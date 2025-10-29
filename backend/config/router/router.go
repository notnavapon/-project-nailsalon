package config

import (
	"nailsalon/handler"
	"nailsalon/usecase"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func AppRouter(usecase usecase.Usecase) *fiber.App {
	handler := handler.NewHandler(usecase)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:5173",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	app.Post("book/create", handler.Create)
	app.Post("book/date", handler.GetBookingByDate)
	app.Post("book/delete", handler.Delete)

	return app
}
