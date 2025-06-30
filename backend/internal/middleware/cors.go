package middleware

import (
	"github.com/EyeQuila/eyeQcheck/internal/config"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	// Origins that are allowed to access the API
	cfg := config.Load()

	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", cfg.AllowedOrigins)
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}
