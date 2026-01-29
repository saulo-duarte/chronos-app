package resources

import (
	"github.com/saulo-duarte/chronos/internal/shared/storage"
	"gorm.io/gorm"
)

type Container struct {
	Repository Repository
	Service    Service
	Handler    *Handler
}

func NewContainer(db *gorm.DB, storage *storage.Client) *Container {
	repo := NewRepository(db)
	svc := NewService(repo, storage)
	handler := NewHandler(svc)

	return &Container{
		Repository: repo,
		Service:    svc,
		Handler:    handler,
	}
}
