package usecase

import (
	"nailsalon/domain"
	"nailsalon/dto"
	"time"
)

func (u *usecase) getBookingBySlot(slot int, date time.Time) (*domain.BookingEntity, error) {
	getSlot, err := u.repo.GetBookingBySlot(slot, date)

	if err != nil {
		return nil, err
	}
	return getSlot, nil
}
func validateSlot(slot int) error {
	if slot >= 9 && slot <= 17 {
		return nil
	}
	return dto.ErrSlotOutOfRange
}

func isDeleted(book *domain.BookingEntity) (*domain.BookingEntity, error) {

	checkBook := book

	if !book.IsDeleted {
		checkBook.IsDeleted = true
		return checkBook, nil
	}
	return nil, dto.ErrRecordNotFound
}
