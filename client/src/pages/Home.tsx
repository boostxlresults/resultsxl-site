/* =============================================================
   ResultsXL Home Page — Dark Technical Premium "The Engine Room"
   Sections: Hero, Problem, How It Works, Deliverables, Before/After, Pricing, CTA
   ============================================================= */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import {
  Zap, ArrowRight, CheckCircle, XCircle, Clock, TrendingUp,
  Shield, Globe, Smartphone, Bot, Code2, BarChart3, Star,
  ChevronRight, AlertTriangle, Gauge, FileCode, Search,
  Layers, GitBranch, ExternalLink
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ---- Asset URLs ---- */
const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663364333705/RaDGhJbVxNh92QwrbqDT8m/resultsxl-hero-bg_a3f7c5dd.png";
const BEFORE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663364333705/RaDGhJbVxNh92QwrbqDT8m/resultsxl-before-website_4e5bd471.png";
const AFTER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663364333705/RaDGhJbVxNh92QwrbqDT8m/resultsxl-after-website_0aa164ce.png";

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

/* ---- Intersection observer hook ---- */
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

/* ---- Stat counter component ---- */
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 1800, inView);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text">
        {count}{suffix}
      </div>
      <div className="text-zinc-400 text-sm mt-1">{label}</div>
    </div>
  );
}

/* ---- Problem table data ---- */
const problems = [
  { problem: "Page load times of 5–15 seconds", impact: "53% of mobile visitors abandon after 3 seconds", icon: <Clock className="w-5 h-5 text-red-400" /> },
  { problem: "No structured data or schema markup", impact: "Invisible to Google rich results and AI Overviews", icon: <FileCode className="w-5 h-5 text-red-400" /> },
  { problem: "Not optimized for AI search engines", impact: "ChatGPT, Perplexity, and Gemini can't recommend you", icon: <Bot className="w-5 h-5 text-red-400" /> },
  { problem: "Bloated page builder code", impact: "Poor Core Web Vitals tank search rankings", icon: <Gauge className="w-5 h-5 text-red-400" /> },
  { problem: "No redirect strategy", impact: "Domain authority bleeds through broken backlinks", icon: <GitBranch className="w-5 h-5 text-red-400" /> },
  { problem: "Generic template content", impact: "Fails to differentiate or convert visitors", icon: <Layers className="w-5 h-5 text-red-400" /> },
];

/* ---- How it works phases ---- */
const phases = [
  { num: "01", title: "Automated Discovery", desc: "Seven automated scans extract your site's structure, content, performance, SEO posture, and every backlink that must be preserved." },
  { num: "02", title: "Foundation Setup", desc: "A new repository is created. Three config files — business.ts, site.ts, theme.ts — define your entire site. No boilerplate, no guesswork." },
  { num: "03", title: "Content Build", desc: "Every page is rebuilt with enhanced, SEO-optimized content. Your real content, improved — not generic AI copy." },
  { num: "04", title: "Technical SEO", desc: "Schema markup on every page type. Every old URL rebuilt or 301 redirected. Dynamic sitemap, robots.txt, internal linking." },
  { num: "05", title: "AI Search Optimization", desc: "llms.txt files, JSON-LD schema, and semantic HTML make your site a first-class citizen in ChatGPT, Perplexity, and Google AI." },
  { num: "06", title: "Validation & Handoff", desc: "85+ Lighthouse mobile score, zero schema errors, all forms tested. Complete handoff documentation — you're never locked in." },
];

