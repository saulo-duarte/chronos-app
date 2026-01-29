package resources

import (
	"io"
	"time"

	"github.com/google/uuid"
	"github.com/saulo-duarte/chronos/internal/shared/storage"
)

type CreateResourceDTO struct {
	CollectionID uuid.UUID    `json:"collection_id" validate:"required"`
	Title        string       `json:"title" validate:"required,min=1,max=200"`
	Description  *string      `json:"description,omitempty" validate:"omitempty,max=1000"`
	Path         string       `json:"path" validate:"required"`
	Type         ResourceType `json:"type" validate:"required,oneof=FILE LINK"`
	Size         int64        `json:"size" validate:"omitempty,min=0"`
	MimeType     *string      `json:"mime_type,omitempty"`
	File         io.Reader    `json:"-"`
}

type UpdateResourceDTO struct {
	Title       *string `json:"title" validate:"omitempty,min=1,max=200"`
	Description *string `json:"description" validate:"omitempty,max=1000"`
}

type ResourceResponseDTO struct {
	ID           uuid.UUID    `json:"id"`
	CollectionID uuid.UUID    `json:"collection_id"`
	UserID       uuid.UUID    `json:"user_id"`
	Title        string       `json:"title"`
	Description  *string      `json:"description,omitempty"`
	Path         string       `json:"path"`
	Type         ResourceType `json:"type"`
	Size         int64        `json:"size"`
	MimeType     *string      `json:"mime_type,omitempty"`
	CreatedAt    time.Time    `json:"created_at"`
}

func (dto *CreateResourceDTO) ToEntity() *Resource {
	return &Resource{
		ID:           uuid.New(),
		CollectionID: dto.CollectionID,
		Title:        dto.Title,
		Description:  dto.Description,
		Path:         dto.Path,
		Type:         dto.Type,
		Size:         dto.Size,
		MimeType:     dto.MimeType,
	}
}

func ToResponse(r Resource, s *storage.Client) ResourceResponseDTO {
	path := r.Path
	if r.Type == ResourceTypeFile && s != nil {
		path = s.GetPublicURL(r.Path)
	}

	return ResourceResponseDTO{
		ID:           r.ID,
		CollectionID: r.CollectionID,
		UserID:       r.UserID,
		Title:        r.Title,
		Description:  r.Description,
		Path:         path,
		Type:         r.Type,
		Size:         r.Size,
		MimeType:     r.MimeType,
		CreatedAt:    r.CreatedAt,
	}
}

func ToResponseList(resources []Resource, s *storage.Client) []ResourceResponseDTO {
	responses := make([]ResourceResponseDTO, len(resources))
	for i, r := range resources {
		responses[i] = ToResponse(r, s)
	}
	return responses
}
