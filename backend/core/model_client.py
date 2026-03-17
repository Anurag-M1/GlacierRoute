"""GlacierRoute Model Client — Multi-provider AI inference (Groq, Together.ai, Ollama)."""

import os
import logging
from typing import AsyncGenerator, Optional

from openai import OpenAI

from core.model_registry import MODEL_REGISTRY

logger = logging.getLogger("glacierroute.model_client")

# ---------------------------------------------------------------------------
# Provider Clients (lazy initialization)
# ---------------------------------------------------------------------------

_groq_client: Optional[OpenAI] = None
_together_client: Optional[OpenAI] = None


def _get_groq() -> OpenAI:
    global _groq_client
    if _groq_client is None:
        _groq_client = OpenAI(
            base_url="https://api.groq.com/openai/v1",
            api_key=os.environ.get("GROQ_API_KEY", ""),
        )
    return _groq_client


def _get_together() -> OpenAI:
    global _together_client
    if _together_client is None:
        _together_client = OpenAI(
            base_url="https://api.together.xyz/v1",
            api_key=os.environ.get("TOGETHER_API_KEY", ""),
        )
    return _together_client


def _get_ollama_host() -> str:
    return os.environ.get("OLLAMA_HOST", "http://localhost:11434")


def _get_ollama_headers() -> dict:
    key = os.environ.get("OLLAMA_API_KEY")
    if key:
        return {"Authorization": f"Bearer {key}"}
    return {}


# ---------------------------------------------------------------------------
# Error Logging
# ---------------------------------------------------------------------------

def log_agent_error(agent: str, provider: str, model: str, error: str):
    logger.error(f"[{agent}] {provider}/{model} failed: {error}")


# ---------------------------------------------------------------------------
# Main Call Function
# ---------------------------------------------------------------------------

async def call_model(
    agent_name: str,
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.3,
    max_tokens: int = 4096,
    json_mode: bool = False,
    stream: bool = False,
    prefer: str = "ollama",
) -> str:
    """Call an AI model with automatic provider fallback.

    Args:
        agent_name: Key in MODEL_REGISTRY (e.g. "orchestrator", "budget").
        system_prompt: System-level instructions.
        user_prompt: User message.
        temperature: Sampling temperature.
        max_tokens: Maximum tokens to generate.
        json_mode: If True, request JSON output format.
        stream: If True, return a streaming response.
        prefer: Preferred provider order ("groq", "together", "ollama").

    Returns:
        The model's text response, or a streaming iterator if stream=True.
    """
    models = MODEL_REGISTRY.get(agent_name)
    if not models:
        raise ValueError(f"Unknown agent: {agent_name}")

    providers = [prefer] + [p for p in ["groq", "together", "ollama"] if p != prefer]

    for provider in providers:
        model_id = models.get(provider)
        if not model_id:
            continue
        try:
            if provider in ("groq", "together"):
                client = _get_groq() if provider == "groq" else _get_together()
                kwargs = dict(
                    model=model_id,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    temperature=temperature,
                    max_tokens=max_tokens,
                    stream=stream,
                )
                if json_mode:
                    kwargs["response_format"] = {"type": "json_object"}

                if stream:
                    return client.chat.completions.create(**kwargs)

                resp = client.chat.completions.create(**kwargs)
                return resp.choices[0].message.content

            elif provider == "ollama":
                # Use HTTP for Ollama to avoid extra dependency issues
                import httpx

                host = _get_ollama_host()
                payload = {
                    "model": model_id,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens,
                    },
                    "stream": False,
                }
                if json_mode:
                    payload["format"] = "json"

                async with httpx.AsyncClient(timeout=120) as http:
                    r = await http.post(
                        f"{host}/api/chat", 
                        json=payload,
                        headers=_get_ollama_headers()
                    )
                    r.raise_for_status()
                    data = r.json()
                    return data["message"]["content"]

        except Exception as e:
            log_agent_error(agent_name, provider, model_id, str(e))
            continue

    raise RuntimeError(f"All providers failed for agent: {agent_name}")


# ---------------------------------------------------------------------------
# Streaming Helper
# ---------------------------------------------------------------------------

async def stream_model(
    agent_name: str,
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.7,
) -> AsyncGenerator[str, None]:
    """Stream tokens for real-time chat, defaulting to Ollama."""
    models = MODEL_REGISTRY.get(agent_name, {})
    
    # Try Ollama first
    if "ollama" in models:
        try:
            import httpx
            import json
            
            host = _get_ollama_host()
            payload = {
                "model": models["ollama"],
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "options": {
                    "temperature": temperature,
                    "num_predict": 2048,
                },
                "stream": True,
            }
            
            async with httpx.AsyncClient(timeout=120) as http:
                async with http.stream(
                    "POST", 
                    f"{host}/api/chat", 
                    json=payload,
                    headers=_get_ollama_headers()
                ) as r:
                    r.raise_for_status()
                    async for line in r.aiter_lines():
                        if line:
                            try:
                                data = json.loads(line)
                                if "message" in data and "content" in data["message"]:
                                    yield data["message"]["content"]
                            except json.JSONDecodeError:
                                continue
            return
        except Exception as e:
            logger.error(f"Ollama stream error for {agent_name}: {e}")
            # Fall back to Groq if Ollama fails

    # Fallback to Groq if specified or if Ollama fails
    model_id = models.get("groq", "llama-3.1-70b-versatile")
    try:
        client = _get_groq()
        stream = client.chat.completions.create(
            model=model_id,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
            max_tokens=2048,
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
    except Exception as e:
        logger.error(f"Stream error for {agent_name}: {e}")
        yield f"[Error: {str(e)}]"
