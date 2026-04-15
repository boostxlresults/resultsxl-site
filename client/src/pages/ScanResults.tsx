/* =============================================================
   ResultsXL Scan Results — Report Card Page
   Dark Technical Premium "The Engine Room"
   ============================================================= */

import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Zap, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp,
  ArrowRight, RefreshCw, Globe, FileCode, Bot, Smartphone, Shield,
  BarChart3, Clock, Layers, ExternalLink, DollarSign, CreditCard,
  Calendar, Languages, TrendingUp, Info, Star, ChevronRight, Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ScanResult, ScanCategory, ScanIssue, RebuildPricing } from "@/lib/scanner";
import { gradeFromScore } from "@/lib/scanner";

/* ---- Grade color helpers ---- */
function gradeColor(grade: string) {
  switch (grade) {
    case "A": return "text-green-400";
    case "B": return "text-lime-400";
    case "C": return "text-yellow-400";
    case "D": return "text-orange-400";
    default: return "text-red-400";
  }
}

function gradeBg(grade: string) {
  switch (grade) {
    case "A": return "bg-green-500/10 border-green-500/30";
    case "B": return "bg-lime-500/10 border-lime-500/30";
    case "C": return "bg-yellow-500/10 border-yellow-500/30";
    case "D": return "bg-orange-500/10 border-orange-500/30";
    default: return "bg-red-500/10 border-red-500/30";
  }
}

function severityColor(severity: string) {
  switch (severity) {
    case "critical": return "text-red-400 bg-red-500/10 border-red-500/20";
    case "warning": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    default: return "text-blue-400 bg-blue-500/10 border-blue-500/20";
  }
}

function categoryIcon(id: string) {
  switch (id) {
    case "performance": return <Zap className="w-5 h-5" />;
    case "seo": return <Globe className="w-5 h-5" />;
    case "schema": return <FileCode className="w-5 h-5" />;
    case "ai": return <Bot className="w-5 h-5" />;
    case "mobile": return <Smartphone className="w-5 h-5" />;
    case "accessibility": return <Shield className="w-5 h-5" />;
    default: return <BarChart3 className="w-5 h-5" />;
  }
}

/* ---- Score Ring SVG ---- */
function ScoreRing({ score, grade, size = 120 }: { score: number; grade: string; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = grade === "A" ? "#22C55E" : grade === "B" ? "#84CC16" : grade === "C" ? "#EAB308" : grade === "D" ? "#F97316" : "#EF4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black" style={{ color }}>{score}</span>
        <span className="text-xs text-zinc-500 font-medium">/100</span>
      </div>
    </div>
  );
}

