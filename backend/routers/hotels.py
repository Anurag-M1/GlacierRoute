"""Hotels Router — Hotel search."""

from fastapi import APIRouter

router = APIRouter()


@router.get("")
async def get_hotels(destination: str = "Goa", budget_tier: str = "mid-range", checkin: str = "2026-04-10", nights: int = 4):
    """
    Search for hotels.
    Powered by AI-Simulated Logistics (Truly Free).
    """
    return {"hotels": [
        {"id": "h1", "name": "OYO Flagship", "area": "Calangute", "stars": 2, "review_score": 7.2, "price_per_night": 1200, "total_cost": 4800, "amenities": ["WiFi", "AC", "TV", "Parking", "Room Service"], "free_cancellation": True, "distance_to_centre": 1.2, "nearest_attraction": "Calangute Beach", "highlight": "Walking distance to beach", "tier": "budget", "is_recommended": False},
        {"id": "h2", "name": "Resort Terra Paraiso", "area": "Calangute", "stars": 3, "review_score": 8.5, "price_per_night": 3200, "total_cost": 12800, "amenities": ["Pool", "Spa", "Breakfast", "WiFi", "Beach shuttle"], "free_cancellation": True, "distance_to_centre": 0.8, "nearest_attraction": "Calangute Beach", "highlight": "Pool, spa, breakfast included", "tier": "mid-range", "is_recommended": True},
        {"id": "h3", "name": "Taj Fort Aguada", "area": "Sinquerim", "stars": 5, "review_score": 9.4, "price_per_night": 12000, "total_cost": 48000, "amenities": ["Private beach", "Pool", "Spa", "Gym", "Fine dining"], "free_cancellation": False, "distance_to_centre": 3.5, "nearest_attraction": "Fort Aguada", "highlight": "Heritage fort resort with ocean views", "tier": "premium", "is_recommended": False},
    ], "source": "AI-Simulated"}
