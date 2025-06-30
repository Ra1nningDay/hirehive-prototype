"""
Health Check API Routes

This module provides FastAPI routes for health and readiness checks.
It includes endpoints to check the service status and readiness for deployment.

Routes:
    GET /health - Basic health check
"""

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class HealthResponse(BaseModel):
    status: str
    version: str
    service: str

@router.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        service="EyeQcheck RAG Service"
    )

# @router.get("/ready")
# async def readiness_check():
#     """Readiness check for Kubernetes"""
    
#     return {"status": "ready"}
