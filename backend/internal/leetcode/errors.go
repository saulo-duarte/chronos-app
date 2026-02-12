package leetcode

import "errors"

var (
	ErrProblemNotFound    = errors.New("leetcode problem not found")
	ErrInvalidScore       = errors.New("score must be between 1 and 5")
	ErrInvalidPattern     = errors.New("invalid pattern")
	ErrInvalidDifficulty  = errors.New("invalid difficulty")
	ErrUnauthorizedAccess = errors.New("unauthorized access to problem")
)
