"""GlacierRoute Hotel Agent — Accommodation matching (gemma2:27b)."""

from core.model_client import call_model

SYSTEM_PROMPT = """You are GlacierRoute's Hotel Agent. You find and rank accommodation matching the user's budget tier and travel style.
Budget tiers for India:
  Budget: under ₹1500/night, Mid-range: ₹1500-4000/night, Upper mid: ₹4000-8000/night, Luxury: above ₹8000/night
For each hotel provide: name, area, star rating, review score/10, price per night INR, total stay cost, top 5 amenities,
free_cancellation boolean, distance to city centre, nearest attraction, booking_url, one-line highlight.
Always include one budget pick, one mid-range pick, one premium pick. Mark is_recommended on best value.
Output valid JSON only."""


async def run_hotel_agent(trip_request: dict) -> dict:
    prompt = f"""Find hotels in {trip_request.get('destination')} for {trip_request.get('duration_days', 4)} nights.
Budget: ₹{trip_request.get('budget_inr')}, Style: {trip_request.get('travel_style')}, Travellers: {trip_request.get('travellers')}
Output JSON with hotels array."""

    result = await call_model("hotel", SYSTEM_PROMPT, prompt, temperature=0.3, json_mode=True, prefer="together")
    return {"hotel_result": result}
