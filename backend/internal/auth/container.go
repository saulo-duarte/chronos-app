package auth

import (
	sharedauth "github.com/saulo-duarte/chronos/internal/shared/auth"
	"github.com/saulo-duarte/chronos/internal/shared/config"
	"gorm.io/gorm"
)

type Container struct {
	Repository *AuthRepository
	Service    *AuthService
	Handler    *AuthHandler
}

func NewContainer(db *gorm.DB, cfg *config.Config, jwtSvc *sharedauth.TokenService) *Container {
	repo := NewRepository(db)
	svc := NewAuthService(repo, jwtSvc)
	hdl := NewAuthHandler(svc, cfg)

	return &Container{
		Repository: repo,
		Service:    svc,
		Handler:    hdl,
	}
}
