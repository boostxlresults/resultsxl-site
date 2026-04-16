/* ============================================================
   ResultsXL Home Page — SEMrush-style bright white design
   - Pure white / light gray backgrounds
   - Deep navy text (#0D0D2B), orange CTAs (#FF642D)
   - Inter font, large sizes (H1: 64px, H2: 48px, body: 18px)
   - Wide layout, generous whitespace
   ============================================================ */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  Zap, ArrowRight, CheckCircle, XCircle, Clock, TrendingUp,
  Shield, Globe, Smartphone, Bot, Code2, BarChart3, Star,
  AlertTriangle, Gauge, FileCode, Search, Layers, GitBranch,
  ChevronRight, ExternalLink
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ---- Counter hook ---- */
function useCountUp(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 1800, inView);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <div style={{ fontSize: "3rem", fontWeight: 800, color: "#FF642D", lineHeight: 1, fontFamily: "Inter, sans-serif", letterSpacing: "-0.03em" }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize: "0.9375rem", color: "#6B6B8A", marginTop: "0.375rem", fontFamily: "Inter, sans-serif" }}>{label}</div>
    </div>
  );
}

const problems = [
  { problem: "Page load times of 5–15 seconds", impact: "53% of mobile visitors abandon after 3 seconds", icon: <Clock size={20} color="#DC2626" /> },
  { problem: "No structured data or schema markup", impact: "Invisible to Google rich results and AI Overviews", icon: <FileCode size={20} color="#DC2626" /> },
  { problem: "Not optimized for AI search engines", impact: "ChatGPT, Perplexity, and Gemini can't recommend you", icon: <Bot size={20} color="#DC2626" /> },
  { problem: "Bloated page builder code", impact: "Poor Core Web Vitals tank search rankings", icon: <Gauge size={20} color="#DC2626" /> },
  { problem: "No redirect strategy", impact: "Domain authority bleeds through broken backlinks", icon: <GitBranch size={20} color="#DC2626" /> },
  { problem: "Generic template content", impact: "Fails to differentiate or convert visitors", icon: <Layers size={20} color="#DC2626" /> },
];

const phases = [
  { num: "01", title: "Automated Discovery", desc: "Seven automated scans extract your site's structure, content, performance, SEO posture, and every backlink that must be preserved." },
  { num: "02", title: "Foundation Setup", desc: "A new repository is created. Three config files define your entire site. No boilerplate, no guesswork." },
  { num: "03", title: "Content Build", desc: "Every page is rebuilt with enhanced, SEO-optimized content. Your real content, improved — not generic AI copy." },
  { num: "04", title: "Technical SEO", desc: "Schema markup on every page type. Every old URL rebuilt or 301 redirected. Dynamic sitemap, robots.txt, internal linking." },
  { num: "05", title: "AI Search Optimization", desc: "llms.txt files, JSON-LD schema, and semantic HTML make your site a first-class citizen in ChatGPT, Perplexity, and Google AI." },
  { num: "06", title: "Validation & Handoff", desc: "85+ Lighthouse mobile score, zero schema errors, all forms tested. Complete handoff documentation — you're never locked in." },
];

const deliverables = [
  { icon: <Code2 size={22} color="#FF642D" />, title: "Next.js 15 Application", desc: "TypeScript, Tailwind CSS — the same stack used by Vercel, Netflix, and Nike." },
  { icon: <Gauge size={22} color="#FF642D" />, title: "Sub-2s Load Times", desc: "85–95+ Lighthouse scores on mobile. Real performance, not just a number." },
  { icon: <Search size={22} color="#FF642D" />, title: "Complete SEO Infrastructure", desc: "Schema markup on every page, dynamic sitemap, optimized robots.txt, strategic internal links." },
  { icon: <Bot size={22} color="#FF642D" />, title: "AI Search Optimization", desc: "llms.txt files, semantic HTML, comprehensive JSON-LD — ready for ChatGPT and AI Overviews." },
  { icon: <Shield size={22} color="#FF642D" />, title: "Zero Broken Backlinks", desc: "Every old URL rebuilt or 301 redirected. Domain authority fully preserved." },
  { icon: <Globe size={22} color="#FF642D" />, title: "Bilingual Support", desc: "Full English and Spanish sites with contextual language switching where applicable." },
  { icon: <Smartphone size={22} color="#FF642D" />, title: "Mobile-First Design", desc: "Strategic CTAs, trust signals, working contact forms. Mobile is the primary target." },
  { icon: <GitBranch size={22} color="#FF642D" />, title: "Auto-Deployment", desc: "Push to GitHub, site updates in seconds via Vercel edge network." },
];

