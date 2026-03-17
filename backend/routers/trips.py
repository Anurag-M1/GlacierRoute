"""Trips Router — CRUD, export, share, invite."""

from fastapi import APIRouter
from typing import Optional

from core.supabase_client import supabase
from schemas.trip import TripRequest

router = APIRouter()


@router.get("")
async def list_trips(user_id: str):
    """List all trips for a user."""
    res = supabase.table("trips").select("*").eq("user_id", user_id).order("created_at", descending=True).execute()
    return {"trips": res.data, "total": len(res.data)}


@router.post("")
async def create_trip(trip: TripRequest, user_id: str):
    """Create a new trip entry."""
    data = trip.model_dump(mode="json")
    data["user_id"] = user_id
    data["title"] = f"Trip to {trip.destination}"
    
    res = supabase.table("trips").insert(data).execute()
    return res.data[0] if res.data else {"error": "Failed to create trip"}


@router.get("/{trip_id}")
async def get_trip(trip_id: str, user_id: str):
    """Get trip details."""
    res = supabase.table("trips").select("*").eq("id", trip_id).eq("user_id", user_id).single().execute()
    if not res.data:
        return {"error": "Not found"}
    return res.data


@router.patch("/{trip_id}")
async def update_trip(trip_id: str, trip: TripRequest, user_id: str):
    """Update trip details."""
    data = trip.model_dump(mode="json")
    res = supabase.table("trips").update(data).eq("id", trip_id).eq("user_id", user_id).execute()
    return {"id": trip_id, "status": "updated", "data": res.data}


@router.delete("/{trip_id}")
async def delete_trip(trip_id: str, user_id: str):
    """Delete a trip."""
    res = supabase.table("trips").delete().eq("id", trip_id).eq("user_id", user_id).execute()
    return {"deleted": True, "data": res.data}


@router.post("/{trip_id}/export-pdf")
async def export_pdf(trip_id: str):
    return {"pdf_url": f"/api/trips/{trip_id}/plan.pdf", "status": "generating"}


@router.post("/{trip_id}/share")
async def share_trip(trip_id: str):
    return {"share_url": f"https://glacierroute.in/shared/{trip_id[:8]}", "share_token": "tk_abc123"}


@router.post("/{trip_id}/invite")
async def invite_companion(trip_id: str, email: str = "friend@example.com"):
    return {"invited": email, "status": "pending"}
