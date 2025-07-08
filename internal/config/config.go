package config

import "os"

type Config struct {
	Port           string
	GinMode        string
	AllowedOrigins string
	RagURL         string
	SttURL         string
	JWTSecret      string
	DatabaseURL   string 
}

// Load reads configuration from environment variables or defaults.
func Load() *Config {
	return &Config{
		Port:           getEnv("PORT", "8080"),
		DatabaseURL:  	getEnv("DATABASE_URL", "postgres://user:password@localhost:5432/eyeqcheck?sslmode=disable"),
		GinMode:        getEnv("GIN_MODE", "debug"),
		AllowedOrigins: getEnv("ALLOWED_ORIGINS", "*"),
		RagURL:         getEnv("RAG_URL", "http://127.0.0.1:8000/chat-rag"),
		SttURL:         getEnv("STT_URL", "http://127.0.0.1:8000/stt"),
		JWTSecret:      getEnv("JWT_SECRET", "your-default-secret-change-this"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}