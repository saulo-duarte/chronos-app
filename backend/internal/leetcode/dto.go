package leetcode

import (
	"time"

	"github.com/google/uuid"
)

type CreateProblemDTO struct {
	Title       string     `json:"title" validate:"required,min=3,max=200"`
	URL         string     `json:"url" validate:"required,url"`
	Pattern     Pattern    `json:"pattern" validate:"required"`
	Difficulty  Difficulty `json:"difficulty" validate:"required"`
	InsightNote *string    `json:"insight_note,omitempty" validate:"omitempty,max=2000"`
}

type UpdateProblemDTO struct {
	Title       *string     `json:"title" validate:"omitempty,min=3,max=200"`
	URL         *string     `json:"url" validate:"omitempty,url"`
	Pattern     *Pattern    `json:"pattern" validate:"omitempty"`
	Difficulty  *Difficulty `json:"difficulty" validate:"omitempty"`
	InsightNote *string     `json:"insight_note" validate:"omitempty,max=2000"`
}

type ReviewDTO struct {
	Score       int     `json:"score" validate:"required,min=1,max=5"`
	InsightNote *string `json:"insight_note,omitempty" validate:"omitempty,max=2000"`
}

type ProblemResponseDTO struct {
	ID          uuid.UUID  `json:"id"`
	Title       string     `json:"title"`
	URL         string     `json:"url"`
	Pattern     Pattern    `json:"pattern"`
	Difficulty  Difficulty `json:"difficulty"`
	LastScore   int        `json:"last_score"`
	NextReview  time.Time  `json:"next_review"`
	EaseFactor  float64    `json:"ease_factor"`
	Interval    int        `json:"interval"`
	InsightNote *string    `json:"insight_note,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
}

func (dto *CreateProblemDTO) ToEntity(userID uuid.UUID) *LeetCodeProblem {
	return &LeetCodeProblem{
		ID:          uuid.New(),
		UserID:      userID,
		Title:       dto.Title,
		URL:         dto.URL,
		Pattern:     dto.Pattern,
		Difficulty:  dto.Difficulty,
		InsightNote: dto.InsightNote,
		NextReview:  time.Now(),
		EaseFactor:  2.5,
		Interval:    1,
		LastScore:   0,
	}
}

func ToResponse(p LeetCodeProblem) ProblemResponseDTO {
	return ProblemResponseDTO{
		ID:          p.ID,
		Title:       p.Title,
		URL:         p.URL,
		Pattern:     p.Pattern,
		Difficulty:  p.Difficulty,
		LastScore:   p.LastScore,
		NextReview:  p.NextReview,
		EaseFactor:  p.EaseFactor,
		Interval:    p.Interval,
		InsightNote: p.InsightNote,
		CreatedAt:   p.CreatedAt,
	}
}

func ToResponseList(problems []LeetCodeProblem) []ProblemResponseDTO {
	responses := make([]ProblemResponseDTO, len(problems))
	for i, p := range problems {
		responses[i] = ToResponse(p)
	}
	return responses
}
