"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Sparkles, Bot, User, Trash2, Loader2 } from "lucide-react";

interface Message { id: string; role: "user" | "assistant"; content: string; ts: number; }

const quickPrompts = [
  "Plan a 3-day trip to Goa under ₹20,000",
  "Best time to visit Ladakh?",
  "Suggest budget-friendly hill stations near Delhi",
  "What to pack for a Kerala monsoon trip?",
  "Compare trains vs flights to Jaipur from Mumbai",
  "Is Varanasi safe for solo female travelers?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "assistant", content: "Hey! I'm GlacierRoute's AI assistant, powered by llama3.1:70b. I can help you plan trips, find destinations, compare transport options, and answer any travel questions about India. What would you like to know?", ts: Date.now() }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim(), ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "goa": "Great choice! 🏖️ For a 3-day Goa trip under ₹20,000:\n\n**Budget Breakdown:**\n• Flights: ₹5,000-7,000 (book 2 weeks early)\n• Stay: ₹3,000-5,000 (OYO/hostel near Baga)\n• Food: ₹3,000 (local shacks are amazing!)\n• Activities: ₹2,000 (water sports, Old Goa tour)\n\n**Top Tips:**\n1. Visit Oct-Mar for best weather\n2. Rent a scooter (₹300/day) — cheapest transport\n3. Eat at local Goan thali places (₹80-120/meal)\n4. North Goa for parties, South Goa for peace\n\nWant me to create a full day-by-day plan? 🌊",
        "ladakh": "**Best time for Ladakh:** 🏔️\n\n• **June-September** is ideal\n• **June-July**: Roads open, snow melting, pleasant\n• **August**: Green landscapes but brief rain spells\n• **September**: Clear skies, less crowded, best photos!\n\n⚠️ **Important:** Acclimatize 1-2 days in Leh before activities. AMS (altitude sickness) is real above 3,500m.\n\nBudget: ₹20,000-35,000 for 7 days from Delhi.",
        "default": "That's a great question! As an AI travel assistant, I'd love to help you plan this. Based on my knowledge of Indian travel:\n\n• I can help with destinations, budgets, routes, safety info, and packing lists\n• I work best with specific questions about Indian travel\n• For a full trip plan, try our **Plan Trip** feature — 8 AI agents will create a complete plan!\n\nCould you tell me more about what you're looking for? 🌍"
      };
      const key = Object.keys(responses).find(k => text.toLowerCase().includes(k)) || "default";
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: responses[key], ts: Date.now() };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div style={{ height: "calc(100vh - 72px)", display: "flex", flexDirection: "column", background: "var(--background)" }}>
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(26,122,212,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={20} style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>GlacierRoute AI</h2>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Powered by llama3.1:70b via Groq</span>
          </div>
        </div>
        <button onClick={() => setMessages([messages[0]])} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 8, borderRadius: 8 }}>
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", gap: 12, marginBottom: 20, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "assistant" && (
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(26,122,212,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}>
                    <Sparkles size={16} style={{ color: "var(--primary)" }} />
                  </div>
                )}
                <div style={{
                  padding: "12px 18px", borderRadius: 16, maxWidth: "75%", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap",
                  background: msg.role === "user" ? "var(--primary)" : "var(--surface)",
                  color: msg.role === "user" ? "white" : "var(--text-primary)",
                  border: msg.role === "assistant" ? "1px solid var(--border-light)" : "none",
                  borderTopRightRadius: msg.role === "user" ? 4 : 16,
                  borderTopLeftRadius: msg.role === "assistant" ? 4 : 16,
                }}>
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}>
                    <User size={16} style={{ color: "var(--accent)" }} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(26,122,212,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={16} style={{ color: "var(--primary)" }} />
              </div>
              <div style={{ padding: "12px 18px", borderRadius: 16, background: "var(--surface)", border: "1px solid var(--border-light)", display: "flex", gap: 4, alignItems: "center" }}>
                <Loader2 size={14} style={{ color: "var(--primary)", animation: "spin 1s linear infinite" }} />
                <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div style={{ maxWidth: 700, margin: "20px auto 0" }}>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>Try asking:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {quickPrompts.map((p) => (
                <button key={p} onClick={() => sendMessage(p)} style={{
                  padding: "8px 14px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--surface)",
                  fontSize: 13, color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)", transition: "all 0.2s"
                }}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border-light)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", gap: 10 }}>
          <input
            className="input" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask me anything about travel..."
            style={{ flex: 1 }}
          />
          <button onClick={() => sendMessage(input)} className="btn-primary" style={{ padding: "12px 20px" }}>
            <Send size={18} />
          </button>
        </div>
      </div>
      <style jsx global>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
