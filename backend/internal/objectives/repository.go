package objectives

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, objective *Objective) error
	GetByID(ctx context.Context, id uuid.UUID, userID uuid.UUID) (*Objective, error)
	GetAllByUserID(ctx context.Context, userID uuid.UUID) ([]Objective, error)
	Update(ctx context.Context, objective *Objective) error
	Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, objective *Objective) error {
	return r.db.WithContext(ctx).Create(objective).Error
}

func (r *repository) GetByID(ctx context.Context, id uuid.UUID, userID uuid.UUID) (*Objective, error) {
	var objective Objective
	if err := r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).First(&objective).Error; err != nil {
		return nil, err
	}
	return &objective, nil
}

func (r *repository) GetAllByUserID(ctx context.Context, userID uuid.UUID) ([]Objective, error) {
	var objectives []Objective
	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).Order("target_year desc, target_month desc").Find(&objectives).Error; err != nil {
		return nil, err
	}
	return objectives, nil
}

func (r *repository) Update(ctx context.Context, objective *Objective) error {
	return r.db.WithContext(ctx).Save(objective).Error
}

func (r *repository) Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	return r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).Delete(&Objective{}).Error
}
