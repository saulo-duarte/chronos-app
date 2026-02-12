package leetcode

import (
	"context"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, problem *LeetCodeProblem) error
	GetByID(ctx context.Context, id, userID uuid.UUID) (*LeetCodeProblem, error)
	GetAllByUserID(ctx context.Context, userID uuid.UUID) ([]LeetCodeProblem, error)
	GetDueProblems(ctx context.Context, userID uuid.UUID) ([]LeetCodeProblem, error)
	Update(ctx context.Context, problem *LeetCodeProblem) error
	Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error
}

type repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, problem *LeetCodeProblem) error {
	return r.db.WithContext(ctx).Create(problem).Error
}

func (r *repository) GetByID(ctx context.Context, id, userID uuid.UUID) (*LeetCodeProblem, error) {
	var problem LeetCodeProblem

	err := r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		First(&problem).Error

	if err != nil {
		return nil, err
	}

	return &problem, nil
}

func (r *repository) GetAllByUserID(ctx context.Context, userID uuid.UUID) ([]LeetCodeProblem, error) {
	var problems []LeetCodeProblem

	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("next_review ASC").
		Find(&problems).Error

	if err != nil {
		return nil, err
	}

	return problems, nil
}

func (r *repository) GetDueProblems(ctx context.Context, userID uuid.UUID) ([]LeetCodeProblem, error) {
	var problems []LeetCodeProblem
	now := time.Now()

	err := r.db.WithContext(ctx).
		Where("user_id = ? AND next_review <= ?", userID, now).
		Order("next_review ASC").
		Find(&problems).Error

	if err != nil {
		return nil, err
	}

	return problems, nil
}

func (r *repository) Update(ctx context.Context, problem *LeetCodeProblem) error {
	return r.db.WithContext(ctx).Save(problem).Error
}

func (r *repository) Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Where("id = ? AND user_id = ?", id, userID).
		Delete(&LeetCodeProblem{}).Error
}
