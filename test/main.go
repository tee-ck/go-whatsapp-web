package main

import (
	"errors"
	"fmt"
	"github.com/skip2/go-qrcode"
	"github.com/tee-ck/go-whatsapp-web"
	"io/ioutil"
	"time"
)

func main() {
	var (
		client *whatsapp.WebClient
		err    error
	)

	client, err = StartClient()
	if err != nil {
		panic(err)
	}

	// if the whatsapp client is started successfully, perform following test
	var (
		resp *whatsapp.JsResp
	)

	resp, err = SendText(client)
	if err != nil {
		panic(err)
	}
	fmt.Println(resp)
	time.Sleep(5 * time.Second)

	resp, err = SendImage(client)
	if err != nil {
		panic(err)
	}
	fmt.Println(resp)
	time.Sleep(5 * time.Second)

	resp, err = SendMultiImage(client)
	if err != nil {
		panic(err)
	}
	fmt.Println(resp)
	time.Sleep(5 * time.Second)

	resp, err = SendAudio(client)
	if err != nil {
		panic(err)
	}
	fmt.Println(resp)
	time.Sleep(5 * time.Second)

	resp, err = SendVideo(client)
	if err != nil {
		panic(err)
	}
	fmt.Println(resp)
	time.Sleep(5 * time.Second)

	time.Sleep(60 * time.Second)
	err = client.Close()
	if err != nil {
		panic(err)
	}
}

func StartClient() (client *whatsapp.WebClient, err error) {
	client, err = whatsapp.NewWebClient(whatsapp.WebClientConfig{
		//SessionID: "622f6c4949597036784f7631615846786364365063773d3d",
		SessionID: "18f7680bb1dcce6708886dc9fbb6e3dbd35ca9b3b532b6b8",
		Resolution: &whatsapp.Resolution{
			Width:  1600,
			Height: 900,
		},
		Headless: true,
	})
	if err != nil {
		return nil, err
	}

	ch, err := client.GetQrChannel(180 * time.Second)
	if err != nil {
		if !errors.Is(err, whatsapp.ErrFetchQrAfterLogin) {
			return nil, err
		}
	} else {
		for resp := range ch {
			if resp.Error != nil {
				break
			}

			if resp.Status == 200 {
				data, ok := resp.Data.(string)
				if ok {
					buf, err := qrcode.Encode(data, qrcode.Medium, 256)
					if err != nil {
						panic(err)
					}

					if err = ioutil.WriteFile("./data/qrcode.png", buf, 0644); err != nil {
						panic(err)
					}

					fmt.Println(data)
				}
			}
		}
	}

	fmt.Println("waiting login")
	err = client.WaitLogin(60 * time.Second)
	if err != nil {
		return nil, err
	}

	return client, nil
}

func SendText(client *whatsapp.WebClient) (*whatsapp.JsResp, error) {
	message := &whatsapp.Message{
		Recipient: "60196132898",
		Kind:      "text",
		Body:      "Hello, World",
	}

	resp, err := client.SendMessage(message)
	return resp, err
}

func SendImage(client *whatsapp.WebClient) (*whatsapp.JsResp, error) {
	message := &whatsapp.Message{
		Recipient: "60196132898",
		Kind:      "media",
	}

	data := MustReadFile("./data/image_01.png")
	message.AppendAttachment(whatsapp.MessageAttachment{
		Mimetype: "image/png",
		Body:     data,
		Filename: "random.png",
	})

	resp, err := client.SendMessage(message)
	return resp, err
}

func SendMultiImage(client *whatsapp.WebClient) (*whatsapp.JsResp, error) {
	message := &whatsapp.Message{
		Recipient: "60196132898",
		Kind:      "media",
	}

	data := MustReadFile("./data/image_01.png")
	message.AppendAttachment(whatsapp.MessageAttachment{
		Mimetype: "image/png",
		Body:     data,
		Filename: "random.png",
	})

	data = MustReadFile("./data/image_02.jpg")
	message.AppendAttachment(whatsapp.MessageAttachment{
		Mimetype: "image/jpeg",
		Body:     data,
		Filename: "skyrim.png",
	})

	resp, err := client.SendMessage(message)
	return resp, err
}

func SendAudio(client *whatsapp.WebClient) (*whatsapp.JsResp, error) {
	message := &whatsapp.Message{
		Recipient: "60196132898",
		Kind:      "media",
	}

	data := MustReadFile("./data/audio.mp3")
	message.AppendAttachment(whatsapp.MessageAttachment{
		Mimetype: "audio/mp3",
		Body:     data,
		Filename: "voice.mp3",
	})

	resp, err := client.SendMessage(message)
	return resp, err
}

func SendVideo(client *whatsapp.WebClient) (*whatsapp.JsResp, error) {
	message := &whatsapp.Message{
		Recipient: "60196132898",
		Kind:      "media",
	}

	data := MustReadFile("./data/video.mp4")
	message.AppendAttachment(whatsapp.MessageAttachment{
		Mimetype: "video/mp4",
		Body:     data,
		Filename: "gura-alarm.mp3",
	})

	resp, err := client.SendMessage(message)
	return resp, err
}

func MustReadFile(filename string) (data []byte) {
	var err error

	data, err = ioutil.ReadFile(filename)
	if err != nil {
		panic(err)
	}

	return data
}
