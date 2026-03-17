import Link from "next/link";
import {
  Compass,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Instagram,
  Linkedin,
  Github,
} from "lucide-react";

const footerLinks = {
  product: [
    { label: "Plan a Trip", href: "/plan" },
    { label: "Explore Destinations", href: "/explore" },
    { label: "AI Assistant", href: "/assistant" },
    { label: "My Trips", href: "/trips" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Press Kit", href: "/press" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "var(--dark)", color: "white", paddingTop: 64, paddingBottom: 32 }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
                <path d="M20 2L35.59 11V29L20 38L4.41 29V11L20 2Z" stroke="#7bafd4" strokeWidth="2.5" fill="rgba(123,175,212,0.15)" />
                <path d="M12 15L20 10L28 15L20 20L12 15Z" fill="#7bafd4" opacity="0.6" />
                <path d="M12 15V25L20 30V20L12 15Z" fill="#7bafd4" opacity="0.4" />
                <path d="M28 15V25L20 30V20L28 15Z" fill="#7bafd4" opacity="0.8" />
              </svg>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 800, color: "#7bafd4" }}>GlacierRoute</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              Every thread of your journey, perfectly woven. AI-powered trip planning that understands your style.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", transition: "all 0.2s"
                }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>
                {category}
              </h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} style={{ color: "rgba(255,255,255,0.65)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
            © {new Date().getFullYear()} GlacierRoute. All rights reserved.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
            <span>Powered by</span>
            <span style={{ color: "var(--accent)", fontWeight: 500 }}>Open-Source AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
