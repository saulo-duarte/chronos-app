package resources

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/saulo-duarte/chronos/internal/shared/middlewares"
	"github.com/saulo-duarte/chronos/internal/shared/storage"
)

type Service interface {
	Create(ctx context.Context, dto *CreateResourceDTO) (*ResourceResponseDTO, error)
	GetByID(ctx context.Context, id uuid.UUID) (*ResourceResponseDTO, error)
	GetByCollectionID(ctx context.Context, collectionID uuid.UUID) ([]ResourceResponseDTO, error)
	Update(ctx context.Context, id uuid.UUID, dto *UpdateResourceDTO) (*ResourceResponseDTO, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type service struct {
	repository Repository
	storage    *storage.Client
}

func NewService(repository Repository, storage *storage.Client) Service {
	return &service{
		repository: repository,
		storage:    storage,
	}
}

func (s *service) Create(ctx context.Context, dto *CreateResourceDTO) (*ResourceResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	if dto.Type == ResourceTypeFile {
		if dto.File == nil {
			return nil, fmt.Errorf("file is required for type FILE")
		}

		mime := "application/octet-stream"
		if dto.MimeType != nil {
			mime = *dto.MimeType
		}

		err := s.storage.Upload(dto.Path, dto.File, mime)
		if err != nil {
			return nil, err
		}
	}

	resource := dto.ToEntity()
	resource.UserID = userID

	if err := s.repository.Create(ctx, resource); err != nil {
		return nil, err
	}

	response := ToResponse(*resource, s.storage)
	return &response, nil
}

func (s *service) GetByID(ctx context.Context, id uuid.UUID) (*ResourceResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	resource, err := s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return nil, ErrResourceNotFound
	}

	response := ToResponse(*resource, s.storage)
	return &response, nil
}

func (s *service) GetByCollectionID(ctx context.Context, collectionID uuid.UUID) ([]ResourceResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	resources, err := s.repository.GetByCollectionID(ctx, collectionID, userID)
	if err != nil {
		return nil, err
	}

	return ToResponseList(resources, s.storage), nil
}

func (s *service) Update(ctx context.Context, id uuid.UUID, dto *UpdateResourceDTO) (*ResourceResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorized
	}

	resource, err := s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return nil, ErrResourceNotFound
	}

	if dto.Title != nil {
		resource.Title = *dto.Title
	}
	if dto.Description != nil {
		resource.Description = dto.Description
	}
	if dto.Tag != nil {
		resource.Tag = dto.Tag
	}

	if err := s.repository.Update(ctx, resource); err != nil {
		return nil, err
	}

	response := ToResponse(*resource, s.storage)
	return &response, nil
}

func (s *service) Delete(ctx context.Context, id uuid.UUID) error {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return ErrUnauthorized
	}

	resource, err := s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return ErrResourceNotFound
	}

	if resource.Type == ResourceTypeFile {
		_ = s.storage.Delete(resource.Path)
	}

	return s.repository.Delete(ctx, id, userID)
}
