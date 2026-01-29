package tasks

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, task *Task) error
	GetByID(ctx context.Context, id, userID uuid.UUID) (*Task, error)
	GetAllByUserID(ctx context.Context, userID uuid.UUID) ([]Task, error)
	GetByCollectionID(ctx context.Context, userID, collectionID uuid.UUID) ([]Task, error)
	Update(ctx context.Context, task *Task) error
	Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, task *Task) error {
	return r.db.WithContext(ctx).Create(task).Error
}

func (r *repository) GetByID(ctx context.Context, id, userID uuid.UUID) (*Task, error) {
	var task Task

	err := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		First(&task).Error

	if err != nil {
		return nil, err
	}

	return &task, nil
}

func (r *repository) GetAllByUserID(ctx context.Context, userID uuid.UUID) ([]Task, error) {
	var tasks []Task

	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Find(&tasks).Error

	if err != nil {
		return nil, err
	}

	return tasks, nil
}

func (r *repository) GetByCollectionID(ctx context.Context, userID, collectionID uuid.UUID) ([]Task, error) {
	var tasks []Task

	err := r.db.WithContext(ctx).
		Where("user_id = ? AND collection_id = ?", userID, collectionID).
		Find(&tasks).Error

	if err != nil {
		return nil, err
	}

	return tasks, nil
}

func (r *repository) Update(ctx context.Context, task *Task) error {
	return r.db.WithContext(ctx).Save(task).Error
}

func (r *repository) Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&Task{}).Error
}
