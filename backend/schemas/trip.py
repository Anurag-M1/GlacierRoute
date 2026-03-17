"""GlacierRoute Schemas — Pydantic models for API request/response."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


class TripRequest(BaseModel):
    origin: str = Field(..., min_length=2, max_length=100)
    destination: str = Field(..., min_length=2, max_length=100)
    start_date: date
    end_date: date
    travellers: int = Field(..., ge=1, le=20)
    budget_inr: int = Field(..., ge=1000)
    travel_style: str = Field(default="mid-range")
    group_type: str = Field(default="couple")
    special_requirements: Optional[str] = None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None


class ExpenseCreate(BaseModel):
    category: str
    amount_inr: float = Field(..., gt=0)
    description: str
    date: date


class DestinationCreate(BaseModel):
    name: str
    slug: str
    state: str
    country: str = "India"
    region: str
    category: str
    description: str
    best_months: List[str]
    avg_budget_inr: int
    safety_score: int = Field(..., ge=1, le=10)
    lat: float
    lng: float


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: Optional[str] = None


class OtpVerify(BaseModel):
    phone: str
    otp: str
