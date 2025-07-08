package controller

import (
	"io"
	"log"
	"net/http"

	"github.com/EyeQuila/eyeQcheck/internal/services"
	"github.com/gin-gonic/gin"
)

// SpeechToTextController transcribes audio to text
// @Summary      Convert speech to text
// @Description  Upload audio file and get transcribed text
// SpeechToTextController transcribes audio to text
// @Summary      Convert speech to text
// @Description  Upload audio file and get transcribed text using Whisper API
// @Tags         Conversation
// @Accept       multipart/form-data
// @Produce      json
// @Param        audio formData file true "Audio file to transcribe"
// @Success      200 {object} model.STTResponse "Returns transcribed text and filename"
// @Failure      400 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /conversation/speech-to-text [post]
func SpeechToTextController(c *gin.Context) {
	// Get uploaded file
	file, header, err := c.Request.FormFile("audio")
	// println("Received file:", file, "Header:", header.Filename)
	if err != nil {
		log.Printf("FormFile error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Audio file required"})
		return
	}
	defer file.Close()

	audioData, err := io.ReadAll(file)
	if err != nil {
		log.Printf("ReadAll error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read audio file"})
		return
	}

	// Process through STT service
	sttService := services.NewSTTService()
	whisperRes, err := sttService.ConvertSpeechToText(audioData, header.Filename)
	if err != nil {
		log.Printf("STT service error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process audio file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"text":     whisperRes,
		"filename": header.Filename,
	})
}

// DemoSpeechToTextController handles demo speech-to-text requests for non-logged-in users
// @Summary      Demo speech-to-text for guests
// @Description  Limited speech-to-text functionality for non-logged-in users (demo/trial)
// @Tags         Demo
// @Accept       multipart/form-data
// @Produce      json
// @Param        audio formData file true "Audio file to transcribe"
// @Success      200 {object} model.STTResponse "Returns transcribed text and filename"
// @Failure      400 {object} map[string]string
// @Failure      500 {object} map[string]string
// @Router       /guest/conversation/speech-to-text [post]
func DemoSpeechToTextController(c *gin.Context) {
	// Get uploaded file
	file, header, err := c.Request.FormFile("audio")
	// println("Received file:", file, "Header:", header.Filename)
	if err != nil {
		log.Printf("FormFile error: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Audio file required"})
		return
	}
	defer file.Close()

	audioData, err := io.ReadAll(file)
	if err != nil {
		log.Printf("ReadAll error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read audio file"})
		return
	}

	// Process through STT service
	sttService := services.NewSTTService()
	whisperRes, err := sttService.ConvertSpeechToText(audioData, header.Filename)
	if err != nil {
		log.Printf("STT service error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process audio file"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"text":     whisperRes,
		"filename": header.Filename,
	})
}
