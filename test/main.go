package main

import (
	"errors"
	"fmt"
	"github.com/tee-ck/go-whatsapp-web"
	"time"
)

func main() {
	client, err := whatsapp.NewWebClient(whatsapp.WebClientConfig{
		SessionID: "622f6c4949597036784f7631615846786364365063773d3d",
		Resolution: &whatsapp.Resolution{
			Width:  1280,
			Height: 720,
		},
		Headless: false,
	})

	if err != nil {
		panic(err)
	}
	fmt.Println("launch successfully")

	ch, err := client.GetQrChannel(20 * time.Second)
	if err != nil {
		if !errors.Is(err, whatsapp.ErrFetchQrAfterLogin) {
			panic(err)
		}
	} else {
		for resp := range ch {
			fmt.Println(resp)

			if resp.Error != nil {
				break
			}
		}
	}

	err = client.WaitLogin(60 * time.Second)
	if err != nil {
		panic(err)
	}

	time.Sleep(60 * time.Second)
	err = client.Close()
	if err != nil {
		panic(err)
	}
}
