package main

import (
	"log"
	"nailsalon/config/db"
	config "nailsalon/config/router"
	postgres "nailsalon/repository"
	"nailsalon/usecase"
)

func main() {
	dbConnected := db.ConnectDB()

	repo := postgres.NewRepository(dbConnected)
	usecase := usecase.NewUsecase(repo)

	app := config.AppRouter(usecase)
	log.Fatal(app.Listen(":8080"))

}
