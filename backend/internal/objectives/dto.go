package objectives

import (
	"time"

	"github.com/google/uuid"
)

type CreateObjectiveDTO struct {
	Title       string  `json:"title" validate:"required,min=3,max=100"`
	Description *string `json:"description" validate:"omitempty,max=500"`
	TargetMonth int     `json:"target_month" validate:"required,min=1,max=12"`
	TargetYear  int     `json:"target_year" validate:"required,min=2024"`
}

type UpdateObjectiveDTO struct {
	Title       *string `json:"title" validate:"omitempty,min=3,max=100"`
	Description *string `json:"description" validate:"omitempty,max=500"`
	Status      *Status `json:"status" validate:"omitempty,oneof=PENDING DONE"`
	TargetMonth *int    `json:"target_month" validate:"omitempty,min=1,max=12"`
	TargetYear  *int    `json:"target_year" validate:"omitempty,min=2024"`
}

type ObjectiveResponseDTO struct {
	ID          uuid.UUID `json:"id"`
	Title       string    `json:"title"`
	Description *string   `json:"description,omitempty"`
	Status      Status    `json:"status"`
	TargetMonth int       `json:"target_month"`
	TargetYear  int       `json:"target_year"`
	CreatedAt   time.Time `json:"created_at"`
}

func ToResponse(o Objective) ObjectiveResponseDTO {
	return ObjectiveResponseDTO{
		ID:          o.ID,
		Title:       o.Title,
		Description: o.Description,
		Status:      o.Status,
		TargetMonth: o.TargetMonth,
		TargetYear:  o.TargetYear,
		CreatedAt:   o.CreatedAt,
	}
}

func ToResponseList(objectives []Objective) []ObjectiveResponseDTO {
	responses := make([]ObjectiveResponseDTO, len(objectives))
	for i, o := range objectives {
		responses[i] = ToResponse(o)
	}
	return responses
}
