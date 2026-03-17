"""GlacierRoute LangGraph Agent Graph — Orchestrates all 8 agents."""

import asyncio
import json
import logging
from time import time
from typing import TypedDict, Annotated, Any
import operator

from agents.orchestrator import run_orchestrator, run_synthesizer
from agents.budget_agent import run_budget_agent
from agents.route_agent import run_route_agent
from agents.transport_agent import run_transport_agent
from agents.hotel_agent import run_hotel_agent
from agents.itinerary_agent import run_itinerary_agent
from agents.safety_agent import run_safety_agent
from agents.packing_agent import run_packing_agent

logger = logging.getLogger("glacierroute.graph")


class TripState(TypedDict):
    trip_request: dict
    budget_result: dict
    route_result: dict
    transport_result: dict
    hotel_result: dict
    itinerary_result: dict
    safety_result: dict
    packing_result: dict
    final_plan: dict
    agent_logs: Annotated[list, operator.add]
    errors: Annotated[list, operator.add]
    session_id: str


def _log(agent: str, msg: str, status: str = "running") -> dict:
    return {"agent": agent, "msg": msg, "ts": time(), "status": status}


async def orchestrator_node(state: TripState) -> dict:
    """Parse trip request and prepare sub-prompts."""
    logs = [_log("orchestrator", "Parsing trip request...", "started")]
    try:
        result = await run_orchestrator(state["trip_request"])
        logs.append(_log("orchestrator", "Request parsed, dispatching agents...", "completed"))
        return {"agent_logs": logs}
    except Exception as e:
        logs.append(_log("orchestrator", f"Error: {str(e)}", "error"))
        return {"agent_logs": logs, "errors": [{"agent": "orchestrator", "error": str(e)}]}


async def parallel_agents_node(state: TripState) -> dict:
    """Run all 7 specialist agents in parallel."""
    logs = [_log("orchestrator", "Running 7 specialist agents in parallel...")]
    request = state["trip_request"]

    # Calculate duration
    from datetime import datetime
    try:
        start = datetime.fromisoformat(str(request.get("start_date", "2026-04-10")))
        end = datetime.fromisoformat(str(request.get("end_date", "2026-04-14")))
        request["duration_days"] = max(1, (end - start).days)
    except Exception:
        request["duration_days"] = 4

    agents = [
        ("budget", run_budget_agent),
        ("route", run_route_agent),
        ("transport", run_transport_agent),
        ("hotel", run_hotel_agent),
        ("itinerary", run_itinerary_agent),
        ("safety", run_safety_agent),
        ("packing", run_packing_agent),
    ]

    results = {}
    errors = []

    async def _run(name: str, fn):
        start_t = time()
        logs.append(_log(name, f"Starting {name} agent...", "started"))
        try:
            result = await fn(request)
            duration = int((time() - start_t) * 1000)
            logs.append(_log(name, f"Completed in {duration}ms", "completed"))
            return name, result
        except Exception as e:
            logs.append(_log(name, f"Error: {str(e)}", "error"))
            errors.append({"agent": name, "error": str(e)})
            return name, {}

    tasks = [_run(name, fn) for name, fn in agents]
    completed = await asyncio.gather(*tasks, return_exceptions=True)

    for item in completed:
        if isinstance(item, tuple):
            name, result = item
            results.update(result)

    return {**results, "agent_logs": logs, "errors": errors}


async def synthesizer_node(state: TripState) -> dict:
    """Final synthesis of all agent results."""
    logs = [_log("orchestrator", "Synthesizing final plan...")]
    try:
        result = await run_synthesizer(state)
        logs.append(_log("orchestrator", "Plan ready!", "completed"))
        return {"final_plan": result.get("final_plan", {}), "agent_logs": logs}
    except Exception as e:
        logs.append(_log("orchestrator", f"Synthesis error: {str(e)}", "error"))
        return {"agent_logs": logs, "errors": [{"agent": "synthesizer", "error": str(e)}]}


async def run_trip_pipeline(trip_request: dict, session_id: str = "") -> dict:
    """Execute the full trip planning pipeline.

    This runs the pipeline manually without LangGraph compile()
    to avoid dependency issues. The flow is:
    orchestrator → parallel_agents → synthesizer
    """
    state: TripState = {
        "trip_request": trip_request,
        "budget_result": {},
        "route_result": {},
        "transport_result": {},
        "hotel_result": {},
        "itinerary_result": {},
        "safety_result": {},
        "packing_result": {},
        "final_plan": {},
        "agent_logs": [],
        "errors": [],
        "session_id": session_id,
    }

    # Step 1: Orchestrator
    result = await orchestrator_node(state)
    state["agent_logs"].extend(result.get("agent_logs", []))
    state["errors"].extend(result.get("errors", []))

    # Step 2: Parallel agents
    result = await parallel_agents_node(state)
    for key in ["budget_result", "route_result", "transport_result", "hotel_result",
                 "itinerary_result", "safety_result", "packing_result"]:
        if key in result:
            state[key] = result[key]
    state["agent_logs"].extend(result.get("agent_logs", []))
    state["errors"].extend(result.get("errors", []))

    # Step 3: Synthesizer
    result = await synthesizer_node(state)
    state["final_plan"] = result.get("final_plan", {})
    state["agent_logs"].extend(result.get("agent_logs", []))
    state["errors"].extend(result.get("errors", []))

    return state
