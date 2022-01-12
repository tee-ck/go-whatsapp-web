package whatsapp

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
)

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
