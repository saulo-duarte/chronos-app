package resources

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, resource *Resource) error
	GetByID(ctx context.Context, id uuid.UUID, userID uuid.UUID) (*Resource, error)
	GetByCollectionID(ctx context.Context, collectionID uuid.UUID, userID uuid.UUID) ([]Resource, error)
	Update(ctx context.Context, resource *Resource) error
	Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, resource *Resource) error {
	return r.db.WithContext(ctx).Create(resource).Error
}

func (r *repository) GetByID(ctx context.Context, id uuid.UUID, userID uuid.UUID) (*Resource, error) {
	var resource Resource
	err := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ? AND deleted_at IS NULL", id, userID).
		First(&resource).Error
	if err != nil {
		return nil, err
	}
	return &resource, nil
}

func (r *repository) GetByCollectionID(ctx context.Context, collectionID uuid.UUID, userID uuid.UUID) ([]Resource, error) {
	var resources []Resource
	err := r.db.WithContext(ctx).
		Where("collection_id = ? AND user_id = ? AND deleted_at IS NULL", collectionID, userID).
		Order("created_at DESC").
		Find(&resources).Error
	return resources, err
}

func (r *repository) Update(ctx context.Context, resource *Resource) error {
	return r.db.WithContext(ctx).Save(resource).Error
}

func (r *repository) Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&Resource{}).Error
}
