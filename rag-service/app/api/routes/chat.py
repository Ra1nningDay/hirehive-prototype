"""
Chat RAG API Routes

This module provides FastAPI routes for chat functionality using Retrieval-Augmented Generation (RAG).
Handles chat requests, integrates with RAG service for document retrieval and language model generation.

Routes:
    POST /chat-rag - Process chat with RAG
    GET /chat-rag/health - Check RAG service health
"""

from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import ChatRequest, ChatResponse, ErrorResponse
from app.services.rag import RAGService
from app.core.logging import get_logger

router = APIRouter()
logger = get_logger(__name__)

def get_rag_service() -> RAGService:
    """Dependency to get RAG service instance"""
    return RAGService()

@router.post("/chat-rag", response_model=ChatResponse)
async def chat_rag(
    request: ChatRequest,
    rag_service: RAGService = Depends(get_rag_service)
):
    """
    Process chat with RAG (Retrieval-Augmented Generation)
    """
    try:
        logger.info(f"Processing chat request with {len(request.messages)} messages")
        
        response = await rag_service.process_chat(
            messages=request.messages,
            thread_id=request.thread_id,
            max_tokens=request.max_tokens,
            temperature=request.temperature
        )
        
        logger.info(f"Chat processed successfully for thread: {response.thread_id}")
        return response
        
    except Exception as e:
        logger.error(f"Error processing chat: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process chat: {str(e)}"
        )
