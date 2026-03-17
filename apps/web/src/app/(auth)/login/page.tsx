"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="gradient-mesh" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-elevated" style={{ width: "100%", maxWidth: 440, padding: 40 }}>
        {/* ... (SVG and Header remains same) ... */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <svg width="48" height="48" viewBox="0 0 40 40" fill="none" style={{ margin: "0 auto 12px" }}>
            <path d="M20 2L35.59 11V29L20 38L4.41 29V11L20 2Z" stroke="#1a7ad4" strokeWidth="2.5" fill="rgba(26,122,212,0.08)" />
            <path d="M12 15L20 10L28 15L20 20L12 15Z" fill="#1a7ad4" opacity="0.6" />
            <path d="M12 15V25L20 30V20L12 15Z" fill="#1a7ad4" opacity="0.4" />
            <path d="M28 15V25L20 30V20L28 15Z" fill="#1a7ad4" opacity="0.8" />
          </svg>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Sign in to continue planning your trips</p>
        </div>

        {error && (
          <div style={{ padding: "10px 14px", background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", borderRadius: 8, fontSize: 13, marginBottom: 20, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            {error}
          </div>
        )}

        {/* ... (Google button and Divider remains same) ... */}
        <button style={{
          width: "100%", padding: "12px", borderRadius: "var(--radius)", border: "2px solid var(--border)",
          background: "var(--surface)", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20, fontFamily: "var(--font-body)"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Email</label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ paddingLeft: 38 }} required />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6, display: "block" }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="input" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingLeft: 38, paddingRight: 38 }} required />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15 }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-secondary)", marginTop: 24 }}>
          Don&apos;t have an account? <Link href="/register" style={{ color: "var(--primary)", fontWeight: 500, textDecoration: "none" }}>Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
