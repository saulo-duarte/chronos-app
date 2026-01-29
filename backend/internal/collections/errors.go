package collections

import "errors"

var (
	ErrCollectionNotFound = errors.New("collection not found")
	ErrUnauthorized       = errors.New("unauthorized")
)
