"""
Retrieval Service Module

This module provides document retrieval capabilities for the RAG (Retrieval-Augmented Generation) system.
It handles searching and retrieving relevant documents from vector stores and traditional text search methods.

Key Features:
- Hybrid retrieval using FAISS vectorstore and BM25 text search
- Ensemble retriever combining multiple search methods
- Context formatting for LLM consumption
- Document count and metadata retrieval
- Configurable search parameters (top-k, weights)

Usage:
    retrieval_service = RetrievalService()
    context = retrieval_service.retrieve_context("user query", max_docs=4)
    doc_count = retrieval_service.get_document_count()

Classes:
    - RetrievalService: Main service for document retrieval operations

Functions:
    - retrieve_context(): Search and format relevant documents as context
    - get_document_count(): Get total number of indexed documents

Dependencies:
    - vectorstore_manager: Manages FAISS and BM25 retrievers
    - LangChain: Document processing and retrieval frameworks
"""