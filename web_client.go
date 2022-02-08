package whatsapp

import (
	"errors"
	"fmt"
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/go-rod/rod/lib/proto"
	"github.com/ysmood/gson"
	"io"
	"os"
	"path/filepath"
	"time"
)

type Resolution struct {
	Width  uint64
	Height uint64
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
	logger  io.WriteCloser
}

func (w *WebClient) IsBeta() (bool, error) {
	if !w.IsLogin {
		return false, ErrLoginRequired
	}

	return false, nil
}

func (w *WebClient) GetQrChannel(timeout time.Duration) (chan *JsResp, error) {
	if w.IsLogin {
		return nil, ErrFetchQrAfterLogin
	}

	var (
		qrcode string
	)
	ch := make(chan *JsResp, 10)

	go func() {
		now := time.Now()
		for {
			if time.Now().UnixMilli()-now.UnixMilli() >= timeout.Milliseconds() {
				ch <- &JsResp{400, ``, "fetch qrcode timeout", nil, ErrFetchQrTimeout}
				break
			}

			obj, err := w.Script("whatsapp.ui.get_qr()")
			if err != nil {
				ch <- &JsResp{500, ``, "script error: whatsapp.ui.get_qr()", obj.Value, err}
				break
			}

			resp, err := ParseJavaScriptResp(obj)
			if err != nil {
				ch <- &JsResp{500, ``, "parse response error: whatsapp.ui.get_qr()", obj.Value, err}
				break
			}

			if resp.Status != 200 {
				resp.Error = ErrFetchQrFailed
				ch <- resp
				break
			}

			if qrcode != resp.Data.(string) {
				ch <- resp
				qrcode = resp.Data.(string)
			}

			time.Sleep(100 * time.Millisecond)
		}
		close(ch)
	}()

	return ch, nil
}

func (w *WebClient) SendMessage(message *Message) (resp *JsResp, err error) {
	if !w.IsLogin {
		return nil, ErrLoginRequired
	}

	if message.Recipient == "" {
		return nil, ErrMessageRecipientNotFound

	} else if !IsValidPhone(message.Recipient) {
		return nil, ErrInvalidMessageRecipient
	}

	data, err := message.JSON()
	if err != nil {
		return nil, err
	}

	obj, err := w.Script(fmt.Sprintf(`window.whatsapp.send_message("%s", %s)`, message.Recipient, string(data)))
	if err != nil {
		return nil, err
	}

	return ParseJavaScriptResp(obj)
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
	if w.IsLogin {
		return nil
	}

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

func (w *WebClient) WaitScriptInjection(timeout time.Duration) error {
	current := time.Now().UnixMilli()

	for time.Now().UnixMilli()-current < timeout.Milliseconds() {
		resp, err := w.Script("!!window.whatsapp")
		if err != nil {
			return err
		}

		if resp.Value.Bool() {
			return nil
		}

		time.Sleep(100 * time.Millisecond)
	}

	return ErrExtensionLoadFailed
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
	location := fmt.Sprintf("./chrome-data/user-%s", w.Session.ID)

	return ZipDir(location)
}

func (w *WebClient) LoadSession(data []byte) error {

	return UnzipDir(data)
}

func NewWebClient(configs ...WebClientConfig) (*WebClient, error) {
	var (
		err error
	)

	config := HandleConfigs(configs...)
	client := &WebClient{}

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
		Append("user-agent", config.UserAgent).
		Append("load-extension", p).
		Append("window-size", fmt.Sprintf("%d,%d", config.Resolution.Width, config.Resolution.Height)).
		Headless(config.Headless)

	// if session ID do assigned, create a temp user profile dir
	if config.SessionID != "" {
		launch.UserDataDir(fmt.Sprintf("./chrome-data/user-%s", config.SessionID))
		client.Session.ID = config.SessionID
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

	// opening web.whatsapp.com
	client.page, err = client.browser.Page(proto.TargetCreateTarget{
		URL:                     "https://web.whatsapp.com",
		Width:                   int(config.Resolution.Width),
		Height:                  int(config.Resolution.Height),
		BrowserContextID:        client.browser.BrowserContextID,
		EnableBeginFrameControl: false,
		NewWindow:               false,
		Background:              false,
	})

	err = client.page.SetViewport(&proto.EmulationSetDeviceMetricsOverride{
		Width:              int(config.Resolution.Width),
		Height:             int(config.Resolution.Height),
		DeviceScaleFactor:  0,
		Mobile:             false,
		Scale:              0,
		ScreenWidth:        int(config.Resolution.Width),
		ScreenHeight:       int(config.Resolution.Height),
		PositionX:          0,
		PositionY:          0,
		DontSetVisibleSize: false,
		ScreenOrientation:  nil,
		Viewport:           nil,
		DisplayFeature:     nil,
	})
	if err != nil {
		return nil, err
	}

	// ensure the script is loaded successfully
	err = client.WaitScriptInjection(10 * time.Second)
	if err != nil {
		return nil, err
	}

	// wait until the whatsapp web page prepared for qr-scan or messaging
	resp, err := client.Script("whatsapp.ui.until_loaded()")
	if err != nil {
		return nil, err
	}

	if resp.Value.Map()["status"].Int() != 200 {
		return nil, ErrWebWhatsAppLoadFailed
	}

	resp, err = client.Script("whatsapp.ui.is_chat_page()")
	if err != nil {
		return nil, err
	}

	if resp.Value.Bool() {
		client.IsLogin = true
	}

	time.Sleep(time.Second)

	return client, nil
}
