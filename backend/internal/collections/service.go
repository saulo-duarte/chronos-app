package collections

import (
	"context"

	"github.com/google/uuid"
	"github.com/saulo-duarte/chronos/internal/shared/middlewares"
)

type Service interface {
	Create(ctx context.Context, dto *CreateCollectionDTO) (*CollectionResponseDTO, error)
	GetByID(ctx context.Context, id uuid.UUID) (*CollectionResponseDTO, error)
	GetAll(ctx context.Context) ([]CollectionResponseDTO, error)
	Update(ctx context.Context, id uuid.UUID, dto *UpdateCollectionDTO) (*CollectionResponseDTO, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type service struct {
	repository Repository
}

func NewService(repository Repository) Service {
	return &service{repository: repository}
}

func (s *service) Create(ctx context.Context, dto *CreateCollectionDTO) (*CollectionResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	collection := dto.ToEntity(userID)
	if err := s.repository.Create(ctx, collection); err != nil {
		return nil, err
	}

	res := ToResponse(*collection)
	return &res, nil
}

func (s *service) GetByID(ctx context.Context, id uuid.UUID) (*CollectionResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	collection, err := s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return nil, ErrCollectionNotFound
	}

	res := ToResponse(*collection)
	return &res, nil
}

func (s *service) GetAll(ctx context.Context) ([]CollectionResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	collections, err := s.repository.GetAllByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return ToResponseList(collections), nil
}

func (s *service) Update(ctx context.Context, id uuid.UUID, dto *UpdateCollectionDTO) (*CollectionResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	collection, err := s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return nil, ErrCollectionNotFound
	}

	if dto.Title != nil {
		collection.Title = *dto.Title
	}
	if dto.Description != nil {
		collection.Description = *dto.Description
	}
	if dto.Color != nil {
		collection.Color = *dto.Color
	}
	if dto.Icon != nil {
		collection.Icon = *dto.Icon
	}
	if dto.IsArchived != nil {
		collection.IsArchived = *dto.IsArchived
	}

	if err := s.repository.Update(ctx, collection); err != nil {
		return nil, err
	}

	res := ToResponse(*collection)
	return &res, nil
}

func (s *service) Delete(ctx context.Context, id uuid.UUID) error {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return ErrUnauthorized
	}

	_, err = s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return ErrCollectionNotFound
	}

	return s.repository.Delete(ctx, id, userID)
}
