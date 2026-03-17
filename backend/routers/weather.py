import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter()

# Free Geocoding mapping (simplified for demo)
CITY_COORDS = {
    "goa": (15.2993, 74.1240),
    "delhi": (28.6139, 77.2090),
    "mumbai": (19.0760, 72.8777),
    "bangalore": (12.9716, 77.5946),
    "manali": (32.2432, 77.1892),
    "jaipur": (26.9124, 75.7873),
    "kerala": (10.8505, 76.2711),
    "srinagar": (34.0837, 74.7973),
}

@router.get("/{city}")
async def get_weather(city: str):
    """Fetch real-time weather using free Open-Meteo API."""
    city_lower = city.lower()
    coords = CITY_COORDS.get(city_lower)
    
    if not coords:
        # Default to Delhi if unknown for demo
        coords = (28.61, 77.2)
    
    lat, lon = coords
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto"
    
    try:
        async with httpx.AsyncClient() as client:
            r = await client.get(url)
            r.raise_for_status()
            data = r.json()
            
            current = data["current_weather"]
            daily = data["daily"]
            
            # Map Open-Meteo codes to condition strings
            conditions = {0: "Sunny", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast", 45: "Foggy", 61: "Rainy"}
            
            return {
                "city": city.title(),
                "current": {
                    "temp_c": current["temperature"],
                    "condition": conditions.get(current["weathercode"], "Cloudy"),
                    "wind_kph": current["windspeed"],
                    "humidity": 65 # Open-meteo current doesn't always include humidity in basic call
                },
                "forecast": [
                    {
                        "date": daily["time"][i],
                        "high": daily["temperature_2m_max"][i],
                        "low": daily["temperature_2m_min"][i],
                        "condition": conditions.get(daily["weathercode"][i], "Cloudy"),
                        "rain_chance": 10
                    } for i in range(min(4, len(daily["time"])))
                ]
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather fetch failed: {str(e)}")
