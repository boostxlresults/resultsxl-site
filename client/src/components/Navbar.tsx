/* ============================================================
   ResultsXL Navbar — SEMrush-style bright white sticky nav
   - White background, deep navy text, orange CTA
   - Large, airy, easy to read
   ============================================================ */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/scan", label: "Free Scanner" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#showcase", label: "Before & After" },
  { href: "/#pricing", label: "Pricing" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location !== "/") {
        window.location.href = href;
        return;
      }
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "white",
        borderBottom: isScrolled ? "1px solid #E5E5EA" : "1px solid transparent",
        boxShadow: isScrolled ? "0 2px 16px rgba(0,0,0,0.07)" : "none",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
    >
      <div className="container">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
          {/* Logo */}
          <Link href="/">
            <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", textDecoration: "none" }}>
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
                color: "#0D0D2B",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}>
                Results<span style={{ color: "#FF642D" }}>XL</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="hidden md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("/#")) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "0.9375rem",
                  color: (location === link.href && !link.href.startsWith("/#")) ? "#FF642D" : "#3D3D5C",
                  padding: "0.5rem 0.875rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  transition: "color 0.15s, background 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "#F7F7FA";
                  el.style.color = "#FF642D";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "transparent";
                  el.style.color = (location === link.href && !link.href.startsWith("/#")) ? "#FF642D" : "#3D3D5C";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link href="/scan">
              <button style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "#FF642D",
                color: "white",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "0.9375rem",
                padding: "0.625rem 1.375rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#e5531f"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#FF642D"; }}
              >
                <Zap size={15} />
                Scan My Website Free
              </button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            style={{ padding: "8px", color: "#0D0D2B", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden" style={{ background: "white", borderTop: "1px solid #E5E5EA", padding: "1rem 1.5rem 1.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("/#")) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  } else {
                    setMobileOpen(false);
                  }
                }}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: "#0D0D2B",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                {link.label}
              </a>
            ))}
            <Link href="/scan" onClick={() => setMobileOpen(false)}>
              <button style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                width: "100%",
                background: "#FF642D",
                color: "white",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                padding: "0.875rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                marginTop: "0.75rem",
              }}>
                <Zap size={16} />
                Scan My Website Free
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
