package whatsapp

import (
	"fmt"
	"github.com/go-rod/rod/lib/proto"
	"github.com/skip2/go-qrcode"
	"io/ioutil"
	"log"
	"sync"
	"testing"
	"time"
)

func TestStartClient(t *testing.T) {
	client, err := NewWebClient(WebClientConfig{
		Headless: false,
	})
	if err != nil {
		panic(err)
	}

	qrChan, err := client.GetQrChannel(5 * time.Minute)
	if err != nil {
		panic(err)
	}

	var buf []byte
	for qrResp := range qrChan {
		fmt.Println(qrResp)

		data, ok := qrResp.Data.(string)
		if !ok {
			buf, err = client.Screenshot(proto.PageCaptureScreenshotFormatPng, 100)
			if err == nil {
				if err = ioutil.WriteFile("./data/screenshot.png", buf, 0644); err != nil {
					panic(err)
				}
			}

			continue
		}

		buf, err = qrcode.Encode(data, qrcode.Medium, 256)
		if err != nil {
			panic(err)
		}

		if err = ioutil.WriteFile("./data/qrcode.png", buf, 0644); err != nil {
			panic(err)
		}
	}

	start := time.Now()
	err = client.WaitLogin(1 * time.Minute)
	if err != nil {
		fmt.Println(err.Error())
	}

	message := &Message{
		Recipient: "60196132898",
		Kind:      "text",
		Body:      "Hello, World",
	}

	resp, err := client.SendMessage(message)
	fmt.Println(resp)
	if err != nil {
		panic(err)
	}

	fmt.Println("time elapsed:", time.Since(start))

	time.Sleep(5 * time.Second)
	err = client.Close()
	if err != nil {
		panic(err)
	}

	return
}

func TestMultipleClient(t *testing.T) {
	var wg sync.WaitGroup
	count := 12

	for i := 0; i < count; i++ {
		wg.Add(1)

		go func() {
			client, err := NewWebClient(WebClientConfig{
				Resolution: &Resolution{
					Width:  1280,
					Height: 720,
				},
			})
			if err != nil {
				log.Fatalln(err)
			}

			time.Sleep(5 * time.Second)
			err = client.Close()
			if err != nil {
				log.Fatalln(err)
			}
			wg.Done()
		}()
	}
	wg.Wait()

	return
}

func TestScriptInjection(t *testing.T) {

	return
}
