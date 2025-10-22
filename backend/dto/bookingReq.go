package dto

import "time"

type BookingReq struct {
	User       string    `json:"user"`
	Date       time.Time `json:"date"`
	Slot       int       `json:"slot"`
	NumberUser string    `json:"number"`
}
type DateReq struct {
	Date string `json:"date"`
}
type GetBookByDateReq struct {
	Date time.Time `json:"date"`
}
