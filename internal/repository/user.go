package repository

import (
	"github.com/EyeQuila/eyeQcheck/internal/database"
	"github.com/EyeQuila/eyeQcheck/internal/model"
	"gorm.io/gorm"
)

// UserRepository provides methods to interact with user data
type UserRepository struct {
	db *gorm.DB
}

// NewUserRepository creates a new UserRepository instance
func NewUserRepository() *UserRepository {
	return &UserRepository{
		db: database.DB,
	}
}

// GetUserByID retrieves a user by their ID
func (r *UserRepository) GetUserByID(userID string) (*model.User,error) {
	var user model.User
	if err := r.db.Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// CreateUser creates a new user in the database
func (r *UserRepository) CreateUser(user *model.User) error {
	if err := r.db.Create(user).Error; err != nil {
		return err
	}
	return nil
}

// UpdateUser updates an existing user in the database
func (r *UserRepository) UpdateUser(user *model.User) error {
	if err := r.db.Save(user).Error; err != nil {
		return err
	}
	return nil
}
