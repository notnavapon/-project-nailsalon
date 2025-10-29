package usecase

import (
	"errors"
	"nailsalon/domain"
	"nailsalon/dto"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Mock Repository
type MockBookingRepository struct {
	mock.Mock
}

func (m *MockBookingRepository) Create(booking *domain.BookingEntity) (*domain.BookingEntity, error) {
	args := m.Called(booking)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.BookingEntity), args.Error(1)
}

func (m *MockBookingRepository) Delete(booking *domain.BookingEntity) error {
	args := m.Called(booking)
	return args.Error(0)
}

func (m *MockBookingRepository) GetBookingByDate(date *time.Time) ([]domain.BookingEntity, error) {
	args := m.Called(date)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]domain.BookingEntity), args.Error(1)
}

func (m *MockBookingRepository) GetBookingBySlot(slot int, date time.Time) (*domain.BookingEntity, error) {
	args := m.Called(slot, date)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*domain.BookingEntity), args.Error(1)
}

// ==================== Test Create ====================

func TestUsecase_Create_Success(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	now := time.Now()
	req := &dto.BookingReq{
		User:       "John Doe",
		Slot:       10,
		NumberUser: "2",
		Date:       now,
	}

	expectedEntity := &domain.BookingEntity{
		ID:         1,
		User:       "John Doe",
		Slot:       10,
		NumberUser: "2",
		Date:       now,
		IsDeleted:  false,
		CreatedAt:  now,
		UpdatedAt:  now,
	}

	mockRepo.On("Create", mock.MatchedBy(func(b *domain.BookingEntity) bool {
		return b.User == "John Doe" && b.Slot == 10 && b.NumberUser == "2"
	})).Return(expectedEntity, nil)

	// Act
	res, err := uc.Create(req)

	// Assert
	assert.NoError(t, err)
	assert.NotNil(t, res)
	assert.Equal(t, "John Doe", res.User)
	assert.Equal(t, 10, res.Slot)
	assert.Equal(t, "2", res.NumberUser)
	assert.Equal(t, now, res.Date)
	mockRepo.AssertExpectations(t)
}

func TestUsecase_Create_SlotTooEarly(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	req := &dto.BookingReq{
		User:       "John Doe",
		Slot:       8, // ก่อน 9 โมง
		NumberUser: "2",
		Date:       time.Now(),
	}

	// Act
	res, err := uc.Create(req)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, res)
	assert.Equal(t, dto.ErrSlotOutOfRange, err)
	mockRepo.AssertNotCalled(t, "Create")
}

func TestUsecase_Create_SlotTooLate(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	req := &dto.BookingReq{
		User:       "John Doe",
		Slot:       18, // หลัง 17 โมง
		NumberUser: "2",
		Date:       time.Now(),
	}

	// Act
	res, err := uc.Create(req)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, res)
	assert.Equal(t, dto.ErrSlotOutOfRange, err)
	mockRepo.AssertNotCalled(t, "Create")
}

func TestUsecase_Create_ValidSlotBoundaries(t *testing.T) {
	// Test slot 9 (min) และ slot 17 (max)
	testCases := []struct {
		name string
		slot int
	}{
		{"MinSlot_9", 9},
		{"MaxSlot_17", 17},
		{"MidSlot_13", 13},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			mockRepo := new(MockBookingRepository)
			uc := NewUsecase(mockRepo)

			now := time.Now()
			req := &dto.BookingReq{
				User:       "John Doe",
				Slot:       tc.slot,
				NumberUser: "2",
				Date:       now,
			}

			expectedEntity := &domain.BookingEntity{
				User:       "John Doe",
				Slot:       tc.slot,
				NumberUser: "2",
				Date:       now,
				CreatedAt:  now,
			}

			mockRepo.On("Create", mock.AnythingOfType("*domain.BookingEntity")).Return(expectedEntity, nil)

			res, err := uc.Create(req)

			assert.NoError(t, err)
			assert.NotNil(t, res)
			assert.Equal(t, tc.slot, res.Slot)
			mockRepo.AssertExpectations(t)
		})
	}
}

