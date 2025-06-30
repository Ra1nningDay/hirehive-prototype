package model

import "time"

// User represents a user in the system
type User struct {
	ID          string    `json:"id" db:"id"`
	Email       string    `json:"email" db:"email"`
	DisplayName string    `json:"display_name" db:"display_name"`
	GoogleID    string    `json:"google_id,omitempty" db:"google_id"`
	AvatarURL   string    `json:"avatar_url,omitempty" db:"avatar_url"`
	Role        string    `json:"role" db:"role"`
	IsActive    bool      `json:"is_active" db:"is_active"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
	LastLoginAt *time.Time `json:"last_login_at,omitempty" db:"last_login_at"`
}

// UserPreferences represents user preferences for the eye examination system
type UserPreferences struct {
	UserID             string `json:"user_id" db:"user_id"`
	Language           string `json:"language" db:"language"`
	NotificationsEmail bool   `json:"notifications_email" db:"notifications_email"`
	NotificationsPush  bool   `json:"notifications_push" db:"notifications_push"`
	ThemePreference    string `json:"theme_preference" db:"theme_preference"`
	CreatedAt          time.Time `json:"created_at" db:"created_at"`
	UpdatedAt          time.Time `json:"updated_at" db:"updated_at"`
}

// Request/Response structs for user operations

// RegisterUserRequest represents the request to register a user from external OAuth system
type RegisterUserRequest struct {
	UserID      string `json:"user_id" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	DisplayName string `json:"display_name" binding:"required"`
	GoogleID    string `json:"google_id,omitempty"`
	AvatarURL   string `json:"avatar_url,omitempty"`
	Role        string `json:"role,omitempty"`
}

// RegisterUserResponse represents the response after user registration
type RegisterUserResponse struct {
	Message   string `json:"message"`
	UserID    string `json:"user_id"`
	IsNewUser bool   `json:"is_new_user"`
}

// UpdateUserProfileRequest represents the request to update user profile

type UpdateUserProfileRequest struct {
	UserID      string `json:"user_id" binding:"required"`
	Email       string `json:"email" binding:"required,email"`
	DisplayName string `json:"display_name" binding:"required"`
	GoogleID    string `json:"google_id,omitempty"`
	AvatarURL   string `json:"avatar_url,omitempty"`
	Role        string `json:"role,omitempty"`
}