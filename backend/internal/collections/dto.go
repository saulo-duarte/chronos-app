package collections

import (
	"time"

	"github.com/google/uuid"
)

type CreateCollectionDTO struct {
	Title       string `json:"title" validate:"required,min=3,max=50"`
	Description string `json:"description,omitempty" validate:"max=255"`
	Color       string `json:"color" validate:"required"`
	Icon        string `json:"icon,omitempty"`
}

type UpdateCollectionDTO struct {
	Title       *string `json:"title,omitempty" validate:"omitempty,min=3,max=50"`
	Description *string `json:"description,omitempty" validate:"omitempty,max=255"`
	Color       *string `json:"color,omitempty"`
	Icon        *string `json:"icon,omitempty"`
	IsArchived  *bool   `json:"is_archived,omitempty"`
}

type CollectionResponseDTO struct {
	ID          uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description,omitempty"`
	Color       string    `json:"color"`
	Icon        string    `json:"icon,omitempty"`
	IsArchived  bool      `json:"is_archived"`
	CreatedAt   time.Time `json:"created_at"`
}

func (dto *CreateCollectionDTO) ToEntity(userID uuid.UUID) *Collection {
	return &Collection{
		ID:          uuid.New(),
		UserID:      userID,
		Title:       dto.Title,
		Description: dto.Description,
		Color:       dto.Color,
		Icon:        dto.Icon,
	}
}

func ToResponse(c Collection) CollectionResponseDTO {
	return CollectionResponseDTO{
		ID:          c.ID,
		Title:       c.Title,
		Description: c.Description,
		Color:       c.Color,
		Icon:        c.Icon,
		IsArchived:  c.IsArchived,
		CreatedAt:   c.CreatedAt,
	}
}

func ToResponseList(collections []Collection) []CollectionResponseDTO {
	responses := make([]CollectionResponseDTO, len(collections))
	for i, c := range collections {
		responses[i] = ToResponse(c)
	}
	return responses
}
