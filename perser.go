package whatsapp

import (
	"encoding/json"
	"github.com/go-rod/rod/lib/proto"
)

type JSResp struct {
	Status  int    `json:"status,omitempty"`
	Flag    string `json:"flag,omitempty"`
	Message string `json:"message,omitempty"`
}

func ParseJavaScriptResp(resp *proto.RuntimeRemoteObject) (*JSResp, error) {
	var result *JSResp

	err := json.Unmarshal(resp.Value.Raw().([]byte), &result)
	if err != nil {
		return nil, ErrParseJavaScriptResponse
	}

	return result, nil
}
