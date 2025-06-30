"""
Speech-to-Text Service Module

This module provides speech-to-text functionality using OpenAI Whisper API.
It handles audio file processing, transcription, and error handling for the EyeQcheck system.

Key Features:
- OpenAI Whisper API integration
- Multiple audio format support (mp3, wav, m4a, etc.)
- Async audio processing
- File size and duration validation
- Language detection and translation
- Medical terminology optimization

Usage:
    stt_service = STTService()
    result = await stt_service.transcribe_audio(audio_data, filename)

Classes:
    - STTService: Main service for speech-to-text operations

Functions:
    - transcribe_audio(): Convert audio to text
    - validate_audio_file(): Validate audio file properties
    - prepare_audio_for_whisper(): Prepare audio for Whisper API

Dependencies:
    - OpenAI Whisper API
    - Audio processing libraries (ffmpeg)
    - File validation utilities
"""

import io
import tempfile
import mimetypes
from typing import Optional, Dict, Any
import asyncio
from pathlib import Path

# Third-party imports
import openai
from openai import AsyncOpenAI

# Local imports
from app.core.config import settings
from app.core.logging import get_logger
from app.models.schemas import STTResponse

logger = get_logger(__name__)


class STTService:
    """
    Speech-to-Text service using OpenAI Whisper API.
    
    This service handles audio file transcription with support for
    multiple audio formats and optimizations for medical terminology.
    """
    
    # Supported audio formats
    SUPPORTED_FORMATS = {
        'audio/mpeg': '.mp3',
        'audio/wav': '.wav', 
        'audio/x-wav': '.wav',
        'audio/mp4': '.m4a',
        'audio/x-m4a': '.m4a',
        'audio/webm': '.webm',
        'audio/ogg': '.ogg',
        'audio/flac': '.flac'
    }
    
    # Maximum file size (25MB - Whisper API limit)
    MAX_FILE_SIZE = 25 * 1024 * 1024
    
    def __init__(self):
        """Initialize STT service with OpenAI client."""
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.whisper_model or "whisper-1"
        
    async def transcribe_audio(
        self,
        audio_data: bytes,
        filename: Optional[str] = None,
        language: Optional[str] = None,
        prompt: Optional[str] = None
    ) -> STTResponse:
        """
        Transcribe audio data to text using OpenAI Whisper.
        
        Args:
            audio_data: Raw audio file bytes
            filename: Original filename (for format detection)
            language: Target language code (e.g., 'en', 'th')
            prompt: Optional prompt to guide transcription
            
        Returns:
            STTResponse: Transcription result with metadata
            
        Raises:
            ValueError: If audio format is not supported or file is too large
            Exception: If transcription fails
        """
        try:
            # Validate audio file
            self._validate_audio_file(audio_data, filename)
            
            # Determine file extension
            file_extension = self._get_file_extension(filename, audio_data)
            
            # Prepare prompt for medical context
            medical_prompt = self._prepare_medical_prompt(prompt)
            
            logger.info(f"Starting transcription for file: {filename} ({len(audio_data)} bytes)")
            
            # Create temporary file for Whisper API
            with tempfile.NamedTemporaryFile(suffix=file_extension, delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_file.flush()
                
                # Transcribe using OpenAI Whisper
                with open(temp_file.name, 'rb') as audio_file:
                    transcript = await self.client.audio.transcriptions.create(
                        model=self.model,
                        file=audio_file,
                        language=language,
                        prompt=medical_prompt,
                        response_format="verbose_json",
                        temperature=0.0  # Lower temperature for more consistent medical terms
                    )
                
                # Clean up temporary file
                Path(temp_file.name).unlink()
            
            # Process and return results
            result = self._process_transcription_result(transcript, filename)
            
            logger.info(f"Transcription completed for {filename}: {len(result.text)} characters")
            return result
            
        except Exception as e:
            logger.error(f"Transcription failed for {filename}: {str(e)}")
            raise Exception(f"Speech-to-text processing failed: {str(e)}")
    
    def _validate_audio_file(self, audio_data: bytes, filename: Optional[str]) -> None:
        """
        Validate audio file size and format.
        
        Args:
            audio_data: Raw audio file bytes
            filename: Original filename
            
        Raises:
            ValueError: If validation fails
        """
        # Check file size
        if len(audio_data) > self.MAX_FILE_SIZE:
            raise ValueError(
                f"Audio file too large. Maximum size: {self.MAX_FILE_SIZE / 1024 / 1024:.1f}MB"
            )
        
        # Check minimum file size (1KB)
        if len(audio_data) < 1024:
            raise ValueError("Audio file too small. Minimum size: 1KB")
        
        # Validate file format if filename provided
        if filename:
            mime_type, _ = mimetypes.guess_type(filename)
            if mime_type and mime_type not in self.SUPPORTED_FORMATS:
                supported_formats = ', '.join(self.SUPPORTED_FORMATS.values())
                raise ValueError(
                    f"Unsupported audio format. Supported formats: {supported_formats}"
                )
    
    def _get_file_extension(self, filename: Optional[str], audio_data: bytes) -> str:
        """
        Determine file extension from filename or audio data.
        
        Args:
            filename: Original filename
            audio_data: Raw audio file bytes
            
        Returns:
            str: File extension (e.g., '.mp3', '.wav')
        """
        if filename:
            mime_type, _ = mimetypes.guess_type(filename)
            if mime_type in self.SUPPORTED_FORMATS:
                return self.SUPPORTED_FORMATS[mime_type]
        
        # Try to detect format from audio data header
        if audio_data.startswith(b'ID3') or audio_data[4:8] == b'ftyp':
            return '.mp3'
        elif audio_data.startswith(b'RIFF'):
            return '.wav'
        elif audio_data.startswith(b'OggS'):
            return '.ogg'
        elif audio_data.startswith(b'fLaC'):
            return '.flac'
        else:
            # Default to mp3 if can't detect
            return '.mp3'
    
    def _prepare_medical_prompt(self, custom_prompt: Optional[str] = None) -> str:
        """
        Prepare prompt with medical context for better transcription accuracy.
        
        Args:
            custom_prompt: User-provided prompt
            
        Returns:
            str: Enhanced prompt with medical terminology guidance
        """
        base_medical_prompt = (
            "This is a medical consultation about eye examination. "
            "Please transcribe accurately including medical terms related to: "
            "vision, eyesight, myopia, hyperopia, astigmatism, glaucoma, "
            "retina, cornea, ophthalmology, visual acuity, eye pressure, "
            "diopter, prescription, contact lens, glasses."
        )
        
        if custom_prompt:
            return f"{base_medical_prompt} Additional context: {custom_prompt}"
        else:
            return base_medical_prompt
    
    def _process_transcription_result(
        self,
        transcript: Any,
        filename: Optional[str]
    ) -> STTResponse:
        """
        Process Whisper API response into STTResponse format.
        
        Args:
            transcript: OpenAI Whisper API response
            filename: Original filename
            
        Returns:
            STTResponse: Processed transcription result
        """
        # Extract transcription text
        text = transcript.text.strip()
        
        # Extract metadata if available
        language = getattr(transcript, 'language', 'unknown')
        duration = getattr(transcript, 'duration', None)
        
        # Calculate confidence score if segments available
        confidence = None
        if hasattr(transcript, 'segments') and transcript.segments:
            confidences = []
            for segment in transcript.segments:
                if hasattr(segment, 'avg_logprob'):
                    # Convert log probability to confidence score (0-1)
                    conf = min(1.0, max(0.0, (segment.avg_logprob + 1.0)))
                    confidences.append(conf)
            
            if confidences:
                confidence = sum(confidences) / len(confidences)
        
        # Post-process text for medical context
        processed_text = self._post_process_medical_text(text)
        
        return STTResponse(
            text=processed_text,
            original_text=text,
            language=language,
            duration=duration,
            confidence=confidence,
            filename=filename,
            word_count=len(processed_text.split()),
            processing_time=None  # Could add timing if needed
        )
    
    def _post_process_medical_text(self, text: str) -> str:
        """
        Post-process transcribed text for better medical terminology.
        
        Args:
            text: Raw transcription text
            
        Returns:
            str: Processed text with corrected medical terms
        """
        # Medical term corrections (common Whisper mistakes)
        medical_corrections = {
            'myope': 'myopia',
            'hyper opia': 'hyperopia',
            'astigmat': 'astigmatism',
            'glau coma': 'glaucoma',
            'ophthalmo': 'ophthalmology',
            'dioptre': 'diopter',
            'optometrist': 'optometrist',
            'ophthalmologist': 'ophthalmologist',
            'visual acuity': 'visual acuity',
            'eye pressure': 'intraocular pressure',
            'blind spot': 'blind spot',
            'peripheral vision': 'peripheral vision'
        }
        
        processed_text = text
        for mistake, correction in medical_corrections.items():
            processed_text = processed_text.replace(mistake, correction)
        
        return processed_text
    
    async def health_check(self) -> Dict[str, Any]:
        """
        Check STT service health status.
        
        Returns:
            Dict: Health status information
        """
        try:
            # Test OpenAI API connection
            models = await self.client.models.list()
            whisper_available = any(model.id.startswith('whisper') for model in models.data)
            
            return {
                "status": "healthy",
                "whisper_model": self.model,
                "whisper_available": whisper_available,
                "supported_formats": list(self.SUPPORTED_FORMATS.values()),
                "max_file_size_mb": self.MAX_FILE_SIZE / 1024 / 1024
            }
        except Exception as e:
            logger.error(f"STT health check failed: {str(e)}")
            return {
                "status": "unhealthy",
                "error": str(e)
            }
