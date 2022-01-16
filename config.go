package whatsapp

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

func HandleConfigs(configs ...WebClientConfig) WebClientConfig {
	var config WebClientConfig

	if len(configs) > 0 {
		config = configs[0]
	} else {
		return DefaultWebClientConfig
	}

	if config.UserAgent == "" {
		config.UserAgent = DefaultWebClientConfig.UserAgent
	}
	if config.Resolution == nil {
		config.Resolution = DefaultWebClientConfig.Resolution
	}

	return config
}
