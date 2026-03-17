"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { MapPin, Calendar, Users, Wallet, Plus, MoreVertical, Eye, Trash2, Share2, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const demoTrips = [
  { id: "1", title: "Goa Beach Getaway", origin: "Delhi", destination: "Goa", startDate: "2026-04-10", endDate: "2026-04-14", travellers: 2, budget: 40000, style: "mid-range", status: "active" as const, confidence: 87, emoji: "🏖️" },
  { id: "2", title: "Manali Adventure", origin: "Delhi", destination: "Manali", startDate: "2026-05-01", endDate: "2026-05-06", travellers: 4, budget: 60000, style: "adventure", status: "planning" as const, confidence: 92, emoji: "🏔️" },
  { id: "3", title: "Jaipur Heritage Tour", origin: "Mumbai", destination: "Jaipur", startDate: "2026-03-01", endDate: "2026-03-04", travellers: 2, budget: 25000, style: "cultural", status: "completed" as const, confidence: 85, emoji: "🏰" },
  { id: "4", title: "Kerala Backwaters", origin: "Bangalore", destination: "Alleppey", startDate: "2026-06-15", endDate: "2026-06-20", travellers: 3, budget: 50000, style: "relaxation", status: "planning" as const, confidence: 79, emoji: "🌴" },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  planning: { bg: "rgba(59,130,246,0.1)", text: "#3B82F6", label: "Planning" },
  active: { bg: "rgba(16,185,129,0.1)", text: "#10B981", label: "Active" },
  completed: { bg: "rgba(107,114,128,0.1)", text: "#6B7280", label: "Completed" },
  cancelled: { bg: "rgba(239,68,68,0.1)", text: "#EF4444", label: "Cancelled" },
};

export default function TripsPage() {
  return (
    <div className="gradient-mesh" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, marginBottom: 8 }}>My Trips</h1>
            <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>Manage and track all your planned trips</p>
          </div>
          <Link href="/plan" className="btn-primary"><Plus size={18} /> New Trip</Link>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {demoTrips.map((trip, i) => {
            const st = statusColors[trip.status];
            return (
              <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link href={`/trips/${trip.id}`} style={{ textDecoration: "none" }}>
                  <div className="card-elevated" style={{ padding: 24, cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 32 }}>{trip.emoji}</span>
                        <div>
                          <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)" }}>{trip.title}</h3>
                          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>{trip.origin} → {trip.destination}</p>
                        </div>
                      </div>
                      <span style={{ padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 500, background: st.bg, color: st.text }}>{st.label}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                        <Calendar size={14} /> {trip.startDate}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                        <Users size={14} /> {trip.travellers} travellers
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                        <Wallet size={14} /> {formatCurrency(trip.budget)}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)" }}>
                        <span className="tag" style={{ fontSize: 11 }}>{trip.style}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--border-light)" }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Confidence: {trip.confidence}%</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}><Eye size={16} /></button>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}><Share2 size={16} /></button>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}><FileText size={16} /></button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
