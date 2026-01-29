package tasks

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Task struct {
	ID           uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey"`
	UserID       uuid.UUID  `json:"user_id" gorm:"type:uuid;index;not null"`
	Title        string     `json:"title" gorm:"column:name;not null"`
	Description  *string    `json:"description,omitempty"`
	Status       Status     `json:"status" gorm:"not null"`
	Priority     Priority   `json:"priority" gorm:"not null"`
	CollectionID *uuid.UUID `json:"collection_id,omitempty" gorm:"type:uuid;index"`

	StartTime  time.Time  `json:"start_time"`
	EndTime    *time.Time `json:"end_time"`
	FinishedAt *time.Time `json:"finished_at"`

	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
}

func (t *Task) BeforeCreate(tx *gorm.DB) (err error) {
	if t.ID == uuid.Nil {
		t.ID = uuid.New()
	}
	return
}
