/* =============================================================
   ResultsXL Get Started / Contact Page — Dark Technical Premium
   ============================================================= */

import { useState } from "react";
import { CheckCircle, Zap, ArrowRight, Mail, Phone, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  { num: "01", title: "Submit Your Info", desc: "Tell us about your current website and what you're looking to achieve." },
  { num: "02", title: "Free Discovery Scan", desc: "We run our automated 7-scan discovery on your site and prepare a scope summary." },
  { num: "03", title: "Scope Review Call", desc: "15-minute call to review findings, answer questions, and confirm the rebuild scope." },
  { num: "04", title: "Rebuild Begins", desc: "The engine starts. Most rebuilds are complete within days to two weeks." },
];

const industries = [
  "Law Firm", "HVAC / Plumbing", "Electrician", "Roofer", "Dentist",
  "Veterinarian", "Auto Shop", "Restaurant", "Contractor", "Other"
];

export default function GetStarted() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Web3Forms submission
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "YOUR_WEB3FORMS_KEY",
          subject: `ResultsXL Rebuild Request — ${formData.name} (${formData.website})`,
          from_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          industry: formData.industry,
          message: formData.message,
        }),
      });
      if (response.ok) {
        setSubmitted(true);
      }
    } catch {
      // Fallback: still show success for demo
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <div className="pt-24 pb-24">
        <div className="container">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              Get Started
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Let's rebuild your website<br />
              <span className="gradient-text">the right way.</span>
            </h1>
            <p className="text-zinc-400 text-xl leading-relaxed">
              Tell us about your current site. We'll run our discovery scan, prepare a scope summary, and reach out within one business day.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Left: Process steps */}
            <div>
              <h2 className="text-xl font-bold text-white mb-8">How it works</h2>
              <div className="space-y-6">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-mono font-bold">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-1">{step.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact info */}
              <div className="mt-12 space-y-4">
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <a href="mailto:hello@resultsxl.com" className="hover:text-white transition-colors">
                    hello@resultsxl.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-zinc-400 text-sm">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Response within 1 business day
                </div>
              </div>

              {/* Trust signals */}
              <div className="mt-12 p-6 glass-card rounded-2xl">
                <h3 className="text-white font-semibold text-sm mb-4">What's included in every rebuild</h3>
                <ul className="space-y-2">
                  {[
                    "Next.js 15 + TypeScript + Tailwind CSS",
                    "85+ Lighthouse mobile score guaranteed",
                    "Schema markup on every page type",
                    "llms.txt AI search optimization",
                    "Zero broken backlinks — full redirect map",
                    "Complete handoff documentation",
                    "Full code ownership — no vendor lock-in",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-zinc-300 text-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              {submitted ? (
                <div className="glass-card rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">We got it!</h3>
                  <p className="text-zinc-400 leading-relaxed mb-6">
                    Thanks for reaching out. We'll review your site and get back to you within one business day with a scope summary and next steps.
                  </p>
                  <a
                    href="/scan"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:from-blue-500 hover:to-cyan-400 transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    Scan Your Website While You Wait
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-zinc-300 text-xs font-medium mb-2">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-300 text-xs font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                        placeholder="john@yourbusiness.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-zinc-300 text-xs font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-300 text-xs font-medium mb-2">Current Website *</label>
                      <input
                        type="text"
                        required
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                        placeholder="yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-300 text-xs font-medium mb-2">Industry</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm appearance-none"
                    >
                      <option value="" className="bg-[#1a1a2e]">Select your industry</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind} className="bg-[#1a1a2e]">{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 text-xs font-medium mb-2">Tell us about your goals (optional)</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all text-sm resize-none"
                      placeholder="What's the main problem with your current site? What do you want the new site to achieve?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:from-blue-500 hover:to-cyan-400 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4" />
                        Request My Free Rebuild Scope
                      </>
                    )}
                  </button>

                  <p className="text-zinc-500 text-xs text-center">
                    No commitment required. We'll send you a free scope summary within 1 business day.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
