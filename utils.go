package whatsapp

import (
	"archive/zip"
	"bytes"
	"embed"
	"errors"
	"io/fs"
	"io/ioutil"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

//go:embed chrome-extensions
var extension embed.FS

func FindExec() (string, bool) {
	var (
		locations []string
		p         string
		err       error
	)

	switch runtime.GOOS {
	case "darwin":
		locations = []string{
			// Mac
			//"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
			"/Applications/Chromium.app/Contents/MacOS/Chromium",
			"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
			"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
		}
	case "windows":
		locations = []string{
			// Windows
			//"brave",
			//"brave.exe",
			"chrome",
			"chrome.exe", // in case PATHEXT is misconfiguration
			//`C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe`,
			`C:\Program Files (x86)\Google\Chrome\Application\chrome.exe`,
			`C:\Program Files\Google\Chrome\Application\chrome.exe`,
			filepath.Join(os.Getenv("USERPROFILE"), `AppData\Local\Google\Chrome\Application\chrome.exe`),
			filepath.Join(os.Getenv("USERPROFILE"), `AppData\Local\Chromium\Application\chrome.exe`),
			"msedge",
			"msedge.exe",
			`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`,
		}
	default:
		locations = []string{
			// Unix-like
			"headless_shell",
			"headless-shell",
			"chromium",
			"chromium-browser",
			"google-chrome",
			"google-chrome-stable",
			"google-chrome-beta",
			"google-chrome-unstable",
			"/usr/bin/google-chrome",
			"/usr/local/bin/chrome",
			"/snap/bin/chromium",
			"chrome",
			"microsoft-edge",
			"/usr/bin/microsoft-edge",
		}
	}

	for _, location := range locations {
		p, err = exec.LookPath(location)
		if err == nil {
			return p, true
		}
	}

	return p, false
}

func InstallChromeExtension() error {
	return fs.WalkDir(extension, ".", func(path string, d fs.DirEntry, err error) error {
		if d.IsDir() {
			err := os.MkdirAll(path, os.ModePerm)
			if err != nil {
				if !errors.Is(err, os.ErrExist) {
					return err
				}
			}
		} else {
			data, err := extension.ReadFile(path)
			if err != nil {
				panic(err)
			}

			return ioutil.WriteFile(path, data, 0755)
		}

		return nil
	})
}

func GetWhatsAppWebInjectScript() (string, error) {
	data, err := extension.ReadFile("chrome-extensions/whatsapp-inject-api.js")
	if err != nil {
		return "", err
	}

	return string(data), nil
}

func ZipDir(dir string, skip int) (zipped []byte, err error) {
	var (
		buffer = new(bytes.Buffer)
	)

	writer := zip.NewWriter(buffer)

	err = ZipFiles(dir, writer, skip)
	if err != nil {
		return nil, err
	}

	err = writer.Close()
	if err != nil {
		return nil, err
	}

	return buffer.Bytes(), nil
}

func ZipFiles(dir string, writer *zip.Writer, skip int) error {
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		return err
	}

	for _, file := range files {
		if file.IsDir() {
			err = ZipFiles(filepath.Join(dir, file.Name()), writer, skip)
			if err != nil {
				return err
			}
		} else {
			data, err := ioutil.ReadFile(filepath.Join(dir, file.Name()))
			if err != nil {
				return err
			}

			w, err := writer.Create(filepath.Join(strings.Split(filepath.Join(dir, file.Name()), string(filepath.Separator))[skip:]...))
			if err != nil {
				return err
			}

			_, err = w.Write(data)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func UnzipDir(zipfile []byte, destination string) error {
	var (
		err    error
		reader *zip.Reader
	)

	reader, err = zip.NewReader(bytes.NewReader(zipfile), int64(len(zipfile)))
	if err != nil {
		return err
	}

	for _, file := range reader.File {
		if file.Mode().IsDir() {
			continue
		}

		folder := filepath.Join(destination, filepath.Dir(file.Name))

		err = os.MkdirAll(folder, os.ModePerm)
		if err != nil && !errors.Is(err, os.ErrExist) {
			return err
		}

		reader, err := file.Open()
		if err != nil {
			return err
		}

		buffer, err := ioutil.ReadAll(reader)
		if err != nil {
			return err
		}

		err = ioutil.WriteFile(filepath.Join(destination, file.Name), buffer, file.FileInfo().Mode())
		if err != nil {
			return err
		}
	}

	return nil
}
