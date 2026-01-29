package storage

import (
	"context"
	"fmt"
	"io"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type Client struct {
	S3Client   *s3.Client
	BucketName string
	BaseURL    string // Usado para gerar a URL pública
}

func NewClient(endpoint, accessKey, secretKey, bucketName string) *Client {
	// O region no Supabase geralmente não importa muito para o S3 wrapper,
	// mas precisa ser preenchido (ex: us-east-1)
	staticResolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL:           endpoint,
			SigningRegion: "us-east-1",
		}, nil
	})

	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithEndpointResolverWithOptions(staticResolver),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKey, secretKey, "")),
		config.WithRegion("us-east-1"),
	)
	if err != nil {
		panic("falha ao configurar s3: " + err.Error())
	}

	client := s3.NewFromConfig(cfg, func(o *s3.Options) {
		o.UsePathStyle = true // Importante: Supabase exige Path Style
	})

	return &Client{
		S3Client:   client,
		BucketName: bucketName,
		BaseURL:    endpoint,
	}
}

func (c *Client) Upload(path string, body io.Reader, contentType string) error {
	_, err := c.S3Client.PutObject(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(c.BucketName),
		Key:         aws.String(path),
		Body:        body,
		ContentType: aws.String(contentType),
	})
	return err
}

func (c *Client) Download(path string) ([]byte, error) {
	result, err := c.S3Client.GetObject(context.TODO(), &s3.GetObjectInput{
		Bucket: aws.String(c.BucketName),
		Key:    aws.String(path),
	})
	if err != nil {
		return nil, err
	}
	defer result.Body.Close()

	return io.ReadAll(result.Body)
}

func (c *Client) Delete(path string) error {
	_, err := c.S3Client.DeleteObject(context.TODO(), &s3.DeleteObjectInput{
		Bucket: aws.String(c.BucketName),
		Key:    aws.String(path),
	})
	return err
}

func (c *Client) GetPublicURL(path string) string {
	// A URL pública via REST continua sendo o formato mais simples para o navegador
	// Substituímos o sufixo /s3 para bater no endpoint de objetos públicos
	restURL := fmt.Sprintf("%s/object/public/%s/%s",
		fmt.Sprintf("https://%s.supabase.co/storage/v1", "wuhyljcphmegcyfjintk"), // Substitua pelo seu Project Ref
		c.BucketName,
		path,
	)
	return restURL
}
