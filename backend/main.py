"""GlacierRoute Backend — FastAPI Application"""

import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from routers import auth, plan, trips, expenses, destinations, transport, hotels, weather, assistant, admin, health  # noqa: E402


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    print("🚀 GlacierRoute backend starting...")
    print(f"   Groq API key: {'✓' if os.getenv('GROQ_API_KEY') else '✗ not set'}")
    print(f"   Together API key: {'✓' if os.getenv('TOGETHER_API_KEY') else '✗ not set'}")
    print(f"   Ollama host: {os.getenv('OLLAMA_HOST', 'http://localhost:11434')}")
    yield
    print("🛑 GlacierRoute backend shutting down...")


app = FastAPI(
    title="GlacierRoute API",
    description="AI Agent-Powered Trip Planning Backend",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check directly in main
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "environment": "serverless" if os.getenv("VERCEL") else "local"}

# Mount routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(plan.router, prefix="/api/plan", tags=["Plan"])
app.include_router(trips.router, prefix="/api/trips", tags=["Trips"])
app.include_router(expenses.router, prefix="/api/trips", tags=["Expenses"])
app.include_router(destinations.router, prefix="/api/destinations", tags=["Destinations"])
app.include_router(transport.router, prefix="/api/transport", tags=["Transport"])
app.include_router(hotels.router, prefix="/api/hotels", tags=["Hotels"])
app.include_router(weather.router, prefix="/api/weather", tags=["Weather"])
app.include_router(assistant.router, prefix="/api/assistant", tags=["Assistant"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
# app.include_router(health.router, prefix="/api/health", tags=["Health"]) # Replaced with direct check
