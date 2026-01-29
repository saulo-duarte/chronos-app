package resources

import "errors"

var (
	ErrResourceNotFound    = errors.New("resource não encontrado")
	ErrUnauthorized        = errors.New("não autorizado")
	ErrInvalidResourceType = errors.New("tipo de resource inválido")
	ErrCollectionNotFound  = errors.New("collection não encontrada")
	ErrInvalidFileSize     = errors.New("tamanho de arquivo inválido")
)
