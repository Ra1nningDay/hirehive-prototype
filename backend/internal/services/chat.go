package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/EyeQuila/eyeQcheck/internal/config"
	"github.com/EyeQuila/eyeQcheck/internal/model"
	"github.com/google/uuid"
)

type ChatService struct{}

func NewChatService() *ChatService {
	return &ChatService{}
}

func (s *ChatService) ProcessChat(messages []model.GPTMessage, threadID string) (*model.ChatResponse, error) {
    // Generate thread_id if not provided
    if threadID == "" {
        threadID = uuid.New().String()
    }

    // Append user message to log
    if len(messages) > 0 {
        if err := AppendMessageToLog(threadID, messages[len(messages)-1]); err != nil {
            log.Printf("Failed to append user message to log: %v", err)
        }
    }

    // Call RAG service
    ragResponse, err := s.callRAGService(messages, threadID)
    if err != nil {
        return nil, err
    }

    // Append assistant reply to log
    if ragResponse.Reply != "" {
        assistantMsg := model.GPTMessage{
            Role:    "assistant",
            Content: ragResponse.Reply,
        }
        if err := AppendMessageToLog(threadID, assistantMsg); err != nil {
            log.Printf("Failed to append assistant message to log: %v", err)
        }
    }

    return &model.ChatResponse{
        Reply:    ragResponse.Reply,
        ThreadID: ragResponse.ThreadID,
        Cached:   false,
    }, nil
}

func (s *ChatService) callRAGService(messages []model.GPTMessage, threadID string) (*model.RAGResponse, error) {
	cfg := config.Load()

    RagURL := cfg.RagURL
    log.Printf("Calling RAG service at: %s", RagURL)

    // Prepare request payload
    payload, err := json.Marshal(map[string]interface{}{
        "messages":  messages,
        "thread_id": threadID,
    })
    if err != nil {
        return nil, fmt.Errorf("failed to marshal request: %w", err)
    }

    // Make HTTP request
    resp, err := http.Post(RagURL, "application/json", bytes.NewBuffer(payload))
    if err != nil {
        return nil, fmt.Errorf("RAG service unavailable: %w", err)
    }
    defer resp.Body.Close()

    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return nil, fmt.Errorf("failed to read response: %w", err)
    }

    log.Printf("RAG raw response body: %s", string(body))

    if resp.StatusCode != http.StatusOK {
        return nil, fmt.Errorf("RAG service error: %s", string(body))
    }

    var ragRes model.RAGResponse
    if err := json.Unmarshal(body, &ragRes); err != nil {
        return nil, fmt.Errorf("invalid RAG response: %w", err)
    }

    if ragRes.Error != "" {
        return nil, fmt.Errorf("RAG error: %s", ragRes.Error)
    }

    return &ragRes, nil
}