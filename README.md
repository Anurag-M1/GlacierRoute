# 🏔️ GlacierRoute — Every Thread of Your Journey, Perfectly Woven

GlacierRoute is a next-generation travel planning platform that replaces hours of manual research with a team of **8 specialized AI agents**. Powered by **Next.js**, **FastAPI**, and **LangGraph**, it orchestrates complex travel data into a single, cohesive experience.

![GlacierRoute Banner](https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop)

## 🤖 The Agent Pipeline
Our orchestrator coordinates 7 specialist agents to handle every aspect of your trip:
*   **💰 Budget Agent**: Smart allocation and cost estimation based on Indian/global tiers.
*   **🗺️ Route Agent**: Optimal paths for road, rail, or air with multi-city support.
*   **✈️ Transport Agent**: Logic for comparing flights, trains, and buses.
*   **🏨 Hotel Agent**: Context-aware accommodation matching.
*   **📅 Itinerary Agent**: Dynamic day-by-day activity scheduling.
*   **🛡️ Safety Agent**: Integrated health advisories and location-specific risk assessments.
*   **🎒 Packing Agent**: Personalized checklists based on weather, duration, and travel style.
*   **🧠 Orchestrator**: Uses LangGraph to synthesize all data into a final, conflict-resolved plan.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS with modern HSL palettes & Glassmorphism
- **Animations**: Framer Motion
- **Maps**: React-Leaflet (OpenStreetMap)
- **Icons**: Lucide React

### Backend
- **Engine**: FastAPI (Python 3.11)
- **Orchestration**: LangGraph & LangChain
- **Serverless**: Mangum (Vercel bridge)
- **API**: SSE (Server-Sent Events) for real-time agent activity logs

### AI & Data
- **Models**: Llama 3.1 70B, Mixtral 8x22B, Qwen 2.5 (via Groq & Together.ai)
- **Auth/DB**: Supabase (PostgreSQL)
- **Email**: Resend API

## 🚀 Getting Started

### Local Development

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Anurag-M1/GlacierRoute.git
   cd GlacierRoute
   ```

2. **Frontend Setup**:
   ```bash
   cd apps/web
   npm install
   npm run dev
   ```

3. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

### Deployment
This project is optimized for **Vercel**. 
- The `vercel.json` file handles routing between the Next.js frontend and the FastAPI backend (hosted via Serverless Functions).
- See the internal `walkthrough.md` for specific Environment Variable requirements.

## 📄 License
MIT License - See the [LICENSE](LICENSE) file for details.

## ✨ Author
Created with ❤️ by [Anurag Singh](https://github.com/Anurag-M1)
