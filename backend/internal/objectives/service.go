package objectives

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/saulo-duarte/chronos/internal/shared/middlewares"
)

var (
	ErrUnauthorized      = errors.New("unauthorized")
	ErrObjectiveNotFound = errors.New("objective not found")
)

type Service interface {
	Create(ctx context.Context, dto *CreateObjectiveDTO) (*ObjectiveResponseDTO, error)
	GetByID(ctx context.Context, id uuid.UUID) (*ObjectiveResponseDTO, error)
	GetAllByUserID(ctx context.Context) ([]ObjectiveResponseDTO, error)
	Update(ctx context.Context, id uuid.UUID, dto *UpdateObjectiveDTO) (*ObjectiveResponseDTO, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, dto *CreateObjectiveDTO) (*ObjectiveResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	objective := &Objective{
		UserID:      userID,
		Title:       dto.Title,
		Description: dto.Description,
		Status:      StatusPending,
		TargetMonth: dto.TargetMonth,
		TargetYear:  dto.TargetYear,
	}

	if err := s.repo.Create(ctx, objective); err != nil {
		return nil, err
	}

	res := ToResponse(*objective)
	return &res, nil
}

func (s *service) GetByID(ctx context.Context, id uuid.UUID) (*ObjectiveResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	objective, err := s.repo.GetByID(ctx, id, userID)
	if err != nil {
		return nil, ErrObjectiveNotFound
	}

	res := ToResponse(*objective)
	return &res, nil
}

func (s *service) GetAllByUserID(ctx context.Context) ([]ObjectiveResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	objectives, err := s.repo.GetAllByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return ToResponseList(objectives), nil
}

func (s *service) Update(ctx context.Context, id uuid.UUID, dto *UpdateObjectiveDTO) (*ObjectiveResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	objective, err := s.repo.GetByID(ctx, id, userID)
	if err != nil {
		return nil, ErrObjectiveNotFound
	}

	if dto.Title != nil {
		objective.Title = *dto.Title
	}
	if dto.Description != nil {
		objective.Description = dto.Description
	}
	if dto.Status != nil {
		objective.Status = *dto.Status
	}
	if dto.TargetMonth != nil {
		objective.TargetMonth = *dto.TargetMonth
	}
	if dto.TargetYear != nil {
		objective.TargetYear = *dto.TargetYear
	}

	if err := s.repo.Update(ctx, objective); err != nil {
		return nil, err
	}

	res := ToResponse(*objective)
	return &res, nil
}

func (s *service) Delete(ctx context.Context, id uuid.UUID) error {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return ErrUnauthorized
	}

	return s.repo.Delete(ctx, id, userID)
}
