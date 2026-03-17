"""Transport Router — Flights, trains, buses, PNR."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/flights")
async def get_flights(origin: str = "DEL", destination: str = "GOI", date: str = "2026-04-10"):
    """
    Get flight suggestions. 
    Powered by AI-Simulated Logistics (Truly Free).
    """
    return {"flights": [
        {"id": "f1", "operator": "IndiGo 6E-1234", "departure": "06:15", "arrival": "08:30", "duration": "2h 15m", "price_inr": 4500, "class": "Economy", "stops": 0, "is_recommended": True},
        {"id": "f2", "operator": "Air India AI-883", "departure": "10:00", "arrival": "12:20", "duration": "2h 20m", "price_inr": 5800, "class": "Economy", "stops": 0, "is_recommended": False},
        {"id": "f3", "operator": "SpiceJet SG-421", "departure": "14:30", "arrival": "17:00", "duration": "2h 30m", "price_inr": 4200, "class": "Economy", "stops": 1, "is_recommended": False},
    ], "source": "AI-Simulated"}


@router.get("/trains")
async def get_trains(origin: str = "NDLS", destination: str = "MAO", date: str = "2026-04-10"):
    return {"trains": [
        {"id": "t1", "operator": "Konkan Kanya Express", "departure": "23:00", "arrival": "11:30+1", "duration": "12h 30m", "price_inr": 1200, "class": "SL", "is_recommended": True},
        {"id": "t2", "operator": "Rajdhani Express", "departure": "16:30", "arrival": "06:00+1", "duration": "13h 30m", "price_inr": 2800, "class": "3AC", "is_recommended": False},
    ], "source": "AI-Simulated"}


@router.get("/buses")
async def get_buses(origin: str = "Mumbai", destination: str = "Goa", date: str = "2026-04-10"):
    return {"buses": [
        {"id": "b1", "operator": "Paulo Travels Volvo", "departure": "21:00", "arrival": "07:00+1", "duration": "10h", "price_inr": 1200, "class": "AC Sleeper", "is_recommended": True},
        {"id": "b2", "operator": "MSRTC Shivneri", "departure": "22:00", "arrival": "08:30+1", "duration": "10h 30m", "price_inr": 800, "class": "AC Semi-sleeper", "is_recommended": False},
    ], "source": "AI-Simulated"}


@router.get("/pnr/{pnr}")
async def check_pnr(pnr: str):
    return {"pnr": pnr, "status": "Confirmed", "train": "Konkan Kanya Express", "class": "SL", "coach": "S5", "berth": "23/LB"}
