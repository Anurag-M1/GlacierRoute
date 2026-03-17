"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin, Calendar, Users, Wallet, Compass, Sparkles, ArrowRight,
  Brain, Shield, Map, Hotel, CalendarDays, Backpack, Zap, CheckCircle2,
  Clock, AlertTriangle, ChevronDown, ChevronRight, Star, Plane, Train,
  Bus, Utensils, Camera, Sun, CloudRain, Wind, ThermometerSun
} from "lucide-react";
import { AGENT_COLORS, AGENT_MODELS, formatCurrency, API_BASE } from "@/lib/utils";
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

const agentList = [
  { key: "orchestrator", name: "Orchestrator", icon: Brain, model: "llama3.1:70b" },
  { key: "budget", name: "Budget", icon: Wallet, model: "qwen2.5:72b" },
  { key: "route", name: "Route", icon: Map, model: "mixtral:8x22b" },
  { key: "transport", name: "Transport", icon: Zap, model: "mistral-nemo:12b" },
  { key: "hotel", name: "Hotel", icon: Hotel, model: "gemma2:27b" },
  { key: "itinerary", name: "Itinerary", icon: CalendarDays, model: "llama3.1:70b" },
  { key: "safety", name: "Safety", icon: Shield, model: "llama3.1:8b" },
  { key: "packing", name: "Packing", icon: Backpack, model: "phi3.5:3.8b" },
];

// Demo data for showcasing the results
const demoBudget = {
  transport: { estimated: 8500, min: 6000, max: 12000 },
  accommodation: { estimated: 12000, perNight: 3000, totalNights: 4 },
  food: { estimated: 6000, perDay: 1500 },
  activities: { estimated: 4000 },
  shoppingMisc: { estimated: 2000 },
  emergencyBuffer: { amount: 3500, percentage: 10 },
  totalEstimated: 36000,
};

const demoItinerary = [
  { day: 1, theme: "🌊 Arrival & Beach Vibes", activities: ["Arrive at Dabolim Airport", "Check into beach resort", "Calangute Beach sunset walk", "Dinner at Britto's"] },
  { day: 2, theme: "🏛️ Heritage & Culture", activities: ["Old Goa churches", "Se Cathedral", "Basilica of Bom Jesus", "Fontainhas Latin Quarter walk"] },
  { day: 3, theme: "🌴 Adventure Day", activities: ["Dudhsagar Falls trip", "Spice plantation tour", "River kayaking", "BBQ dinner at Baga"] },
  { day: 4, theme: "🛒 Markets & Departure", activities: ["Anjuna Flea Market", "Cashew shopping", "Beach brunch", "Departure"] },
];

const demoHotels = [
  { name: "OYO Flagships", area: "Calangute", stars: 2, price: 1200, tier: "budget", score: 7.2, highlight: "Walking distance to beach" },
  { name: "Resort Terra Paraiso", area: "Calangute", stars: 3, price: 3200, tier: "mid-range", score: 8.5, highlight: "Pool, spa, breakfast included", recommended: true },
  { name: "Taj Fort Aguada", area: "Sinquerim", stars: 5, price: 12000, tier: "premium", score: 9.4, highlight: "Heritage fort resort with ocean views" },
];

const demoTransport = [
  { mode: "Flight", operator: "IndiGo 6E-1234", departure: "06:15", arrival: "08:30", duration: "2h 15m", price: 4500, recommended: true },
  { mode: "Flight", operator: "Air India AI-883", departure: "10:00", arrival: "12:20", duration: "2h 20m", price: 5800, recommended: false },
  { mode: "Train", operator: "Konkan Kanya Exp", departure: "23:00", arrival: "11:30+1", duration: "12h 30m", price: 1200, recommended: false },
];

type PlanStage = "form" | "processing" | "results";
type AgentStatusType = "idle" | "running" | "done" | "error";

