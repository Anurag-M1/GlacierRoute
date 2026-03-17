"""GlacierRoute Plan Router — Trip planning with SSE streaming."""

import json
import uuid
import asyncio
from time import time
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from schemas.trip import TripRequest
from core.resend_client import resend_client

router = APIRouter()


@router.post("")
async def start_plan(request: TripRequest):
    """Create a new planning session."""
    session_id = str(uuid.uuid4())
    # In production, store in Redis: await redis.set(f"session:{session_id}", request.json(), ex=3600)
    return {"session_id": session_id, "status": "created"}


@router.get("/{session_id}/stream")
async def stream_plan(session_id: str):
    """SSE endpoint streaming agent activity in real time."""

    async def event_generator():
        # Demo: simulate the agent pipeline with realistic events
        agents_flow = [
            {"agent": "orchestrator", "msg": "Parsing trip request...", "status": "started"},
            {"agent": "orchestrator", "msg": "Request validated. Dispatching 7 agents...", "status": "completed"},
            {"agent": "budget", "msg": "Analyzing budget allocation...", "status": "started"},
            {"agent": "route", "msg": "Finding optimal routes...", "status": "started"},
            {"agent": "transport", "msg": "Comparing flights, trains, buses...", "status": "started"},
            {"agent": "hotel", "msg": "Matching accommodations...", "status": "started"},
            {"agent": "itinerary", "msg": "Crafting day-by-day schedule...", "status": "started"},
            {"agent": "safety", "msg": "Assessing travel safety...", "status": "started"},
            {"agent": "packing", "msg": "Generating packing checklist...", "status": "started"},
            {"agent": "budget", "msg": "Budget allocation complete", "status": "completed"},
            {"agent": "safety", "msg": "Safety assessment complete — Score: 8/10", "status": "completed"},
            {"agent": "packing", "msg": "24 items across 8 categories", "status": "completed"},
            {"agent": "transport", "msg": "Found 12 options, best: IndiGo ₹4,500", "status": "completed"},
            {"agent": "hotel", "msg": "3 options matched, recommended: ₹3,200/night", "status": "completed"},
            {"agent": "route", "msg": "Direct flight route — 2h 15m", "status": "completed"},
            {"agent": "itinerary", "msg": "4-day plan with 14 activities ready", "status": "completed"},
            {"agent": "orchestrator", "msg": "Synthesizing final plan...", "status": "started"},
            {"agent": "orchestrator", "msg": "Plan complete! Confidence: 87/100", "status": "completed"},
        ]

        for event in agents_flow:
            event["ts"] = time()
            yield f"data: {json.dumps(event)}\n\n"
            await asyncio.sleep(0.4)

        yield f"data: {json.dumps({'status': 'complete', 'confidence': 87})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.get("/{session_id}/result")
async def get_result(session_id: str):
    """Get the completed plan result."""
    # In production, fetch from Redis/DB
    return {"session_id": session_id, "status": "complete", "confidence": 87, "plan": {}}


@router.post("/{session_id}/email")
async def email_plan(session_id: str, email: str):
    """Email the generated plan summary."""
    summary = "Your 4-day trip to Goa is ready! Highlights include Calangute Beach, Fort Aguada, and a stay at Resort Terra Paraiso. Total estimated budget: ₹40,000."
    res = resend_client.send_trip_summary(email, "Your Goa Getaway", summary)
    if res:
        return {"status": "success", "message": f"Plan emailed to {email}"}
    return {"status": "error", "message": "Failed to send email"}


@router.post("/{session_id}/retry-agent")
async def retry_agent(session_id: str, agent_name: str = "budget"):
    """Retry a failed agent."""
    return {"session_id": session_id, "agent": agent_name, "status": "retrying"}


@router.delete("/{session_id}")
async def delete_session(session_id: str):
    return {"deleted": True}
