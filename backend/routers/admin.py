"""Admin Router — Analytics, user management, model metrics, destination CMS."""

from fastapi import APIRouter
from schemas.trip import DestinationCreate, UserUpdate

router = APIRouter()


@router.get("/users")
async def list_users():
    return {"users": [
        {"id": "1", "name": "Priya Sharma", "email": "priya@example.com", "role": "user", "trips": 3, "last_login": "2026-03-15"},
        {"id": "2", "name": "Arjun Patel", "email": "arjun@example.com", "role": "user", "trips": 1, "last_login": "2026-03-14"},
        {"id": "3", "name": "Admin", "email": "admin@glacierroute.in", "role": "admin", "trips": 0, "last_login": "2026-03-16"},
    ], "total": 12847}


@router.patch("/users/{user_id}")
async def update_user(user_id: str, update: UserUpdate):
    return {"id": user_id, "updated": True}


@router.get("/analytics")
async def analytics():
    return {
        "total_users": 12847, "total_trips": 54231, "active_today": 423,
        "ai_calls_today": 8420, "avg_confidence": 84.2, "avg_plan_time_ms": 5200,
        "popular_destinations": [
            {"name": "Goa", "trips": 8420}, {"name": "Manali", "trips": 6100},
            {"name": "Jaipur", "trips": 5800}, {"name": "Kerala", "trips": 4200},
        ],
        "trips_by_style": {"mid-range": 42, "budget": 28, "adventure": 15, "luxury": 10, "cultural": 5},
    }


@router.get("/model-metrics")
async def model_metrics():
    return {"metrics": [
        {"agent": "orchestrator", "model": "llama3.1:70b", "provider": "groq", "avg_latency_ms": 1200, "error_rate": 0.02, "total_calls": 12450},
        {"agent": "budget", "model": "qwen2.5:72b", "provider": "together", "avg_latency_ms": 1800, "error_rate": 0.03, "total_calls": 11230},
        {"agent": "route", "model": "mixtral:8x22b", "provider": "together", "avg_latency_ms": 2100, "error_rate": 0.04, "total_calls": 11180},
        {"agent": "transport", "model": "mistral-nemo:12b", "provider": "groq", "avg_latency_ms": 800, "error_rate": 0.01, "total_calls": 11200},
        {"agent": "hotel", "model": "gemma2:27b", "provider": "together", "avg_latency_ms": 1500, "error_rate": 0.03, "total_calls": 11150},
        {"agent": "itinerary", "model": "llama3.1:70b", "provider": "groq", "avg_latency_ms": 1400, "error_rate": 0.02, "total_calls": 11190},
        {"agent": "safety", "model": "llama3.1:8b", "provider": "groq", "avg_latency_ms": 450, "error_rate": 0.01, "total_calls": 11200},
        {"agent": "packing", "model": "phi3.5:3.8b", "provider": "groq", "avg_latency_ms": 350, "error_rate": 0.01, "total_calls": 11210},
    ]}


@router.post("/destinations")
async def create_destination(dest: DestinationCreate):
    return {"id": "new_dest_001", "slug": dest.slug, "status": "created"}


@router.patch("/destinations/{dest_id}")
async def update_destination(dest_id: str):
    return {"id": dest_id, "status": "updated"}


@router.delete("/destinations/{dest_id}")
async def delete_destination(dest_id: str):
    return {"deleted": True}
