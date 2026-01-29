package apperrors

import "errors"

var (
	ErrUserNotFound = errors.New("usuário não encontrado")
	ErrInvalidToken = errors.New("token inválido ou expirado")
	ErrGoogleAuth   = errors.New("falha na autenticação com google")
	ErrInternal     = errors.New("erro interno do servidor")
)
