package whatsapp

import (
	"errors"
)

var (
	ErrChromiumBrowserNotFound   = errors.New("[whatsapp web client]: chromium based browser not found")
	ErrWebWhatsAppLoadFailed     = errors.New("[whatsapp web client]: unable to load the whatsapp web")
	ErrExtensionLoadFailed       = errors.New("[whatsapp web client]: extension script load failed")
	ErrWebClientLaunchTimeout    = errors.New("[whatsapp web client]: launch timeout")
	ErrElementWaitVisibleTimeout = errors.New("[whatsapp web client]: browser element wait visible timeout")
	ErrLoginRequired             = errors.New("[whatsapp web client]: login required")
	ErrWaitLoginTimeout          = errors.New("[whatsapp web client]: wait login timeout")
	ErrFetchQrTimeout            = errors.New("[whatsapp web client]: fetch qr timeout")
	ErrFetchQrAfterLogin         = errors.New("[whatsapp web client]: already login, fetch qr code failed")
	ErrMessageRecipientNotFound  = errors.New("[whatsapp web client]: message recipient not found")
	ErrInvalidMessageRecipient   = errors.New("[whatsapp web client]: invalid message recipient")

	ErrParseJavaScriptResponse = errors.New("[whatsapp web client]: unable to parse javascript response")
)
