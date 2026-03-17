"""Health Router — API and model health checks."""

import os
from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def health():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "services": {
            "api": "up",
            "groq": "configured" if os.getenv("GROQ_API_KEY") else "not configured",
            "together": "configured" if os.getenv("TOGETHER_API_KEY") else "not configured",
            "ollama": os.getenv("OLLAMA_HOST", "http://localhost:11434"),
        },
    }


@router.get("/models")
async def model_health():
    """Check which AI models/providers are available."""
    providers = {}
    if os.getenv("GROQ_API_KEY"):
        providers["groq"] = {"status": "ready", "models": ["llama-3.1-70b-versatile", "llama3-8b-8192", "mixtral-8x7b-32768"]}
    else:
        providers["groq"] = {"status": "not configured", "models": []}

    if os.getenv("TOGETHER_API_KEY"):
        providers["together"] = {"status": "ready", "models": ["Qwen/Qwen2.5-72B-Instruct", "mistralai/Mixtral-8x22B-Instruct-v0.1", "google/gemma-2-27b-it"]}
    else:
        providers["together"] = {"status": "not configured", "models": []}

    ollama_host = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    try:
        import httpx
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.get(f"{ollama_host}/api/tags")
            if resp.status_code == 200:
                data = resp.json()
                models = [m["name"] for m in data.get("models", [])]
                providers["ollama"] = {"status": "ready", "host": ollama_host, "models": models}
            else:
                providers["ollama"] = {"status": "error", "host": ollama_host}
    except Exception:
        providers["ollama"] = {"status": "unreachable", "host": ollama_host}

    all_ready = any(p["status"] == "ready" for p in providers.values())
    return {"overall": "ready" if all_ready else "no providers", "providers": providers}
