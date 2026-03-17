"""Expenses Router — Trip expense tracking."""

from fastapi import APIRouter
from schemas.trip import ExpenseCreate

from core.supabase_client import supabase

router = APIRouter()


@router.get("/{trip_id}/expenses")
async def list_expenses(trip_id: str, user_id: str):
    """List expenses for a trip. In production, user_id comes from JWT."""
    res = supabase.table("expenses").select("*").eq("trip_id", trip_id).eq("user_id", user_id).execute()
    total = sum(e["amount_inr"] for e in res.data)
    return {"expenses": res.data, "total": total}


@router.post("/{trip_id}/expenses")
async def add_expense(trip_id: str, expense: ExpenseCreate, user_id: str):
    """Add a new expense."""
    data = expense.model_dump(mode="json")
    data["trip_id"] = trip_id
    data["user_id"] = user_id
    
    res = supabase.table("expenses").insert(data).execute()
    return res.data[0] if res.data else {"error": "Failed to add expense"}


@router.patch("/{trip_id}/expenses/{expense_id}")
async def update_expense(trip_id: str, expense_id: str, expense: ExpenseCreate, user_id: str):
    """Update an expense."""
    data = expense.model_dump(mode="json")
    res = supabase.table("expenses").update(data).eq("id", expense_id).eq("user_id", user_id).execute()
    return {"id": expense_id, "status": "updated", "data": res.data}


@router.delete("/{trip_id}/expenses/{expense_id}")
async def delete_expense(trip_id: str, expense_id: str, user_id: str):
    """Delete an expense."""
    res = supabase.table("expenses").delete().eq("id", expense_id).eq("user_id", user_id).execute()
    return {"deleted": True, "data": res.data}


@router.get("/{trip_id}/expenses/export")
async def export_expenses(trip_id: str):
    # This could generate a signed URL from Supabase Storage in the future
    return {"csv_url": f"/api/trips/{trip_id}/expenses.csv"}
