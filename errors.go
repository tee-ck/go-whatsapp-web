package whatsapp

import (
	"errors"
)

var (
	ChromiumBrowserNotFound   = errors.New("[whatsapp web client]: chromium based browser not found")
	ExtensionLoadFailed       = errors.New("[whatsapp web client]: extension script load failed")
	WebClientLaunchTimeout    = errors.New("[whatsapp web client]: launch timeout")
	LoginTimeout              = errors.New("[whatsapp web client]: login timeout")
	ElementWaitVisibleTimeout = errors.New("[whatsapp web client]: browser element wait visible timeout")
	LoginRequired             = errors.New("[whatsapp web client]: login required")
	FetchQrAfterLogin         = errors.New("[whatsapp web client]: already login, fetch qr code failed")
)
