#!/bin/bash
# GlacierRoute — Pull all required Ollama models
# Run this on self-hosted Ollama instance (RunPod/Modal/Vast.ai)

echo "🚀 Pulling GlacierRoute fire models..."

ollama pull llama3.1:70b     # Orchestrator + Itinerary + Assistant
ollama pull qwen2.5:72b      # Budget Agent
ollama pull mixtral:8x22b    # Route Agent
ollama pull mistral-nemo:12b # Transport Agent
ollama pull gemma2:27b       # Hotel Agent
ollama pull llama3.1:8b      # Safety Agent
ollama pull phi3.5:3.8b      # Packing Agent

echo "✅ All models ready."
echo ""
echo "Model status:"
ollama list
