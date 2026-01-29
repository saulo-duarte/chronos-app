package tasks

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/saulo-duarte/chronos/internal/shared/middlewares"
)

type Service interface {
	Create(ctx context.Context, dto *CreateTaskDTO) (*TaskResponseDTO, error)
	GetByID(ctx context.Context, id uuid.UUID) (*TaskResponseDTO, error)
	GetAllByUserID(ctx context.Context) ([]TaskResponseDTO, error)
	GetByCollection(ctx context.Context, collectionID uuid.UUID) ([]TaskResponseDTO, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status Status) (*TaskResponseDTO, error)
	Update(ctx context.Context, id uuid.UUID, dto *UpdateTaskDTO) (*TaskResponseDTO, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type service struct {
	repository Repository
}

func NewService(repository Repository) Service {
	return &service{repository: repository}
}

func (s *service) Create(ctx context.Context, dto *CreateTaskDTO) (*TaskResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	if !dto.Status.IsValid() {
		return nil, ErrInvalidTaskStatus
	}
	if !dto.Priority.IsValid() {
		return nil, ErrInvalidTaskPriority
	}

	task := dto.ToEntity()
	task.UserID = userID

	if task.Status == Done {
		now := time.Now()
		task.FinishedAt = &now
	}

	if err := s.repository.Create(ctx, task); err != nil {
		return nil, err
	}

	response := ToResponse(*task)
	return &response, nil
}

func (s *service) GetByID(ctx context.Context, id uuid.UUID) (*TaskResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	task, err := s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return nil, ErrTaskNotFound
	}

	response := ToResponse(*task)
	return &response, nil
}

func (s *service) GetAllByUserID(ctx context.Context) ([]TaskResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	tasks, err := s.repository.GetAllByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return ToResponseList(tasks), nil
}

func (s *service) GetByCollection(ctx context.Context, collectionID uuid.UUID) ([]TaskResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	tasks, err := s.repository.GetByCollectionID(ctx, userID, collectionID)
	if err != nil {
		return nil, err
	}

	return ToResponseList(tasks), nil
}

func (s *service) UpdateStatus(ctx context.Context, id uuid.UUID, status Status) (*TaskResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	if !status.IsValid() {
		return nil, ErrInvalidTaskStatus
	}

	task, err := s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return nil, ErrTaskNotFound
	}

	s.applyStatusChange(task, status)

	if err := s.repository.Update(ctx, task); err != nil {
		return nil, err
	}

	response := ToResponse(*task)
	return &response, nil
}

func (s *service) Update(ctx context.Context, id uuid.UUID, dto *UpdateTaskDTO) (*TaskResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	task, err := s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return nil, ErrTaskNotFound
	}

	if err := s.applyUpdates(task, dto); err != nil {
		return nil, err
	}

	if err := s.repository.Update(ctx, task); err != nil {
		return nil, err
	}

	response := ToResponse(*task)
	return &response, nil
}

func (s *service) Delete(ctx context.Context, id uuid.UUID) error {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return ErrUnauthorized
	}

	_, err = s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return ErrTaskNotFound
	}

	return s.repository.Delete(ctx, id, userID)
}

func (s *service) applyUpdates(task *Task, dto *UpdateTaskDTO) error {
	if dto.Title != nil {
		task.Title = *dto.Title
	}
	if dto.Description != nil {
		task.Description = dto.Description
	}
	if dto.Status != nil {
		if !dto.Status.IsValid() {
			return ErrInvalidTaskStatus
		}
		s.applyStatusChange(task, *dto.Status)
	}
	if dto.Priority != nil {
		if !dto.Priority.IsValid() {
			return ErrInvalidTaskPriority
		}
		task.Priority = *dto.Priority
	}
	if dto.CollectionID != nil {
		task.CollectionID = dto.CollectionID
	}
	if dto.StartTime != nil {
		task.StartTime = *dto.StartTime
	}
	if dto.EndTime != nil {
		task.EndTime = dto.EndTime
	}
	return nil
}

func (s *service) applyStatusChange(task *Task, newStatus Status) {
	if newStatus == Done && task.Status != Done {
		now := time.Now()
		task.FinishedAt = &now
	} else if newStatus != Done {
		task.FinishedAt = nil
	}
	task.Status = newStatus
}