const comparison = [
  { feature: "Timeline", agency: "3–6 months", resultsxl: "Days to weeks" },
  { feature: "Cost", agency: "$10,000 – $50,000+", resultsxl: "A fraction of agency cost" },
  { feature: "SEO migration", agency: "Often botched or ignored", resultsxl: "Automated, zero broken links" },
  { feature: "AI search optimization", agency: "Not offered", resultsxl: "Built into every rebuild" },
  { feature: "Schema markup", agency: "Basic or missing", resultsxl: "Comprehensive, every page type" },
  { feature: "Ongoing edits", agency: "$100–200/hr retainer", resultsxl: "Fast, affordable edit tasks" },
  { feature: "Vendor lock-in", agency: "Proprietary CMS, can't leave", resultsxl: "Open-source, full code ownership" },
];

const showcaseClients = [
  { name: "ACA Plumbing & HVAC", industry: "Plumbing / HVAC", pages: 24, lighthouseBefore: 38, lighthouseAfter: 94, loadBefore: "8.2s", loadAfter: "0.9s" },
  { name: "The Baum Law Firm", industry: "Personal Injury Law", pages: 31, lighthouseBefore: 42, lighthouseAfter: 96, loadBefore: "11.4s", loadAfter: "0.7s" },
  { name: "Old Pueblo Stucco", industry: "Stucco / Masonry", pages: 18, lighthouseBefore: 31, lighthouseAfter: 92, loadBefore: "9.7s", loadAfter: "1.1s" },
];

const testimonials = [
  { quote: "Our old site was embarrassing. The rebuild was done in a week and our Lighthouse score went from 38 to 94. We're already ranking for terms we never showed up for before.", name: "Mike R.", role: "Owner, ACA Plumbing & HVAC", rating: 5 },
  { quote: "I was quoted $25,000 by a traditional agency. ResultsXL delivered a better result in days. The AI search optimization alone is worth it — ChatGPT now recommends us.", name: "David B.", role: "Partner, The Baum Law Firm", rating: 5 },
  { quote: "The before/after is night and day. Fast, clean, and our contact form actually works now. We've seen a 40% increase in leads since the rebuild.", name: "Carlos M.", role: "Owner, Old Pueblo Stucco", rating: 5 },
];

/* ================================================================
   HOME PAGE
   ================================================================ */
