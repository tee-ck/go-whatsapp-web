package main

import (
	"fmt"
	"github.com/tee-ck/go-whatsapp-web"
	"io/ioutil"
	"os"
	"time"
)

func main() {
	client, err := whatsapp.NewWebClient(whatsapp.WebClientConfig{
		SessionID: "4a18befee56fd6cb775fcf2ae0dbdaa4093dce24eb9cfca2",
		Headless:  false,
	})

	if err != nil {
		panic(err)
	}
	fmt.Println("login successfully")

	time.Sleep(10 * time.Second)
	err = client.Close()
	if err != nil {
		panic(err)
	}

	data, err := whatsapp.ZipDir("./chrome-data/user-4a18befee56fd6cb775fcf2ae0dbdaa4093dce24eb9cfca2")
	if err != nil {
		panic(err)
	}

	err = ioutil.WriteFile("./compress-data.zip", data, os.ModePerm)
	if err != nil {
		panic(err)
	}

	data, err = ioutil.ReadFile("compress-data.zip")
	if err != nil {
		panic(err)
	}

	err = whatsapp.UnzipDir(data, "./chrome-data/user-4a18befee56fd6cb775fcf2ae0dbdaa4093dce24eb9cfca2")
	if err != nil {
		panic(err)
	}
}
