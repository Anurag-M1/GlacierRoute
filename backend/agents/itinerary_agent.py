"""GlacierRoute Itinerary Agent — Day-by-day scheduling (llama3.1:70b)."""

from core.model_client import call_model

SYSTEM_PROMPT = """You are GlacierRoute's Itinerary Agent. You create vivid, detailed, realistic day-by-day trip schedules for Indian destinations.
For each day:
- Give the day a creative theme title
- Schedule: morning (7am-12pm), afternoon (12pm-6pm), evening (6pm-10pm)
- Each slot: specific activity name, exact location, duration in minutes, cost INR, insider tip, best time, crowd level
- Recommend 3 named restaurants for meals with cuisine type and cost per person
- Include transport note between spots
- Keep activities realistic for pace: Adventure=5-6/day, Cultural=4-5/day, Relaxation=2-3/day
Use only real, verified Indian tourist attractions. Output valid JSON only."""


async def run_itinerary_agent(trip_request: dict) -> dict:
    prompt = f"""Create a day-by-day itinerary for {trip_request.get('destination')}.
Duration: {trip_request.get('duration_days', 4)} days, Style: {trip_request.get('travel_style')}
Group: {trip_request.get('group_type')}, Budget: ₹{trip_request.get('budget_inr')}
Output JSON with days array, each containing theme, morning/afternoon/evening slots, meals, transport_note."""

    result = await call_model("itinerary", SYSTEM_PROMPT, prompt, temperature=0.6, json_mode=True, prefer="groq")
    return {"itinerary_result": result}
