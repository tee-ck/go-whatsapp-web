package whatsapp

import (
	"log"
	"sync"
	"testing"
	"time"
)

func TestStartClient(t *testing.T) {
	client, err := NewWebClient(WebClientConfig{})
	if err != nil {
		log.Fatalln(err)
	}

	time.Sleep(5 * time.Second)
	err = client.Close()
	if err != nil {
		log.Fatalln(err)
	}

	return
}

func TestMultipleClient(t *testing.T) {
	var wg sync.WaitGroup
	count := 8

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