/* ---- Deliverables ---- */
const deliverables = [
  { icon: <Code2 className="w-5 h-5" />, title: "Next.js 15 Application", desc: "TypeScript, Tailwind CSS — the same stack used by Vercel, Netflix, and Nike." },
  { icon: <Gauge className="w-5 h-5" />, title: "Sub-2s Load Times", desc: "85–95+ Lighthouse scores on mobile. Real performance, not just a number." },
  { icon: <Search className="w-5 h-5" />, title: "Complete SEO Infrastructure", desc: "Schema markup on every page, dynamic sitemap, optimized robots.txt, strategic internal links." },
  { icon: <Bot className="w-5 h-5" />, title: "AI Search Optimization", desc: "llms.txt files, semantic HTML, comprehensive JSON-LD — ready for ChatGPT and AI Overviews." },
  { icon: <Shield className="w-5 h-5" />, title: "Zero Broken Backlinks", desc: "Every old URL rebuilt or 301 redirected. Domain authority fully preserved." },
  { icon: <Globe className="w-5 h-5" />, title: "Bilingual Support", desc: "Full English and Spanish sites with contextual language switching where applicable." },
  { icon: <Smartphone className="w-5 h-5" />, title: "Mobile-First Design", desc: "Strategic CTAs, trust signals, working contact forms. Mobile is the primary target." },
  { icon: <GitBranch className="w-5 h-5" />, title: "Auto-Deployment", desc: "Push to GitHub, site updates in seconds via Vercel edge network." },
];

/* ---- Comparison table ---- */
const comparison = [
  { feature: "Timeline", agency: "3–6 months", resultsxl: "Days to weeks" },
  { feature: "Cost", agency: "$10,000 – $50,000+", resultsxl: "A fraction of agency cost" },
  { feature: "SEO migration", agency: "Often botched or ignored", resultsxl: "Automated, zero broken links" },
  { feature: "AI search optimization", agency: "Not offered", resultsxl: "Built into every rebuild" },
  { feature: "Schema markup", agency: "Basic or missing", resultsxl: "Comprehensive, every page type" },
  { feature: "Ongoing edits", agency: "$100–200/hr retainer", resultsxl: "Fast, affordable edit tasks" },
  { feature: "Vendor lock-in", agency: "Proprietary CMS, can't leave", resultsxl: "Open-source, full code ownership" },
];

/* ---- Showcase data ---- */
const showcaseClients = [
  {
    name: "ACA Plumbing & HVAC",
    industry: "Plumbing / HVAC",
    pages: 24,
    lighthouseBefore: 38,
    lighthouseAfter: 94,
    loadBefore: "8.2s",
    loadAfter: "0.9s",
    url: "https://boostxlresults.github.io/aca-rebuild",
  },
  {
    name: "The Baum Law Firm",
    industry: "Personal Injury Law",
    pages: 31,
    lighthouseBefore: 42,
    lighthouseAfter: 96,
    loadBefore: "11.4s",
    loadAfter: "0.7s",
    url: "https://boostxlresults.github.io/baum-rebuild",
  },
  {
    name: "Old Pueblo Stucco",
    industry: "Stucco / Masonry",
    pages: 18,
    lighthouseBefore: 31,
    lighthouseAfter: 92,
    loadBefore: "9.7s",
    loadAfter: "1.1s",
    url: "https://boostxlresults.github.io/oldpueblo-rebuild",
  },
];

/* ---- Testimonials ---- */
const testimonials = [
  {
    quote: "Our old site was embarrassing. The rebuild was done in a week and our Lighthouse score went from 38 to 94. We're already ranking for terms we never showed up for before.",
    name: "Mike R.",
    role: "Owner, ACA Plumbing & HVAC",
    rating: 5,
  },
  {
    quote: "I was quoted $25,000 by a traditional agency. ResultsXL delivered a better result in days. The AI search optimization alone is worth it — ChatGPT now recommends us.",
    name: "David B.",
    role: "Partner, The Baum Law Firm",
    rating: 5,
  },
  {
    quote: "The before/after is night and day. Fast, clean, and our contact form actually works now. We've seen a 40% increase in leads since the rebuild.",
    name: "Carlos M.",
    role: "Owner, Old Pueblo Stucco",
    rating: 5,
  },
];

/* ================================================================
   HOME PAGE
   ================================================================ */
