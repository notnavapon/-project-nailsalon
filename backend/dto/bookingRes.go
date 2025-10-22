package dto

import (
	"errors"
	"time"
)

type BookingRes struct {
	User       string    `json:"user"`
	Date       time.Time `json:"date"`
	Slot       int       `json:"slot"`
	NumberUser string    `json:"number"`
	CreatedAt  time.Time `json:"createAt"`
}
type BookingListRes struct {
	Books []BookingRes `json:"data"`
}

var ErrEmailExists = errors.New("email already exists")
var ErrSlotOutOfRange = errors.New("slot out of rage")
var ErrRecordNotFound = errors.New("record not found")
var ErrSlotNotAvailable = errors.New("slot not avilable")