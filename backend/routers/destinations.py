"""Destinations Router — Browse, search, trending."""

from fastapi import APIRouter
from typing import Optional

from core.supabase_client import supabase

router = APIRouter()


@router.get("")
async def list_destinations(category: Optional[str] = None, region: Optional[str] = None):
    query = supabase.table("destinations").select("*").eq("is_active", True)
    if category:
        query = query.eq("category", category)
    if region:
        query = query.ilike("region", region)
    
    res = query.execute()
    return {"destinations": res.data, "total": len(res.data)}


@router.get("/search")
async def search_destinations(q: str = ""):
    # Supabase text search or simple ilike
    res = supabase.table("destinations").select("*").or_(f"name.ilike.%{q}%,state.ilike.%{q}%").execute()
    return {"results": res.data, "query": q}


@router.get("/trending")
async def trending():
    res = supabase.table("destinations").select("*").limit(4).execute()
    return {"trending": res.data}


@router.get("/{slug}")
async def get_destination(slug: str):
    res = supabase.table("destinations").select("*").eq("slug", slug).single().execute()
    if not res.data:
        return {"error": "Not found"}
    return res.data
