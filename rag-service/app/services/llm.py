"""
LLM Service Module

This module provides a unified interface for different Large Language Model providers.
It supports OpenAI GPT models and Anthropic Claude models with a common interface.

Key Features:
- Provider abstraction (OpenAI, Anthropic Claude)
- Async support for better performance
- Configurable temperature, max_tokens, and response formats
- Token usage logging
- JSON structured output support
- Factory pattern for provider selection

Usage:
    llm_provider = get_llm_provider()
    response = await llm_provider.generate(
        messages=[{"role": "user", "content": "Hello"}],
        system_prompt="You are a helpful assistant",
        temperature=0.7
    )

Classes:
    - LLMProvider: Abstract base class for all LLM providers
    - OpenAIProvider: Implementation for OpenAI GPT models
    - ClaudeProvider: Implementation for Anthropic Claude models

Functions:
    - get_llm_provider(): Factory function to get the configured provider
"""

