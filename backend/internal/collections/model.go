package collections

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Collection struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primaryKey"`
	UserID      uuid.UUID `json:"user_id" gorm:"type:uuid;index;not null"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description,omitempty"`
	Color       string    `json:"color" gorm:"not null"`
	Icon        string    `json:"icon,omitempty"`
	IsArchived  bool      `json:"is_archived" gorm:"default:false"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

func (c *Collection) BeforeCreate(tx *gorm.DB) (err error) {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return
}
