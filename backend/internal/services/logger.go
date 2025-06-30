package services

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// InterviewLog represents the structure of a log file with summary fields and messages
// If summary fields are not present, only messages will be used (legacy support)
type InterviewLog struct {
	CandidateName string        `json:"candidate_name,omitempty"`
	Position      string        `json:"position,omitempty"`
	InterviewDate string        `json:"interview_date,omitempty"`
	Status        string        `json:"status,omitempty"`
	Messages      []interface{} `json:"messages"`
}

// extractCandidateName tries to extract a name after "ชื่อ" or "ชื่อคือ" from a message string
func extractCandidateName(text string) string {
	fmt.Printf("[DEBUG] extractCandidateName input: %q\n", text)
	text = strings.TrimSpace(text)
	// จับชื่อหลัง "ชื่อ" หรือ "ชื่อคือ" หรือ "ชื่อ :" เฉพาะตัวอักษรไทย/อังกฤษและช่องว่าง
	re := regexp.MustCompile(`(?i)ชื่อ\s*(?:คือ)?\s*[:：]?\s*([ก-๙a-zA-Z]+(?:\s+[ก-๙a-zA-Z]+)*)`)
	matches := re.FindStringSubmatch(text)
	if len(matches) > 1 {
		name := matches[1]
		// normalize: เหลือ space เดียวระหว่างคำ
		name = strings.Join(strings.Fields(name), " ")
		fmt.Printf("[DEBUG] extractCandidateName matched: %q\n", name)
		return name
	}
	fmt.Println("[DEBUG] extractCandidateName: no match")
	return ""
}

// AppendMessageToLog appends a message to the thread's log file (as JSON array or InterviewLog)
func AppendMessageToLog(threadID string, message interface{}) error {
	logDir := "logs"
	if _, err := os.Stat(logDir); os.IsNotExist(err) {
		err := os.Mkdir(logDir, 0755)
		if err != nil {
			return err
		}
	}
	logPath := filepath.Join(logDir, threadID+".json")
	var log InterviewLog
	if _, err := os.Stat(logPath); err == nil {
		data, err := os.ReadFile(logPath)
		if err == nil {
			// Try to unmarshal as InterviewLog
			if err := json.Unmarshal(data, &log); err != nil || log.Messages == nil {
				// Fallback: legacy array of messages
				var messages []interface{}
				if err := json.Unmarshal(data, &messages); err == nil {
					log.Messages = messages
				}
			}
		}
	}
	log.Messages = append(log.Messages, message)
	// ตรวจสอบ candidate_name ถ้ายังไม่มี และ message นี้เป็น user message
	if log.CandidateName == "" {
		// debug print message type and content
		fmt.Printf("[DEBUG] message type: %T, value: %+v\n", message, message)
		// กรณี message เป็น map[string]interface{}
		if msgMap, ok := message.(map[string]interface{}); ok {
			if role, ok := msgMap["role"].(string); ok && role == "user" {
				if content, ok := msgMap["content"].(string); ok {
					name := extractCandidateName(content)
					if name != "" {
						log.CandidateName = name
					}
				}
			}
		} else {
			// กรณี message เป็น struct ที่มี field Content, Role
			if msgBytes, err := json.Marshal(message); err == nil {
				var msgStruct struct {
					Role    string `json:"role"`
					Content string `json:"content"`
				}
				if err := json.Unmarshal(msgBytes, &msgStruct); err == nil {
					if msgStruct.Role == "user" {
						name := extractCandidateName(msgStruct.Content)
						if name != "" {
							log.CandidateName = name
						}
					}
				}
			}
		}
	}
	data, err := json.MarshalIndent(log, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(logPath, data, 0644)
}

// GetLogByThreadID reads the log file for a thread and returns the InterviewLog structure
func GetLogByThreadID(threadID string) (*InterviewLog, error) {
	logPath := filepath.Join("logs", threadID+".json")
	data, err := os.ReadFile(logPath)
	if err != nil {
		return nil, err
	}
	var log InterviewLog
	if err := json.Unmarshal(data, &log); err == nil && log.Messages != nil {
		return &log, nil
	}
	// Fallback: legacy array of messages
	var messages []interface{}
	if err := json.Unmarshal(data, &messages); err == nil {
		return &InterviewLog{Messages: messages}, nil
	}
	return nil, err
}