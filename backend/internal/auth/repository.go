package auth

import (
	"gorm.io/gorm"
)

type AuthRepository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *AuthRepository {
	return &AuthRepository{db: db}
}

func (r *AuthRepository) UpsertUser(user *User) error {
	return r.db.Where(User{GoogleID: user.GoogleID}).
		Attrs(User{Email: user.Email, Name: user.Name}).
		FirstOrCreate(user).Error
}

func (r *AuthRepository) GetByID(id string) (*User, error) {
	var user User
	if err := r.db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
