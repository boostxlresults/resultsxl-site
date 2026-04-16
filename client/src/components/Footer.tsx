/* ============================================================
   ResultsXL Footer — SEMrush-style clean dark footer
   ============================================================ */

import { Link } from "wouter";
import { Zap, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ background: "#0D0D2B", color: "white" }}>
      <div className="container" style={{ paddingTop: "4rem", paddingBottom: "3rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "3rem",
        }} className="footer-grid">
          {/* Brand column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
              <div style={{
                width: "38px", height: "38px",
                background: "#FF642D",
                borderRadius: "9px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Zap size={20} color="white" fill="white" />
              </div>
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: "1.4rem",
                color: "white",
                letterSpacing: "-0.03em",
              }}>
                Results<span style={{ color: "#FF642D" }}>XL</span>
              </span>
            </div>
            <p style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.9375rem",
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.7,
              maxWidth: "320px",
              marginBottom: "1.5rem",
            }}>
              We rebuild outdated local business websites into high-performance, AI-search-optimized Next.js applications — at a fraction of the cost of a traditional agency.
            </p>
            <a
              href="mailto:hello@resultsxl.com"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.9375rem",
                color: "rgba(255,255,255,0.6)",
                textDecoration: "none",
              }}
            >
              <Mail size={15} />
              hello@resultsxl.com
            </a>
          </div>

          {/* Services */}
          <div>
            <h4 style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.8125rem",
              color: "white",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}>Services</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { label: "Website Rebuild Engine", href: "/#how-it-works" },
                { label: "Free Website Scanner", href: "/scan" },
                { label: "AI SEO Optimization", href: "/#how-it-works" },
                { label: "Before & After Showcase", href: "/#showcase" },
                { label: "Get Started", href: "/get-started" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.9375rem",
                    color: "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                  }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "0.8125rem",
              color: "white",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}>Company</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { label: "BoostXL Platform", href: "https://boostxl.com", external: true },
                { label: "Free AI SEO Scan", href: "https://boostxl.com/free-scan", external: true },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "4px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.9375rem",
                      color: "rgba(255,255,255,0.55)",
                      textDecoration: "none",
                    }}
                  >
                    {item.label}
                    {item.external && <ExternalLink size={12} />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          marginTop: "3rem",
          paddingTop: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.35)" }}>
            © {new Date().getFullYear()} ResultsXL (BoostXL). All rights reserved.
          </p>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.875rem", color: "rgba(255,255,255,0.35)" }}>
            Built with Next.js · TypeScript · Tailwind
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </footer>
  );
}
