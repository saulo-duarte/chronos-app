package auth

import (
	"github.com/go-chi/chi/v5"
	"github.com/saulo-duarte/chronos/internal/shared/config"
	"github.com/saulo-duarte/chronos/internal/shared/middlewares"
)

func RegisterRoutes(r chi.Router, service *AuthService, cfg *config.Config) {
	h := NewAuthHandler(service, cfg)

	r.Route("/auth", func(r chi.Router) {
		r.Get("/login", h.Login)
		r.Get("/callback", h.GoogleCallback)

		r.Group(func(r chi.Router) {
			r.Use(middlewares.Auth(service.jwtService))
			r.Get("/me", h.Me)
		})
	})
}
