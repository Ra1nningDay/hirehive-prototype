package controller

import (
	"log"
	"net/http"

	"github.com/EyeQuila/eyeQcheck/internal/model"
	"github.com/EyeQuila/eyeQcheck/internal/services"
	"github.com/gin-gonic/gin"
)

// RegisterUserController handles user registration from external OAuth system
// @Summary      Register user from external OAuth system
// @Description  Register or update user information from external OAuth system (Google, etc.)
// @Tags         User
// @Accept       json
// @Produce      json
// @Param        request body model.RegisterUserRequest true "User registration data from OAuth system"
// @Success      200 {object} model.RegisterUserResponse "User registered/updated successfully"
// @Success      201 {object} model.RegisterUserResponse "New user created successfully"
// @Failure      400 {object} map[string]string "Invalid request payload"
// @Failure      500 {object} map[string]string "Internal server error"
// @Router       /public/register-user [post]
func RegisterUserController(c *gin.Context) {
	var req model.RegisterUserRequest

	// Parse and validate the incoming JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	log.Printf("Registering user: %s (%s)", req.DisplayName, req.Email)

	// Process user registration through service
	userService := services.NewUserService()
	user, isNewUser, err := userService.RegisterOrUpdateUser(
		req.UserID,
		req.Email,
		req.DisplayName,
		req.GoogleID,
		req.AvatarURL,
		req.Role,
	)
	if err != nil {
		log.Printf("Error registering user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	statusCode := http.StatusCreated
	if !isNewUser {
		statusCode = http.StatusOK
	}

	response := model.RegisterUserResponse{
		Message:   "User registered successfully",
		UserID:    user.ID,
		IsNewUser: isNewUser,
	}

	log.Printf("User registration completed: %s (new: %v)", user.ID, isNewUser)
	c.JSON(statusCode, response)
}

// GetUserProfileController retrieves the authenticated user's profile
// @Summary      Get user profile
// @Description  Retrieve the profile information of the authenticated user
// @Tags         User
// @Produce      json
// @Success      200 {object} model.User "Returns user profile information"
// @Failure      401 {object} map[string]string "Unauthorized"
// @Failure      500 {object} map[string]string "Internal server error"
func GetUserProfileController(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	log.Printf("Fetching profile for user: %s", userID)

	// Fetch user profile from service
	userService := services.NewUserService()
	user, err := userService.GetUserProfile(userID.(string))
	if err != nil {
		log.Printf("Error fetching user profile: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user profile"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func UpdateUserProfileController(c *gin.Context) {
	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req model.UpdateUserProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Failed to bind JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	log.Printf("Updating profile for user: %s", userID)

	// Update user profile through service
	userService := services.NewUserService()
	user := &model.User{
		ID:          userID.(string),
		Email:       req.Email,
		DisplayName: req.DisplayName,
		GoogleID:    req.GoogleID,
		AvatarURL:   req.AvatarURL,
		Role:        req.Role,
	}
	err := userService.UpdateUserProfile(user)
	if err != nil {
		log.Printf("Error updating user profile: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user profile"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User profile updated successfully"})
}