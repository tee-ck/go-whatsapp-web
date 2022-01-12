package whatsapp

import (
	"encoding/json"
)

type Message struct {
	Kind string          `json:"kind,omitempty"`
	Body string          `json:"body,omitempty"`
	Opts *MessageOptions `json:"opts,omitempty"`
}

type MessageOptions struct {
	//Location    string               `json:"location,omitempty"`
	Attachments []MessageAttachment `json:"attachments,omitempty"`
	Caption     string              `json:"caption,omitempty"`
}

type MessageAttachment struct {
	Mimetype string `json:"mimetype,omitempty"`
	Body     []byte `json:"body,omitempty"`
	Filename string `json:"filename,omitempty"`
}

func (m *Message) AppendAttachment(attachment ...MessageAttachment) {
	if m.Opts == nil {
		m.Opts = &MessageOptions{
			Attachments: []MessageAttachment{},
		}
	}

	m.Opts.Attachments = append(m.Opts.Attachments, attachment...)
}

func (m *Message) JSON() ([]byte, error) {
	return json.Marshal(&m)
}
