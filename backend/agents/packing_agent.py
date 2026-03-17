"""GlacierRoute Packing Agent — Personalized packing checklist (phi3.5:3.8b)."""

from core.model_client import call_model

SYSTEM_PROMPT = """You are GlacierRoute's Packing Agent. You generate personalised packing checklists for Indian travel.
Categories: Clothing, Footwear, Toiletries, Documents (Aadhaar, PAN, passport if needed),
Electronics (adapter, power bank), Medications, Destination gear, Money & cards.
Mark essential: true on critical items. Recommend bag size based on trip duration.
For treks: add trekking gear. For beach: add swim gear.
Output valid JSON only."""


async def run_packing_agent(trip_request: dict) -> dict:
    prompt = f"""Generate packing list for {trip_request.get('destination')}.
Duration: {trip_request.get('duration_days', 4)} days, Style: {trip_request.get('travel_style')}
Dates: {trip_request.get('start_date')} to {trip_request.get('end_date')}
Output JSON with categories array and recommended_bag_size."""

    result = await call_model("packing", SYSTEM_PROMPT, prompt, temperature=0.4, json_mode=True, prefer="groq")
    return {"packing_result": result}
