/* ============================================================
   ResultsXL Scan Results — SEMrush-style bright white design
   ============================================================ */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Zap, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp,
  ArrowRight, RefreshCw, Globe, FileCode, Bot, Smartphone, Shield,
  BarChart3, Clock, Layers, DollarSign, CreditCard,
  Calendar, Languages, TrendingUp, Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { ScanResult, ScanCategory, RebuildPricing } from "@/lib/scanner";
import { gradeFromScore } from "@/lib/scanner";

/* ---- Color helpers ---- */
function gradeColorHex(grade: string) {
  switch (grade) {
    case "A": return "#16A34A";
    case "B": return "#65A30D";
    case "C": return "#CA8A04";
    case "D": return "#EA580C";
    default: return "#DC2626";
  }
}
function gradeBgStyle(grade: string): React.CSSProperties {
  const color = gradeColorHex(grade);
  return { background: color + "15", border: `1px solid ${color}40`, color };
}
function severityStyle(severity: string): React.CSSProperties {
  if (severity === "critical") return { background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" };
  if (severity === "warning") return { background: "#FFFBEB", border: "1px solid #FDE68A", color: "#B45309" };
  return { background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1D4ED8" };
}
function categoryIcon(id: string) {
  switch (id) {
    case "performance": return <Zap size={18} />;
    case "seo": return <Globe size={18} />;
    case "schema": return <FileCode size={18} />;
    case "ai": return <Bot size={18} />;
    case "mobile": return <Smartphone size={18} />;
    case "accessibility": return <Shield size={18} />;
    default: return <BarChart3 size={18} />;
  }
}

/* ---- Score Ring ---- */
function ScoreRing({ score, grade, size = 120 }: { score: number; grade: string; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = gradeColorHex(grade);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F0F0F5" strokeWidth="8" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "1.75rem", fontWeight: 900, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: "0.75rem", color: "#9999AA", fontWeight: 500 }}>/100</span>
      </div>
    </div>
  );
}

/* ---- Category Card ---- */
function CategoryCard({ category }: { category: ScanCategory }) {
  const [expanded, setExpanded] = useState(false);
  const color = gradeColorHex(category.grade);
  const criticalCount = category.issues.filter(i => i.severity === "critical").length;

  return (
    <div style={{ background: "white", border: "1px solid #E5E5EA", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <button
        style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem 1.5rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...gradeBgStyle(category.grade) }}>
          {categoryIcon(category.id)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.375rem" }}>
            <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#0D0D2B" }}>{category.name}</span>
            <span style={{ fontWeight: 800, fontSize: "0.875rem", padding: "0.125rem 0.625rem", borderRadius: "100px", ...gradeBgStyle(category.grade) }}>{category.grade}</span>
            {criticalCount > 0 && (
              <span style={{ fontSize: "0.8125rem", color: "#DC2626", display: "flex", alignItems: "center", gap: "4px" }}>
                <AlertTriangle size={12} />
                {criticalCount} critical
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ flex: 1, maxWidth: "160px", height: "6px", background: "#F0F0F5", borderRadius: "100px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${category.score}%`, background: color, borderRadius: "100px", transition: "width 1s ease" }} />
            </div>
            <span style={{ fontSize: "0.8125rem", color: "#9999AA" }}>{category.score}/100</span>
          </div>
        </div>
        <div style={{ color: "#9999AA", flexShrink: 0 }}>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {expanded && (
        <div style={{ borderTop: "1px solid #F0F0F5", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {category.issues.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {category.issues.map((issue, i) => (
                <div key={i} style={{ borderRadius: "10px", padding: "1rem", ...severityStyle(issue.severity) }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", padding: "0.125rem 0.5rem", borderRadius: "100px", ...severityStyle(issue.severity) }}>{issue.severity}</span>
                    <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#0D0D2B" }}>{issue.title}</span>
                  </div>
                  <p style={{ fontSize: "0.8125rem", color: "#4A4A6A", lineHeight: 1.6, marginBottom: "0.5rem" }}>{issue.description}</p>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "0.375rem" }}>
                    <ArrowRight size={12} color="#FF642D" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <p style={{ fontSize: "0.8125rem", color: "#FF642D", lineHeight: 1.6 }}>{issue.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {category.passed.length > 0 && (
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9999AA", marginBottom: "0.625rem" }}>Passing Checks</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                {category.passed.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#4A4A6A" }}>
                    <CheckCircle size={14} color="#16A34A" style={{ flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---- Rebuild Quote ---- */
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
    <div style={{ maxWidth: "896px", margin: "0 auto 2rem" }}>
      <div style={{ background: "white", border: "1px solid #E5E5EA", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #FFF7F4 0%, #FFF0EB 100%)", borderBottom: "1px solid #FFD5C2", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#FF642D", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: "#0D0D2B", margin: 0 }}>Your Rebuild Quote</h2>
              <p style={{ fontSize: "0.8125rem", color: "#9999AA", margin: 0 }}>{domain} · {pageCount} pages · {pricing.tierLabel} · ${pricing.pricePerPage}/page</p>
            </div>
          </div>
        </div>

        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Tier + next tier nudge */}
          <div style={{ display: "grid", gridTemplateColumns: pricing.nextTierPages !== null && pricing.nextTierSavings !== null && pricing.nextTierSavings > 0 ? "1fr 1fr" : "1fr", gap: "1rem" }}>
            <div style={{ padding: "1.25rem", borderRadius: "12px", background: "#F7F7FA", border: "1px solid #E5E5EA" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9999AA" }}>Current Tier</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FF642D" }}>{pricing.tierLabel}</span>
              </div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0D0D2B", lineHeight: 1 }}>${pricing.pricePerPage}<span style={{ fontSize: "1rem", fontWeight: 400, color: "#9999AA" }}>/page</span></div>
              <div style={{ fontSize: "0.875rem", color: "#4A4A6A", marginTop: "0.375rem" }}>
                {pageCount} pages × ${pricing.pricePerPage} = <strong style={{ color: "#0D0D2B" }}>${pricing.totalCost.toLocaleString()}</strong>
              </div>
            </div>
            {pricing.nextTierPages !== null && pricing.nextTierSavings !== null && pricing.nextTierSavings > 0 && (
              <div style={{ padding: "1.25rem", borderRadius: "12px", background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <TrendingUp size={14} color="#B45309" />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#B45309" }}>Price Break Available</span>
                </div>
                <p style={{ fontSize: "0.875rem", color: "#4A4A6A", lineHeight: 1.6, margin: 0 }}>
                  Add <strong style={{ color: "#0D0D2B" }}>{pricing.nextTierPages} more page{pricing.nextTierPages > 1 ? "s" : ""}</strong> (we can create new blog content) to unlock the next tier and save <strong style={{ color: "#B45309" }}>${pricing.nextTierSavings.toLocaleString()}</strong> on your total.
                </p>
              </div>
            )}
          </div>

          {/* Add-ons */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9999AA", marginBottom: "0.75rem" }}>Optional Add-Ons</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {/* Bilingual */}
              {pricing.bilingualAddonCost > 0 ? (
                <button onClick={() => setBilingualSelected(!bilingualSelected)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem",
                  borderRadius: "10px", border: bilingualSelected ? "2px solid #0891B2" : "1px solid #E5E5EA",
                  background: bilingualSelected ? "#ECFEFF" : "white", cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s",
                }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "4px", border: bilingualSelected ? "2px solid #0891B2" : "2px solid #D1D5DB", background: bilingualSelected ? "#0891B2" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {bilingualSelected && <CheckCircle size={12} color="white" />}
                  </div>
                  <Languages size={18} color="#0891B2" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0D0D2B" }}>Bilingual Site (English + Spanish)</div>
                    <div style={{ fontSize: "0.8125rem", color: "#9999AA" }}>Full /es/ version of every page with contextual language switching</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "#0891B2", flexShrink: 0 }}>+$399</div>
                </button>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", borderRadius: "10px", background: "#ECFEFF", border: "1px solid #A5F3FC" }}>
                  <CheckCircle size={18} color="#0891B2" style={{ flexShrink: 0 }} />
                  <Languages size={18} color="#0891B2" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0D0D2B" }}>Bilingual Pages Detected</div>
                    <div style={{ fontSize: "0.8125rem", color: "#9999AA" }}>Your site already has bilingual content — we'll rebuild all language versions at no extra charge</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "#0891B2", flexShrink: 0 }}>Included</div>
                </div>
              )}

              {/* BoostXL AI SEO */}
              <button onClick={() => setAiSeoSelected(!aiSeoSelected)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem",
                borderRadius: "10px", border: aiSeoSelected ? "2px solid #7C3AED" : "1px solid #E5E5EA",
                background: aiSeoSelected ? "#F5F3FF" : "white", cursor: "pointer", textAlign: "left",
                transition: "all 0.15s",
              }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "4px", border: aiSeoSelected ? "2px solid #7C3AED" : "2px solid #D1D5DB", background: aiSeoSelected ? "#7C3AED" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {aiSeoSelected && <CheckCircle size={12} color="white" />}
                </div>
                <Sparkles size={18} color="#7C3AED" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0D0D2B" }}>BoostXL AI SEO</span>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, padding: "0.125rem 0.5rem", borderRadius: "100px", background: "#EDE9FE", color: "#7C3AED" }}>Monthly</span>
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "#9999AA" }}>Ongoing AI search optimization, rank tracking, schema updates, and monthly performance reports</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: "0.9375rem", color: "#7C3AED", flexShrink: 0 }}>+${AI_SEO_MONTHLY}/mo</div>
              </button>
            </div>
          </div>

          {/* Payment options */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9999AA", marginBottom: "0.75rem" }}>Payment Options</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <button onClick={() => setSelectedPlan("split")} style={{
                width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem",
                borderRadius: "10px", border: selectedPlan === "split" ? "2px solid #FF642D" : "1px solid #E5E5EA",
                background: selectedPlan === "split" ? "#FFF7F4" : "white", cursor: "pointer", textAlign: "left",
                transition: "all 0.15s",
              }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: selectedPlan === "split" ? "5px solid #FF642D" : "2px solid #D1D5DB", flexShrink: 0 }} />
                <CreditCard size={18} color="#FF642D" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0D0D2B" }}>50% Upfront / 50% on Completion</div>
                  <div style={{ fontSize: "0.8125rem", color: "#9999AA" }}>Pay half to start, half when your new site is ready to launch</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: "1rem", color: "#0D0D2B" }}>${adjustedHalf.toLocaleString()} now</div>
                  <div style={{ fontSize: "0.75rem", color: "#9999AA" }}>${(adjustedTotal - adjustedHalf).toLocaleString()} on completion</div>
                </div>
              </button>

              {showMonthly && (
                <button onClick={() => setSelectedPlan("monthly")} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem",
                  borderRadius: "10px", border: selectedPlan === "monthly" ? "2px solid #16A34A" : "1px solid #E5E5EA",
                  background: selectedPlan === "monthly" ? "#F0FDF4" : "white", cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s",
                }}>
                  <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: selectedPlan === "monthly" ? "5px solid #16A34A" : "2px solid #D1D5DB", flexShrink: 0 }} />
                  <Calendar size={18} color="#16A34A" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0D0D2B" }}>12-Month Payment Plan</span>
                      <span style={{ fontSize: "0.6875rem", fontWeight: 700, padding: "0.125rem 0.5rem", borderRadius: "100px", background: "#DCFCE7", color: "#16A34A" }}>0% Interest</span>
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "#9999AA" }}>Spread the cost over 12 months with zero interest{aiSeoSelected ? " — combine with BoostXL AI SEO" : ""}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: "1.25rem", color: "#16A34A" }}>${totalMonthlyWithAiSeo.toLocaleString()}<span style={{ fontSize: "0.8125rem", fontWeight: 400, color: "#9999AA" }}>/mo</span></div>
                    {aiSeoSelected && <div style={{ fontSize: "0.75rem", color: "#9999AA" }}>${adjustedMonthly}/mo rebuild + ${AI_SEO_MONTHLY}/mo AI SEO</div>}
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Summary bar */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem", padding: "1.25rem 1.5rem", borderRadius: "12px", background: "linear-gradient(135deg, #FFF7F4 0%, #FFF0EB 100%)", border: "1px solid #FFD5C2" }}>
            <div style={{ flex: 1, minWidth: "160px" }}>
              <div style={{ fontSize: "0.75rem", color: "#9999AA", marginBottom: "0.25rem" }}>Total Rebuild Investment</div>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0D0D2B", lineHeight: 1 }}>${adjustedTotal.toLocaleString()}</div>
              {bilingualSelected && pricing.bilingualAddonCost > 0 && <div style={{ fontSize: "0.75rem", color: "#0891B2", marginTop: "0.25rem" }}>Includes bilingual add-on (+$399)</div>}
            </div>
            {selectedPlan === "split" ? (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", color: "#9999AA", marginBottom: "0.25rem" }}>Your first payment</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FF642D" }}>${adjustedHalf.toLocaleString()}</div>
                <div style={{ fontSize: "0.75rem", color: "#9999AA" }}>then ${(adjustedTotal - adjustedHalf).toLocaleString()} on completion</div>
              </div>
            ) : (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.75rem", color: "#9999AA", marginBottom: "0.25rem" }}>Monthly payment</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#16A34A" }}>${totalMonthlyWithAiSeo.toLocaleString()}<span style={{ fontSize: "0.875rem", fontWeight: 400, color: "#9999AA" }}>/mo</span></div>
                <div style={{ fontSize: "0.75rem", color: "#9999AA" }}>12 months · 0% interest</div>
              </div>
            )}
            <Link href={`/get-started?pages=${pageCount}&cost=${adjustedTotal}&plan=${selectedPlan}&bilingual=${bilingualSelected}&aiSeo=${aiSeoSelected}`}>
              <button style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.875rem 1.5rem", borderRadius: "10px",
                background: "#FF642D", color: "white",
                fontWeight: 700, fontSize: "0.9375rem",
                border: "none", cursor: "pointer", whiteSpace: "nowrap",
                fontFamily: "Inter, sans-serif",
              }}>
                <Zap size={16} />
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN SCAN RESULTS PAGE
   ================================================================ */
export default function ScanResults() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("scanResult");
    if (stored) {
      try { setResult(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid #FFD5C2", borderTopColor: "#FF642D", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{ minHeight: "100vh", background: "white", fontFamily: "Inter, sans-serif" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 1rem" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#9999AA", marginBottom: "1.5rem", fontSize: "1rem" }}>No scan results found. Please run a scan first.</p>
            <Link href="/scan">
              <button style={{ padding: "0.875rem 2rem", borderRadius: "10px", background: "#FF642D", color: "white", fontWeight: 700, fontSize: "1rem", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                Run a Free Scan
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const urgency = result.rebuildRecommendation.urgency;
  const urgencyLabel = urgency === "critical" ? "Critical — Rebuild Immediately"
    : urgency === "high" ? "High Priority Rebuild"
    : urgency === "medium" ? "Rebuild Recommended"
    : "Optimization Opportunity";
  const urgencyStyle: React.CSSProperties = urgency === "critical"
    ? { background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626" }
    : urgency === "high" ? { background: "#FFF7ED", border: "1px solid #FED7AA", color: "#EA580C" }
    : urgency === "medium" ? { background: "#FFFBEB", border: "1px solid #FDE68A", color: "#B45309" }
    : { background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#16A34A" };

  return (
    <div style={{ background: "#F7F7FA", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#0D0D2B" }}>
      <Navbar />

      <div style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        <div className="container">
          {/* ---- Header ---- */}
          <div style={{ maxWidth: "896px", margin: "0 auto 2rem" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "1rem", marginBottom: "1.25rem" }}>
              <div style={{ flex: 1, minWidth: "260px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "0.375rem 0.875rem", borderRadius: "100px", fontSize: "0.8125rem", fontWeight: 700, marginBottom: "1rem", ...urgencyStyle }}>
                  <AlertTriangle size={13} />
                  {urgencyLabel}
                </div>
                <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 900, letterSpacing: "-0.03em", color: "#0D0D2B", margin: "0 0 0.5rem" }}>
                  Website Rebuild Report Card
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <Globe size={14} color="#9999AA" />
                  <span style={{ fontSize: "0.9rem", color: "#6B6B8A" }}>{result.domain}</span>
                  <span style={{ color: "#D1D5DB" }}>·</span>
                  <span style={{ fontSize: "0.9rem", color: "#9999AA" }}>Scanned {new Date(result.scannedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                <Link href="/scan">
                  <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.125rem", borderRadius: "8px", background: "white", border: "1px solid #E5E5EA", color: "#4A4A6A", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                    <RefreshCw size={14} />
                    Rescan
                  </button>
                </Link>
                <Link href="/get-started">
                  <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.125rem", borderRadius: "8px", background: "#FF642D", color: "white", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                    <Zap size={14} />
                    Get a Rebuild Quote
                  </button>
                </Link>
              </div>
            </div>
            {result.techStack.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.8125rem", color: "#9999AA", fontWeight: 500 }}>Detected:</span>
                {result.techStack.map((tech) => (
                  <span key={tech} style={{ padding: "0.25rem 0.75rem", borderRadius: "100px", background: "white", border: "1px solid #E5E5EA", fontSize: "0.8125rem", color: "#4A4A6A", fontWeight: 500 }}>{tech}</span>
                ))}
              </div>
            )}
          </div>

          {/* ---- Overall Score + Categories ---- */}
          <div style={{ maxWidth: "896px", margin: "0 auto 1.5rem" }}>
            <div style={{ background: "white", border: "1px solid #E5E5EA", borderRadius: "16px", padding: "2rem", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2.5rem" }}>
                {/* Score ring */}
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <ScoreRing score={result.overallScore} grade={result.overallGrade} size={140} />
                  <div style={{ marginTop: "0.75rem" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: gradeColorHex(result.overallGrade) }}>Grade {result.overallGrade}</div>
                    <div style={{ fontSize: "0.75rem", color: "#9999AA", marginTop: "2px" }}>Overall Score</div>
                  </div>
                </div>

                {/* Category mini scores */}
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", minWidth: "280px" }}>
                  {result.categories.map((cat) => (
                    <div key={cat.id} style={{ textAlign: "center", padding: "0.875rem", borderRadius: "10px", background: "#F7F7FA", border: "1px solid #F0F0F5" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: 900, color: gradeColorHex(cat.grade) }}>{cat.grade}</div>
                      <div style={{ fontSize: "0.8rem", color: "#6B6B8A", marginTop: "2px", fontWeight: 500 }}>{cat.name}</div>
                      <div style={{ marginTop: "0.5rem", height: "4px", background: "#E5E5EA", borderRadius: "100px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${cat.score}%`, background: gradeColorHex(cat.grade), borderRadius: "100px" }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick stats */}
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.75rem", minWidth: "130px" }}>
                  <div style={{ padding: "0.875rem 1rem", borderRadius: "10px", background: "#F7F7FA", border: "1px solid #E5E5EA", textAlign: "center" }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#0D0D2B" }}>{result.pageCount.content + result.pageCount.blog}</div>
                    <div style={{ fontSize: "0.75rem", color: "#9999AA", marginTop: "2px" }}>Content Pages</div>
                  </div>
                  <div style={{ padding: "0.875rem 1rem", borderRadius: "10px", background: "#FFF7F4", border: "1px solid #FFD5C2", textAlign: "center" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FF642D" }}>{result.loadTimeEstimate}</div>
                    <div style={{ fontSize: "0.75rem", color: "#9999AA", marginTop: "2px" }}>Load Time</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Rebuild Recommendation ---- */}
          <div style={{ maxWidth: "896px", margin: "0 auto 1.5rem" }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "1.75rem", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", ...urgencyStyle }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...urgencyStyle }}>
                  <AlertTriangle size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: "#0D0D2B", marginBottom: "0.5rem" }}>Rebuild Recommendation</h2>
                  <p style={{ fontSize: "0.9375rem", color: "#4A4A6A", lineHeight: 1.7, marginBottom: "1.5rem" }}>{result.rebuildRecommendation.summary}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9999AA", marginBottom: "0.75rem" }}>Top Issues to Fix</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {result.rebuildRecommendation.topIssues.map((issue, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.9rem", color: "#4A4A6A" }}>
                            <XCircle size={14} color="#DC2626" style={{ marginTop: "2px", flexShrink: 0 }} />
                            {issue}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#9999AA", marginBottom: "0.75rem" }}>What a Rebuild Delivers</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {result.rebuildRecommendation.keyBenefits.map((benefit, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.9rem", color: "#4A4A6A" }}>
                            <CheckCircle size={14} color="#16A34A" style={{ marginTop: "2px", flexShrink: 0 }} />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "8px", background: "white", border: "1px solid #E5E5EA" }}>
                      <Layers size={14} color="#FF642D" />
                      <span style={{ fontSize: "0.875rem", color: "#4A4A6A" }}>
                        <strong style={{ color: "#0D0D2B" }}>{result.rebuildRecommendation.estimatedPages}</strong> pages to rebuild
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "8px", background: "white", border: "1px solid #E5E5EA" }}>
                      <Clock size={14} color="#FF642D" />
                      <span style={{ fontSize: "0.875rem", color: "#4A4A6A" }}>
                        <strong style={{ color: "#0D0D2B" }}>{result.rebuildRecommendation.estimatedTimeline}</strong> estimated timeline
                      </span>
                    </div>
                    <Link href="/get-started" style={{ marginLeft: "auto" }}>
                      <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 1.25rem", borderRadius: "8px", background: "#FF642D", color: "white", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                        <ArrowRight size={14} />
                        Get a Free Rebuild Scope
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Page Counter ---- */}
          <div style={{ maxWidth: "896px", margin: "0 auto 1.5rem" }}>
            <div style={{ background: "white", border: "1px solid #E5E5EA", borderRadius: "16px", padding: "1.75rem", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.125rem", color: "#0D0D2B", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <Layers size={20} color="#FF642D" />
                Page Counter — Full Rebuild Scope
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
                <div style={{ textAlign: "center", padding: "1.25rem", borderRadius: "12px", background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 900, color: "#1D4ED8" }}>{result.pageCount.content}</div>
                  <div style={{ fontSize: "0.875rem", color: "#4A4A6A", fontWeight: 600, marginTop: "4px" }}>Content Pages</div>
                  <div style={{ fontSize: "0.75rem", color: "#9999AA" }}>Services, About, Home, etc.</div>
                </div>
                <div style={{ textAlign: "center", padding: "1.25rem", borderRadius: "12px", background: "#ECFEFF", border: "1px solid #A5F3FC" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 900, color: "#0891B2" }}>{result.pageCount.blog}</div>
                  <div style={{ fontSize: "0.875rem", color: "#4A4A6A", fontWeight: 600, marginTop: "4px" }}>Blog / News Posts</div>
                  <div style={{ fontSize: "0.75rem", color: "#9999AA" }}>Articles, updates, insights</div>
                </div>
                <div style={{ textAlign: "center", padding: "1.25rem", borderRadius: "12px", background: "#F7F7FA", border: "1px solid #E5E5EA" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 900, color: "#9999AA" }}>{result.pageCount.utility}</div>
                  <div style={{ fontSize: "0.875rem", color: "#4A4A6A", fontWeight: 600, marginTop: "4px" }}>Utility Pages</div>
                  <div style={{ fontSize: "0.75rem", color: "#9999AA" }}>Privacy, Terms, Sitemap (excluded)</div>
                </div>
              </div>
              <div style={{ padding: "1rem 1.25rem", borderRadius: "10px", background: "#FFF7F4", border: "1px solid #FFD5C2" }}>
                <p style={{ fontSize: "0.9rem", color: "#4A4A6A", lineHeight: 1.7, margin: 0 }}>
                  <strong style={{ color: "#0D0D2B" }}>{result.rebuildRecommendation.estimatedPages} pages</strong> will be rebuilt and fully AI-SEO optimized — every content page and blog post gets schema markup, enhanced content, and AI search signals. Utility pages (privacy, terms, sitemap) are excluded from rebuild pricing.
                </p>
              </div>
            </div>
          </div>

          {/* ---- Rebuild Quote ---- */}
          <RebuildQuote pricing={result.rebuildRecommendation.pricing} domain={result.domain} pageCount={result.rebuildRecommendation.estimatedPages} />

          {/* ---- Detailed Analysis ---- */}
          <div style={{ maxWidth: "896px", margin: "0 auto 2.5rem" }}>
            <h2 style={{ fontWeight: 800, fontSize: "1.25rem", color: "#0D0D2B", marginBottom: "1rem" }}>Detailed Analysis</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {result.categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>

          {/* ---- CTA ---- */}
          <div style={{ maxWidth: "896px", margin: "0 auto" }}>
            <div style={{ background: "white", border: "1px solid #E5E5EA", borderRadius: "16px", padding: "3rem 2rem", textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 900, color: "#0D0D2B", letterSpacing: "-0.03em", marginBottom: "1rem" }}>
                Ready to fix every issue on this report?
              </h2>
              <p style={{ fontSize: "1.0625rem", color: "#6B6B8A", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 2.5rem" }}>
                The ResultsXL Rebuild Engine will address every critical and warning issue found in this scan — delivering a production-ready Next.js site in days, not months.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
                <Link href="/get-started">
                  <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2rem", borderRadius: "10px", background: "#FF642D", color: "white", fontWeight: 700, fontSize: "1.0625rem", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                    <Zap size={18} />
                    Get My Free Rebuild Scope
                  </button>
                </Link>
                <Link href="/scan">
                  <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2rem", borderRadius: "10px", background: "white", color: "#4A4A6A", fontWeight: 600, fontSize: "1.0625rem", border: "1px solid #E5E5EA", cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                    <RefreshCw size={18} />
                    Scan Another Site
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
