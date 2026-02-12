package container

import (
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/saulo-duarte/chronos/internal/auth"
	"github.com/saulo-duarte/chronos/internal/collections"
	"github.com/saulo-duarte/chronos/internal/leetcode"
	"github.com/saulo-duarte/chronos/internal/resources"
	sharedauth "github.com/saulo-duarte/chronos/internal/shared/auth"
	"github.com/saulo-duarte/chronos/internal/shared/config"
	"github.com/saulo-duarte/chronos/internal/shared/storage"
	"github.com/saulo-duarte/chronos/internal/tasks"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Container struct {
	Config            *config.Config
	DB                *gorm.DB
	AuthService       *auth.AuthService
	AuthHandler       *auth.AuthHandler
	TaskHandler       *tasks.Handler
	CollectionHandler *collections.Handler
	ResourceHandler   *resources.Handler
	LeetCodeHandler   *leetcode.Handler
	JWTService        *sharedauth.TokenService
}

func New() *Container {
	cfg := config.LoadConfig()

	pgxConfig, err := pgx.ParseConfig(cfg.DBURL)
	if err != nil {
		log.Fatalf("Falha ao fazer parse da URL do banco: %v", err)
	}

	pgxConfig.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol

	sqlDB := stdlib.OpenDB(*pgxConfig)

	db, err := gorm.Open(postgres.New(postgres.Config{
		Conn: sqlDB,
	}), &gorm.Config{
		PrepareStmt:            false,
		SkipDefaultTransaction: true,
	})

	if err != nil {
		log.Fatalf("Falha ao conectar no banco: %v", err)
	}

	if err := db.AutoMigrate(&auth.User{}); err != nil {
		log.Fatalf("Falha ao migrar User: %v", err)
	}

	if err := db.AutoMigrate(&collections.Collection{}); err != nil {
		log.Fatalf("Falha ao migrar Collection: %v", err)
	}

	if err := db.AutoMigrate(&tasks.Task{}); err != nil {
		log.Fatalf("Falha ao migrar Task: %v", err)
	}

	if err := db.AutoMigrate(&resources.Resource{}); err != nil {
		log.Fatalf("Falha ao migrar Resource: %v", err)
	}

	if err := db.AutoMigrate(&leetcode.LeetCodeProblem{}); err != nil {
		log.Fatalf("Falha ao migrar LeetCodeProblem: %v", err)
	}

	jwtSvc := sharedauth.NewTokenService(cfg.JWTSecret)
	storageSvc := storage.NewClient(
		cfg.StorageURL,
		cfg.StorageAPIKey,
		cfg.StorageSecretKey,
		cfg.StorageBucketName,
	)

	authContainer := auth.NewContainer(db, cfg, jwtSvc)
	tasksContainer := tasks.NewContainer(db)
	collectionsContainer := collections.NewContainer(db)
	resourcesContainer := resources.NewContainer(db, storageSvc)
	leetcodeContainer := leetcode.NewContainer(db)

	return &Container{
		Config:            cfg,
		DB:                db,
		AuthService:       authContainer.Service,
		AuthHandler:       authContainer.Handler,
		TaskHandler:       tasksContainer.Handler,
		CollectionHandler: collectionsContainer.Handler,
		ResourceHandler:   resourcesContainer.Handler,
		LeetCodeHandler:   leetcodeContainer.Handler,
		JWTService:        jwtSvc,
	}
}
