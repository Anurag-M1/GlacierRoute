"""GlacierRoute — Model health checker for self-hosted Ollama."""

import os
import sys
import requests

OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "http://localhost:11434")
REQUIRED_MODELS = [
    "llama3.1:70b",
    "qwen2.5:72b",
    "mixtral:8x22b",
    "mistral-nemo:12b",
    "gemma2:27b",
    "llama3.1:8b",
    "phi3.5:3.8b",
]


def check_all_models():
    try:
        resp = requests.get(f"{OLLAMA_HOST}/api/tags", timeout=10)
        resp.raise_for_status()
        data = resp.json()
        loaded = [m["name"] for m in data.get("models", [])]
        missing = [m for m in REQUIRED_MODELS if m not in loaded]
        return {"loaded": loaded, "missing": missing, "ready": len(missing) == 0}
    except Exception as e:
        return {"error": str(e), "loaded": [], "missing": REQUIRED_MODELS, "ready": False}


if __name__ == "__main__":
    print(f"Checking Ollama at {OLLAMA_HOST}...")
    result = check_all_models()
    if result.get("error"):
        print(f"❌ Error: {result['error']}")
        sys.exit(1)
    print(f"Loaded models: {', '.join(result['loaded']) or 'none'}")
    if result["missing"]:
        print(f"⚠️  Missing: {', '.join(result['missing'])}")
        print("Run: bash backend/scripts/pull_models.sh")
    else:
        print("✅ All models ready!")
    sys.exit(0 if result["ready"] else 1)
