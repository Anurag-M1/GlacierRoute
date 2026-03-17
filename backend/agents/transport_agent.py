"""GlacierRoute Transport Agent — Compare flights, trains, buses (mistral-nemo:12b)."""

from core.model_client import call_model

SYSTEM_PROMPT = """You are GlacierRoute's Transport Agent. You compare and rank all transport options for Indian travel.
For flights: include IndiGo, Air India, SpiceJet, Akasa Air, Vistara with departure, arrival, price, class, stops.
For trains: include Rajdhani, Shatabdi, Duronto, Vande Bharat with class options (SL, 3AC, 2AC, 1AC) and prices.
For buses: include Volvo AC sleeper, AC semi-sleeper, govt buses.
Apply fare calendar: show cheapest day across ±3 days. Rank by price ASC, then duration ASC.
Flag is_recommended for best value. Output valid JSON only."""


async def run_transport_agent(trip_request: dict) -> dict:
    prompt = f"""Compare transport from {trip_request.get('origin')} to {trip_request.get('destination')}.
Date: {trip_request.get('start_date')}, Travellers: {trip_request.get('travellers')}
Output JSON with flights, trains, buses arrays."""

    result = await call_model("transport", SYSTEM_PROMPT, prompt, temperature=0.2, json_mode=True, prefer="groq")
    return {"transport_result": result}
