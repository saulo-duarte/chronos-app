package collections

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, collection *Collection) error
	GetByID(ctx context.Context, id, userID uuid.UUID) (*Collection, error)
	GetAllByUserID(ctx context.Context, userID uuid.UUID) ([]Collection, error)
	Update(ctx context.Context, collection *Collection) error
	Delete(ctx context.Context, id, userID uuid.UUID) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, collection *Collection) error {
	return r.db.WithContext(ctx).Create(collection).Error
}

func (r *repository) GetByID(ctx context.Context, id, userID uuid.UUID) (*Collection, error) {
	var collection Collection
	err := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		First(&collection).Error
	if err != nil {
		return nil, err
	}
	return &collection, nil
}

func (r *repository) GetAllByUserID(ctx context.Context, userID uuid.UUID) ([]Collection, error) {
	var collections []Collection
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Find(&collections).Error
	if err != nil {
		return nil, err
	}
	return collections, nil
}

func (r *repository) Update(ctx context.Context, collection *Collection) error {
	return r.db.WithContext(ctx).Save(collection).Error
}

func (r *repository) Delete(ctx context.Context, id, userID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&Collection{}).Error
}
