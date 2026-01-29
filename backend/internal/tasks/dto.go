package tasks

import (
	"time"

	"github.com/google/uuid"
)

type CreateTaskDTO struct {
	Title        string     `json:"title" validate:"required"`
	Description  *string    `json:"description,omitempty"`
	Status       Status     `json:"status" validate:"required"`
	Priority     Priority   `json:"priority" validate:"required"`
	CollectionID *uuid.UUID `json:"collection_id,omitempty"`
	StartTime    time.Time  `json:"start_time" validate:"required"`
	EndTime      *time.Time `json:"end_time,omitempty"`
}

type UpdateTaskDTO struct {
	Title        *string    `json:"title" validate:"omitempty,min=3,max=100"`
	Description  *string    `json:"description" validate:"omitempty,max=500"`
	Status       *Status    `json:"status" validate:"omitempty"`
	Priority     *Priority  `json:"priority" validate:"omitempty"`
	CollectionID *uuid.UUID `json:"collection_id,omitempty"`
	StartTime    *time.Time `json:"start_time" validate:"omitempty"`
	EndTime      *time.Time `json:"end_time" validate:"omitempty"`
}

type TaskResponseDTO struct {
	ID           uuid.UUID  `json:"id"`
	Title        string     `json:"title"`
	Description  *string    `json:"description,omitempty"`
	Status       Status     `json:"status"`
	Priority     Priority   `json:"priority"`
	CollectionID *uuid.UUID `json:"collection_id,omitempty"`
	StartTime    time.Time  `json:"start_time"`
	EndTime      *time.Time `json:"end_time,omitempty"`
	FinishedAt   *time.Time `json:"finished_at,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
}

func (dto *CreateTaskDTO) ToEntity() *Task {
	return &Task{
		ID:           uuid.New(),
		Title:        dto.Title,
		Description:  dto.Description,
		Status:       dto.Status,
		Priority:     dto.Priority,
		CollectionID: dto.CollectionID,
		StartTime:    dto.StartTime,
		EndTime:      dto.EndTime,
	}
}

func ToResponse(t Task) TaskResponseDTO {
	return TaskResponseDTO{
		ID:           t.ID,
		Title:        t.Title,
		Description:  t.Description,
		Status:       t.Status,
		Priority:     t.Priority,
		CollectionID: t.CollectionID,
		StartTime:    t.StartTime,
		EndTime:      t.EndTime,
		FinishedAt:   t.FinishedAt,
		CreatedAt:    t.CreatedAt,
	}
}

func ToResponseList(tasks []Task) []TaskResponseDTO {
	responses := make([]TaskResponseDTO, len(tasks))
	for i, t := range tasks {
		responses[i] = ToResponse(t)
	}
	return responses
}
