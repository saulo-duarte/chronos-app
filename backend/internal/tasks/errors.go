package tasks

import "errors"

var (
	ErrTaskNotFound         = errors.New("task not found")
	ErrInvalidTaskStatus    = errors.New("invalid task status")
	ErrInvalidTaskPriority  = errors.New("invalid task priority")
	ErrTaskNotBelongsToUser = errors.New("task not belongs to user")
	ErrUnauthorized         = errors.New("unauthorized")
)
