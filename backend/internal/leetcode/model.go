package leetcode

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type LeetCodeProblem struct {
	ID          uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey"`
	UserID      uuid.UUID  `json:"user_id" gorm:"type:uuid;index;not null"`
	Title       string     `json:"title" gorm:"not null"`
	URL         string     `json:"url" gorm:"not null"`
	Pattern     Pattern    `json:"pattern" gorm:"not null"`
	Difficulty  Difficulty `json:"difficulty" gorm:"not null"`
	LastScore   int        `json:"last_score" gorm:"default:0"`
	NextReview  time.Time  `json:"next_review" gorm:"index;not null"`
	EaseFactor  float64    `json:"ease_factor" gorm:"default:2.5"`
	Interval    int        `json:"interval" gorm:"default:1"`
	InsightNote *string    `json:"insight_note,omitempty"`

	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty"`
}

func (p *LeetCodeProblem) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	if p.EaseFactor == 0 {
		p.EaseFactor = 2.5
	}
	if p.Interval == 0 {
		p.Interval = 1
	}
	if p.NextReview.IsZero() {
		p.NextReview = time.Now()
	}
	return
}
