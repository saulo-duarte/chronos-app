package router

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/saulo-duarte/chronos/internal/auth"
	"github.com/saulo-duarte/chronos/internal/collections"
	"github.com/saulo-duarte/chronos/internal/leetcode"
	"github.com/saulo-duarte/chronos/internal/resources"
	sharedauth "github.com/saulo-duarte/chronos/internal/shared/auth"
	"github.com/saulo-duarte/chronos/internal/shared/middlewares"
	"github.com/saulo-duarte/chronos/internal/tasks"
)

type RouterConfig struct {
	AuthHandler       *auth.AuthHandler
	AuthService       *auth.AuthService
	TaskHandler       *tasks.Handler
	CollectionHandler *collections.Handler
	ResourceHandler   *resources.Handler
	LeetCodeHandler   *leetcode.Handler
	JWTService        *sharedauth.TokenService
}

func New(cfg RouterConfig) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middlewares.CORS)
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("up"))
	})

	r.Route("/api/v1", func(r chi.Router) {
		r.Route("/auth", func(r chi.Router) {
			r.Get("/login", cfg.AuthHandler.Login)
			r.Get("/callback", cfg.AuthHandler.GoogleCallback)
			r.Post("/logout", cfg.AuthHandler.Logout)

			r.Group(func(r chi.Router) {
				r.Use(middlewares.Auth(cfg.JWTService))
				r.Get("/me", cfg.AuthHandler.Me)
			})
		})

		r.Route("/tasks", func(r chi.Router) {
			r.Use(middlewares.Auth(cfg.JWTService))
			r.Post("/", cfg.TaskHandler.Create)
			r.Get("/", cfg.TaskHandler.GetAll)
			r.Get("/{id}", cfg.TaskHandler.GetByID)
			r.Put("/{id}", cfg.TaskHandler.Update)
			r.Patch("/{id}/status", cfg.TaskHandler.UpdateStatus)
			r.Delete("/{id}", cfg.TaskHandler.Delete)
			r.Get("/collection/{collectionID}", cfg.TaskHandler.GetByCollection)
		})

		r.Route("/collections", func(r chi.Router) {
			r.Use(middlewares.Auth(cfg.JWTService))
			r.Post("/", cfg.CollectionHandler.Create)
			r.Get("/", cfg.CollectionHandler.GetAll)
			r.Get("/{id}", cfg.CollectionHandler.GetByID)
			r.Put("/{id}", cfg.CollectionHandler.Update)
			r.Delete("/{id}", cfg.CollectionHandler.Delete)
		})

		r.Route("/resources", func(r chi.Router) {
			r.Use(middlewares.Auth(cfg.JWTService))
			r.Post("/", cfg.ResourceHandler.Create)
			r.Get("/collection/{collectionId}", cfg.ResourceHandler.GetByCollectionID)
			r.Get("/{id}", cfg.ResourceHandler.GetByID)
			r.Put("/{id}", cfg.ResourceHandler.Update)
			r.Delete("/{id}", cfg.ResourceHandler.Delete)
		})

		r.Route("/leetcode", func(r chi.Router) {
			r.Use(middlewares.Auth(cfg.JWTService))
			r.Post("/", cfg.LeetCodeHandler.Create)
			r.Get("/", cfg.LeetCodeHandler.GetAll)
			r.Get("/due", cfg.LeetCodeHandler.GetDue)
			r.Get("/{id}", cfg.LeetCodeHandler.GetByID)
			r.Put("/{id}", cfg.LeetCodeHandler.Update)
			r.Post("/{id}/review", cfg.LeetCodeHandler.Review)
			r.Delete("/{id}", cfg.LeetCodeHandler.Delete)
		})
	})

	return r
}
