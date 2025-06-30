from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    # API Settings
    PORT: int = 8001
    DEBUG: bool = False
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # OpenAI Settings
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4-turbo"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-large"
    
    # Whisper/STT Settings
    WHISPER_MODEL: str = "whisper-1"
    STT_MAX_FILE_SIZE_MB: int = 25
    STT_SUPPORTED_LANGUAGES: List[str] = ["th", "en", "auto"]
    STT_DEFAULT_LANGUAGE: str = "th"

    
    # Vector Database
    PINECONE_API_KEY: Optional[str] = None
    PINECONE_ENVIRONMENT: str = "us-east-1"
    PINECONE_INDEX_NAME: str = "eyeqcheck-knowledge"
    
    # RAG Settings
    MAX_TOKENS: int = 1500
    TEMPERATURE: float = 0.7
    TOP_K: int = 5
    SIMILARITY_THRESHOLD: float = 0.7
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Alternative LLM Provider  
    ANTHROPIC_API_KEY: Optional[str] = None
    LLM_PROVIDER: str = "openai"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

    @property
    def openai_api_key(self) -> str:
        return self.OPENAI_API_KEY
    
    @property 
    def whisper_model(self) -> str:
        return self.WHISPER_MODEL
    
    @property
    def embedding_model(self) -> str:
        return self.OPENAI_EMBEDDING_MODEL
    
    @property
    def faiss_k(self) -> int:
        return self.TOP_K

# Create settings instance
settings = Settings()

# Optional: Add validation helper
def validate_settings():
    """Validate critical settings on startup"""
    if not settings.OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is required. Please set it in your .env file.")
    
    if settings.LLM_PROVIDER == "anthropic" and not settings.ANTHROPIC_API_KEY:
        raise ValueError("ANTHROPIC_API_KEY is required when using Anthropic provider.")
    
    print(f"✅ Settings loaded successfully (ENV: {'.env' if settings.DEBUG else 'production'})")

# Validate on import (optional - uncomment if needed)
# validate_settings()
