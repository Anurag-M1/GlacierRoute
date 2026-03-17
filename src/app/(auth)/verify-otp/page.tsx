"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const handleChange = (i: number, v: string) => {
    if (v.length > 1) return;
    const next = [...otp]; next[i] = v; setOtp(next);
    if (v && i < 5) { const el = document.getElementById(`otp-${i + 1}`); el?.focus(); }
  };
  return (
    <div className="gradient-mesh" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated" style={{ width: "100%", maxWidth: 440, padding: 40, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(26,122,212,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <ShieldCheck size={32} style={{ color: "var(--primary)" }} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Verify your phone</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32 }}>We sent a 6-digit code to +91 98765 XXXXX</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 32 }}>
          {otp.map((d, i) => (
            <input key={i} id={`otp-${i}`} value={d} onChange={(e) => handleChange(i, e.target.value)} maxLength={1}
              style={{ width: 48, height: 56, textAlign: "center", fontSize: 22, fontWeight: 700, borderRadius: "var(--radius)", border: "2px solid var(--border)", fontFamily: "var(--font-heading)", outline: "none", transition: "border-color 0.2s" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")} onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          ))}
        </div>
        <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>
          Verify <ArrowRight size={16} />
        </button>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 20 }}>
          Didn&apos;t receive the code? <button style={{ color: "var(--primary)", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-body)" }}>Resend</button>
        </p>
      </motion.div>
    </div>
  );
}
