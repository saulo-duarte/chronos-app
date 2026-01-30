package config

import "os"

type Config struct {
	DBURL              string
	JWTSecret          string
	GoogleClientID     string
	GoogleClientSecret string
	GoogleRedirectURL  string
	Port               string
	StorageURL         string
	StorageSecretKey   string
	StorageBucketName  string
	StorageAPIKey      string
}

func LoadConfig() *Config {
	return &Config{
		DBURL:              getEnv("DATABASE_DSN", ""),
		JWTSecret:          getEnv("JWT_SECRET", "secret"),
		GoogleClientID:     getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
		GoogleRedirectURL:  getEnv("GOOGLE_REDIRECT_URL", "http://localhost:3001/api/v1/auth/callback"),
		Port:               getEnv("PORT", "8080"),
		StorageURL:         getEnv("SUPABASE_STORAGE_BASE_URL", ""),
		StorageSecretKey:   getEnv("SUPABASE_API_SECRET", ""),
		StorageBucketName:  getEnv("SUPABASE_STORAGE_BUCKET_NAME", "chronos"),
		StorageAPIKey:      getEnv("SUPABASE_API_KEY", ""),
	}
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
