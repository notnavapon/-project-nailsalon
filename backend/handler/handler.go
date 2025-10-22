package handler

import (
	"nailsalon/dto"
	"nailsalon/usecase"
	"time"

	"github.com/gofiber/fiber/v2"
)

type handler struct {
	usecase usecase.Usecase
}

func NewHandler(usecase usecase.Usecase) *handler {
	return &handler{usecase: usecase}
}

func (h *handler) Create(c *fiber.Ctx) error {
	var req *dto.BookingReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	res, err := h.usecase.Create(req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "create successfully",
		"data":    res,
	})
}

func (h *handler) Delete(c *fiber.Ctx) error {
	var req *dto.BookingReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	res, err := h.usecase.Delete(req)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": res.Message,
	})
}

func (h *handler) GetBookingByDate(c *fiber.Ctx) error {
	var req dto.DateReq

	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	date, err := time.Parse(time.RFC3339, req.Date)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	res, err := h.usecase.GetBookingByDate(date)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "get data successfuly",
		"data":    res,
	})
}
