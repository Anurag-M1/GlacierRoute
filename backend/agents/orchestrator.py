"""GlacierRoute Orchestrator Agent — Coordinates all specialist agents."""

from core.model_client import call_model

SYSTEM_PROMPT = """You are GlacierRoute's Orchestrator. You receive a trip planning request and must coordinate 7 specialist agents.
Your job:
1. Parse all trip parameters from the user request precisely
2. Validate: origin and destination must be valid Indian or international cities. Budget must be positive number. Duration between 1 and 30 days.
3. Create a tailored sub-prompt for each specialist agent containing only the parameters each agent needs
4. After all 7 agents return their JSON results, detect conflicts:
   - If hotel_total + transport_total > user_budget * 0.85, flag
   - If any itinerary activity time overlaps another, flag
   - If safety advisory = high-risk, prepend warning to plan
5. Resolve conflicts using rule: Safety > Budget > Comfort
6. Output final synthesised plan as valid JSON
7. Write a 3-sentence plain English trip summary
8. Calculate confidence score 0-100 based on data completeness
Always respond with valid JSON only. No markdown, no explanation."""


async def run_orchestrator(trip_request: dict) -> dict:
    """Parse the trip request and prepare sub-prompts for all agents."""
    user_prompt = f"""Plan a trip with these details:
- Origin: {trip_request.get('origin', 'Delhi')}
- Destination: {trip_request.get('destination', 'Goa')}
- Start date: {trip_request.get('start_date', '2026-04-10')}
- End date: {trip_request.get('end_date', '2026-04-14')}
- Travellers: {trip_request.get('travellers', 2)}
- Budget: ₹{trip_request.get('budget_inr', 40000)}
- Travel style: {trip_request.get('travel_style', 'mid-range')}
- Group type: {trip_request.get('group_type', 'couple')}
- Special requirements: {trip_request.get('special_requirements', 'None')}

Parse these parameters and output a JSON object with validated fields."""

    result = await call_model(
        agent_name="orchestrator",
        system_prompt=SYSTEM_PROMPT,
        user_prompt=user_prompt,
        temperature=0.3,
        json_mode=True,
    )
    return {"raw": result, "trip_request": trip_request}


async def run_synthesizer(state: dict) -> dict:
    """Final synthesis pass — resolve conflicts and generate summary."""
    synth_prompt = f"""You have received results from 7 specialist agents for a trip.
Synthesize all results into a final cohesive plan.
Detect and resolve conflicts using: Safety > Budget > Comfort.
Generate a 3-sentence summary and confidence score 0-100.

Trip request: {state.get('trip_request', {})}
Budget result: {state.get('budget_result', {})}
Route result: {state.get('route_result', {})}
Transport result: {state.get('transport_result', {})}
Hotel result: {state.get('hotel_result', {})}
Itinerary result: {state.get('itinerary_result', {})}
Safety result: {state.get('safety_result', {})}
Packing result: {state.get('packing_result', {})}

Output a final synthesized JSON plan."""

    result = await call_model(
        agent_name="orchestrator",
        system_prompt="You are GlacierRoute's Orchestrator performing final synthesis. Output valid JSON only.",
        user_prompt=synth_prompt,
        temperature=0.3,
        json_mode=True,
    )
    return {"final_plan": result}
