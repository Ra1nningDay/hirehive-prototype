package middleware

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"
)

// RateLimiter holds rate limiting configuration for different user tiers
type RateLimiter struct {
	// Requests per minute for free users
	FreeUserLimit rate.Limit
	// Burst capacity for free users
	FreeUserBurst int
	// Storage for user rate limiters (in production, use Redis)
	limiters map[string]*rate.Limiter
}

// Global rate limiter instance
var globalRateLimiter = &RateLimiter{
	FreeUserLimit: rate.Every(time.Minute / 10), // 10 requests per minute
	FreeUserBurst: 5,                            // Allow burst of 5 requests
	limiters:      make(map[string]*rate.Limiter),
}

// Guest rate limiter (more restrictive)
var guestRateLimiter = &RateLimiter{
	FreeUserLimit: rate.Every(time.Minute / 3), // 3 requests per minute
	FreeUserBurst: 2,                           // Allow burst of 2 requests
	limiters:      make(map[string]*rate.Limiter),
}

// RateLimitMiddleware applies rate limiting for authenticated users
func RateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get user ID from JWT context
		userID := c.GetString("user_id")
		if userID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
			c.Abort()
			return
		}

		// Get user role to determine if rate limiting applies
		userRole := c.GetString("user_role")
		
		// Skip rate limiting for authenicated users
		if userRole == "user" || userRole == "admin" {
			c.Next()
			return
		}

		// Get or create rate limiter for this user
		limiter := globalRateLimiter.getLimiter(userID)

		// Check if request is allowed
		if !limiter.Allow() {
			// Rate limit exceeded
			c.Header("X-RateLimit-Limit", "10")
			c.Header("X-RateLimit-Remaining", "0")
			c.Header("X-RateLimit-Reset", fmt.Sprintf("%d", time.Now().Add(time.Minute).Unix()))
			
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":   "Rate limit exceeded",
				"message": "Free tier allows 10 requests per minute. Upgrade to premium for unlimited access.",
				"upgrade_url": "/api/public/upgrade",
			})
			c.Abort()
			return
		}

		// Add rate limit headers
		remaining := limiter.Tokens()
		c.Header("X-RateLimit-Limit", "10")
		c.Header("X-RateLimit-Remaining", strconv.FormatFloat(remaining, 'f', 0, 64))
		c.Header("X-RateLimit-Reset", fmt.Sprintf("%d", time.Now().Add(time.Minute).Unix()))

		c.Next()
	}
}

// getLimiter gets or creates a rate limiter for a specific user
func (rl *RateLimiter) getLimiter(userID string) *rate.Limiter {
	// In production, use Redis with TTL for distributed rate limiting
	if limiter, exists := rl.limiters[userID]; exists {
		return limiter
	}

	// Create new limiter for this user
	limiter := rate.NewLimiter(rl.FreeUserLimit, rl.FreeUserBurst)
	rl.limiters[userID] = limiter
	
	// TODO: In production, clean up old limiters periodically
	// or use Redis with appropriate TTL
	
	return limiter
}

// GuestRateLimitMiddleware applies stricter rate limiting for anonymous users
func GuestRateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Use IP address as identifier for guest users
		clientIP := c.ClientIP()
		
		// Get rate limiter for this IP
		limiter := guestRateLimiter.getLimiter(clientIP)

		// Check if request is allowed
		if !limiter.Allow() {
			// Rate limit exceeded
			c.Header("X-RateLimit-Limit", "3")
			c.Header("X-RateLimit-Remaining", "0")
			c.Header("X-RateLimit-Reset", fmt.Sprintf("%d", time.Now().Add(time.Minute).Unix()))
			
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":   "Rate limit exceeded",
				"message": "Guest users are limited to 3 requests per minute. Please sign up for more access.",
				"signup_url": "/api/public/register-user",
			})
			c.Abort()
			return
		}

		// Add rate limit headers
		remaining := limiter.Tokens()
		c.Header("X-RateLimit-Limit", "3")
		c.Header("X-RateLimit-Remaining", strconv.FormatFloat(remaining, 'f', 0, 64))
		c.Header("X-RateLimit-Reset", fmt.Sprintf("%d", time.Now().Add(time.Minute).Unix()))

		c.Next()
	}
}