export default function Home() {
  const [scanUrl, setScanUrl] = useState("");
  const [beforeAfterIndex, setBeforeAfterIndex] = useState(0);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanUrl.trim()) return;
    const url = scanUrl.trim().replace(/^https?:\/\//, "");
    window.location.href = `/scan?url=${encodeURIComponent(url)}`;
  };

  return (
    <div style={{ background: "white", color: "#0D0D2B", fontFamily: "Inter, sans-serif" }}>
      <Navbar />

      {/* ===== HERO ===== */}
      <section style={{ background: "white", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <div style={{ maxWidth: "860px" }}>
            {/* Badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#FFF0EB", color: "#FF642D",
              fontWeight: 600, fontSize: "0.875rem",
              padding: "0.375rem 1rem", borderRadius: "100px",
              marginBottom: "1.75rem",
              border: "1px solid #FFD5C2",
            }}>
              <Zap size={14} fill="#FF642D" />
              Free Website Rebuild Scanner — No Credit Card Required
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "#0D0D2B",
              marginBottom: "1.5rem",
            }}>
              Your outdated website is<br />
              <span style={{ color: "#FF642D" }}>costing you customers</span><br />
              every single day.
            </h1>

            {/* Subheadline */}
            <p style={{
              fontSize: "1.25rem",
              lineHeight: 1.7,
              color: "#4A4A6A",
              maxWidth: "620px",
              marginBottom: "2.5rem",
            }}>
              ResultsXL rebuilds outdated local business websites into high-performance, AI-search-optimized Next.js applications — in days, not months, at a fraction of agency cost.
            </p>

            {/* Scanner input */}
            <form onSubmit={handleScan} style={{ marginBottom: "1.5rem" }}>
              <div style={{
                display: "flex",
                gap: "0",
                maxWidth: "580px",
                background: "white",
                border: "2px solid #E5E5EA",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                transition: "border-color 0.2s",
              }}
              onFocus={() => {}}
              >
                <div style={{ display: "flex", alignItems: "center", paddingLeft: "1rem", color: "#9999AA" }}>
                  <Globe size={18} />
                </div>
                <input
                  type="text"
                  value={scanUrl}
                  onChange={(e) => setScanUrl(e.target.value)}
                  placeholder="yourbusiness.com"
                  style={{
                    flex: 1,
                    padding: "1rem 0.75rem",
                    fontSize: "1.0625rem",
                    border: "none",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                    color: "#0D0D2B",
                    background: "transparent",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: "#FF642D",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "1rem",
                    padding: "0.875rem 1.5rem",
                    border: "none",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontFamily: "Inter, sans-serif",
                    flexShrink: 0,
                  }}
                >
                  <Zap size={16} />
                  Scan Free
                </button>
              </div>
            </form>

            <p style={{ fontSize: "0.875rem", color: "#9999AA" }}>
              100% Free · No credit card · No signup required · Results in ~30 seconds
            </p>
          </div>

          {/* Stats row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2rem",
            marginTop: "5rem",
            paddingTop: "3rem",
            borderTop: "1px solid #E5E5EA",
            maxWidth: "800px",
          }} className="stats-grid">
            <StatCounter value={150} suffix="+" label="Sites Rebuilt" />
            <StatCounter value={94} suffix="+" label="Avg Lighthouse Score" />
            <StatCounter value={87} suffix="%" label="Avg Load Time Reduction" />
            <StatCounter value={40} suffix="%" label="Avg Lead Increase" />
          </div>
        </div>
      </section>

      {/* ===== PROBLEM SECTION ===== */}
      <section style={{ background: "#F7F7FA", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <div style={{ maxWidth: "640px", marginBottom: "3.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#FEE2E2", color: "#DC2626",
              fontWeight: 600, fontSize: "0.875rem",
              padding: "0.375rem 1rem", borderRadius: "100px",
              marginBottom: "1.25rem",
            }}>
              <AlertTriangle size={14} />
              The Problem
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: "1rem", color: "#0D0D2B" }}>
              Most local business websites are quietly failing
            </h2>
            <p style={{ fontSize: "1.125rem", color: "#4A4A6A", lineHeight: 1.7 }}>
              Your website was built years ago on a page builder that made sense at the time. Today, it's a liability — slow, invisible to AI search, and losing you customers every day.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1.25rem",
          }} className="problems-grid">
            {problems.map((item, i) => (
              <div key={i} style={{
                background: "white",
                border: "1px solid #E5E5EA",
                borderRadius: "12px",
                padding: "1.5rem",
                display: "flex",
                gap: "1rem",
                alignItems: "flex-start",
              }}>
                <div style={{ flexShrink: 0, marginTop: "2px" }}>{item.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "#0D0D2B", marginBottom: "0.25rem" }}>{item.problem}</div>
                  <div style={{ fontSize: "0.9375rem", color: "#6B6B8A", lineHeight: 1.6 }}>{item.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" style={{ background: "white", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <div style={{ maxWidth: "640px", marginBottom: "3.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#FFF0EB", color: "#FF642D",
              fontWeight: 600, fontSize: "0.875rem",
              padding: "0.375rem 1rem", borderRadius: "100px",
              marginBottom: "1.25rem",
            }}>
              <Zap size={14} fill="#FF642D" />
              The Process
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: "1rem", color: "#0D0D2B" }}>
              How the Rebuild Engine works
            </h2>
            <p style={{ fontSize: "1.125rem", color: "#4A4A6A", lineHeight: 1.7 }}>
              A systematic, automated process that delivers a production-ready Next.js application in days — not months.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="phases-grid">
            {phases.map((phase, i) => (
              <div key={i} style={{
                background: "white",
                border: "1px solid #E5E5EA",
                borderRadius: "16px",
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
              }}>
                <div style={{
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  color: "#F0F0F5",
                  lineHeight: 1,
                  position: "absolute",
                  top: "1rem",
                  right: "1.25rem",
                  fontFamily: "Inter, sans-serif",
                  letterSpacing: "-0.04em",
                }}>
                  {phase.num}
                </div>
                <div style={{
                  width: "36px", height: "36px",
                  background: "#FFF0EB",
                  borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1rem",
                }}>
                  <Zap size={18} color="#FF642D" fill="#FF642D" />
                </div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0D0D2B", marginBottom: "0.625rem" }}>{phase.title}</h3>
                <p style={{ fontSize: "0.9375rem", color: "#6B6B8A", lineHeight: 1.65 }}>{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DELIVERABLES ===== */}
      <section style={{ background: "#F7F7FA", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <div style={{ maxWidth: "640px", marginBottom: "3.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#DCFCE7", color: "#16A34A",
              fontWeight: 600, fontSize: "0.875rem",
              padding: "0.375rem 1rem", borderRadius: "100px",
              marginBottom: "1.25rem",
            }}>
              <CheckCircle size={14} />
              What You Get
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: "1rem", color: "#0D0D2B" }}>
              Everything included in every rebuild
            </h2>
            <p style={{ fontSize: "1.125rem", color: "#4A4A6A", lineHeight: 1.7 }}>
              Not a template. Not a theme. A production-grade Next.js application built to the same standards as enterprise software.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem" }} className="deliverables-grid">
            {deliverables.map((item, i) => (
              <div key={i} style={{
                background: "white",
                border: "1px solid #E5E5EA",
                borderRadius: "12px",
                padding: "1.5rem",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
              >
                <div style={{ marginBottom: "0.875rem" }}>{item.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0D0D2B", marginBottom: "0.375rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#6B6B8A", lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BEFORE / AFTER ===== */}
      <section id="showcase" style={{ background: "white", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <div style={{ maxWidth: "640px", marginBottom: "3.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#DBEAFE", color: "#2563EB",
              fontWeight: 600, fontSize: "0.875rem",
              padding: "0.375rem 1rem", borderRadius: "100px",
              marginBottom: "1.25rem",
            }}>
              <TrendingUp size={14} />
              Before & After
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: "1rem", color: "#0D0D2B" }}>
              Real results from real rebuilds
            </h2>
            <p style={{ fontSize: "1.125rem", color: "#4A4A6A", lineHeight: 1.7 }}>
              These aren't cherry-picked outliers. Every rebuild delivers dramatic performance improvements.
            </p>
          </div>

          {/* Client selector tabs */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
            {showcaseClients.map((client, i) => (
              <button
                key={i}
                onClick={() => setBeforeAfterIndex(i)}
                style={{
                  padding: "0.625rem 1.25rem",
                  borderRadius: "8px",
                  border: beforeAfterIndex === i ? "2px solid #FF642D" : "2px solid #E5E5EA",
                  background: beforeAfterIndex === i ? "#FFF0EB" : "white",
                  color: beforeAfterIndex === i ? "#FF642D" : "#4A4A6A",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  cursor: "pointer",
                  fontFamily: "Inter, sans-serif",
                  transition: "all 0.15s",
                }}
              >
                {client.name}
              </button>
            ))}
          </div>

          {/* Before/After card */}
          {(() => {
            const client = showcaseClients[beforeAfterIndex];
            return (
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                background: "#F7F7FA",
                borderRadius: "20px",
                padding: "2.5rem",
                border: "1px solid #E5E5EA",
              }} className="ba-grid">
                {/* Before */}
                <div style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "2rem",
                  border: "1px solid #FECACA",
                }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    background: "#FEE2E2", color: "#DC2626",
                    fontWeight: 700, fontSize: "0.8125rem",
                    padding: "0.25rem 0.75rem", borderRadius: "100px",
                    marginBottom: "1.25rem",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    <XCircle size={12} /> Before
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0D0D2B", marginBottom: "0.25rem" }}>{client.name}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#9999AA", marginBottom: "1.5rem" }}>{client.industry}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                    {[
                      { label: "Lighthouse Score", value: `${client.lighthouseBefore}/100`, bad: true },
                      { label: "Load Time", value: client.loadBefore, bad: true },
                      { label: "Schema Markup", value: "None", bad: true },
                      { label: "AI Search Ready", value: "No", bad: true },
                    ].map((stat) => (
                      <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.9375rem", color: "#4A4A6A" }}>{stat.label}</span>
                        <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#DC2626" }}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* After */}
                <div style={{
                  background: "white",
                  borderRadius: "14px",
                  padding: "2rem",
                  border: "1px solid #BBF7D0",
                }}>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    background: "#DCFCE7", color: "#16A34A",
                    fontWeight: 700, fontSize: "0.8125rem",
                    padding: "0.25rem 0.75rem", borderRadius: "100px",
                    marginBottom: "1.25rem",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    <CheckCircle size={12} /> After Rebuild
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0D0D2B", marginBottom: "0.25rem" }}>{client.name}</h3>
                  <p style={{ fontSize: "0.875rem", color: "#9999AA", marginBottom: "1.5rem" }}>{client.pages} pages rebuilt</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                    {[
                      { label: "Lighthouse Score", value: `${client.lighthouseAfter}/100` },
                      { label: "Load Time", value: client.loadAfter },
                      { label: "Schema Markup", value: "Every page" },
                      { label: "AI Search Ready", value: "Yes" },
                    ].map((stat) => (
                      <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.9375rem", color: "#4A4A6A" }}>{stat.label}</span>
                        <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#16A34A" }}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Testimonials */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginTop: "3rem" }} className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: "#F7F7FA",
                border: "1px solid #E5E5EA",
                borderRadius: "14px",
                padding: "1.75rem",
              }}>
                <div style={{ display: "flex", gap: "3px", marginBottom: "1rem" }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} color="#FF642D" fill="#FF642D" />
                  ))}
                </div>
                <p style={{ fontSize: "0.9375rem", color: "#4A4A6A", lineHeight: 1.7, marginBottom: "1.25rem", fontStyle: "italic" }}>
                  "{t.quote}"
                </p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#0D0D2B" }}>{t.name}</div>
                  <div style={{ fontSize: "0.875rem", color: "#9999AA" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING / COMPARISON ===== */}
      <section id="pricing" style={{ background: "#F7F7FA", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container">
          <div style={{ maxWidth: "640px", marginBottom: "3.5rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#FFF0EB", color: "#FF642D",
              fontWeight: 600, fontSize: "0.875rem",
              padding: "0.375rem 1rem", borderRadius: "100px",
              marginBottom: "1.25rem",
            }}>
              <BarChart3 size={14} />
              The Economics
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.025em", marginBottom: "1rem", color: "#0D0D2B" }}>
              A fraction of what agencies charge
            </h2>
            <p style={{ fontSize: "1.125rem", color: "#4A4A6A", lineHeight: 1.7 }}>
              Traditional agencies charge $10,000–$50,000+ for a rebuild that takes months. ResultsXL delivers a better result in days — priced per page, not per project.
            </p>
          </div>

          {/* Pricing tiers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem", marginBottom: "3rem" }} className="pricing-tiers-grid">
            {[
              { range: "0–19 pages", price: "$100", unit: "per page" },
              { range: "20–39 pages", price: "$75", unit: "per page" },
              { range: "40–59 pages", price: "$60", unit: "per page" },
              { range: "60–79 pages", price: "$50", unit: "per page" },
              { range: "80+ pages", price: "$40", unit: "per page", best: true },
            ].map((tier, i) => (
              <div key={i} style={{
                background: tier.best ? "#0D0D2B" : "white",
                border: tier.best ? "2px solid #FF642D" : "1px solid #E5E5EA",
                borderRadius: "14px",
                padding: "1.5rem",
                textAlign: "center",
                position: "relative",
              }}>
                {tier.best && (
                  <div style={{
                    position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                    background: "#FF642D", color: "white",
                    fontSize: "0.75rem", fontWeight: 700,
                    padding: "0.25rem 0.75rem", borderRadius: "100px",
                    whiteSpace: "nowrap",
                  }}>Best Value</div>
                )}
                <div style={{ fontSize: "0.8125rem", color: tier.best ? "rgba(255,255,255,0.6)" : "#9999AA", marginBottom: "0.5rem", fontWeight: 500 }}>{tier.range}</div>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: tier.best ? "white" : "#0D0D2B", letterSpacing: "-0.03em", lineHeight: 1 }}>{tier.price}</div>
                <div style={{ fontSize: "0.8125rem", color: tier.best ? "rgba(255,255,255,0.5)" : "#9999AA", marginTop: "0.25rem" }}>{tier.unit}</div>
              </div>
            ))}
          </div>

          {/* Payment options */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }} className="payment-grid">
            <div style={{ background: "white", border: "1px solid #E5E5EA", borderRadius: "14px", padding: "2rem" }}>
              <div style={{ fontWeight: 700, fontSize: "1.125rem", color: "#0D0D2B", marginBottom: "0.5rem" }}>50% Upfront / 50% on Completion</div>
              <p style={{ fontSize: "0.9375rem", color: "#6B6B8A", lineHeight: 1.6 }}>Pay half to start, half when your new site is live and you're 100% satisfied.</p>
            </div>
            <div style={{ background: "white", border: "1px solid #E5E5EA", borderRadius: "14px", padding: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                <div style={{ fontWeight: 700, fontSize: "1.125rem", color: "#0D0D2B" }}>12-Month 0% Interest</div>
                <span style={{ background: "#DCFCE7", color: "#16A34A", fontSize: "0.75rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "100px" }}>For $1,000+ projects</span>
              </div>
              <p style={{ fontSize: "0.9375rem", color: "#6B6B8A", lineHeight: 1.6 }}>Spread your rebuild cost over 12 months with zero interest. No credit check required.</p>
            </div>
          </div>

          {/* Comparison table */}
          <div style={{ background: "white", border: "1px solid #E5E5EA", borderRadius: "16px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F7F7FA" }}>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.875rem", fontWeight: 700, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: "0.05em" }}>Feature</th>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "center", fontSize: "0.875rem", fontWeight: 700, color: "#6B6B8A", textTransform: "uppercase", letterSpacing: "0.05em" }}>Traditional Agency</th>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "center", fontSize: "0.875rem", fontWeight: 700, color: "#FF642D", textTransform: "uppercase", letterSpacing: "0.05em" }}>ResultsXL</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #F0F0F5" }}>
                    <td style={{ padding: "1rem 1.5rem", fontSize: "0.9375rem", fontWeight: 600, color: "#0D0D2B" }}>{row.feature}</td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9375rem", color: "#DC2626" }}>
                        <XCircle size={15} /> {row.agency}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9375rem", color: "#16A34A", fontWeight: 600 }}>
                        <CheckCircle size={15} /> {row.resultsxl}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section style={{ background: "#0D0D2B", paddingTop: "5rem", paddingBottom: "5rem" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "white", letterSpacing: "-0.03em", marginBottom: "1.25rem" }}>
            See exactly what's holding<br />your site back — for free
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 2.5rem" }}>
            Run a free scan on your website. Get a full report card with your page count, a rebuild quote, and a clear picture of what needs to change.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/scan">
              <button style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "#FF642D",
                color: "white",
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "1.0625rem",
                padding: "1rem 2rem",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
              }}>
                <Zap size={18} />
                Scan My Website Free
              </button>
            </Link>
            <Link href="/get-started">
              <button style={{
                display: "flex", alignItems: "center", gap: "8px",
                background: "transparent",
                color: "white",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: "1.0625rem",
                padding: "1rem 2rem",
                borderRadius: "10px",
                border: "2px solid rgba(255,255,255,0.3)",
                cursor: "pointer",
              }}>
                Get a Free Rebuild Scope
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .problems-grid { grid-template-columns: 1fr !important; }
          .phases-grid { grid-template-columns: 1fr !important; }
          .deliverables-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ba-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .pricing-tiers-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .payment-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .deliverables-grid { grid-template-columns: 1fr !important; }
          .pricing-tiers-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
