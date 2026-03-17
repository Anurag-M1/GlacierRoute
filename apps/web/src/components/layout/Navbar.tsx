"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Map,
  MessageSquare,
  PlaneTakeoff,
  Menu,
  X,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Settings,
  Briefcase,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

const navLinks = [
  { href: "/plan", label: "Plan Trip", icon: PlaneTakeoff },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/trips", label: "My Trips", icon: Briefcase },
  { href: "/assistant", label: "AI Assistant", icon: MessageSquare },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
  };

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <nav className="glass" style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border-light)" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36 }}>
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L35.59 11V29L20 38L4.41 29V11L20 2Z" stroke="#1a7ad4" strokeWidth="2.5" fill="rgba(26,122,212,0.08)" />
              <path d="M12 15L20 10L28 15L20 20L12 15Z" fill="#1a7ad4" opacity="0.6" />
              <path d="M12 15V25L20 30V20L12 15Z" fill="#1a7ad4" opacity="0.4" />
              <path d="M28 15V25L20 30V20L28 15Z" fill="#1a7ad4" opacity="0.8" />
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800, color: "var(--primary)" }}>
            GlacierRoute
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden-mobile">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: "var(--radius)",
                  fontSize: 14,
                  fontWeight: active ? 500 : 400,
                  color: active ? "var(--primary)" : "var(--text-secondary)",
                  background: active ? "rgba(26,122,212,0.08)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  border: "none", background: "none", display: "flex", alignItems: "center", gap: 8,
                  cursor: "pointer", color: "var(--text-primary)", padding: 4
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={14} style={{ transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      position: "absolute", top: "100%", right: 0, marginTop: 8, width: 200,
                      background: "white", borderRadius: "12px", border: "1px solid var(--border-light)",
                      boxShadow: "0 10px 40px rgba(0,0,0,0.1)", overflow: "hidden"
                    }}
                  >
                    <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-light)" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{user.user_metadata.full_name || "User"}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
                    </div>
                    <div style={{ padding: 6 }}>
                      <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: "none", background: "none", cursor: "pointer", color: "#EF4444", fontSize: 13, textAlign: "left" }}>
                        <LogOut size={14} /> Log Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="btn-primary" style={{ fontSize: 13, padding: "8px 20px" }}>
              Get Started
            </Link>
          )}
          {/* Mobile menu toggle */}
          <button
            className="show-mobile"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-primary)",
              padding: 4,
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", borderTop: "1px solid var(--border-light)" }}
          >
            <div style={{ padding: "8px 24px 16px" }}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 0",
                      fontSize: 15,
                      fontWeight: active ? 500 : 400,
                      color: active ? "var(--primary)" : "var(--text-secondary)",
                      textDecoration: "none",
                      borderBottom: "1px solid var(--border-light)",
                    }}
                  >
                    <Icon size={18} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
