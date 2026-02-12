package leetcode

import (
	"gorm.io/gorm"
)

type Container struct {
	Repository Repository
	Service    Service
	Handler    *Handler
}

func NewContainer(db *gorm.DB) *Container {
	repo := NewRepository(db)
	svc := NewService(repo)
	hdl := NewHandler(svc)

	return &Container{
		Repository: repo,
		Service:    svc,
		Handler:    hdl,
	}
}