export default function Home() {
  const [scanUrl, setScanUrl] = useState("");
  const [beforeAfterIndex, setBeforeAfterIndex] = useState(0);
  const [showAfter, setShowAfter] = useState(false);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanUrl.trim()) return;
    const url = scanUrl.trim().replace(/^https?:\/\//, "");
    window.location.href = `/scan?url=${encodeURIComponent(url)}`;
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/60 via-transparent to-[#09090B]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-transparent to-[#09090B]/80" />
        </div>

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 py-24">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              ResultsXL Rebuild Engine v4.0
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Your outdated website<br />
              is <span className="gradient-text">costing you customers</span><br />
              every day.
            </h1>

            <p className="text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
              We rebuild local business websites into high-performance, AI-search-optimized Next.js applications — in days, not months, at a fraction of agency cost.
            </p>

            {/* Scanner CTA */}
            <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3 max-w-xl mb-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={scanUrl}
                  onChange={(e) => setScanUrl(e.target.value)}
                  placeholder="yourwebsite.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 whitespace-nowrap"
              >
                <Zap className="w-4 h-4" />
                Scan My Website Free
              </button>
            </form>

            <p className="text-zinc-500 text-sm">
              100% Free · No credit card · Instant results · Includes page counter
            </p>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg">
              <StatCounter value={95} suffix="+" label="Lighthouse score" />
              <StatCounter value={10} suffix="x" label="Faster load time" />
              <StatCounter value={100} suffix="%" label="AI search ready" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM SECTION ===== */}
      <section className="py-24 bg-[#09090B]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-6">
              <AlertTriangle className="w-3.5 h-3.5" />
              The Problem
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Most local businesses are running websites<br />
              <span className="gradient-text">built 5–10 years ago.</span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              WordPress, Wix, Squarespace, GoDaddy builders. They all share the same critical failures — and those failures are costing you customers every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map((item, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 hover:border-red-500/20 transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 rounded-lg bg-red-500/10 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm mb-1">{item.problem}</p>
                    <p className="text-zinc-400 text-xs leading-relaxed">{item.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-blue-600/10 to-cyan-500/10 border border-blue-500/20 max-w-3xl mx-auto text-center">
            <p className="text-zinc-300 text-lg">
              Traditional agencies charge <span className="text-white font-bold">$10,000–$50,000</span> and take <span className="text-white font-bold">3–6 months</span> to rebuild a site. Most local businesses can't justify that — so they keep running the old site, losing customers every day.
            </p>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-24 bg-[#0D0D12]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              The Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              An 8-phase workflow.<br />
              <span className="gradient-text">Consistent quality. Every time.</span>
            </h2>
            <p className="text-zinc-400 text-lg">
              The rebuild engine operates through a structured, repeatable process. Every rebuild follows the same workflow — ensuring consistent quality regardless of industry or scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phases.map((phase, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 hover:border-blue-500/20 transition-all duration-300 group relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-6xl font-black text-white/3 select-none">
                  {phase.num}
                </div>
                <div className="text-blue-400 text-xs font-mono font-semibold mb-3 tracking-wider">
                  PHASE {phase.num}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{phase.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DELIVERABLES ===== */}
      <section className="py-24 bg-[#09090B]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-6">
              <CheckCircle className="w-3.5 h-3.5" />
              What You Get
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Every rebuild delivers a<br />
              <span className="gradient-text">complete, production-ready website.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {deliverables.map((item, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 hover:border-blue-500/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:from-blue-600/30 group-hover:to-cyan-500/30 transition-all">
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BEFORE/AFTER SHOWCASE ===== */}
      <section id="showcase" className="py-24 bg-[#0D0D12]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              <TrendingUp className="w-3.5 h-3.5" />
              Real Results
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Before & After.<br />
              <span className="gradient-text">The numbers speak for themselves.</span>
            </h2>
          </div>

          {/* Client selector */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {showcaseClients.map((client, i) => (
              <button
                key={i}
                onClick={() => { setBeforeAfterIndex(i); setShowAfter(false); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  beforeAfterIndex === i
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
                    : "glass-card text-zinc-400 hover:text-white"
                }`}
              >
                {client.name}
              </button>
            ))}
          </div>

          {/* Before/After display */}
          {(() => {
            const client = showcaseClients[beforeAfterIndex];
            return (
              <div className="max-w-5xl mx-auto">
                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Lighthouse Before", value: client.lighthouseBefore, color: "text-red-400", suffix: "/100" },
                    { label: "Lighthouse After", value: client.lighthouseAfter, color: "text-green-400", suffix: "/100" },
                    { label: "Load Time Before", value: client.loadBefore, color: "text-red-400", suffix: "" },
                    { label: "Load Time After", value: client.loadAfter, color: "text-green-400", suffix: "" },
                  ].map((stat, i) => (
                    <div key={i} className="glass-card rounded-2xl p-4 text-center">
                      <div className={`text-3xl font-bold ${stat.color}`}>
                        {stat.value}{stat.suffix}
                      </div>
                      <div className="text-zinc-500 text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Image comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-card rounded-2xl overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="text-zinc-400 text-xs font-medium">BEFORE — Old Site</span>
                      <span className="ml-auto text-red-400 text-xs font-mono">{client.loadBefore} load</span>
                    </div>
                    <img src={BEFORE_IMG} alt="Before rebuild" className="w-full h-64 object-cover" />
                  </div>
                  <div className="glass-card rounded-2xl overflow-hidden gradient-border">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-zinc-400 text-xs font-medium">AFTER — ResultsXL Rebuild</span>
                      <span className="ml-auto text-green-400 text-xs font-mono">{client.loadAfter} load</span>
                    </div>
                    <img src={AFTER_IMG} alt="After rebuild" className="w-full h-64 object-cover" />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-zinc-400 text-sm">
                    <span className="text-white font-semibold">{client.name}</span> · {client.industry} · {client.pages} pages rebuilt
                  </div>
                  <a
                    href={client.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                  >
                    View Live Site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 bg-[#09090B]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What local businesses<br />
              <span className="gradient-text">are saying.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-zinc-500 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMPARISON / ECONOMICS ===== */}
      <section id="pricing" className="py-24 bg-[#0D0D12]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <BarChart3 className="w-3.5 h-3.5" />
              The Economics
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The rebuild engine changes<br />
              <span className="gradient-text">the cost structure entirely.</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-white/10">
            {/* Header */}
            <div className="grid grid-cols-3 bg-white/5 border-b border-white/10">
              <div className="p-4 text-zinc-400 text-sm font-medium"></div>
              <div className="p-4 text-center">
                <div className="text-zinc-400 text-sm font-medium flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  Traditional Agency
                </div>
              </div>
              <div className="p-4 text-center bg-gradient-to-b from-blue-600/10 to-transparent">
                <div className="text-white text-sm font-semibold flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  ResultsXL Engine
                </div>
              </div>
            </div>
            {comparison.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 border-b border-white/8 last:border-0 ${i % 2 === 0 ? "" : "bg-white/2"}`}
              >
                <div className="p-4 text-zinc-300 text-sm font-medium">{row.feature}</div>
                <div className="p-4 text-center text-red-400 text-sm">{row.agency}</div>
                <div className="p-4 text-center text-green-400 text-sm font-medium bg-gradient-to-b from-blue-600/5 to-transparent">
                  {row.resultsxl}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FREE SCANNER CTA ===== */}
      <section className="py-24 bg-[#09090B] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              Free Website Scanner
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              See exactly why your site<br />
              <span className="gradient-text">needs a rebuild.</span>
            </h2>
            <p className="text-zinc-400 text-xl mb-10 leading-relaxed">
              Our free scanner analyzes your website's performance, SEO, schema markup, AI readiness, mobile experience, and counts every content page — then shows you exactly what a rebuild would fix.
            </p>

            <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6">
              <input
                type="text"
                value={scanUrl}
                onChange={(e) => setScanUrl(e.target.value)}
                placeholder="yourwebsite.com"
                className="flex-1 px-4 py-4 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/60 transition-all text-sm"
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 whitespace-nowrap"
              >
                <Zap className="w-4 h-4" />
                Scan Free
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
              {["Performance Score", "SEO Analysis", "Schema Audit", "AI Readiness", "Page Counter", "Rebuild Report Card"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-12">
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Ready to get started? Talk to us <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
