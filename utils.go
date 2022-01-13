package whatsapp

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"io/fs"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
)

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
			"/Applications/Chromium.app/Contents/MacOS/Chromium",
			"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
			"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
		}
	case "windows":
		locations = []string{
			// Windows
			"chrome",
			"chrome.exe", // in case PATHEXT is misconfiguration
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

func ZipDir(dir string) ([]byte, error) {
	var (
		buffer bytes.Buffer
		err    error
		zipper *zip.Writer
	)

	zipper = zip.NewWriter(&buffer)

	err = filepath.Walk(dir, func(path string, info fs.FileInfo, err error) error {
		if strings.Contains(path, ".DS_Store") || info.Name() == ".DS_Store" {
			return nil
		}

		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return err
		}
		header.Name = path

		block, err := zipper.CreateHeader(header)
		if err != nil {
			return err
		}

		if !info.IsDir() {
			file, err := os.Open(path)
			if err != nil {
				return err
			}

			_, err = io.Copy(block, file)
			if err != nil {
				return err
			}
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	err = zipper.Close()
	if err != nil {
		return nil, err
	}

	return buffer.Bytes(), nil
}

func UnzipDir(zipfile []byte, dst string) error {
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

		}
		//err = os.MkdirAll(file.Name, os.ModeDir)

		if err != nil {
			fmt.Println(err.Error())
			panic(err)
		}
	}

	return nil
}
