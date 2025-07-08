package database

import (
	"log"

	"github.com/EyeQuila/eyeQcheck/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB is the global database connection
var DB *gorm.DB
// Init initializes the database connection
func Init() {
	cfg := config.Load()
	dsn := cfg.DatabaseURL

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database connection established")

	// Migrate the schema
	err = DB.AutoMigrate(
		// Add your models here
	)
	if err != nil {
		log.Fatalf("Failed to migrate database schema: %v", err)
	}

	log.Println("Database schema migrated successfully")
}