package services

import (
	"log"
	"time"

	"github.com/EyeQuila/eyeQcheck/internal/model"
)

type UserService struct{}

func NewUserService() *UserService {
	return &UserService{}
}

// RegisterOrUpdateUser registers a new user or updates existing user from OAuth system
func (s *UserService) RegisterOrUpdateUser(userID, email, displayName, googleID, avatarURL, role string) (*model.User, bool, error) {
	// TODO: Implement database operations
	// For now, return mock data
	
	log.Printf("Processing user registration: %s (%s)", displayName, email)
	
	// Check if user exists (mock implementation)
	isNewUser := true // This should come from database query
	
	user := &model.User{
		ID:          userID,
		Email:       email,
		DisplayName: displayName,
		GoogleID:    googleID,
		AvatarURL:   avatarURL,
		Role:        role,
		IsActive:    true,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
	
	if isNewUser {
		// Create new user in database
		log.Printf("Creating new user: %s", userID)
		// TODO: INSERT INTO users...
		
		// Create default user preferences
		err := s.createDefaultUserPreferences(userID)
		if err != nil {
			log.Printf("Failed to create user preferences: %v", err)
			// Continue anyway, preferences are not critical
		}
	} else {
		// Update existing user
		log.Printf("Updating existing user: %s", userID)
		// TODO: UPDATE users SET... WHERE id = userID
		user.LastLoginAt = &time.Time{}
		*user.LastLoginAt = time.Now()
	}
	
	return user, isNewUser, nil
}

// createDefaultUserPreferences creates default preferences for new users
func (s *UserService) createDefaultUserPreferences(userID string) error {
	_ = &model.UserPreferences{
		UserID:             userID,
		Language:           "th", // Default to Thai
		NotificationsEmail: true,
		NotificationsPush:  true,
		ThemePreference:    "light",
		CreatedAt:          time.Now(),
		UpdatedAt:          time.Now(),
	}
	
	log.Printf("Creating default preferences for user: %s", userID)
	// TODO: INSERT INTO user_preferences...
	
	return nil
}

// GetUserByID retrieves user by ID
func (s *UserService) GetUserByID(userID string) (*model.User, error) {
	// TODO: Implement database query
	// SELECT * FROM users WHERE id = userID
	return nil, nil
}

// GetUserByEmail retrieves user by email
func (s *UserService) GetUserByEmail(email string) (*model.User, error) {
	// TODO: Implement database query
	// SELECT * FROM users WHERE email = email
	return nil, nil
}

// UpdateUserLastLogin updates user's last login timestamp
func (s *UserService) UpdateUserLastLogin(userID string) error {
	log.Printf("Updating last login for user: %s", userID)
	// TODO: UPDATE users SET last_login_at = NOW() WHERE id = userID
	return nil
}

// GetUserProfile retrieves the profile of the authenticated user
func (s *UserService) GetUserProfile(userID string) (*model.User, error) {
	log.Printf("Fetching profile for user: %s", userID)
	return s.GetUserByID(userID)
}

// UpdateUserProfile updates the profile of the authenticated user
func (s *UserService) UpdateUserProfile(user *model.User) error {
	log.Printf("Updating profile for user: %s", user.ID)
	return s.UpdateUserLastLogin(user.ID) // This should also update other fields like email, display name, etc.
}

