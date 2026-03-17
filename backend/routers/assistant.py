"""Assistant Router — AI chat with SSE streaming."""

import json
import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from schemas.trip import ChatRequest
from core.model_client import stream_model

router = APIRouter()

ASSISTANT_SYSTEM = """You are GlacierRoute's AI travel assistant. You help users plan trips across India and internationally.
You are knowledgeable about Indian destinations, budget travel, transport options, safety, food, and culture.
Be friendly, helpful, and specific. Use Indian Rupee (₹) for costs. Provide actionable advice.
If asked to plan a full trip, suggest using the Plan Trip feature for a comprehensive AI-generated plan."""


@router.post("/chat")
async def chat(req: ChatRequest):
    """Stream AI assistant response via SSE."""
    async def generate():
        try:
            async for token in stream_model("assistant", ASSISTANT_SYSTEM, req.message, temperature=0.7):
                yield f"data: {json.dumps({'token': token})}\n\n"
        except Exception as e:
            # Fallback static response
            fallback = "I'd love to help with your travel plans! Could you tell me more about your destination, dates, and budget? For a complete AI-generated trip plan, try our **Plan Trip** feature. 🌍"
            for word in fallback.split():
                yield f"data: {json.dumps({'token': word + ' '})}\n\n"
                await asyncio.sleep(0.03)
        yield f"data: {json.dumps({'done': True})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream", headers={"Cache-Control": "no-cache"})


@router.get("/history")
async def get_history():
    return {"messages": [
        {"id": "1", "role": "assistant", "content": "Hey! I'm GlacierRoute's AI assistant. How can I help you plan your next adventure?", "created_at": "2026-03-16T10:00:00Z"},
    ]}


@router.delete("/history")
async def clear_history():
    return {"cleared": True}
