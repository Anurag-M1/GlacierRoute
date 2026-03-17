"""GlacierRoute Model Registry — Maps each agent to optimal model per provider."""

MODEL_REGISTRY = {
    "orchestrator": {
        "groq": "llama-3.1-70b-versatile",
        "together": "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
        "ollama": "llama3.1:70b",
    },
    "budget": {
        "groq": "llama-3.1-70b-versatile",
        "together": "Qwen/Qwen2.5-72B-Instruct",
        "ollama": "qwen2.5:72b",
    },
    "route": {
        "groq": "mixtral-8x7b-32768",
        "together": "mistralai/Mixtral-8x22B-Instruct-v0.1",
        "ollama": "mixtral:8x22b",
    },
    "transport": {
        "groq": "llama-3.1-8b-instant",
        "together": "mistralai/Mistral-Nemo-Instruct-2407",
        "ollama": "mistral-nemo:12b",
    },
    "hotel": {
        "groq": "llama-3.1-70b-versatile",
        "together": "google/gemma-2-27b-it",
        "ollama": "gemma2:27b",
    },
    "itinerary": {
        "groq": "llama-3.1-70b-versatile",
        "together": "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
        "ollama": "llama3.1:70b",
    },
    "safety": {
        "groq": "llama3-8b-8192",
        "together": "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        "ollama": "llama3.1:8b",
    },
    "packing": {
        "groq": "llama3-8b-8192",
        "together": "microsoft/Phi-3.5-mini-instruct",
        "ollama": "phi3.5:3.8b",
    },
    "assistant": {
        "groq": "llama-3.1-70b-versatile",
        "together": "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
        "ollama": "llama3.1:70b",
    },
}

# Agent-specific default configurations
AGENT_CONFIGS = {
    "orchestrator": {"temperature": 0.3, "max_tokens": 4096, "top_p": 0.9},
    "budget":       {"temperature": 0.1, "max_tokens": 4096, "top_p": 0.95},
    "route":        {"temperature": 0.2, "max_tokens": 4096, "top_p": 0.9},
    "transport":    {"temperature": 0.2, "max_tokens": 4096, "top_p": 0.9},
    "hotel":        {"temperature": 0.3, "max_tokens": 4096, "top_p": 0.9},
    "itinerary":    {"temperature": 0.6, "max_tokens": 8192, "top_p": 0.95},
    "safety":       {"temperature": 0.1, "max_tokens": 2048, "top_p": 0.9},
    "packing":      {"temperature": 0.4, "max_tokens": 2048, "top_p": 0.9},
    "assistant":    {"temperature": 0.7, "max_tokens": 2048, "top_p": 0.95},
}
