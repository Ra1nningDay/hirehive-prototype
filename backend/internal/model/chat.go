package model

// GPTRequest represents the request sent to the OpenAI API.
type GPTRequest struct {
	Model    string       `json:"model"`
	Messages []GPTMessage `json:"messages"`
}

// GPTMessage represents a single message in the conversation
type GPTMessage struct {
    Role    string `json:"role" binding:"required" example:"user" enums:"user,assistant,system"`
    Content string `json:"content" binding:"required" example:"Hello, how are you?"`
}

// ChatRequest represents the request body for chat endpoint
type ChatRequest struct {
    Messages []GPTMessage `json:"messages" binding:"required"`
    ThreadID string       `json:"thread_id,omitempty" example:"550e8400-e29b-41d4-a716-446655440000"`
}

// ChatResponse represents the response from chat endpoint
type ChatResponse struct {
    Reply    string `json:"reply" example:"Hello! How can I help you with your eye examination today?"`
    ThreadID string `json:"thread_id" example:"550e8400-e29b-41d4-a716-446655440000"`
    Cached   bool   `json:"cached" example:"false"`
}

type RAGResponse struct {
    Reply    string `json:"reply"`
    ThreadID string `json:"thread_id"`
    Error    string `json:"error"`
}

// STTResponse represents the response from speech-to-text endpoint
type STTResponse struct {
    Text     string `json:"text" example:"Hello, I would like to book an eye examination"`
    Filename string `json:"filename,omitempty" example:"audio.wav"`
}