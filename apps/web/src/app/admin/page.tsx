"use client";
import { motion } from "framer-motion";
import { Users, Brain, TrendingUp, MapPin, Clock, Activity, BarChart3, AlertTriangle, CheckCircle2, Server } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const agentMetrics = [
  { name: "Orchestrator", model: "llama3.1:70b", provider: "Groq", avgLatency: 1200, errorRate: 0.02, calls: 12450 },
  { name: "Budget", model: "qwen2.5:72b", provider: "Together", avgLatency: 1800, errorRate: 0.03, calls: 11230 },
  { name: "Route", model: "mixtral:8x22b", provider: "Together", avgLatency: 2100, errorRate: 0.04, calls: 11180 },
  { name: "Transport", model: "mistral-nemo:12b", provider: "Groq", avgLatency: 800, errorRate: 0.01, calls: 11200 },
  { name: "Hotel", model: "gemma2:27b", provider: "Together", avgLatency: 1500, errorRate: 0.03, calls: 11150 },
  { name: "Itinerary", model: "llama3.1:70b", provider: "Groq", avgLatency: 1400, errorRate: 0.02, calls: 11190 },
  { name: "Safety", model: "llama3.1:8b", provider: "Groq", avgLatency: 450, errorRate: 0.01, calls: 11200 },
  { name: "Packing", model: "phi3.5:3.8b", provider: "Groq", avgLatency: 350, errorRate: 0.01, calls: 11210 },
];

export default function AdminPage() {
  return (
    <div className="gradient-mesh" style={{ minHeight: "100vh" }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, marginBottom: 8 }}>Admin Dashboard</h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 32 }}>GlacierRoute analytics and management</p>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Users", value: "12,847", icon: Users, color: "#1a7ad4", change: "+12%" },
            { label: "Trips Planned", value: "54,231", icon: TrendingUp, color: "#f59e0b", change: "+8%" },
            { label: "AI Calls Today", value: "8,420", icon: Brain, color: "#8B5CF6", change: "+15%" },
            { label: "Avg Response", value: "1.2s", icon: Clock, color: "#10B981", change: "-5%" },
            { label: "Active Destinations", value: "487", icon: MapPin, color: "#3B82F6", change: "+3" },
            { label: "Error Rate", value: "0.02%", icon: AlertTriangle, color: "#EF4444", change: "-0.01%" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card-elevated" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <s.icon size={20} style={{ color: s.color }} />
                <span style={{ fontSize: 11, fontWeight: 500, color: s.change.startsWith("+") || s.change.startsWith("-0") ? "var(--success)" : "var(--warning)" }}>{s.change}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-heading)" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Agent Performance */}
        <div className="card-elevated" style={{ padding: 28, marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <Brain size={20} style={{ color: "var(--primary)" }} /> AI Agent Performance
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border-light)" }}>
                  {["Agent", "Model", "Provider", "Avg Latency", "Error Rate", "Total Calls", "Status"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {agentMetrics.map((agent) => (
                  <tr key={agent.name} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 500 }}>{agent.name}</td>
                    <td style={{ padding: "12px 16px" }}><code style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "rgba(26,122,212,0.06)", color: "var(--primary)" }}>{agent.model}</code></td>
                    <td style={{ padding: "12px 16px" }}><span className="tag" style={{ fontSize: 11 }}>{agent.provider}</span></td>
                    <td style={{ padding: "12px 16px" }}>{agent.avgLatency}ms</td>
                    <td style={{ padding: "12px 16px", color: agent.errorRate <= 0.02 ? "var(--success)" : "var(--warning)" }}>{(agent.errorRate * 100).toFixed(1)}%</td>
                    <td style={{ padding: "12px 16px" }}>{agent.calls.toLocaleString()}</td>
                    <td style={{ padding: "12px 16px" }}><CheckCircle2 size={16} style={{ color: "var(--success)" }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users & System */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div className="card-elevated" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Users size={18} style={{ color: "var(--primary)" }} /> Recent Users
            </h3>
            {["Priya Sharma — 3 trips", "Arjun Patel — 1 trip", "Meera Gupta — 2 trips", "Raj Kumar — 5 trips", "Ananya Singh — 1 trip"].map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border-light)", fontSize: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `hsl(${i * 60}, 50%, 85%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>
                  {u.charAt(0)}
                </div>
                {u}
              </div>
            ))}
          </div>
          <div className="card-elevated" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Server size={18} style={{ color: "var(--primary)" }} /> System Health
            </h3>
            {[
              { name: "Groq API", status: "Healthy", latency: "45ms" },
              { name: "Together.ai API", status: "Healthy", latency: "120ms" },
              { name: "Supabase", status: "Healthy", latency: "15ms" },
              { name: "Redis (Upstash)", status: "Healthy", latency: "8ms" },
              { name: "Typesense", status: "Healthy", latency: "22ms" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border-light)", fontSize: 14 }}>
                <span>{s.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.latency}</span>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
