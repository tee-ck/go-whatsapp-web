package whatsapp

import (
	"regexp"
)

var phoneRegex = regexp.MustCompile(`[0-9]+`)

func IsValidPhone(phone string) bool {
	return phoneRegex.MatchString(phone)
}