func TestUsecase_Create_RepositoryError(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	req := &dto.BookingReq{
		User:       "John Doe",
		Slot:       10,
		NumberUser: "2",
		Date:       time.Now(),
	}

	expectedError := errors.New("database connection error")
	mockRepo.On("Create", mock.AnythingOfType("*domain.BookingEntity")).Return(nil, expectedError)

	// Act
	res, err := uc.Create(req)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, res)
	assert.Equal(t, expectedError, err)
	mockRepo.AssertExpectations(t)
}

func TestUsecase_Create_DuplicateSlotError(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	req := &dto.BookingReq{
		User:       "John Doe",
		Slot:       10,
		NumberUser: "2",
		Date:       time.Now(),
	}

	mockRepo.On("Create", mock.AnythingOfType("*domain.BookingEntity")).
		Return(nil, dto.ErrSlotNotAvailable)

	// Act
	res, err := uc.Create(req)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, res)
	assert.Equal(t, dto.ErrSlotNotAvailable, err)
	mockRepo.AssertExpectations(t)
}

// ==================== Test Delete ====================

func TestUsecase_Delete_Success(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	now := time.Now()
	req := &dto.BookingReq{
		User: "John Doe",
		Slot: 10,
		Date: now,
	}

	existingBooking := &domain.BookingEntity{
		ID:        1,
		User:      "John Doe",
		Slot:      10,
		Date:      now,
		IsDeleted: false,
		CreatedAt: now,
		UpdatedAt: now,
	}

	mockRepo.On("GetBookingBySlot", 10, now).Return(existingBooking, nil)
	mockRepo.On("Delete", mock.MatchedBy(func(b *domain.BookingEntity) bool {
		return b.IsDeleted == true && b.User == "John Doe"
	})).Return(nil)

	// Act
	res, err := uc.Delete(req)

	// Assert
	assert.NoError(t, err)
	assert.NotNil(t, res)
	assert.Contains(t, res.Message, "John Doe")
	assert.Contains(t, res.Message, "deleted")
	mockRepo.AssertExpectations(t)
}

func TestUsecase_Delete_BookingNotFound(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	now := time.Now()
	req := &dto.BookingReq{
		User: "John Doe",
		Slot: 10,
		Date: now,
	}

	mockRepo.On("GetBookingBySlot", 10, now).Return(nil, nil)

	// Act
	res, err := uc.Delete(req)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, res)
	assert.Equal(t, dto.ErrRecordNotFound, err)
	mockRepo.AssertNotCalled(t, "Delete")
	mockRepo.AssertExpectations(t)
}

func TestUsecase_Delete_AlreadyDeleted(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	now := time.Now()
	req := &dto.BookingReq{
		User: "John Doe",
		Slot: 10,
		Date: now,
	}

	existingBooking := &domain.BookingEntity{
		ID:        1,
		User:      "John Doe",
		Slot:      10,
		Date:      now,
		IsDeleted: true, // ถูกลบไปแล้ว
		CreatedAt: now,
		UpdatedAt: now,
	}

	mockRepo.On("GetBookingBySlot", 10, now).Return(existingBooking, nil)

	// Act
	res, err := uc.Delete(req)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, res)
	assert.Equal(t, dto.ErrRecordNotFound, err)
	mockRepo.AssertNotCalled(t, "Delete")
	mockRepo.AssertExpectations(t)
}

func TestUsecase_Delete_GetBookingError(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	now := time.Now()
	req := &dto.BookingReq{
		User: "John Doe",
		Slot: 10,
		Date: now,
	}

	expectedError := errors.New("database error")
	mockRepo.On("GetBookingBySlot", 10, now).Return(nil, expectedError)

	// Act
	res, err := uc.Delete(req)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, res)
	assert.Equal(t, expectedError, err)
	mockRepo.AssertNotCalled(t, "Delete")
}

func TestUsecase_Delete_DeleteRepositoryError(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	now := time.Now()
	req := &dto.BookingReq{
		User: "John Doe",
		Slot: 10,
		Date: now,
	}

	existingBooking := &domain.BookingEntity{
		ID:        1,
		User:      "John Doe",
		Slot:      10,
		Date:      now,
		IsDeleted: false,
	}

	expectedError := errors.New("failed to delete record")
	mockRepo.On("GetBookingBySlot", 10, now).Return(existingBooking, nil)
	mockRepo.On("Delete", mock.AnythingOfType("*domain.BookingEntity")).Return(expectedError)

	// Act
	res, err := uc.Delete(req)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, res)
	assert.Equal(t, expectedError, err)
	mockRepo.AssertExpectations(t)
}

