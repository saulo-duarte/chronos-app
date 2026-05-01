package objectives

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Status string

const (
	StatusPending Status = "PENDING"
	StatusDone    Status = "DONE"
)

type Objective struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primaryKey"`
	UserID      uuid.UUID      `json:"user_id" gorm:"type:uuid;index;not null"`
	Title       string         `json:"title" gorm:"not null"`
	Description *string        `json:"description"`
	Status      Status         `json:"status" gorm:"not null;default:'PENDING'"`
	TargetMonth int            `json:"target_month" gorm:"not null"`
	TargetYear  int            `json:"target_year" gorm:"not null"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

func (o *Objective) BeforeCreate(tx *gorm.DB) (err error) {
	if o.ID == uuid.Nil {
		o.ID = uuid.New()
	}
	return
}
