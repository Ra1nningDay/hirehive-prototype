package middleware

import (
	"errors"
	"log"
	"net/http"
	"strings"

	"github.com/EyeQuila/eyeQcheck/internal/config"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// UserClaims represents the JWT claims structure from client system
type UserClaims struct {
	UserID      string `json:"user_id"`
	Email       string `json:"email"`
	DisplayName string `json:"display_name"`
	GoogleID    string `json:"google_id,omitempty"`
	Role        string `json:"role,omitempty"`
	jwt.RegisteredClaims
}

// AuthMiddleware validates JWT token from client system
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			c.Abort()
			return
		}

		// Extract token (Bearer <token>)
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		// Validate token
		userClaims, err := validateJWTToken(tokenString)
		if err != nil {
			log.Printf("Token validation error: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Set user context
		c.Set("user_id", userClaims.UserID)
		c.Set("user_email", userClaims.Email)
		c.Set("user_name", userClaims.DisplayName)
		c.Set("google_id", userClaims.GoogleID)
		c.Set("user_role", userClaims.Role)

		c.Next()
	}
}

// validateJWTToken validates the JWT token from client system
func validateJWTToken(tokenString string) (*UserClaims, error) {
	// Parse token
	token, err := jwt.ParseWithClaims(tokenString, &UserClaims{}, func(token *jwt.Token) (interface{}, error) {
		// Validate signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		// Return the secret key (should be shared with client system)
		return []byte(getJWTSecret()), nil
	})

	if err != nil {
		return nil, err
	}

	// Extract claims
	if claims, ok := token.Claims.(*UserClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token claims")
}

// getJWTSecret gets the shared secret key from config
func getJWTSecret() string {
	cfg := config.Load()
	return cfg.JWTSecret
}
