package leetcode

import (
	"context"
	"math"
	"time"

	"github.com/google/uuid"
	"github.com/saulo-duarte/chronos/internal/shared/middlewares"
)

type Service interface {
	Create(ctx context.Context, dto *CreateProblemDTO) (*ProblemResponseDTO, error)
	GetByID(ctx context.Context, id uuid.UUID) (*ProblemResponseDTO, error)
	GetAll(ctx context.Context) ([]ProblemResponseDTO, error)
	GetDueProblems(ctx context.Context) ([]ProblemResponseDTO, error)
	Update(ctx context.Context, id uuid.UUID, dto *UpdateProblemDTO) (*ProblemResponseDTO, error)
	Review(ctx context.Context, id uuid.UUID, dto *ReviewDTO) (*ProblemResponseDTO, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type service struct {
	repository Repository
}

func NewService(repository Repository) Service {
	return &service{repository: repository}
}

func (s *service) Create(ctx context.Context, dto *CreateProblemDTO) (*ProblemResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorizedAccess
	}

	if !dto.Pattern.IsValid() {
		return nil, ErrInvalidPattern
	}
	if !dto.Difficulty.IsValid() {
		return nil, ErrInvalidDifficulty
	}

	problem := dto.ToEntity(userID)

	if err := s.repository.Create(ctx, problem); err != nil {
		return nil, err
	}

	response := ToResponse(*problem)
	return &response, nil
}

func (s *service) GetByID(ctx context.Context, id uuid.UUID) (*ProblemResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorizedAccess
	}

	problem, err := s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return nil, ErrProblemNotFound
	}

	response := ToResponse(*problem)
	return &response, nil
}

func (s *service) GetAll(ctx context.Context) ([]ProblemResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorizedAccess
	}

	problems, err := s.repository.GetAllByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	return ToResponseList(problems), nil
}

func (s *service) GetDueProblems(ctx context.Context) ([]ProblemResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorizedAccess
	}

	problems, err := s.repository.GetDueProblems(ctx, userID)
	if err != nil {
		return nil, err
	}

	return ToResponseList(problems), nil
}

func (s *service) Update(ctx context.Context, id uuid.UUID, dto *UpdateProblemDTO) (*ProblemResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorizedAccess
	}

	problem, err := s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return nil, ErrProblemNotFound
	}

	if err := s.applyUpdates(problem, dto); err != nil {
		return nil, err
	}

	if err := s.repository.Update(ctx, problem); err != nil {
		return nil, err
	}

	response := ToResponse(*problem)
	return &response, nil
}

func (s *service) Review(ctx context.Context, id uuid.UUID, dto *ReviewDTO) (*ProblemResponseDTO, error) {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return nil, ErrUnauthorizedAccess
	}

	if dto.Score < 1 || dto.Score > 5 {
		return nil, ErrInvalidScore
	}

	problem, err := s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return nil, ErrProblemNotFound
	}

	s.calculateNextReview(problem, dto.Score)

	if dto.InsightNote != nil {
		problem.InsightNote = dto.InsightNote
	}

	if err := s.repository.Update(ctx, problem); err != nil {
		return nil, err
	}

	response := ToResponse(*problem)
	return &response, nil
}

func (s *service) Delete(ctx context.Context, id uuid.UUID) error {
	userID, err := middlewares.GetUserIDFromContext(ctx)
	if err != nil {
		return ErrUnauthorizedAccess
	}

	_, err = s.repository.GetByID(ctx, id, userID)
	if err != nil {
		return ErrProblemNotFound
	}

	return s.repository.Delete(ctx, id, userID)
}

func (s *service) applyUpdates(problem *LeetCodeProblem, dto *UpdateProblemDTO) error {
	if dto.Title != nil {
		problem.Title = *dto.Title
	}
	if dto.URL != nil {
		problem.URL = *dto.URL
	}
	if dto.Pattern != nil {
		if !dto.Pattern.IsValid() {
			return ErrInvalidPattern
		}
		problem.Pattern = *dto.Pattern
	}
	if dto.Difficulty != nil {
		if !dto.Difficulty.IsValid() {
			return ErrInvalidDifficulty
		}
		problem.Difficulty = *dto.Difficulty
	}
	if dto.InsightNote != nil {
		problem.InsightNote = dto.InsightNote
	}
	return nil
}

// calculateNextReview implements Anki-like spaced repetition algorithm
func (s *service) calculateNextReview(problem *LeetCodeProblem, score int) {
	problem.LastScore = score

	// Adjust ease factor based on score (Anki algorithm)
	problem.EaseFactor = problem.EaseFactor + (0.1 - (5-float64(score))*(0.08+(5-float64(score))*0.02))
	if problem.EaseFactor < 1.3 {
		problem.EaseFactor = 1.3
	}

	// Calculate new interval
	var newInterval int
	switch {
	case score < 3:
		// Failed: review tomorrow
		newInterval = 1
	case score == 3:
		// Hard: keep same interval or slightly increase
		newInterval = int(math.Max(1, float64(problem.Interval)*1.2))
	case score == 4:
		// Good: double the interval
		newInterval = int(math.Max(1, float64(problem.Interval)*problem.EaseFactor))
	case score == 5:
		// Easy: triple the interval
		newInterval = int(math.Max(1, float64(problem.Interval)*problem.EaseFactor*1.3))
	}

	problem.Interval = newInterval
	problem.NextReview = time.Now().AddDate(0, 0, newInterval)
}
