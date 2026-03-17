"""GlacierRoute Budget Agent — Indian travel cost estimation (qwen2.5:72b)."""

from core.model_client import call_model

SYSTEM_PROMPT = """You are GlacierRoute's Budget Agent. You specialise in Indian travel cost estimation and budget optimisation.
Given trip parameters, you must:
1. Distribute the total budget across categories using these benchmark percentages for Indian destinations:
   Transport: 25-35%, Accommodation: 30-35%, Food: 15-20%, Activities: 10-15%, Shopping/Misc: 5-8%, Emergency: 10%
2. Adjust percentages based on travel style:
   Adventure: more activities, less accommodation
   Luxury: more accommodation, premium transport
   Budget Backpacker: minimise all, maximise activities
3. Use real Indian cost benchmarks:
   Budget hotel: ₹800-2000/night, Mid-range: ₹2000-5000/night, Luxury: ₹5000-20000/night
   Budget meal: ₹80-200/person, Mid-range meal: ₹200-600/person
   Rickshaw/local transport per day: ₹200-500, Activity entry fees: ₹50-2000
4. If total exceeds budget, suggest 3 specific trade-offs
5. Output valid JSON only. No markdown, no preamble."""


async def run_budget_agent(trip_request: dict) -> dict:
    prompt = f"""Calculate budget for:
Destination: {trip_request.get('destination')}, Duration: {trip_request.get('duration_days', 4)} days
Travellers: {trip_request.get('travellers', 2)}, Budget: ₹{trip_request.get('budget_inr', 40000)}
Style: {trip_request.get('travel_style', 'mid-range')}, Group: {trip_request.get('group_type', 'couple')}

Output JSON with: transport, accommodation, food, activities, shopping_misc, emergency_buffer, total_estimated, within_budget, savings_tips."""

    result = await call_model("budget", SYSTEM_PROMPT, prompt, temperature=0.1, json_mode=True, prefer="together")
    return {"budget_result": result}
