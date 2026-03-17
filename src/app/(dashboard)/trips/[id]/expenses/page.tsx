"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Plus, Wallet, Utensils, Plane, Hotel, Camera, ShoppingBag, Fuel, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const categoryIcons: Record<string, typeof Wallet> = { transport: Plane, accommodation: Hotel, food: Utensils, activities: Camera, shopping: ShoppingBag, other: Wallet };
const categoryColors: Record<string, string> = { transport: "#8B5CF6", accommodation: "#EC4899", food: "#10B981", activities: "#3B82F6", shopping: "#F97316", other: "#6B7280" };

const demoExpenses = [
  { id: "1", category: "transport", description: "IndiGo flight DEL-GOI", amount: 4500, date: "2026-04-10" },
  { id: "2", category: "accommodation", description: "Resort Terra Paraiso — 4 nights", amount: 12800, date: "2026-04-10" },
  { id: "3", category: "food", description: "Dinner at Britto's", amount: 1200, date: "2026-04-10" },
  { id: "4", category: "activities", description: "Dudhsagar Falls tour", amount: 1800, date: "2026-04-12" },
  { id: "5", category: "food", description: "Beach shack lunch", amount: 600, date: "2026-04-11" },
  { id: "6", category: "shopping", description: "Cashew & spice shopping", amount: 1500, date: "2026-04-13" },
  { id: "7", category: "transport", description: "Rickshaw (4 days)", amount: 1200, date: "2026-04-10" },
  { id: "8", category: "food", description: "Café Lilliput brunch", amount: 800, date: "2026-04-13" },
];

export default function ExpensesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const total = demoExpenses.reduce((s, e) => s + e.amount, 0);
  const byCategory = demoExpenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] || 0) + e.amount; return acc; }, {} as Record<string, number>);

  return (
    <div className="gradient-mesh" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ paddingTop: 32, paddingBottom: 80, maxWidth: 800 }}>
        <Link href="/trips/1" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--text-secondary)", textDecoration: "none", marginBottom: 24 }}>
          <ArrowLeft size={16} /> Back to Trip
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Expense Tracker</h1>
            <button className="btn-primary" onClick={() => setShowAdd(!showAdd)} style={{ padding: "10px 20px", fontSize: 13 }}>
              <Plus size={16} /> Add Expense
            </button>
          </div>

          {/* Summary */}
          <div className="card-elevated" style={{ padding: 24, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>Total Spent</span>
              <span style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--primary)" }}>{formatCurrency(total)}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
              {Object.entries(byCategory).map(([cat, amt]) => {
                const Icon = categoryIcons[cat] || Wallet;
                return (
                  <div key={cat} style={{ padding: 12, borderRadius: "var(--radius)", border: "1px solid var(--border-light)", textAlign: "center" }}>
                    <Icon size={18} style={{ color: categoryColors[cat], marginBottom: 4 }} />
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{formatCurrency(amt)}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>{cat}</div>
                    <div style={{ width: "100%", height: 3, borderRadius: 2, background: "var(--border-light)", marginTop: 6 }}>
                      <div style={{ width: `${(amt / total) * 100}%`, height: "100%", borderRadius: 2, background: categoryColors[cat] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Form */}
          {showAdd && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="card-elevated" style={{ padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Add New Expense</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <select className="input"><option>Transport</option><option>Accommodation</option><option>Food</option><option>Activities</option><option>Shopping</option><option>Other</option></select>
                <input className="input" type="number" placeholder="Amount (₹)" />
                <input className="input" placeholder="Description" style={{ gridColumn: "1/-1" }} />
                <input className="input" type="date" />
                <button className="btn-primary" style={{ justifyContent: "center" }}>Add Expense</button>
              </div>
            </motion.div>
          )}

          {/* Expense List */}
          <div className="card-elevated" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>All Expenses</h3>
            {demoExpenses.map((exp) => {
              const Icon = categoryIcons[exp.category] || Wallet;
              return (
                <div key={exp.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: "1px solid var(--border-light)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${categoryColors[exp.category]}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} style={{ color: categoryColors[exp.category] }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{exp.description}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{exp.date} • {exp.category}</div>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{formatCurrency(exp.amount)}</span>
                  <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}><Trash2 size={14} /></button>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
