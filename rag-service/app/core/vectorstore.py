"""
Vector Store Management Module

This module manages FAISS vector database operations for the RAG service.
It handles initialization, configuration, and access to semantic similarity search.

Key Features:
- FAISS vector store management for semantic similarity search
- Document loading and preprocessing pipeline
- Singleton pattern for global vectorstore access
- Lazy initialization and error handling
- Eye examination knowledge base management

Usage:
    # Initialize during app startup
    vectorstore_manager.initialize()
    
    # Get retriever for search
    retriever = vectorstore_manager.get_retriever()
    docs = retriever.invoke("search query")

Classes:
    - VectorStoreManager: Main manager for vectorstore operations

Functions:
    - initialize(): Load documents and create vectorstore
    - get_retriever(): Get the FAISS retriever instance
    - get_vectorstore(): Get FAISS vectorstore directly

Dependencies:
    - FAISS: Vector similarity search
    - OpenAI Embeddings: Text embedding generation
    - LangChain: Document processing framework
"""