export default function PlanPage() {
  const [stage, setStage] = useState<PlanStage>("form");
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatusType>>({});
  const [logs, setLogs] = useState<{ agent: string; msg: string; ts: number }[]>([]);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debug tracing
  useState(() => {
    if (typeof window !== 'undefined') {
      (window as any).__plan_mount_count = ((window as any).__plan_mount_count || 0) + 1;
      console.log(`[PlanPage] Initial Mount. Count: ${(window as any).__plan_mount_count}`);
      
      window.onbeforeunload = () => {
        console.log("[PlanPage] Page is reloading/unloading!");
      };
    }
    return 0;
  });

  useState(() => {
    console.log("[PlanPage] Component state initialized");
    return 0;
  });

  const [form, setForm] = useState({
    origin: "Delhi",
    destination: "Goa",
    startDate: "2026-04-10",
    endDate: "2026-04-14",
    travellers: 2,
    budget: 40000,
    style: "mid-range",
    groupType: "couple",
    special: "",
  });

  const simulatePlanning = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    console.log("[PlanPage] Starting planning process...");
    setStage("processing");
    const initialStatuses: Record<string, AgentStatusType> = {};
    agentList.forEach((a) => (initialStatuses[a.key] = "idle"));
    setAgentStatuses(initialStatuses);
    setLogs([]);

    try {
      // 1. Create planning session
      const response = await fetch(`${API_BASE}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: form.origin,
          destination: form.destination,
          start_date: form.startDate,
          end_date: form.endDate,
          travellers: form.travellers,
          budget_inr: form.budget,
          travel_style: form.style,
          group_type: form.groupType,
          special_requirements: form.special,
        }),
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }
      const { session_id } = await response.json();

      // 2. Start SSE stream
      const eventSource = new EventSource(`${API_BASE}/api/plan/${session_id}/stream`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.status === "complete") {
          setAgentStatuses((prev) => {
            const updated = { ...prev };
            Object.keys(updated).forEach((k) => (updated[k] = "done"));
            return updated;
          });
          setStage("results");
          eventSource.close();
          return;
        }

        if (data.agent && data.msg) {
          setLogs((prev) => [...prev, { agent: data.agent, msg: data.msg, ts: data.ts * 1000 || Date.now() }]);
          setAgentStatuses((prev) => ({
            ...prev,
            [data.agent]: data.status === "completed" ? "done" : "running",
          }));
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE Error:", err);
        eventSource.close();
        // Fallback or error state could be handled here
      };

    } catch (error: any) {
      console.error("[PlanPage] Planning Error:", error);
      alert(`Error planning your trip: ${error.message}`);
      setStage("form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="gradient-mesh" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, marginBottom: 8 }}>
            Plan Your Trip
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>
            8 AI agents will create your perfect plan in seconds
          </p>
        </motion.div>

        {/* ============ FORM STAGE ============ */}
        {stage === "form" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card-elevated" style={{ padding: 40, maxWidth: 800 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                    <MapPin size={14} style={{ display: "inline", marginRight: 4 }} /> Origin
                  </label>
                  <input className="input" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="e.g. Delhi" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                    <MapPin size={14} style={{ display: "inline", marginRight: 4 }} /> Destination
                  </label>
                  <input className="input" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="e.g. Goa" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                    <Calendar size={14} style={{ display: "inline", marginRight: 4 }} /> Start Date
                  </label>
                  <input className="input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                    <Calendar size={14} style={{ display: "inline", marginRight: 4 }} /> End Date
                  </label>
                  <input className="input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                    <Users size={14} style={{ display: "inline", marginRight: 4 }} /> Travellers
                  </label>
                  <input className="input" type="number" min={1} max={20} value={form.travellers} onChange={(e) => setForm({ ...form, travellers: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                    <Wallet size={14} style={{ display: "inline", marginRight: 4 }} /> Budget (₹)
                  </label>
                  <input className="input" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                    <Compass size={14} style={{ display: "inline", marginRight: 4 }} /> Travel Style
                  </label>
                  <select className="input" value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} style={{ cursor: "pointer" }}>
                    <option value="budget">Budget Backpacker</option>
                    <option value="mid-range">Mid-Range</option>
                    <option value="luxury">Luxury</option>
                    <option value="adventure">Adventure</option>
                    <option value="cultural">Cultural</option>
                    <option value="relaxation">Relaxation</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                    <Users size={14} style={{ display: "inline", marginRight: 4 }} /> Group Type
                  </label>
                  <select className="input" value={form.groupType} onChange={(e) => setForm({ ...form, groupType: e.target.value })} style={{ cursor: "pointer" }}>
                    <option value="solo">Solo</option>
                    <option value="couple">Couple</option>
                    <option value="family">Family</option>
                    <option value="friends">Friends</option>
                    <option value="business">Business</option>
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>
                    Special Requirements (optional)
                  </label>
                  <textarea
                    className="input"
                    rows={3}
                    value={form.special}
                    onChange={(e) => setForm({ ...form, special: e.target.value })}
                    placeholder="e.g. vegetarian food, wheelchair accessible, prefer morning flights..."
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>
              <button 
                type="button"
                className="btn-primary" 
                onClick={(e) => {
                  e.preventDefault();
                  simulatePlanning();
                }} 
                style={{ marginTop: 24, width: "100%", justifyContent: "center", fontSize: 16, padding: "16px" }}
              >
                <Sparkles size={18} /> Weave My Trip Plan
              </button>
            </div>
          </motion.div>
        )}

        {/* ============ PROCESSING STAGE ============ */}
        {(stage === "processing" || stage === "results") && (
          <div style={{ display: "grid", gridTemplateColumns: stage === "results" ? "1fr" : "280px 1fr", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
            {/* Agent Pipeline (show during processing) */}
            {stage === "processing" && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="card-elevated" style={{ padding: 20, position: "sticky", top: 90 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <Brain size={16} style={{ color: "var(--primary)" }} /> Agent Pipeline
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {agentList.map((agent) => {
                      const status = agentStatuses[agent.key] || "idle";
                      const Icon = agent.icon;
                      return (
                        <div key={agent.key} className={`agent-badge ${status}`} style={{ justifyContent: "flex-start", width: "100%" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: status === "done" ? "var(--success)" : status === "running" ? "var(--primary)" : "var(--border)", flexShrink: 0 }} />
                          <Icon size={14} />
                          <span style={{ flex: 1, fontSize: 12 }}>{agent.name}</span>
                          {status === "running" && <div className="shimmer" style={{ width: 20, height: 4, borderRadius: 2 }} />}
                          {status === "done" && <CheckCircle2 size={14} style={{ color: "var(--success)" }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Agent Logs / Results */}
            <div>
              {stage === "processing" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-elevated" style={{ padding: 24 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                    <Zap size={16} style={{ color: "var(--accent)" }} /> Agent Activity Log
                  </h3>
                  <div style={{ maxHeight: 500, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                    {logs.map((log, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 12px", borderRadius: 8, background: i === logs.length - 1 ? "rgba(26,122,212,0.04)" : "transparent" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: AGENT_COLORS[log.agent] || "var(--primary)", marginTop: 7, flexShrink: 0 }} />
                        <div>
                          <span style={{ fontSize: 12, fontWeight: 600, color: AGENT_COLORS[log.agent] || "var(--primary)", textTransform: "capitalize" }}>
                            {log.agent}
                          </span>
                          <span style={{ fontSize: 13, color: "var(--text-secondary)", marginLeft: 8 }}>{log.msg}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ============ RESULTS ============ */}
              {stage === "results" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {/* Confidence & Summary */}
                  <div className="card-elevated" style={{ padding: 32, background: "linear-gradient(135deg, rgba(26,122,212,0.04) 0%, rgba(245,158,11,0.04) 100%)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
                      <div>
                        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                          {form.origin} → {form.destination}
                        </h2>
                        <p style={{ fontSize: 15, color: "var(--text-secondary)" }}>
                          {form.travellers} travellers • {form.startDate} to {form.endDate} • {form.style} style
                        </p>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ width: 80, height: 80, borderRadius: "50%", border: "4px solid var(--success)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                          <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--success)" }}>87</span>
                        </div>
                        <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4, display: "block" }}>Confidence</span>
                      </div>
                    </div>

                    <MapView 
                      origin={CITY_COORDS[form.origin.toLowerCase()] || [28.6, 77.2]} 
                      destination={CITY_COORDS[form.destination.toLowerCase()] || [15.3, 74.1]}
                      originName={form.origin}
                      destinationName={form.destination}
                    />
                  </div>

                  {/* Budget Card */}
                  <div className="card-elevated" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Wallet size={18} style={{ color: "#F59E0B" }} />
                      </div>
                      Budget Breakdown
                      <span className="tag" style={{ marginLeft: "auto", background: "rgba(16,185,129,0.1)", color: "var(--success)" }}>Within Budget ✓</span>
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16 }}>
                      {[
                        { label: "Transport", amount: demoBudget.transport.estimated, color: "#8B5CF6", pct: 24 },
                        { label: "Accommodation", amount: demoBudget.accommodation.estimated, color: "#EC4899", pct: 33 },
                        { label: "Food", amount: demoBudget.food.estimated, color: "#10B981", pct: 17 },
                        { label: "Activities", amount: demoBudget.activities.estimated, color: "#3B82F6", pct: 11 },
                        { label: "Shopping", amount: demoBudget.shoppingMisc.estimated, color: "#F97316", pct: 6 },
                        { label: "Emergency", amount: demoBudget.emergencyBuffer.amount, color: "#EF4444", pct: 10 },
                      ].map((item) => (
                        <div key={item.label} style={{ padding: 16, borderRadius: "var(--radius)", border: "1px solid var(--border-light)" }}>
                          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{item.label}</div>
                          <div style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(item.amount)}</div>
                          <div style={{ width: "100%", height: 4, borderRadius: 2, background: "var(--border-light)", marginTop: 8 }}>
                            <div style={{ width: `${item.pct}%`, height: "100%", borderRadius: 2, background: item.color }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 20, padding: 16, borderRadius: "var(--radius)", background: "rgba(26,122,212,0.04)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 15, fontWeight: 500 }}>Total Estimated</span>
                      <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--primary)" }}>{formatCurrency(demoBudget.totalEstimated)}</span>
                    </div>
                  </div>

                  {/* Transport Card */}
                  <div className="card-elevated" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Plane size={18} style={{ color: "#8B5CF6" }} />
                      </div>
                      Transport Options
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {demoTransport.map((t, i) => (
                        <div key={i} style={{
                          padding: 16, borderRadius: "var(--radius)", border: t.recommended ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                          background: t.recommended ? "rgba(26,122,212,0.02)" : "transparent", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap"
                        }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: t.mode === "Flight" ? "rgba(139,92,246,0.1)" : "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {t.mode === "Flight" ? <Plane size={18} style={{ color: "#8B5CF6" }} /> : <Train size={18} style={{ color: "#3B82F6" }} />}
                          </div>
                          <div style={{ flex: 1, minWidth: 150 }}>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>{t.operator}</div>
                            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t.departure} → {t.arrival} • {t.duration}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>{formatCurrency(t.price)}</div>
                            {t.recommended && <span className="tag" style={{ fontSize: 10 }}>Recommended</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hotel Card */}
                  <div className="card-elevated" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Hotel size={18} style={{ color: "#EC4899" }} />
                      </div>
                      Accommodation
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                      {demoHotels.map((h, i) => (
                        <div key={i} style={{
                          padding: 20, borderRadius: "var(--radius)", border: h.recommended ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                          position: "relative"
                        }}>
                          {h.recommended && (
                            <div style={{ position: "absolute", top: -10, right: 16, background: "var(--primary)", color: "white", padding: "2px 12px", borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                              Best Value
                            </div>
                          )}
                          <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                            {Array.from({ length: h.stars }).map((_, j) => <Star key={j} size={12} fill="var(--accent)" style={{ color: "var(--accent)" }} />)}
                          </div>
                          <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{h.name}</h4>
                          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{h.area} • {h.score}/10</div>
                          <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>{h.highlight}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span className="tag">{h.tier}</span>
                            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>{formatCurrency(h.price)}<span style={{ fontSize: 12, fontWeight: 400, color: "var(--text-muted)" }}>/night</span></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Itinerary */}
                  <div className="card-elevated" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CalendarDays size={18} style={{ color: "#10B981" }} />
                      </div>
                      Day-by-Day Itinerary
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {demoItinerary.map((day, i) => (
                        <div key={i} style={{ borderRadius: "var(--radius)", border: "1px solid var(--border-light)", overflow: "hidden" }}>
                          <button
                            onClick={() => setExpandedDay(expandedDay === i ? null : i)}
                            style={{
                              width: "100%", padding: "14px 20px", background: expandedDay === i ? "rgba(16,185,129,0.04)" : "transparent",
                              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between",
                              fontFamily: "var(--font-body)", fontSize: 15, fontWeight: 500, color: "var(--text-primary)"
                            }}
                          >
                            <span>Day {day.day}: {day.theme}</span>
                            <ChevronDown size={18} style={{ color: "var(--text-muted)", transform: expandedDay === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                          </button>
                          <AnimatePresence>
                            {expandedDay === i && (
                              <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} style={{ overflow: "hidden" }}>
                                <div style={{ padding: "0 20px 16px" }}>
                                  {day.activities.map((a, j) => (
                                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: j < day.activities.length - 1 ? "1px solid var(--border-light)" : "none" }}>
                                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)" }} />
                                      <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{a}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Safety Card */}
                  <div className="card-elevated" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Shield size={18} style={{ color: "#EF4444" }} />
                      </div>
                      Safety & Health
                      <span className="tag" style={{ marginLeft: "auto", background: "rgba(16,185,129,0.1)", color: "var(--success)" }}>Score: 8/10</span>
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div style={{ padding: 16, borderRadius: "var(--radius)", border: "1px solid var(--border-light)" }}>
                        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: "var(--warning)" }}>⚠️ Health Advisories</h4>
                        <ul style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8, paddingLeft: 16 }}>
                          <li>Heat exhaustion risk in April — stay hydrated</li>
                          <li>Apply SPF 50+ sunscreen regularly</li>
                          <li>Drink only bottled/purified water</li>
                        </ul>
                      </div>
                      <div style={{ padding: 16, borderRadius: "var(--radius)", border: "1px solid var(--border-light)" }}>
                        <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>📞 Emergency Contacts</h4>
                        <ul style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8, listStyle: "none", paddingLeft: 0 }}>
                          <li>Police: 100</li>
                          <li>Ambulance: 108</li>
                          <li>Tourist Helpline: 1363</li>
                          <li>Goa Police: 0832-2226611</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Packing Checklist */}
                  <div className="card-elevated" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Backpack size={18} style={{ color: "#F97316" }} />
                      </div>
                      Packing Checklist
                      <span className="tag" style={{ marginLeft: "auto" }}>24 items</span>
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                      {[
                        { cat: "👕 Clothing", items: ["Lightweight t-shirts ×4", "Shorts ×3", "Swimwear ×2", "Light jacket ×1"] },
                        { cat: "👟 Footwear", items: ["Flip-flops", "Walking shoes", "Water sandals"] },
                        { cat: "🧴 Toiletries", items: ["Sunscreen SPF 50+", "Insect repellent", "After-sun lotion"] },
                        { cat: "📄 Documents", items: ["Aadhaar Card", "Hotel confirmations", "Flight tickets", "Insurance card"] },
                        { cat: "🔌 Electronics", items: ["Phone charger", "Power bank 20000mAh", "Waterproof phone pouch"] },
                        { cat: "💊 Medicines", items: ["Basic first aid kit", "ORS packets", "Digestive tablets", "Paracetamol"] },
                      ].map((cat) => (
                        <div key={cat.cat} style={{ padding: 16, borderRadius: "var(--radius)", border: "1px solid var(--border-light)" }}>
                          <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{cat.cat}</h4>
                          {cat.items.map((item, j) => (
                            <label key={j} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-secondary)", marginBottom: 6, cursor: "pointer" }}>
                              <input type="checkbox" style={{ accentColor: "var(--primary)" }} />
                              {item}
                            </label>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
                    <button className="btn-primary" style={{ padding: "14px 32px" }}>
                      💾 Save Trip
                    </button>
                    <button className="btn-secondary" style={{ padding: "14px 32px" }}>
                      📄 Export PDF
                    </button>
                    <button className="btn-secondary" style={{ padding: "14px 32px" }}>
                      🔗 Share Plan
                    </button>
                    <button className="btn-secondary" style={{ padding: "14px 32px" }} onClick={() => { setStage("form"); setLogs([]); }}>
                      ✏️ Edit & Replan
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
