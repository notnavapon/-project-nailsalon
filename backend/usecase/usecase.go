package usecase

import (
	"fmt"
	"nailsalon/domain"
	"nailsalon/dto"
	"time"
)

type Usecase interface {
	Create(booking *dto.BookingReq) (*dto.BookingRes, error)
	Delete(booking *domain.BookingEntity) error
	GetBookingByDate(date time.Time) (*dto.BookingListRes, error)
}

type usecase struct {
	repo domain.BookingRepository
}

func NewUsecase(repo domain.BookingRepository) Usecase {
	return &usecase{
		repo: repo,
	}
}

func (u *usecase) Create(req *dto.BookingReq) (*dto.BookingRes, error) {
	if err := validateSlot(req.Slot); err != nil {
		return nil, err
	}

	book := &domain.BookingEntity{
		User:       req.User,
		Slot:       req.Slot,
		NumberUser: req.NumberUser,
		Date:       req.Date,
	}

	res, err := u.repo.Create(book)
	if err != nil {
		return nil, err
	}

	return &dto.BookingRes{
		User:       res.User,
		Slot:       res.Slot,
		NumberUser: res.NumberUser,
		Date:       res.Date,
		CreatedAt:  res.CreatedAt,
	}, nil
}
func (u *usecase) Delete(booking *domain.BookingEntity) error {
	return nil
}
func (u *usecase) GetBookingByDate(date time.Time) (*dto.BookingListRes, error) {
	bookList, err := u.repo.GetBookingByDate(&date)
	if err != nil {
		return nil, err
	} else if bookList == nil {
		return nil, dto.ErrRecordNotFound
	}

	res := []dto.BookingRes{}

	for _, book := range bookList {
		res = append(res, dto.BookingRes{
			User:       book.User,
			Slot:       book.Slot,
			NumberUser: book.NumberUser,
			Date:       book.Date,
			CreatedAt:  book.CreatedAt,
		})
	}

	fmt.Println(res)
	return &dto.BookingListRes{
		Books: res,
	}, nil
}
