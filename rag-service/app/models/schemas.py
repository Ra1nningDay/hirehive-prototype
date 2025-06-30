from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"

class Message(BaseModel):
    role: MessageRole
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    thread_id: Optional[str] = None
    max_tokens: Optional[int] = 1000
    temperature: Optional[float] = 0.7

class ChatResponse(BaseModel):
    reply: str
    thread_id: str
    sources: Optional[List[str]] = None
    cached: bool = False

class STTRequest(BaseModel):
    """Request model for speech-to-text API"""
    language: Optional[str] = None
    prompt: Optional[str] = None

class STTResponse(BaseModel):
    """Response model for speech-to-text API"""
    text: str
    original_text: Optional[str] = None
    language: Optional[str] = None
    confidence: Optional[float] = None
    duration: Optional[float] = None
    filename: Optional[str] = None
    word_count: Optional[int] = None
    processing_time: Optional[float] = None
    
    class Config:
        schema_extra = {
            "example": {
                "text": "ผมมีปัญหาสายตาสั้น ต้องการตรวจสายตา",
                "original_text": "ผมมีปัญหาสายตาสั้น ต้องการตรวจสายตา", 
                "language": "th",
                "confidence": 0.95,
                "duration": 3.2,
                "filename": "voice_message.mp3",
                "word_count": 6,
                "processing_time": 1.2
            }
        }

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    code: Optional[str] = None
