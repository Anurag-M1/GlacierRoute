"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Sparkles, Brain, Shield, Map, Wallet, Hotel,
  CalendarDays, Backpack, Zap, Globe, Star, ChevronDown,
  Clock, Users, CheckCircle2, MessageSquare, TrendingUp
} from "lucide-react";

const agents = [
  { name: "Orchestrator", model: "llama3.1:70b", icon: Brain, color: "#1a7ad4", desc: "Coordinates all agents" },
  { name: "Budget", model: "qwen2.5:72b", icon: Wallet, color: "#F59E0B", desc: "Optimizes your spending" },
  { name: "Route", model: "mixtral:8x22b", icon: Map, color: "#3B82F6", desc: "Finds best routes" },
  { name: "Transport", model: "mistral-nemo:12b", icon: Zap, color: "#8B5CF6", desc: "Compares flights & trains" },
  { name: "Hotel", model: "gemma2:27b", icon: Hotel, color: "#EC4899", desc: "Matches perfect stays" },
  { name: "Itinerary", model: "llama3.1:70b", icon: CalendarDays, color: "#10B981", desc: "Plans your days" },
  { name: "Safety", model: "llama3.1:8b", icon: Shield, color: "#EF4444", desc: "Keeps you safe" },
  { name: "Packing", model: "phi3.5:3.8b", icon: Backpack, color: "#F97316", desc: "Packs your bags" },
];

const destinations = [
  { name: "Manali", state: "Himachal Pradesh", image: "🏔️", budget: "₹12,000", tag: "Adventure" },
  { name: "Goa", state: "Goa", image: "🏖️", budget: "₹15,000", tag: "Beach" },
  { name: "Jaipur", state: "Rajasthan", image: "🏰", budget: "₹10,000", tag: "Cultural" },
  { name: "Kerala", state: "Kerala", image: "🌴", budget: "₹18,000", tag: "Nature" },
  { name: "Varanasi", state: "Uttar Pradesh", image: "🕉️", budget: "₹8,000", tag: "Spiritual" },
  { name: "Darjeeling", state: "West Bengal", image: "🍵", budget: "₹11,000", tag: "Hill Station" },
];

const testimonials = [
  { name: "Priya Sharma", role: "Solo Traveler", text: "GlacierRoute planned my entire Ladakh trip in under 10 seconds. The budget breakdown was spot-on!", rating: 5 },
  { name: "Arjun & Meera", role: "Couple", text: "The AI suggested hidden gems in Kerala we'd never have found. Our honeymoon was perfect.", rating: 5 },
  { name: "Raj Patel", role: "Family Trip", text: "Planning for 6 family members was a nightmare before GlacierRoute. Now it takes minutes.", rating: 5 },
];

const faqs = [
  { q: "How does GlacierRoute's AI work?", a: "GlacierRoute uses 8 specialized AI agents, each powered by a different open-source model optimized for its task. They work in parallel to create your perfect plan in seconds." },
  { q: "Is it free to use?", a: "Yes! GlacierRoute offers a generous free tier with up to 5 trip plans per month. Premium plans unlock unlimited planning and priority AI processing." },
  { q: "How accurate are the budget estimates?", a: "Our Budget Agent uses real Indian travel cost benchmarks and is calibrated against thousands of real trip expenses. Accuracy is typically within 10-15%." },
  { q: "Can I edit the generated plan?", a: "Absolutely! Every part of the plan is fully editable. You can swap hotels, change activities, adjust dates, and the AI will recalculate everything automatically." },
  { q: "Does it work for international trips?", a: "Yes, GlacierRoute supports international destinations. However, our budget benchmarks are most accurate for Indian domestic travel." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const } }),
};

