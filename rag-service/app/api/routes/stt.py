"""
Speech-to-Text API Routes

This module provides FastAPI routes for speech-to-text functionality.
Handles audio file uploads and returns transcribed text using OpenAI Whisper.

Routes:
    POST /stt/transcribe - Convert audio to text
    GET /stt/health - Check STT service health
    GET /stt/supported-formats - Get supported audio formats
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, Query
from typing import Optional
import time

from app.models.schemas import STTResponse, STTRequest, ErrorResponse
from app.services.stt import STTService
from app.core.logging import get_logger

router = APIRouter()
logger = get_logger(__name__)

def get_stt_service() -> STTService:
    """Dependency to get STT service instance"""
    return STTService()

@router.post("/transcribe", response_model=STTResponse)
async def speech_to_text(
    audio: UploadFile = File(..., description="Audio file to transcribe"),
    language: Optional[str] = Query(None, description="Language code (e.g., 'th', 'en')"),
    prompt: Optional[str] = Query(None, description="Optional prompt to guide transcription"),
    stt_service: STTService = Depends(get_stt_service)
):
    """
    Convert speech to text using OpenAI Whisper.
    
    - **audio**: Audio file (mp3, wav, m4a, webm, etc.)
    - **language**: Optional language code for better accuracy
    - **prompt**: Optional context prompt for medical terminology
    
    Returns transcribed text with metadata including confidence scores.
    """
    start_time = time.time()
    
    try:
        # Validate file type
        if not audio.content_type or not audio.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "Invalid file type",
                    "detail": "File must be an audio file",
                    "supported_formats": list(STTService.SUPPORTED_FORMATS.values())
                }
            )
        
        logger.info(f"Processing STT for file: {audio.filename} ({audio.content_type})")
        
        # Read audio data
        audio_data = await audio.read()
        
        # Validate file size
        if len(audio_data) > STTService.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail={
                    "error": "File too large",
                    "detail": f"Maximum file size: {STTService.MAX_FILE_SIZE / 1024 / 1024:.1f}MB",
                    "received_size_mb": len(audio_data) / 1024 / 1024
                }
            )
        
        # Process with STT service
        result = await stt_service.transcribe_audio(
            audio_data=audio_data,
            filename=audio.filename,
            language=language,
            prompt=prompt
        )
        
        # Add processing time
        processing_time = time.time() - start_time
        result.processing_time = processing_time
        
        logger.info(
            f"STT completed for {audio.filename}: "
            f"{len(result.text)} chars in {processing_time:.2f}s"
        )
        
        return result
        
    except HTTPException:
        raise
    except ValueError as e:
        logger.warning(f"Validation error for {audio.filename}: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Validation failed",
                "detail": str(e)
            }
        )
    except Exception as e:
        logger.error(f"Error processing STT for {audio.filename}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Processing failed",
                "detail": f"Failed to process audio: {str(e)}"
            }
        )

@router.get("/health")
async def stt_health_check(stt_service: STTService = Depends(get_stt_service)):
    """
    Check STT service health status.
    
    Returns service status, model information, and capabilities.
    """
    try:
        health_status = await stt_service.health_check()
        return health_status
    except Exception as e:
        logger.error(f"STT health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail={
                "error": "Service unavailable",
                "detail": str(e)
            }
        )

@router.get("/supported-formats")
async def get_supported_formats():
    """
    Get list of supported audio formats.
    
    Returns information about supported audio formats and file size limits.
    """
    return {
        "supported_formats": STTService.SUPPORTED_FORMATS,
        "max_file_size_mb": STTService.MAX_FILE_SIZE / 1024 / 1024,
        "recommended_formats": [".mp3", ".wav", ".m4a"],
        "quality_tips": [
            "Use clear audio with minimal background noise",
            "Speak at normal pace and volume",
            "Use high-quality recording equipment if possible",
            "For medical consultations, speak medical terms clearly"
        ]
    }
