"""
RAG Service Module

This module provides the main Retrieval-Augmented Generation (RAG) orchestration service.
It combines document retrieval with language model generation to provide contextual responses.

Key Features:
- RAG pipeline orchestration (retrieve → augment → generate)
- Multi-provider LLM support (OpenAI, Claude)
- Dynamic parameter tuning based on query type
- Structured output support (JSON responses)
- Interview summarization capabilities
- Context-aware response generation

Usage:
    rag_service = RAGService()
    response = await rag_service.process_chat(chat_request)

Classes:
    - RAGService: Main orchestration service for RAG operations

Functions:
    - process_chat(): Main RAG processing pipeline
    - _build_system_instruction(): Build system prompts for different scenarios
    - _determine_parameters(): Determine LLM parameters based on query type
    - _process_structured_output(): Handle JSON/structured responses

Dependencies:
    - RetrievalService: Document retrieval and search
    - LLMProvider: Language model generation
    - Pydantic models: Request/response validation
"""