/* ---- Category Card ---- */
function CategoryCard({ category }: { category: ScanCategory }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center gap-4 p-5 hover:bg-white/3 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${gradeBg(category.grade)}`}>
          <span className={gradeColor(category.grade)}>{categoryIcon(category.id)}</span>
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold text-sm">{category.name}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${gradeBg(category.grade)} ${gradeColor(category.grade)}`}>
              {category.grade}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[120px]">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${category.score}%`,
                  background: category.grade === "A" ? "#22C55E" : category.grade === "B" ? "#84CC16" : category.grade === "C" ? "#EAB308" : category.grade === "D" ? "#F97316" : "#EF4444"
                }}
              />
            </div>
            <span className="text-zinc-500 text-xs">{category.score}/100</span>
            {category.issues.filter(i => i.severity === "critical").length > 0 && (
              <span className="text-red-400 text-xs flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {category.issues.filter(i => i.severity === "critical").length} critical
              </span>
            )}
          </div>
        </div>
        <div className="text-zinc-500 flex-shrink-0">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/8 p-5 space-y-4">
          {/* Issues */}
          {category.issues.length > 0 && (
            <div className="space-y-3">
              {category.issues.map((issue, i) => (
                <div key={i} className={`rounded-xl p-4 border ${severityColor(issue.severity)}`}>
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${severityColor(issue.severity)}`}>
                      {issue.severity}
                    </span>
                    <span className="text-white text-sm font-semibold">{issue.title}</span>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-2">{issue.description}</p>
                  <div className="flex items-start gap-1.5">
                    <ArrowRight className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-300 text-xs leading-relaxed">{issue.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Passed checks */}
          {category.passed.length > 0 && (
            <div className="space-y-2">
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Passing Checks</p>
              {category.passed.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-zinc-400 text-xs">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ================================================================
   REBUILD QUOTE COMPONENT
   ================================================================ */
function RebuildQuote({ pricing, domain, pageCount }: { pricing: RebuildPricing; domain: string; pageCount: number }) {
  const [selectedPlan, setSelectedPlan] = useState<"split" | "monthly">("split");
  const [bilingualSelected, setBilingualSelected] = useState(false);
  const [aiSeoSelected, setAiSeoSelected] = useState(false);

  const AI_SEO_MONTHLY = 299;
  const bilingualCost = bilingualSelected ? pricing.bilingualAddonCost : 0;
  const adjustedTotal = pricing.totalCost + bilingualCost;
  const adjustedHalf = Math.round(adjustedTotal / 2);
  const adjustedMonthly = Math.round(adjustedTotal / 12);
  const showMonthly = adjustedTotal >= 1000;
  const totalMonthlyWithAiSeo = adjustedMonthly + (aiSeoSelected ? AI_SEO_MONTHLY : 0);

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="glass-card rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-500/10 border-b border-white/8 p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Your Rebuild Quote</h2>
              <p className="text-zinc-500 text-xs">{domain} · {pageCount} pages · {pricing.tierLabel} tier · ${pricing.pricePerPage}/page</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* Tier callout + next-tier nudge */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Current Tier</span>
                <span className="text-blue-400 text-xs font-semibold">{pricing.tierLabel}</span>
              </div>
              <div className="text-3xl font-black text-white">${pricing.pricePerPage}<span className="text-zinc-500 text-base font-normal">/page</span></div>
              <div className="text-zinc-400 text-sm mt-1">{pageCount} pages × ${pricing.pricePerPage} = <span className="text-white font-semibold">${pricing.totalCost.toLocaleString()}</span></div>
            </div>
            {pricing.nextTierPages !== null && pricing.nextTierSavings !== null && pricing.nextTierSavings > 0 && (
              <div className="flex-1 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Price Break Available</span>
                </div>
                <p className="text-zinc-300 text-sm">
                  Add <span className="text-white font-bold">{pricing.nextTierPages} more page{pricing.nextTierPages > 1 ? "s" : ""}</span> (we can create new blog content) to unlock the next tier and save <span className="text-amber-400 font-bold">${pricing.nextTierSavings.toLocaleString()}</span> on your total.
                </p>
              </div>
            )}
          </div>

          {/* Add-ons */}
          <div className="space-y-3">
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Optional Add-Ons</p>

            {/* Bilingual add-on */}
            {pricing.bilingualAddonCost > 0 ? (
              <button
                onClick={() => setBilingualSelected(!bilingualSelected)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                  bilingualSelected
                    ? "bg-cyan-500/10 border-cyan-500/40"
                    : "bg-white/3 border-white/8 hover:border-white/15"
                }`}
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  bilingualSelected ? "bg-cyan-500 border-cyan-500" : "border-zinc-600"
                }`}>
                  {bilingualSelected && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <Languages className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">Bilingual Site (English + Spanish)</div>
                  <div className="text-zinc-500 text-xs">Full /es/ version of every page with contextual language switching</div>
                </div>
                <div className="text-cyan-400 font-bold text-sm flex-shrink-0">+$399</div>
              </button>
            ) : (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <Languages className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-white font-semibold text-sm">Bilingual Pages Detected</div>
                  <div className="text-zinc-500 text-xs">Your site already has bilingual content — we'll rebuild all language versions at no extra charge</div>
                </div>
                <div className="text-cyan-400 font-bold text-sm flex-shrink-0">Included</div>
              </div>
            )}

            {/* BoostXL AI SEO add-on */}
            <button
              onClick={() => setAiSeoSelected(!aiSeoSelected)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                aiSeoSelected
                  ? "bg-purple-500/10 border-purple-500/40"
                  : "bg-white/3 border-white/8 hover:border-white/15"
              }`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                aiSeoSelected ? "bg-purple-500 border-purple-500" : "border-zinc-600"
              }`}>
                {aiSeoSelected && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">BoostXL AI SEO</span>
                  <span className="px-1.5 py-0.5 rounded text-purple-300 bg-purple-500/20 text-xs font-medium">Monthly</span>
                </div>
                <div className="text-zinc-500 text-xs">Ongoing AI search optimization, rank tracking, schema updates, and monthly performance reports</div>
              </div>
              <div className="text-purple-400 font-bold text-sm flex-shrink-0">+${AI_SEO_MONTHLY}/mo</div>
            </button>
          </div>

          {/* Payment options */}
          <div className="space-y-3">
            <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Payment Options</p>

            {/* 50/50 split */}
            <button
              onClick={() => setSelectedPlan("split")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                selectedPlan === "split"
                  ? "bg-blue-500/10 border-blue-500/40"
                  : "bg-white/3 border-white/8 hover:border-white/15"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedPlan === "split" ? "border-blue-500" : "border-zinc-600"
              }`}>
                {selectedPlan === "split" && <div className="w-2 h-2 rounded-full bg-blue-500" />}
              </div>
              <CreditCard className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">50% Upfront / 50% on Completion</div>
                <div className="text-zinc-500 text-xs">Pay half to start, half when your new site is ready to launch</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-white font-bold text-sm">${adjustedHalf.toLocaleString()} now</div>
                <div className="text-zinc-500 text-xs">${(adjustedTotal - adjustedHalf).toLocaleString()} on completion</div>
              </div>
            </button>

            {/* 12-month option */}
            {showMonthly && (
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                  selectedPlan === "monthly"
                    ? "bg-green-500/10 border-green-500/40"
                    : "bg-white/3 border-white/8 hover:border-white/15"
                }`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedPlan === "monthly" ? "border-green-500" : "border-zinc-600"
                }`}>
                  {selectedPlan === "monthly" && <div className="w-2 h-2 rounded-full bg-green-500" />}
                </div>
                <Calendar className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">12-Month Payment Plan</span>
                    <span className="px-1.5 py-0.5 rounded text-green-300 bg-green-500/20 text-xs font-medium">0% Interest</span>
                  </div>
                  <div className="text-zinc-500 text-xs">Spread the cost over 12 months with zero interest{aiSeoSelected ? " — combine with BoostXL AI SEO" : ""}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-green-400 font-bold text-lg">${totalMonthlyWithAiSeo.toLocaleString()}<span className="text-zinc-500 text-xs font-normal">/mo</span></div>
                  {aiSeoSelected && (
                    <div className="text-zinc-500 text-xs">${adjustedMonthly}/mo rebuild + ${AI_SEO_MONTHLY}/mo AI SEO</div>
                  )}
                </div>
              </button>
            )}
          </div>

          {/* Summary bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-600/10 to-cyan-500/10 border border-blue-500/20">
            <div className="flex-1 text-center sm:text-left">
              <div className="text-zinc-400 text-xs mb-1">Total Rebuild Investment</div>
              <div className="text-3xl font-black text-white">${adjustedTotal.toLocaleString()}</div>
              {bilingualSelected && pricing.bilingualAddonCost > 0 && (
                <div className="text-cyan-400 text-xs mt-0.5">Includes bilingual add-on (+$399)</div>
              )}
            </div>
            {selectedPlan === "split" ? (
              <div className="text-center sm:text-right">
                <div className="text-zinc-400 text-xs mb-1">Your first payment</div>
                <div className="text-2xl font-bold text-blue-400">${adjustedHalf.toLocaleString()}</div>
                <div className="text-zinc-500 text-xs">then ${(adjustedTotal - adjustedHalf).toLocaleString()} on completion</div>
              </div>
            ) : (
              <div className="text-center sm:text-right">
                <div className="text-zinc-400 text-xs mb-1">Monthly payment</div>
                <div className="text-2xl font-bold text-green-400">${totalMonthlyWithAiSeo.toLocaleString()}<span className="text-zinc-500 text-sm font-normal">/mo</span></div>
                <div className="text-zinc-500 text-xs">12 months · 0% interest</div>
              </div>
            )}
            <Link
              href={`/get-started?pages=${pageCount}&cost=${adjustedTotal}&plan=${selectedPlan}&bilingual=${bilingualSelected}&aiSeo=${aiSeoSelected}`}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg hover:shadow-blue-500/25 flex-shrink-0"
            >
              <Zap className="w-4 h-4" />
              Get Started
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SCAN RESULTS PAGE
   ================================================================ */
export default function ScanResults() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("scanResult");
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-[#09090B] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-400 mb-4">No scan results found. Please run a scan first.</p>
            <Link href="/scan" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm">
              Run a Free Scan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const urgencyColor = result.rebuildRecommendation.urgency === "critical" ? "text-red-400 bg-red-500/10 border-red-500/30"
    : result.rebuildRecommendation.urgency === "high" ? "text-orange-400 bg-orange-500/10 border-orange-500/30"
    : result.rebuildRecommendation.urgency === "medium" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
    : "text-green-400 bg-green-500/10 border-green-500/30";

  const urgencyLabel = result.rebuildRecommendation.urgency === "critical" ? "Critical — Rebuild Immediately"
    : result.rebuildRecommendation.urgency === "high" ? "High Priority Rebuild"
    : result.rebuildRecommendation.urgency === "medium" ? "Rebuild Recommended"
    : "Optimization Opportunity";

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <div className="pt-24 pb-24">
        <div className="container">
          {/* ---- Header ---- */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
              <div className="flex-1">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold mb-4 ${urgencyColor}`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {urgencyLabel}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Website Rebuild Report Card
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <Globe className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-400 text-sm">{result.domain}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-500 text-sm">
                    Scanned {new Date(result.scannedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/scan"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-zinc-300 hover:text-white text-sm font-medium transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Rescan
                </Link>
                <Link
                  href="/get-started"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  Get a Rebuild Quote
                </Link>
              </div>
            </div>

            {/* Tech stack */}
            {result.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-zinc-500 text-xs font-medium">Detected:</span>
                {result.techStack.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ---- Overall Score + Category Scores ---- */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Big score ring */}
                <div className="text-center flex-shrink-0">
                  <ScoreRing score={result.overallScore} grade={result.overallGrade} size={140} />
                  <div className="mt-3">
                    <div className={`text-2xl font-black ${gradeColor(result.overallGrade)}`}>
                      Grade {result.overallGrade}
                    </div>
                    <div className="text-zinc-500 text-xs mt-0.5">Overall Score</div>
                  </div>
                </div>

                {/* Category mini-scores */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                  {result.categories.map((cat) => (
                    <div key={cat.id} className="text-center">
                      <div className={`text-2xl font-bold ${gradeColor(cat.grade)}`}>{cat.grade}</div>
                      <div className="text-zinc-400 text-xs mt-0.5">{cat.name}</div>
                      <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${cat.score}%`,
                            background: cat.grade === "A" ? "#22C55E" : cat.grade === "B" ? "#84CC16" : cat.grade === "C" ? "#EAB308" : cat.grade === "D" ? "#F97316" : "#EF4444"
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick stats */}
                <div className="flex-shrink-0 space-y-3 min-w-[140px]">
                  <div className="glass-card rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-white">{result.pageCount.content + result.pageCount.blog}</div>
                    <div className="text-zinc-500 text-xs">Content Pages</div>
                  </div>
                  <div className="glass-card rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-orange-400">{result.loadTimeEstimate}</div>
                    <div className="text-zinc-500 text-xs">Load Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Rebuild Recommendation ---- */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className={`rounded-2xl p-6 border ${urgencyColor.split(" ").slice(1).join(" ")}`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${urgencyColor}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-white font-bold text-lg mb-2">Rebuild Recommendation</h2>
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">{result.rebuildRecommendation.summary}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-3">Top Issues to Fix</p>
                      <ul className="space-y-2">
                        {result.rebuildRecommendation.topIssues.map((issue, i) => (
                          <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                            <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-3">What a Rebuild Delivers</p>
                      <ul className="space-y-2">
                        {result.rebuildRecommendation.keyBenefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <span className="text-zinc-300 text-sm">
                        <span className="text-white font-semibold">{result.rebuildRecommendation.estimatedPages}</span> pages to rebuild
                      </span>
                    </div>
                    <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-zinc-300 text-sm">
                        <span className="text-white font-semibold">{result.rebuildRecommendation.estimatedTimeline}</span> estimated timeline
                      </span>
                    </div>
                    <Link
                      href="/get-started"
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-cyan-400 transition-all ml-auto"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Get a Free Rebuild Scope
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Page Counter ---- */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                Page Counter — Full Rebuild Scope
              </h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                  <div className="text-3xl font-bold text-blue-400">{result.pageCount.content}</div>
                  <div className="text-zinc-400 text-xs mt-1">Content Pages</div>
                  <div className="text-zinc-600 text-xs">Services, About, Home, etc.</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/15">
                  <div className="text-3xl font-bold text-cyan-400">{result.pageCount.blog}</div>
                  <div className="text-zinc-400 text-xs mt-1">Blog / News Posts</div>
                  <div className="text-zinc-600 text-xs">Articles, updates, insights</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-white/3 border border-white/8">
                  <div className="text-3xl font-bold text-zinc-400">{result.pageCount.utility}</div>
                  <div className="text-zinc-400 text-xs mt-1">Utility Pages</div>
                  <div className="text-zinc-600 text-xs">Privacy, Terms, Sitemap (excluded)</div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/10 to-cyan-500/10 border border-blue-500/20">
                <p className="text-zinc-300 text-sm">
                  <span className="text-white font-semibold">{result.rebuildRecommendation.estimatedPages} pages</span> will be rebuilt and fully AI-SEO optimized — every content page and blog post gets schema markup, enhanced content, and AI search signals. Utility pages (privacy, terms, sitemap) are excluded from rebuild pricing.
                </p>
              </div>
            </div>
          </div>

          {/* ---- Rebuild Quote / Pricing ---- */}
          <RebuildQuote pricing={result.rebuildRecommendation.pricing} domain={result.domain} pageCount={result.rebuildRecommendation.estimatedPages} />

          {/* ---- Category Detail Cards ---- */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-white font-bold text-xl mb-6">Detailed Analysis</h2>
            <div className="space-y-3">
              {result.categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>

          {/* ---- CTA ---- */}
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-500/5 pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to fix every issue on this report?
                </h2>
                <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                  The ResultsXL Rebuild Engine will address every critical and warning issue found in this scan — delivering a production-ready Next.js site in days, not months.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/get-started"
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg hover:shadow-blue-500/30"
                  >
                    <Zap className="w-4 h-4" />
                    Get My Free Rebuild Scope
                  </Link>
                  <Link
                    href="/scan"
                    className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass-card text-zinc-300 hover:text-white font-medium transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Scan Another Site
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