export default function LandingPage() {
  return (
    <div>
      {/* ============ HERO ============ */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "90vh", display: "flex", alignItems: "center" }}>
        <div className="gradient-mesh" style={{ position: "absolute", inset: 0 }} />
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "rgba(26,122,212,0.06)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "10%", width: 200, height: 200, borderRadius: "50%", background: "rgba(245,158,11,0.08)", filter: "blur(40px)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, paddingTop: 80, paddingBottom: 80 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ maxWidth: 600 }}>
              <div className="tag" style={{ marginBottom: 20, gap: 6 }}>
                <Sparkles size={14} />
                Powered by 8 AI Agents
              </div>
              <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
                Every thread of your journey,{" "}
                <span style={{ background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  perfectly woven
                </span>
              </h1>
              <p style={{ fontSize: 18, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 32, maxWidth: 500 }}>
                8 specialized AI agents work in parallel to craft your perfect trip plan — budget, routes, hotels, itinerary, safety, and packing — all in under 10 seconds.
              </p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link href="/plan" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
                  Plan Your Trip <ArrowRight size={18} />
                </Link>
                <Link href="/explore" className="btn-secondary" style={{ fontSize: 16, padding: "14px 32px" }}>
                  Explore Destinations
                </Link>
              </div>
              <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
                {[
                  { label: "Trips Planned", value: "50K+" },
                  { label: "AI Models", value: "8" },
                  { label: "Destinations", value: "500+" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--primary)" }}>{stat.value}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              {/* Agent Pipeline Visualization */}
              <div style={{ background: "var(--surface)", borderRadius: "var(--radius-xl)", padding: 32, boxShadow: "var(--shadow-lg)", border: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
                  <span style={{ marginLeft: 8, fontSize: 13, color: "var(--text-muted)" }}>GlacierRoute Agent Pipeline</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {agents.map((agent, i) => (
                    <motion.div
                      key={agent.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
                        borderRadius: "var(--radius)", border: "1px solid var(--border-light)",
                        background: i === 0 ? "rgba(26,122,212,0.04)" : "transparent",
                      }}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${agent.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <agent.icon size={16} style={{ color: agent.color }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{agent.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{agent.model}</div>
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)" }} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="section-padding" style={{ background: "var(--surface)" }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 60 }}>
            <motion.div variants={fadeUp} custom={0} className="tag" style={{ marginBottom: 16, display: "inline-flex", gap: 6 }}>
              <Zap size={14} /> How It Works
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 16 }}>
              Three steps to your perfect trip
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} style={{ fontSize: 17, color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto" }}>
              Tell us where you want to go, and our AI agents handle everything else.
            </motion.p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32, maxWidth: 1000, margin: "0 auto" }}>
            {[
              { step: "01", title: "Tell Us Your Dream", desc: "Enter your destination, dates, budget, and travel style. Our form captures everything the AI needs.", icon: MessageSquare, color: "var(--primary)" },
              { step: "02", title: "AI Agents at Work", desc: "8 specialized agents powered by open-source models analyze, plan, and optimize your trip in parallel.", icon: Brain, color: "var(--accent)" },
              { step: "03", title: "Your Perfect Plan", desc: "Get a complete trip plan with budget breakdown, routes, hotels, daily itinerary, safety tips, and packing list.", icon: CheckCircle2, color: "var(--success)" },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="card-elevated"
                style={{ textAlign: "center", padding: 40 }}
              >
                <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--border)", marginBottom: 16 }}>{item.step}</div>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <item.icon size={26} style={{ color: item.color }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{item.title}</h3>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AGENT PIPELINE ============ */}
      <section className="section-padding gradient-mesh">
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 60 }}>
            <motion.div variants={fadeUp} custom={0} className="tag" style={{ marginBottom: 16, display: "inline-flex", gap: 6 }}>
              <Brain size={14} /> AI Agent System
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 16 }}>
              8 AI agents, one perfect plan
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} style={{ fontSize: 17, color: "var(--text-secondary)", maxWidth: 600, margin: "0 auto" }}>
              Each agent is powered by a specialized open-source LLM chosen for its unique strengths.
            </motion.p>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="card"
                style={{ display: "flex", alignItems: "flex-start", gap: 16, cursor: "default" }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: `${agent.color}12`, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <agent.icon size={22} style={{ color: agent.color }} />
                </div>
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{agent.name} Agent</h4>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>{agent.desc}</p>
                  <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: `${agent.color}10`, color: agent.color, fontFamily: "monospace" }}>
                    {agent.model}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="section-padding" style={{ background: "var(--surface)" }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 60 }}>
            <motion.h2 variants={fadeUp} custom={0} style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, marginBottom: 16 }}>
              Everything you need to travel smarter
            </motion.h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
            {[
              { icon: Clock, title: "Plans in Seconds", desc: "All 8 agents work in parallel. Your complete plan is ready in under 10 seconds." },
              { icon: Wallet, title: "Smart Budgeting", desc: "INR-calibrated cost estimates with real Indian travel benchmarks." },
              { icon: Map, title: "Optimal Routes", desc: "Compare flights, trains, and buses with fare calendars and cheapest day alerts." },
              { icon: Hotel, title: "Perfect Hotels", desc: "AI-matched accommodations across budget, mid-range, and luxury tiers." },
              { icon: Shield, title: "Safety First", desc: "Health risk assessments, emergency contacts, and seasonal advisories." },
              { icon: Globe, title: "500+ Destinations", desc: "Explore trending spots across India and international destinations." },
              { icon: Users, title: "Group Planning", desc: "Split expenses, invite companions, and collaborate on trip plans." },
              { icon: TrendingUp, title: "Model Metrics", desc: "Transparent AI — see which models powered your plan and their performance." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                style={{ padding: 28, borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", transition: "all 0.3s", cursor: "default" }}
              >
                <f.icon size={24} style={{ color: "var(--primary)", marginBottom: 12 }} />
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h4>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POPULAR DESTINATIONS ============ */}
      <section className="section-padding gradient-mesh">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
            <div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, marginBottom: 8 }}>Popular Destinations</h2>
              <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>Trending spots loved by Indian travellers</p>
            </div>
            <Link href="/explore" className="btn-secondary" style={{ fontSize: 14, padding: "10px 20px" }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
              >
                <Link href={`/destinations/${dest.name.toLowerCase()}`} style={{ textDecoration: "none" }}>
                  <div className="card-elevated" style={{ textAlign: "center", padding: "32px 20px", cursor: "pointer" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>{dest.image}</div>
                    <h4 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{dest.name}</h4>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>{dest.state}</p>
                    <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                      <span className="tag">{dest.tag}</span>
                      <span className="tag" style={{ background: "rgba(245,158,11,0.1)", color: "var(--accent)" }}>from {dest.budget}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="section-padding" style={{ background: "var(--surface)" }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 60 }}>
            <motion.h2 variants={fadeUp} custom={0} style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, marginBottom: 16 }}>
              Loved by travelers
            </motion.h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 1000, margin: "0 auto" }}>
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="card" style={{ padding: 32 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} fill="var(--accent)" style={{ color: "var(--accent)" }} />
                  ))}
                </div>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="section-padding gradient-mesh">
        <div className="container" style={{ maxWidth: 800 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 48 }}>
            <motion.h2 variants={fadeUp} custom={0} style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, marginBottom: 16 }}>
              Frequently asked questions
            </motion.h2>
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((faq, i) => (
              <motion.details
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="card"
                style={{ cursor: "pointer" }}
              >
                <summary style={{ fontSize: 16, fontWeight: 500, listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {faq.q}
                  <ChevronDown size={18} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                </summary>
                <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 12 }}>{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div className="gradient-primary" style={{ borderRadius: "var(--radius-xl)", padding: "64px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "white", marginBottom: 16 }}>
                Ready to weave your next adventure?
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", marginBottom: 32, maxWidth: 500, margin: "0 auto 32px" }}>
                Let 8 AI agents plan your perfect trip in seconds. Free to start.
              </p>
              <Link href="/plan" className="btn-accent" style={{ fontSize: 16, padding: "16px 36px" }}>
                Start Planning Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
