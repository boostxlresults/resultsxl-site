/* ============================================================
   ResultsXL Scan Page — SEMrush-style bright white design
   ============================================================ */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Zap, CheckCircle, Globe, Search, FileCode, Bot, Smartphone, Shield, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { scanWebsite } from "@/lib/scanner";

const scanSteps = [
  { icon: <Globe size={18} />, label: "Fetching your website" },
  { icon: <Search size={18} />, label: "Analyzing SEO signals" },
  { icon: <FileCode size={18} />, label: "Auditing schema markup" },
  { icon: <Bot size={18} />, label: "Checking AI readiness" },
  { icon: <Smartphone size={18} />, label: "Testing mobile experience" },
  { icon: <Shield size={18} />, label: "Evaluating accessibility" },
  { icon: <Zap size={18} />, label: "Counting content pages via sitemap" },
];

export default function ScanPage() {
  const [, navigate] = useLocation();
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get("url");
    if (urlParam) {
      setUrl(urlParam);
      startScan(urlParam);
    }
  }, []);

  const startScan = async (scanUrl: string) => {
    if (!scanUrl.trim()) return;
    setScanning(true);
    setError("");
    setProgress(0);
    setCompletedSteps([]);

    try {
      const result = await scanWebsite(scanUrl, (step, prog) => {
        setCurrentStep(step);
        setProgress(prog);
        const stepIndex = Math.floor((prog / 100) * scanSteps.length);
        setCompletedSteps(Array.from({ length: stepIndex }, (_, i) => i));
      });

      sessionStorage.setItem("scanResult", JSON.stringify(result));
      navigate(`/results?domain=${encodeURIComponent(result.domain)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed. Please check the URL and try again.");
      setScanning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startScan(url);
  };

  return (
    <div style={{ background: "white", minHeight: "100vh", fontFamily: "Inter, sans-serif", color: "#0D0D2B" }}>
      <Navbar />

      <div style={{ minHeight: "calc(100vh - 72px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: "640px" }}>
          {!scanning ? (
            /* ---- Input State ---- */
            <div style={{ textAlign: "center" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "#FFF0EB", color: "#FF642D",
                fontWeight: 600, fontSize: "0.875rem",
                padding: "0.375rem 1rem", borderRadius: "100px",
                marginBottom: "1.75rem",
                border: "1px solid #FFD5C2",
              }}>
                <Zap size={14} fill="#FF642D" />
                Free Website Rebuild Scanner
              </div>

              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#0D0D2B",
                marginBottom: "1.25rem",
              }}>
                See exactly what's<br />
                <span style={{ color: "#FF642D" }}>holding your site back.</span>
              </h1>

              <p style={{ fontSize: "1.125rem", color: "#4A4A6A", lineHeight: 1.7, marginBottom: "2.5rem" }}>
                Enter your website URL for a free analysis of performance, SEO, schema markup, AI readiness, mobile experience, and a full page count.
              </p>

              <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
                <div style={{
                  display: "flex",
                  background: "white",
                  border: "2px solid #E5E5EA",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", paddingLeft: "1rem", color: "#9999AA", flexShrink: 0 }}>
                    <Globe size={18} />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="yourwebsite.com"
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
                    Scan Now
                  </button>
                </div>
              </form>

              {error && (
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: "10px",
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: "10px",
                  padding: "1rem 1.25rem",
                  marginBottom: "1.25rem",
                  textAlign: "left",
                  color: "#DC2626",
                  fontSize: "0.9375rem",
                }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "1px" }} />
                  {error}
                </div>
              )}

              <p style={{ fontSize: "0.875rem", color: "#9999AA", marginBottom: "3rem" }}>
                100% Free · No credit card · No signup required · Results in ~30 seconds
              </p>

              {/* What we scan */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                {[
                  { icon: <Search size={16} color="#FF642D" />, label: "SEO Analysis" },
                  { icon: <FileCode size={16} color="#FF642D" />, label: "Schema Audit" },
                  { icon: <Bot size={16} color="#FF642D" />, label: "AI Readiness" },
                  { icon: <Zap size={16} color="#FF642D" />, label: "Performance" },
                  { icon: <Smartphone size={16} color="#FF642D" />, label: "Mobile Check" },
                  { icon: <Shield size={16} color="#FF642D" />, label: "Page Counter" },
                ].map((item) => (
                  <div key={item.label} style={{
                    background: "#F7F7FA",
                    border: "1px solid #E5E5EA",
                    borderRadius: "10px",
                    padding: "0.875rem 1rem",
                    display: "flex", alignItems: "center", gap: "0.625rem",
                  }}>
                    {item.icon}
                    <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0D0D2B" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ---- Scanning State ---- */
            <div style={{ textAlign: "center" }}>
              {/* Animated scanner orb */}
              <div style={{ position: "relative", width: "100px", height: "100px", margin: "0 auto 2.5rem" }}>
                <div style={{
                  position: "absolute", inset: 0,
                  borderRadius: "50%",
                  border: "2px solid #FFD5C2",
                  animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                }} />
                <div style={{
                  position: "absolute", inset: "8px",
                  borderRadius: "50%",
                  border: "2px solid #FFB899",
                  animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite 0.3s",
                }} />
                <div style={{
                  position: "absolute", inset: "16px",
                  borderRadius: "50%",
                  background: "#FFF0EB",
                  border: "2px solid #FF642D",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Zap size={28} color="#FF642D" fill="#FF642D" />
                </div>
              </div>

              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0D0D2B", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
                Analyzing Your Website
              </h2>
              <p style={{ fontSize: "1rem", color: "#6B6B8A", marginBottom: "0.5rem" }}>
                Running comprehensive rebuild diagnostics on{" "}
                <strong style={{ color: "#0D0D2B" }}>{url.replace(/^https?:\/\//, "")}</strong>
              </p>

              {/* Progress bar */}
              <div style={{ maxWidth: "440px", margin: "1.5rem auto 2rem" }}>
                <div style={{ height: "6px", background: "#F0F0F5", borderRadius: "100px", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    background: "#FF642D",
                    borderRadius: "100px",
                    width: `${progress}%`,
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.8125rem", color: "#9999AA" }}>{currentStep}</span>
                  <span style={{ fontSize: "0.8125rem", color: "#FF642D", fontWeight: 600 }}>{progress}%</span>
                </div>
              </div>

              {/* Step list */}
              <div style={{ maxWidth: "380px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {scanSteps.map((step, i) => {
                  const isComplete = completedSteps.includes(i);
                  const isCurrent = !isComplete && progress > (i / scanSteps.length) * 100;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: "0.75rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      background: isCurrent ? "#FFF0EB" : isComplete ? "#F7F7FA" : "transparent",
                      border: isCurrent ? "1px solid #FFD5C2" : isComplete ? "1px solid #E5E5EA" : "1px solid transparent",
                      opacity: (!isComplete && !isCurrent) ? 0.35 : 1,
                      transition: "all 0.3s",
                    }}>
                      <div style={{ flexShrink: 0, color: isComplete ? "#16A34A" : isCurrent ? "#FF642D" : "#9999AA" }}>
                        {isComplete ? <CheckCircle size={18} /> : step.icon}
                      </div>
                      <span style={{ fontSize: "0.9rem", fontWeight: 500, color: isCurrent ? "#0D0D2B" : isComplete ? "#6B6B8A" : "#9999AA", flex: 1, textAlign: "left" }}>
                        {step.label}
                      </span>
                      {isCurrent && (
                        <div style={{ display: "flex", gap: "3px" }}>
                          {[0, 1, 2].map((j) => (
                            <div key={j} style={{
                              width: "5px", height: "5px", borderRadius: "50%",
                              background: "#FF642D",
                              animation: `bounce 1s infinite ${j * 0.2}s`,
                            }} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {!scanning && <Footer />}

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
