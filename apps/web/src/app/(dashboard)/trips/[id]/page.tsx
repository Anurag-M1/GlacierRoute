"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, Wallet, MapPin, Share2, FileText, Edit, Shield, Backpack, Hotel, Plane, CalendarDays, Star, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/trip/MapView"), { 
  ssr: false,
  loading: () => <div style={{ height: "400px", width: "100%", background: "var(--surface)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-light)" }}>Loading Map...</div>
});

const CITY_COORDS: Record<string, [number, number]> = {
  "goa": [15.2993, 74.1240],
  "delhi": [28.6139, 77.2090],
  "mumbai": [19.0760, 72.8777],
  "bangalore": [12.9716, 77.5946],
  "manali": [32.2432, 77.1892],
  "jaipur": [26.9124, 75.7873],
};

export default function TripDetailPage() {
  const trip = {
    id: "1", title: "Goa Beach Getaway", origin: "Delhi", destination: "Goa",
    startDate: "2026-04-10", endDate: "2026-04-14", travellers: 2, budget: 40000,
    style: "mid-range", status: "active", confidence: 87, emoji: "🏖️"
  };

  const itinerary = [
    { day: 1, theme: "🌊 Arrival & Beach Vibes", items: ["Arrive Dabolim Airport", "Check-in at Resort Terra Paraiso", "Calangute Beach sunset walk", "Dinner at Britto's — Goan seafood"] },
    { day: 2, theme: "🏛️ Heritage & Culture", items: ["Old Goa churches tour", "Se Cathedral & Basilica of Bom Jesus", "Fontainhas Latin Quarter walk", "Dinner at Gunpowder — Kerala cuisine"] },
    { day: 3, theme: "🌴 Adventure Day", items: ["Dudhsagar Falls excursion", "Spice plantation tour & lunch", "Evening river kayaking", "BBQ dinner at Baga beach shack"] },
    { day: 4, theme: "🛒 Markets & Departure", items: ["Anjuna Flea Market", "Cashew & spice shopping", "Beach brunch at Café Lilliput", "Departure from Dabolim Airport"] },
  ];

  return (
    <div className="gradient-mesh" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 900 }}>
        <Link href="/trips" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-secondary)", textDecoration: "none", marginBottom: 24 }}>
          <ArrowLeft size={16} /> Back to My Trips
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="card-elevated" style={{ padding: 32, marginBottom: 24, background: "linear-gradient(135deg, rgba(26,122,212,0.04), rgba(245,158,11,0.04))" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <span style={{ fontSize: 48 }}>{trip.emoji}</span>
                <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 8, marginBottom: 8 }}>{trip.title}</h1>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                  <MapPin size={16} /> {trip.origin} → {trip.destination}
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", border: "4px solid var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 22, fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--success)" }}>{trip.confidence}</span>
                </div>
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Confidence</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-secondary)" }}><Calendar size={14} /> {trip.startDate} — {trip.endDate}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-secondary)" }}><Users size={14} /> {trip.travellers} travellers</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-secondary)" }}><Wallet size={14} /> {formatCurrency(trip.budget)}</span>
              <span className="tag">{trip.style}</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20, marginBottom: 24 }}>
              <button className="btn-primary" style={{ padding: "10px 20px", fontSize: 13 }}><Edit size={14} /> Edit Plan</button>
              <button className="btn-secondary" style={{ padding: "10px 20px", fontSize: 13 }}><FileText size={14} /> Export PDF</button>
              <button className="btn-secondary" style={{ padding: "10px 20px", fontSize: 13 }}><Share2 size={14} /> Share</button>
            </div>

            <MapView 
              origin={CITY_COORDS[trip.origin.toLowerCase()] || [28.6, 77.2]} 
              destination={CITY_COORDS[trip.destination.toLowerCase()] || [15.3, 74.1]}
              originName={trip.origin}
              destinationName={trip.destination}
            />
          </div>

          {/* Quick Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Transport", value: "₹8,500", icon: Plane, color: "#8B5CF6" },
              { label: "Hotel", value: "₹12,800", icon: Hotel, color: "#EC4899" },
              { label: "Food", value: "₹6,000", icon: CalendarDays, color: "#10B981" },
              { label: "Activities", value: "₹4,000", icon: Star, color: "#3B82F6" },
              { label: "Safety", value: "8/10", icon: Shield, color: "#EF4444" },
              { label: "Items", value: "24", icon: Backpack, color: "#F97316" },
            ].map((s) => (
              <div key={s.label} className="card" style={{ textAlign: "center", padding: 16 }}>
                <s.icon size={20} style={{ color: s.color, marginBottom: 6 }} />
                <div style={{ fontSize: 18, fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Itinerary */}
          <div className="card-elevated" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
              <CalendarDays size={20} style={{ color: "var(--primary)" }} /> Day-by-Day Itinerary
            </h2>
            {itinerary.map((day) => (
              <div key={day.day} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border-light)" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Day {day.day}: {day.theme}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingLeft: 16 }}>
                  {day.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                      <CheckCircle2 size={14} style={{ color: "var(--success)", flexShrink: 0 }} /> {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Expense Link */}
          <Link href="/trips/1/expenses" className="card-elevated" style={{ padding: 20, marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", textDecoration: "none", color: "var(--text-primary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Wallet size={20} style={{ color: "var(--accent)" }} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>Expense Tracker</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Track and split expenses for this trip</div>
              </div>
            </div>
            <span style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500 }}>Open →</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
