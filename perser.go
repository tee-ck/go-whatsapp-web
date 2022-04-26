package whatsapp

import (
	"encoding/json"
	"github.com/go-rod/rod/lib/proto"
)

type JsResp struct {
	Status  int         `json:"status,omitempty"`
	Flag    string      `json:"flag,omitempty"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data"`
	Error   error       `json:"error,omitempty"`
}

func (j *JsResp) ToJson() (data []byte, err error) {

	return json.Marshal(&j)
}

func ParseJavaScriptResp(resp *proto.RuntimeRemoteObject) (*JsResp, error) {
	var result *JsResp

	err := json.Unmarshal(resp.Value.Raw().([]byte), &result)
	if err != nil {
		return nil, ErrParseJavaScriptResponse
	}

	return result, nil
}
