package main

import (
	"log"

	_ "github.com/EyeQuila/eyeQcheck/docs"
	"github.com/EyeQuila/eyeQcheck/internal/config"
	"github.com/EyeQuila/eyeQcheck/internal/middleware"
	"github.com/EyeQuila/eyeQcheck/internal/router"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// @title           EyeQcheck API
// @version         1.0
// @description     Eye examination consultation API service
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.email  support@eyeqcheck.com

// @license.name  MIT
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:8080
// @BasePath  /api
func main() {
	// Load environment variables from .env.local file if it exists
	if err := godotenv.Load(".env.local"); err != nil {
		log.Println("No .env.local file found, using environment variables")
	}

	// Load configuration
	// This will read from environment variables or use defaults
	cfg := config.Load()

	// Set Gin mode based on configuration
	gin.SetMode(cfg.GinMode)
	r := gin.Default()

	// Initialize middleware first
	r.Use(middleware.CORSMiddleware())
	r.Use(gin.Recovery())
	r.Use(gin.Logger())

	// Set up the API routes
	router.RegisterRoutes(r)

	log.Printf("Starting server on port: %s...", cfg.Port)
	log.Printf("Swagger docs available at: http://localhost:%s/swagger/index.html", cfg.Port)
	r.Run(":" + cfg.Port)
}