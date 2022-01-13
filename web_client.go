package whatsapp

import (
	"embed"
	"errors"
	"fmt"
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/go-rod/rod/lib/proto"
	"github.com/ysmood/gson"
	"os"
	"path/filepath"
	"time"
)

//go:embed chrome-extension
var extension embed.FS

type Resolution struct {
	Width  uint64
	Height uint64
}

type WebClientConfig struct {
	SessionID  string
	Resolution *Resolution
	Headless   bool
}

type WaResp struct {
	Status  int
	Message string
	Value   gson.JSON
	Error   error
}

type WebSession struct {
	ID     string
	Remote string
	Status string
}

type WebClient struct {
	Pid     int
	IsLogin bool
	Session WebSession

	browser *rod.Browser
	page    *rod.Page
}

func (w *WebClient) GetQrChannel(timeout time.Duration) (chan WaResp, error) {
	if w.IsLogin {
		return nil, FetchQrAfterLogin
	}

	var qr string
	ch := make(chan WaResp, 12)

	go func() {
		now := time.Now()
		for {
			if time.Now().UnixMilli()-now.UnixMilli() >= timeout.Milliseconds() {
				ch <- WaResp{
					Status:  400,
					Message: "fetch qr timeout",
					Error:   nil,
				}
				break
			}

			obj, err := w.Script("whatsapp.ui.get_qr()")
			if err != nil {
				ch <- WaResp{
					Status:  500,
					Message: "script error",
					Value:   obj.Value,
					Error:   err,
				}
				break
			}

			if qr != obj.Value.Str() {
				ch <- WaResp{
					Status: 200,
					Value:  obj.Value,
					Error:  nil,
				}
				qr = obj.Value.Str()
			}

			time.Sleep(1 * time.Second)
		}
		close(ch)
	}()

	return ch, nil
}

func (w *WebClient) SendMessage(message *Message) (resp *proto.RuntimeRemoteObject, err error) {
	if !w.IsLogin {
		return nil, LoginRequired
	}

	data, err := message.JSON()
	if err != nil {
		return nil, err
	}

	resp, err = w.AsyncScript(fmt.Sprintf("whatsapp.send_message(%s)", string(data)))
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (w *WebClient) Script(script string) (*proto.RuntimeRemoteObject, error) {
	return w.page.Eval(script)
}

func (w *WebClient) AsyncScript(script string) (*proto.RuntimeRemoteObject, error) {
	return w.page.Evaluate(&rod.EvalOptions{
		ByValue:      true,
		AwaitPromise: true,
		ThisObj:      nil,
		JS:           script,
		JSArgs:       nil,
		UserGesture:  false,
	})
}

func (w *WebClient) WaitLogin(timeout time.Duration) error {
	err := w.WaitVisible("#side", timeout)
	if err != nil {
		if errors.Is(err, ElementWaitVisibleTimeout) {
			return LoginTimeout
		}
		return err
	}

	// successfully login
	w.IsLogin = true

	obj, err := w.Script("whatsapp.remote")
	if err != nil {
		return err
	}

	w.Session.Remote = obj.Value.Str()

	return nil
}

func (w *WebClient) WaitVisible(selector string, timeout time.Duration) (err error) {
	ch := make(chan error)

	go func() {
		element, err := w.page.Element(selector)
		if err != nil {
			ch <- err
		}

		err = element.WaitVisible()
		if err != nil {
			ch <- err
		}

		ch <- nil
	}()

	select {
	case err = <-ch:
		break
	case <-time.After(timeout):
		err = ElementWaitVisibleTimeout
	}

	close(ch)
	return err
}

func (w *WebClient) WaitVisibleChannel(selector string) chan error {
	ch := make(chan error)

	go func() {
		element, err := w.page.Element(selector)
		if err != nil {
			ch <- err
		}

		err = element.WaitVisible()
		if err != nil {
			ch <- err
		}

		ch <- nil
	}()

	return ch
}

func (w *WebClient) Close() (err error) {
	err = w.browser.Close()
	if err != nil {
		return err
	}
	time.Sleep(3 * time.Second)

	return w.Cleanup()
}

func (w *WebClient) Cleanup() (err error) {
	paths := []string{
		fmt.Sprintf("./chrome-data/user-%s/Default/Cache", w.Session.ID),
		fmt.Sprintf("./chrome-data/user-%s/Default/GPUCache", w.Session.ID),
		fmt.Sprintf("./chrome-data/user-%s/Default/Service Worker", w.Session.ID),
		fmt.Sprintf("./chrome-data/user-%s/GrShaderCache", w.Session.ID),
		fmt.Sprintf("./chrome-data/user-%s/ShaderCache", w.Session.ID),
		fmt.Sprintf("./chrome-data/user-%s/ShaderCache", w.Session.ID),
	}

	for _, path := range paths {
		err = os.RemoveAll(path)
		if err != nil {
			return err
		}
	}

	return nil
}

func (w *WebClient) Screenshot(format proto.PageCaptureScreenshotFormat, quality int) ([]byte, error) {
	return w.page.Screenshot(true, &proto.PageCaptureScreenshot{
		Format:                format,
		Quality:               quality,
		Clip:                  nil,
		FromSurface:           false,
		CaptureBeyondViewport: false,
	})
}

func (w *WebClient) GetSession() ([]byte, error) {

	return nil, nil
}

func (w *WebClient) SetSession(data []byte) error {

	return nil
}

func NewWebClient(config ...WebClientConfig) (*WebClient, error) {
	var err error
	client := &WebClient{}

	path, has := FindExec()
	if !has {
		return nil, ChromiumBrowserNotFound
	}

	p, err := filepath.Abs("./chrome-extension")
	if err != nil {
		panic(err)
	}

	l := launcher.New().
		Bin(path).
		Headless(true).
		Append("load-extension", p)

	if len(config) > 0 {
		conf := config[0]

		if conf.SessionID != "" {
			l.UserDataDir(fmt.Sprintf("./chrome-data/user-%s", conf.SessionID))
			client.Session.ID = conf.SessionID
		}

		if conf.Resolution != nil {
			l.Append("window-size", fmt.Sprintf("%d,%d", conf.Resolution.Width, conf.Resolution.Height))
		}

		l.Headless(conf.Headless)
	}

	uri, err := l.Launch()
	if err != nil {
		return nil, err
	}

	client.Pid = l.PID()
	client.browser = rod.New().ControlURL(uri)
	err = client.browser.Connect()
	if err != nil {
		panic(err)
	}

	client.page, err = client.browser.Page(proto.TargetCreateTarget{
		URL:                     "https://web.whatsapp.com",
		Width:                   960,
		Height:                  540,
		BrowserContextID:        client.browser.BrowserContextID,
		EnableBeginFrameControl: false,
		NewWindow:               false,
		Background:              false,
	})

	select {
	case err = <-client.WaitVisibleChannel("div[data-ref]"):
		// login qr code render successfully

	case err = <-client.WaitVisibleChannel("#side"):
		client.IsLogin = true

	case <-time.After(60 * time.Second):
		return nil, WebClientLaunchTimeout
	}

	if err != nil {
		return nil, err
	}

	// make sure the Chrome extension script is load successfully
	_, err = client.Script("window.whatsapp")
	if err != nil {
		return nil, ExtensionLoadFailed
	}

	if client.IsLogin {
		obj, err := client.Script("whatsapp.remote")
		if err != nil {
			return nil, err
		}

		client.Session.Remote = obj.Value.Str()
	}

	return client, nil
}
