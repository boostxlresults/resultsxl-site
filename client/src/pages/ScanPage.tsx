/* =============================================================
   ResultsXL Scan Page — Website Scanner Input + Progress
   Dark Technical Premium "The Engine Room"
   ============================================================= */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Zap, CheckCircle, Globe, Search, FileCode, Bot, Smartphone, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { scanWebsite } from "@/lib/scanner";

const SCANNER_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663364333705/RaDGhJbVxNh92QwrbqDT8m/resultsxl-scanner-bg_cd11731b.png";

const scanSteps = [
  { icon: <Globe className="w-5 h-5" />, label: "Fetching your website" },
  { icon: <Search className="w-5 h-5" />, label: "Analyzing SEO signals" },
  { icon: <FileCode className="w-5 h-5" />, label: "Auditing schema markup" },
  { icon: <Bot className="w-5 h-5" />, label: "Checking AI readiness" },
  { icon: <Smartphone className="w-5 h-5" />, label: "Testing mobile experience" },
  { icon: <Shield className="w-5 h-5" />, label: "Evaluating accessibility" },
  { icon: <Zap className="w-5 h-5" />, label: "Counting content pages" },
];

export default function ScanPage() {
  const [location, navigate] = useLocation();
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [error, setError] = useState("");

  // Check for URL param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get("url");
    if (urlParam) {
      setUrl(urlParam);
      // Auto-start scan
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
      const result = await scanWebsite(
        scanUrl,
        (step, prog) => {
          setCurrentStep(step);
          setProgress(prog);
          // Mark steps as complete based on progress
          const stepIndex = Math.floor((prog / 100) * scanSteps.length);
          setCompletedSteps(Array.from({ length: stepIndex }, (_, i) => i));
        }
      );
      
      // Store result in sessionStorage and navigate
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
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <div className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={SCANNER_BG} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/80 via-[#09090B]/60 to-[#09090B]" />
        </div>

        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 py-24">
          <div className="max-w-2xl mx-auto">
            {!scanning ? (
              /* ---- Input State ---- */
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
                  <Zap className="w-3.5 h-3.5" />
                  Free Website Rebuild Scanner
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  See exactly what's<br />
                  <span className="gradient-text">holding your site back.</span>
                </h1>

                <p className="text-zinc-400 text-xl mb-10 leading-relaxed">
                  Enter your website URL for a free analysis of performance, SEO, schema markup, AI readiness, mobile experience, and a full page count.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="yourwebsite.com"
                      className="w-full pl-11 pr-4 py-4 rounded-xl bg-white/5 border border-white/15 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/8 transition-all text-base"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Zap className="w-4 h-4" />
                    Scan Now
                  </button>
                </form>

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <p className="text-zinc-500 text-sm mb-12">
                  100% Free · No credit card · No signup required
                </p>

                {/* What we scan */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { icon: <Search className="w-4 h-4" />, label: "SEO Analysis" },
                    { icon: <FileCode className="w-4 h-4" />, label: "Schema Audit" },
                    { icon: <Bot className="w-4 h-4" />, label: "AI Readiness" },
                    { icon: <Zap className="w-4 h-4" />, label: "Performance" },
                    { icon: <Smartphone className="w-4 h-4" />, label: "Mobile Check" },
                    { icon: <Shield className="w-4 h-4" />, label: "Page Counter" },
                  ].map((item) => (
                    <div key={item.label} className="glass-card rounded-xl p-3 flex items-center gap-2.5">
                      <div className="text-blue-400">{item.icon}</div>
                      <span className="text-zinc-300 text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* ---- Scanning State ---- */
              <div className="text-center">
                {/* Animated scanner orb */}
                <div className="relative w-32 h-32 mx-auto mb-10">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
                  <div className="absolute inset-2 rounded-full border-2 border-cyan-500/40" style={{ animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite 0.3s" }} />
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-blue-400" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">Analyzing Your Website</h2>
                <p className="text-zinc-400 mb-2">
                  Running comprehensive rebuild diagnostics on{" "}
                  <span className="text-white font-medium">{url.replace(/^https?:\/\//, "")}</span>
                </p>

                {/* Progress bar */}
                <div className="max-w-md mx-auto mb-8">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-zinc-500">
                    <span>{currentStep}</span>
                    <span>{progress}%</span>
                  </div>
                </div>

                {/* Step list */}
                <div className="max-w-sm mx-auto space-y-3">
                  {scanSteps.map((step, i) => {
                    const isComplete = completedSteps.includes(i);
                    const isCurrent = !isComplete && progress > (i / scanSteps.length) * 100;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isComplete ? "glass-card opacity-60" : isCurrent ? "glass-card border-blue-500/30" : "opacity-30"
                        }`}
                      >
                        <div className={`flex-shrink-0 ${isComplete ? "text-green-400" : isCurrent ? "text-blue-400" : "text-zinc-600"}`}>
                          {isComplete ? <CheckCircle className="w-5 h-5" /> : step.icon}
                        </div>
                        <span className={`text-sm font-medium ${isComplete ? "text-zinc-400" : isCurrent ? "text-white" : "text-zinc-600"}`}>
                          {step.label}
                        </span>
                        {isCurrent && (
                          <div className="ml-auto flex gap-1">
                            {[0, 1, 2].map((j) => (
                              <div
                                key={j}
                                className="w-1.5 h-1.5 rounded-full bg-blue-400"
                                style={{ animation: `bounce 1s infinite ${j * 0.2}s` }}
                              />
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
      </div>

      {!scanning && <Footer />}
    </div>
  );
}
