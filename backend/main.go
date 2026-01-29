package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	chiadapter "github.com/awslabs/aws-lambda-go-api-proxy/chi"
	"github.com/go-chi/chi/v5"
	"github.com/saulo-duarte/chronos/internal/container"
	"github.com/saulo-duarte/chronos/internal/shared/router"
)

var chiLambda *chiadapter.ChiLambdaV2
var chiRouter *chi.Mux

func init() {
	c := container.New()

	r := router.New(router.RouterConfig{
		AuthHandler:       c.AuthHandler,
		AuthService:       c.AuthService,
		TaskHandler:       c.TaskHandler,
		CollectionHandler: c.CollectionHandler,
		ResourceHandler:   c.ResourceHandler,
		JWTService:        c.JWTService,
	})

	chiRouter = r
	chiLambda = chiadapter.NewV2(chiRouter)
}

func Handler(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	return chiLambda.ProxyWithContextV2(ctx, req)
}

func main() {
	if os.Getenv("RUN_MODE") == "local" {
		port := os.Getenv("PORT")
		if port == "" {
			port = "3001"
		}
		log.Printf("🚀 Servidor local iniciado em http://localhost:%s\n", port)
		log.Fatal(http.ListenAndServe(":"+port, chiRouter))
	} else {
		lambda.Start(Handler)
	}
}
