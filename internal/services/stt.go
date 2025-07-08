package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"

	"github.com/EyeQuila/eyeQcheck/internal/config"
)

type STTService struct{}

func NewSTTService() *STTService {
	return &STTService{}
}

type STTResponse struct {
	Text  string `json:"text"`
	Error string `json:"error,omitempty"`
}

func (s *STTService) ConvertSpeechToText(audioData []byte, filename string) (string, error) {
	cfg := config.Load()
	sttURL := cfg.SttURL

	log.Printf("Calling STT service at: %s", sttURL)

	// Create multipart form data
	var requestBody bytes.Buffer
	writer := multipart.NewWriter(&requestBody)

	// Add audio file to form
	part, err := writer.CreateFormFile("audio", filename)
	if err != nil {
		return "", fmt.Errorf("failed to create form file: %w", err)
	}

	if _, err := part.Write(audioData); err != nil {
		return "", fmt.Errorf("failed to write audio data: %w", err)
	}

	writer.Close()

	// Make HTTP request to Python STT service
	req, err := http.NewRequest("POST", sttURL, &requestBody)
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("STT service unavailable: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	log.Printf("STT raw response: %s", string(body))

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("STT service error (status %d): %s", resp.StatusCode, string(body))
	}

	// Parse response
	var sttResponse STTResponse
	if err := json.Unmarshal(body, &sttResponse); err != nil {
		return "", fmt.Errorf("invalid STT response: %w", err)
	}

	if sttResponse.Error != "" {
		return "", fmt.Errorf("STT error: %s", sttResponse.Error)
	}

	return sttResponse.Text, nil
}
