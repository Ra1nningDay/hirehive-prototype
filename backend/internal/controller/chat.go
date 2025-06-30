package controller

import (
	"log"
	"net/http"

	"github.com/EyeQuila/eyeQcheck/internal/model"
	"github.com/EyeQuila/eyeQcheck/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// ChatController handles chat requests
// @Summary      Process chat conversation
// @Description  Send messages to AI assistant and get response for eye examination consultation
// @Tags         Conversation
// @Accept       json
// @Produce      json
// @Param        request body model.ChatRequest true "Chat request with messages and optional thread_id"
// @Success      200 {object} model.ChatResponse "Successful response with assistant reply"
// @Failure      400 {object} map[string]string "Invalid request payload"
// @Failure      500 {object} map[string]string "Internal server error"
// @Router       /conversation/chat [post]
func ChatController(c *gin.Context) {
	var req model.ChatRequest

	// Parse the incoming JSON request into the ChatRequest struct
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	threadID := c.Query("thread_id")
	if threadID == "" {
		threadID = uuid.New().String()
	}

	// Validate the messages in the request
	chatService := services.NewChatService()
	response, err := chatService.ProcessChat(req.Messages, threadID)
	if err != nil {
		log.Printf("Error processing chat: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process chat"})
		return
	}

	c.JSON(http.StatusOK, response)
}

// DemoChatController handles demo chat requests for anonymous users
// @Summary      Demo chat conversation for guests
// @Description  Limited chat functionality for non-logged-in users (demo/trial)
// @Tags         Demo
// @Accept       json
// @Produce      json
// @Param        request body model.ChatRequest true "Demo chat request with limited messages"
// @Success      200 {object} model.ChatResponse "Demo response with limited functionality"
// @Failure      400 {object} map[string]string "Invalid request payload"
// @Failure      429 {object} map[string]string "Rate limit exceeded"
// @Failure      500 {object} map[string]string "Internal server error"
// @Router       /guest/conversation/demo-chat [post]
func DemoChatController(c *gin.Context) {
	var req model.ChatRequest

	// Parse and validate the incoming JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Limit message count for demo users
	if len(req.Messages) > 10 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Demo users are limited to 3 messages per conversation",
			"message": "Please sign up for unlimited messaging",
			"signup_url": "/api/public/register-user",
		})
		return
	}

	// Generate a new thread ID if not provided
	threadID := c.Query("thread_id")
	if threadID == "" {
		threadID = uuid.New().String()
	}

	// Process chat through service (same as regular chat but with demo context)
	// Validate the messages in the request
	chatService := services.NewChatService()
	response, err := chatService.ProcessChat(req.Messages, threadID)
	if err != nil {
		log.Printf("Error processing chat: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process chat"})
		return
	}

	c.JSON(http.StatusOK, response)
}