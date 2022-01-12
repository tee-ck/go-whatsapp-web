package whatsapp

import "errors"

var ChromiumBrowserNotFound = errors.New("[whatsapp web client]: chromium based browser not found")
var ExtensionLoadFailed = errors.New("[whatsapp web client]: extension script load failed")
var WebClientLaunchTimeout = errors.New("[whatsapp web client]: launch timeout")
var LoginTimeout = errors.New("[whatsapp web client]: login timeout")
var ElementWaitVisibleTimeout = errors.New("[whatsapp web client]: browser element wait visible timeout")
var LoginRequired = errors.New("[whatsapp web client]: login required")
var FetchQrAfterLogin = errors.New("[whatsapp web client]: already login, fetch qr code failed")
