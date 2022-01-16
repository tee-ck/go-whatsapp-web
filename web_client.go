package whatsapp

import (
	"errors"
	"fmt"
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/go-rod/rod/lib/proto"
	"github.com/ysmood/gson"
	"os"
	"path/filepath"
	"regexp"
	"time"
)

var recipientRegex *regexp.Regexp

type Resolution struct {
	Width  uint64
	Height uint64
}

type WebClientConfig struct {
	SessionID  string
	UserAgent  string
	Resolution *Resolution
	Headless   bool
}

var DefaultWebClientConfig = WebClientConfig{
	UserAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
	Resolution: &Resolution{
		Width:  1280,
		Height: 720,
	},
	Headless: true,
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
		return nil, ErrFetchQrAfterLogin
	}

	var qr string
	ch := make(chan WaResp, 10)

	go func() {
		now := time.Now()
		for {
			if time.Now().UnixMilli()-now.UnixMilli() >= timeout.Milliseconds() {
				ch <- WaResp{
					Status:  400,
					Message: "fetch qr timeout",
					Error:   ErrFetchQrTimeout,
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

			time.Sleep(100 * time.Millisecond)
		}
		close(ch)
	}()

	return ch, nil
}

func (w *WebClient) SendMessage(message *Message) (resp *proto.RuntimeRemoteObject, err error) {
	if !w.IsLogin {
		return nil, ErrLoginRequired
	}

	if message.Recipient == "" {
		return nil, ErrMessageRecipientNotFound

	} else if !recipientRegex.MatchString(message.Recipient) {
		return nil, ErrInvalidMessageRecipient
	}

	data, err := message.JSON()
	if err != nil {
		return nil, err
	}

	resp, err = w.Script(fmt.Sprintf("whatsapp.send_message(%s, %s)", message.Recipient, string(data)))
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
		if errors.Is(err, ErrElementWaitVisibleTimeout) {
			return ErrWaitLoginTimeout
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
		err = ErrElementWaitVisibleTimeout
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

func (w *WebClient) DumpSession() ([]byte, error) {
	// todo wait for implementation

	return nil, nil
}

func (w *WebClient) LoadSession(data []byte) error {
	// todo wait for implementation

	return nil
}

func NewWebClient(config ...WebClientConfig) (*WebClient, error) {
	var (
		conf = DefaultWebClientConfig
		err  error
	)
	client := &WebClient{}

	if len(config) > 0 {
		conf = config[0]
	}

	if conf.UserAgent == "" {
		conf.UserAgent = DefaultWebClientConfig.UserAgent
	}
	if conf.Resolution == nil {
		conf.Resolution = DefaultWebClientConfig.Resolution
	}

	path, has := FindExec()
	if !has {
		return nil, ErrChromiumBrowserNotFound
	}

	p, err := filepath.Abs("./chrome-extensions")
	if err != nil {
		return nil, err
	}

	launch := launcher.New().
		Bin(path).
		Headless(true).
		Append("user-agent", conf.UserAgent).
		Append("load-extension", p).
		Append("window-size", fmt.Sprintf("%d,%d", conf.Resolution.Width, conf.Resolution.Height)).
		Headless(conf.Headless)

	if conf.SessionID != "" {
		launch.UserDataDir(fmt.Sprintf("./chrome-data/user-%s", conf.SessionID))
		client.Session.ID = conf.SessionID
	}

	uri, err := launch.Launch()
	if err != nil {
		return nil, err
	}

	client.Pid = launch.PID()
	client.browser = rod.New().ControlURL(uri)
	err = client.browser.Connect()
	if err != nil {
		return nil, err
	}

	client.page, err = client.browser.Page(proto.TargetCreateTarget{
		URL:                     "https://web.whatsapp.com",
		Width:                   int(conf.Resolution.Width),
		Height:                  int(conf.Resolution.Height),
		BrowserContextID:        client.browser.BrowserContextID,
		EnableBeginFrameControl: false,
		NewWindow:               false,
		Background:              false,
	})

	qr := client.WaitVisibleChannel("div[data-ref]")
	panel := client.WaitVisibleChannel("#side")

	select {
	case err = <-qr:
		// login qr code render successfully

	case err = <-panel:
		client.IsLogin = true

	case <-time.After(150 * time.Second):
		return nil, ErrWebClientLaunchTimeout
	}

	if err != nil {
		return nil, err
	}

	// make sure the Chrome extension script is load successfully
	_, err = client.Script("window.whatsapp")
	if err != nil {
		return nil, ErrExtensionLoadFailed
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

func init() {
	re, err := regexp.Compile(`[0-9]+`)
	if err != nil {
		panic(err)
	}

	recipientRegex = re
}
