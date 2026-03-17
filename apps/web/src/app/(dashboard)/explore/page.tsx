"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, Filter, MapPin, Star, TrendingUp, Compass, Mountain, Waves, Building2, Landmark } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const categories = [
  { label: "All", icon: Compass, value: "all" },
  { label: "Beach", icon: Waves, value: "beach" },
  { label: "Hill Station", icon: Mountain, value: "hill" },
  { label: "Heritage", icon: Landmark, value: "heritage" },
  { label: "City", icon: Building2, value: "city" },
];

const destinations = [
  { name: "Goa", state: "Goa", emoji: "🏖️", category: "beach", budget: 15000, safety: 8, bestMonths: "Oct-Mar", trending: true },
  { name: "Manali", state: "Himachal Pradesh", emoji: "🏔️", category: "hill", budget: 12000, safety: 7, bestMonths: "Mar-Jun", trending: true },
  { name: "Jaipur", state: "Rajasthan", emoji: "🏰", category: "heritage", budget: 10000, safety: 8, bestMonths: "Oct-Mar", trending: true },
  { name: "Kerala", state: "Kerala", emoji: "🌴", category: "beach", budget: 18000, safety: 9, bestMonths: "Sep-Mar", trending: false },
  { name: "Varanasi", state: "Uttar Pradesh", emoji: "🕉️", category: "heritage", budget: 8000, safety: 7, bestMonths: "Oct-Mar", trending: false },
  { name: "Udaipur", state: "Rajasthan", emoji: "🏯", category: "heritage", budget: 13000, safety: 9, bestMonths: "Sep-Mar", trending: true },
  { name: "Rishikesh", state: "Uttarakhand", emoji: "🧘", category: "hill", budget: 9000, safety: 7, bestMonths: "Sep-Nov", trending: true },
  { name: "Andaman", state: "Andaman", emoji: "🐚", category: "beach", budget: 25000, safety: 9, bestMonths: "Oct-May", trending: true },
  { name: "Leh Ladakh", state: "Ladakh", emoji: "🏔️", category: "hill", budget: 22000, safety: 6, bestMonths: "Jun-Sep", trending: true },
  { name: "Mumbai", state: "Maharashtra", emoji: "🌆", category: "city", budget: 20000, safety: 7, bestMonths: "Oct-Feb", trending: false },
  { name: "Darjeeling", state: "West Bengal", emoji: "🍵", category: "hill", budget: 11000, safety: 8, bestMonths: "Mar-May", trending: false },
  { name: "Hampi", state: "Karnataka", emoji: "🗿", category: "heritage", budget: 7000, safety: 8, bestMonths: "Oct-Feb", trending: false },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }) };

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = destinations
    .filter((d) => category === "all" || d.category === category)
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="gradient-mesh" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, marginBottom: 8 }}>Explore Destinations</h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 32 }}>Discover trending spots across India</p>
        </motion.div>

        <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 250 }}>
            <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input className="input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search destinations..." style={{ paddingLeft: 42 }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button key={cat.value} onClick={() => setCategory(cat.value)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 999,
              border: category === cat.value ? "2px solid var(--primary)" : "2px solid var(--border)",
              background: category === cat.value ? "rgba(26,122,212,0.08)" : "var(--surface)",
              color: category === cat.value ? "var(--primary)" : "var(--text-secondary)",
              fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-body)"
            }}>
              <cat.icon size={14} /> {cat.label}
            </button>
          ))}
        </div>

        {category === "all" && !search && (
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={20} style={{ color: "var(--accent)" }} /> Trending Now
            </h2>
            <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
              {destinations.filter((d) => d.trending).map((dest, i) => (
                <Link key={dest.name} href={`/destinations/${dest.name.toLowerCase().replace(/\s+/g, "-")}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                  <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={i}
                    className="card-elevated" style={{ width: 180, padding: 20, cursor: "pointer" }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>{dest.emoji}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{dest.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>{dest.state}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--primary)" }}>from {formatCurrency(dest.budget)}</div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {filtered.map((dest, i) => (
            <motion.div key={dest.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
              <Link href={`/destinations/${dest.name.toLowerCase().replace(/\s+/g, "-")}`} style={{ textDecoration: "none" }}>
                <div className="card-elevated" style={{ padding: 24, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 40 }}>{dest.emoji}</span>
                    {dest.trending && <span className="tag" style={{ background: "rgba(245,158,11,0.1)", color: "var(--accent)", fontSize: 10 }}>🔥 Trending</span>}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{dest.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}><MapPin size={12} style={{ display: "inline" }} /> {dest.state}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)" }}>from {formatCurrency(dest.budget)}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                      <Star size={12} fill="var(--accent)" style={{ color: "var(--accent)" }} /> {dest.safety}/10
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span className="tag">{dest.category}</span>
                    <span className="tag" style={{ background: "rgba(16,185,129,0.08)", color: "var(--success)" }}>Best: {dest.bestMonths}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>
            <Compass size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p>No destinations found</p>
          </div>
        )}
      </div>
    </div>
  );
}
