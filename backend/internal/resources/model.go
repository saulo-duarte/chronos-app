package resources

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ResourceType string

const (
	ResourceTypeFile ResourceType = "FILE"
	ResourceTypeLink ResourceType = "LINK"
)

type Resource struct {
	ID           uuid.UUID    `json:"id" gorm:"type:uuid;primaryKey"`
	CollectionID uuid.UUID    `json:"collection_id" gorm:"type:uuid;index;not null"`
	UserID       uuid.UUID    `json:"user_id" gorm:"type:uuid;index;not null"`
	Title        string       `json:"title" gorm:"not null"`
	Description  *string      `json:"description,omitempty"`
	Tag          *string      `json:"tag,omitempty"`
	Path         string       `json:"path" gorm:"not null"`
	Type         ResourceType `json:"type" gorm:"not null"`
	Size         int64        `json:"size" gorm:"default:0"`
	MimeType     *string      `json:"mime_type,omitempty"`
	CreatedAt    time.Time    `json:"created_at"`
	UpdatedAt    time.Time    `json:"updated_at"`
	DeletedAt    *time.Time   `json:"deleted_at,omitempty"`
}

func (r *Resource) BeforeCreate(tx *gorm.DB) (err error) {
	if r.ID == uuid.Nil {
		r.ID = uuid.New()
	}
	return
}
