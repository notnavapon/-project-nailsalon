package domain

import "time"

type BookingEntity struct {
	ID         uint `gorm:"primaryKey"`
	User       string
	Date       time.Time
	Slot       int
	NumberUser string
	IsDeleted  bool      `gorm:"default:false"`
	CreatedAt  time.Time `gorm:"autoCreateTime"`
	UpdatedAt  time.Time `gorm:"autoUpdateTime"`
}

type BookingRepository interface {
	Create(booking *BookingEntity) (*BookingEntity, error)
	GetBookingBySlot(slot int, date time.Time) (*BookingEntity, error)
	GetBookingByDate(date *time.Time) ([]BookingEntity, error)
	Delete(booking *BookingEntity) error
}
