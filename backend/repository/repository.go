package postgres

import (
	"nailsalon/domain"
	"nailsalon/dto"
	"strings"
	"time"

	"gorm.io/gorm"
)

type bookingRepository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) domain.BookingRepository {
	return &bookingRepository{db: db}
}

func (repo *bookingRepository) Create(booking *domain.BookingEntity) (*domain.BookingEntity, error) {

	if err := repo.db.Create(booking).Error; err != nil {
		errMsg := err.Error()

		if strings.Contains(errMsg, "duplicate") ||
			strings.Contains(errMsg, "23505") ||
			strings.Contains(errMsg, "idx_booking_slot_date") {
			return nil, dto.ErrSlotNotAvailable
		}

		return nil, err
	}
	return booking, nil
}

func (repo *bookingRepository) Delete(book *domain.BookingEntity) error {
	err := repo.db.Save(&book).Error
	if err != nil {
		return err
	}
	return nil
}

func (repo *bookingRepository) GetBookingByDate(date *time.Time) ([]domain.BookingEntity, error) {
	var bookinglist []domain.BookingEntity
	err := repo.db.Where("date = ? AND is_deleted = ?", date, false).Find(&bookinglist).Error
	if err != nil {
		return nil, err
	}
	if bookinglist == nil {
		return nil, nil
	}	
	return bookinglist, nil
}
func (repo *bookingRepository) GetBookingBySlot(slot int, date time.Time) (*domain.BookingEntity, error) {
	var book domain.BookingEntity
	err := repo.db.Where("date = ? AND slot = ?", date, slot).First(&book).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &book, nil
}
