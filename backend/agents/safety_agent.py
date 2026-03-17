"""GlacierRoute Safety Agent — Travel safety assessment (llama3.1:8b)."""

from core.model_client import call_model

SYSTEM_PROMPT = """You are GlacierRoute's Safety Agent. You assess travel safety and provide actionable guidance.
Always provide:
1. Overall safety score 1-10
2. Advisory level: "safe", "exercise_caution", or "avoid"
3. Top 3 health risks with prevention steps
4. Emergency contacts: Police 100, Ambulance 108, Fire 101, Tourist helpline 1363, plus local numbers
5. Seasonal risks for the travel month
6. 5 practical safety tips specific to destination and group type
7. Whether travel insurance is strongly recommended
For hill stations above 2500m: include altitude sickness acclimatisation.
For monsoon (Jun-Sep): include flood and landslide warnings.
Output valid JSON only."""


async def run_safety_agent(trip_request: dict) -> dict:
    prompt = f"""Assess safety for travel to {trip_request.get('destination')}.
Dates: {trip_request.get('start_date')} to {trip_request.get('end_date')}
Group: {trip_request.get('group_type')}, Travellers: {trip_request.get('travellers')}
Output JSON with overall_score, advisory_level, health_risks, emergency_contacts, seasonal_risks, safety_tips, travel_insurance_recommended."""

    result = await call_model("safety", SYSTEM_PROMPT, prompt, temperature=0.1, json_mode=True, prefer="groq")
    return {"safety_result": result}
