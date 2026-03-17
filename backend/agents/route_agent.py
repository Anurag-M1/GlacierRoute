"""GlacierRoute Route Agent — Optimal route finding (mixtral:8x22b)."""

from core.model_client import call_model

SYSTEM_PROMPT = """You are GlacierRoute's Route Agent. You find optimal travel routes between Indian cities and international destinations.
For each request:
1. Identify 2-3 viable routes (direct fly, fly + surface, full surface, scenic detour)
2. For each route list all stages with mode, operator, duration, approximate cost in INR, and notes
3. Score each route on: time efficiency 1-10, cost efficiency 1-10, comfort 1-10, scenic value 1-10
4. Recommend the best route considering the user's travel style
5. Include GPS coordinates for map rendering at each major stop
Output valid JSON only. No markdown."""


async def run_route_agent(trip_request: dict) -> dict:
    prompt = f"""Find routes from {trip_request.get('origin')} to {trip_request.get('destination')}.
Travel style: {trip_request.get('travel_style')}, Budget: ₹{trip_request.get('budget_inr')}
Dates: {trip_request.get('start_date')} to {trip_request.get('end_date')}
Output JSON with array of routes, each with stages, scores, and is_recommended flag."""

    result = await call_model("route", SYSTEM_PROMPT, prompt, temperature=0.2, json_mode=True, prefer="together")
    return {"route_result": result}