// ==================== Test GetBookingByDate ====================

func TestUsecase_GetBookingByDate_Success(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	now := time.Now()
	bookings := []domain.BookingEntity{
		{
			ID:         1,
			User:       "John Doe",
			Slot:       10,
			NumberUser: "2",
			Date:       now,
			IsDeleted:  false,
			CreatedAt:  now,
			UpdatedAt:  now,
		},
		{
			ID:         2,
			User:       "Jane Smith",
			Slot:       11,
			NumberUser: "1",
			Date:       now,
			IsDeleted:  false,
			CreatedAt:  now,
			UpdatedAt:  now,
		},
	}

	mockRepo.On("GetBookingByDate", &now).Return(bookings, nil)

	// Act
	res, err := uc.GetBookingByDate(now)

	// Assert
	assert.NoError(t, err)
	assert.NotNil(t, res)
	assert.Len(t, res.Books, 2)
	assert.Equal(t, "John Doe", res.Books[0].User)
	assert.Equal(t, 10, res.Books[0].Slot)
	assert.Equal(t, "Jane Smith", res.Books[1].User)
	assert.Equal(t, 11, res.Books[1].Slot)
	mockRepo.AssertExpectations(t)
}

func TestUsecase_GetBookingByDate_EmptyResult(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	now := time.Now()
	mockRepo.On("GetBookingByDate", &now).Return(nil, nil)

	// Act
	res, err := uc.GetBookingByDate(now)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, res)
	assert.Equal(t, dto.ErrRecordNotFound, err)
	mockRepo.AssertExpectations(t)
}

func TestUsecase_GetBookingByDate_RepositoryError(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	now := time.Now()
	expectedError := errors.New("database connection error")
	mockRepo.On("GetBookingByDate", &now).Return(nil, expectedError)

	// Act
	res, err := uc.GetBookingByDate(now)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, res)
	assert.Equal(t, expectedError, err)
	mockRepo.AssertExpectations(t)
}

func TestUsecase_GetBookingByDate_SingleBooking(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	now := time.Now()
	bookings := []domain.BookingEntity{
		{
			ID:         1,
			User:       "John Doe",
			Slot:       10,
			NumberUser: "3",
			Date:       now,
			IsDeleted:  false,
			CreatedAt:  now,
		},
	}

	mockRepo.On("GetBookingByDate", &now).Return(bookings, nil)

	// Act
	res, err := uc.GetBookingByDate(now)

	// Assert
	assert.NoError(t, err)
	assert.NotNil(t, res)
	assert.Len(t, res.Books, 1)
	assert.Equal(t, "John Doe", res.Books[0].User)
	mockRepo.AssertExpectations(t)
}

func TestUsecase_GetBookingByDate_MultipleBookings(t *testing.T) {
	// Arrange
	mockRepo := new(MockBookingRepository)
	uc := NewUsecase(mockRepo)

	now := time.Now()
	bookings := []domain.BookingEntity{
		{ID: 1, User: "User1", Slot: 9, NumberUser: "1", Date: now, CreatedAt: now},
		{ID: 2, User: "User2", Slot: 10, NumberUser: "2", Date: now, CreatedAt: now},
		{ID: 3, User: "User3", Slot: 11, NumberUser: "3", Date: now, CreatedAt: now},
		{ID: 4, User: "User4", Slot: 15, NumberUser: "1", Date: now, CreatedAt: now},
		{ID: 5, User: "User5", Slot: 17, NumberUser: "2", Date: now, CreatedAt: now},
	}

	mockRepo.On("GetBookingByDate", &now).Return(bookings, nil)

	// Act
	res, err := uc.GetBookingByDate(now)

	// Assert
	assert.NoError(t, err)
	assert.NotNil(t, res)
	assert.Len(t, res.Books, 5)
	for i, book := range res.Books {
		assert.Equal(t, bookings[i].User, book.User)
		assert.Equal(t, bookings[i].Slot, book.Slot)
	}
	mockRepo.AssertExpectations(t)
}
