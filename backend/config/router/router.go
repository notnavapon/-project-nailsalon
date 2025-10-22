package config

import (
	"nailsalon/handler"
	"nailsalon/usecase"

	"github.com/gofiber/fiber/v2"
)

func AppRouter(usecase usecase.Usecase) *fiber.App {
	handler := handler.NewHandler(usecase)

	app := fiber.New()

	app.Post("book/create", handler.Create)
	app.Post("book/date", handler.GetBookingByDate)

	return app
}
