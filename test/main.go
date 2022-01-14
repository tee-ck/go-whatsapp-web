package main

import (
	"fmt"
	"github.com/tee-ck/go-whatsapp-web"
	"io/ioutil"
	"log"
	"os"
	"time"
)

func main() {
	log.SetFlags(log.Llongfile)

	client, err := whatsapp.NewWebClient(whatsapp.WebClientConfig{
		SessionID: "622f6c4949597036784f7631615846786364365063773d3d",
		Headless:  false,
	})

	if err != nil {
		panic(err)
	}
	fmt.Println("login successfully")

	time.Sleep(5 * time.Second)
	err = client.Close()
	if err != nil {
		log.Fatal(err)
	}

	data, err := whatsapp.ZipDir("./chrome-data/user-622f6c4949597036784f7631615846786364365063773d3d")
	if err != nil {
		log.Fatal(err)
	}

	err = ioutil.WriteFile("./compress-data.zip", data, os.ModePerm)
	if err != nil {
		log.Fatal(err)
	}

	data, err = ioutil.ReadFile("compress-data.zip")
	if err != nil {
		log.Fatal(err)
	}

	err = whatsapp.UnzipDir(data, "./chrome-data/user-622f6c4949597036784f7631615846786364365063773d3d")
	if err != nil {
		log.Fatal(err)
	}
}
