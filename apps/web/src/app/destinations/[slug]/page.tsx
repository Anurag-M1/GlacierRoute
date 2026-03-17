"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Shield, Star, Sun, CloudRain, Utensils, Camera, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const destData: Record<string, { name: string; state: string; emoji: string; desc: string; safety: number; budget: number; bestMonths: string; attractions: string[]; foods: string[]; weather: { month: string; temp: string; rain: string }[] }> = {
  goa: { name: "Goa", state: "Goa", emoji: "🏖️", desc: "India's ultimate beach paradise with Portuguese heritage, vibrant nightlife, and serene South Goa beaches. Known for its stunning coastline, historic churches, and delicious seafood cuisine.",
    safety: 8, budget: 15000, bestMonths: "October to March",
    attractions: ["Calangute Beach", "Basilica of Bom Jesus", "Dudhsagar Falls", "Fort Aguada", "Anjuna Flea Market", "Fontainhas Latin Quarter", "Palolem Beach", "Spice Plantations"],
    foods: ["Goan Fish Curry", "Bebinca", "Vindaloo", "Xacuti", "Prawn Balchão", "Feni"],
    weather: [{ month: "Oct", temp: "30°C", rain: "Low" }, { month: "Nov", temp: "33°C", rain: "None" }, { month: "Dec", temp: "32°C", rain: "None" }, { month: "Jan", temp: "31°C", rain: "None" }, { month: "Feb", temp: "31°C", rain: "None" }, { month: "Mar", temp: "32°C", rain: "None" }]
  },
};
const fallback = { name: "Destination", state: "India", emoji: "🌍", desc: "A beautiful Indian destination waiting to be explored.", safety: 7, budget: 12000, bestMonths: "Oct-Mar",
  attractions: ["Local Temples", "City Market", "Nature Park", "Historical Fort", "Lake View Point"],
  foods: ["Local Thali", "Street Food", "Regional Specialties"],
  weather: [{ month: "Oct", temp: "28°C", rain: "Low" }, { month: "Nov", temp: "26°C", rain: "None" }, { month: "Dec", temp: "24°C", rain: "None" }]
};

export default function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  // Use fallback data for demo
  const dest = destData["goa"] || fallback;

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <div className="gradient-hero" style={{ padding: "60px 0 80px", color: "white", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <Link href="/explore" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "rgba(255,255,255,0.7)", textDecoration: "none", marginBottom: 24 }}>
            <ArrowLeft size={16} /> Back to Explore
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ fontSize: 64, display: "block", marginBottom: 8 }}>{dest.emoji}</span>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, marginBottom: 8 }}>{dest.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, color: "rgba(255,255,255,0.8)", marginBottom: 20 }}>
              <MapPin size={16} /> {dest.state}, India
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.8)", maxWidth: 600, marginBottom: 24 }}>{dest.desc}</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ padding: "8px 16px", borderRadius: 999, background: "rgba(255,255,255,0.15)", fontSize: 14 }}>
                <Shield size={14} style={{ display: "inline", marginRight: 6 }} /> Safety: {dest.safety}/10
              </div>
              <div style={{ padding: "8px 16px", borderRadius: 999, background: "rgba(255,255,255,0.15)", fontSize: 14 }}>
                <Calendar size={14} style={{ display: "inline", marginRight: 6 }} /> Best: {dest.bestMonths}
              </div>
              <div style={{ padding: "8px 16px", borderRadius: 999, background: "rgba(255,255,255,0.15)", fontSize: 14 }}>
                from {formatCurrency(dest.budget)}
              </div>
            </div>
            <Link href="/plan" className="btn-accent" style={{ marginTop: 24, padding: "14px 28px" }}>Plan a Trip to {dest.name} <ArrowRight size={16} /></Link>
          </motion.div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Attractions */}
            <div className="card-elevated" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Camera size={20} style={{ color: "var(--primary)" }} /> Top Attractions
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {dest.attractions.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: "var(--radius)", border: "1px solid var(--border-light)" }}>
                    <Star size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                    <span style={{ fontSize: 14 }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Food Guide */}
            <div className="card-elevated" style={{ padding: 28 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Utensils size={20} style={{ color: "var(--accent)" }} /> Food Guide
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {dest.foods.map((f, i) => (
                  <span key={i} className="tag" style={{ padding: "8px 14px", fontSize: 13 }}>{f}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Weather */}
            <div className="card-elevated" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Sun size={18} style={{ color: "var(--accent)" }} /> Weather
              </h3>
              {dest.weather.map((w, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < dest.weather.length - 1 ? "1px solid var(--border-light)" : "none", fontSize: 14 }}>
                  <span style={{ fontWeight: 500 }}>{w.month}</span>
                  <span>{w.temp}</span>
                  <span style={{ color: w.rain === "None" ? "var(--success)" : "var(--warning)", fontSize: 12 }}>
                    {w.rain === "None" ? <Sun size={14} style={{ display: "inline" }} /> : <CloudRain size={14} style={{ display: "inline" }} />} {w.rain}
                  </span>
                </div>
              ))}
            </div>

            {/* Safety */}
            <div className="card-elevated" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Shield size={18} style={{ color: dest.safety >= 8 ? "var(--success)" : "var(--warning)" }} /> Safety Score
              </h3>
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "var(--font-heading)", color: dest.safety >= 8 ? "var(--success)" : "var(--warning)" }}>
                  {dest.safety}/10
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{dest.safety >= 8 ? "Safe" : "Exercise Caution"}</div>
              </div>
            </div>

            {/* CTA */}
            <div className="gradient-primary" style={{ padding: 24, borderRadius: "var(--radius-lg)", color: "white", textAlign: "center" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ready to visit?</h3>
              <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 16 }}>Let our AI plan the perfect trip</p>
              <Link href="/plan" className="btn-accent" style={{ width: "100%", justifyContent: "center" }}>Plan Now</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
