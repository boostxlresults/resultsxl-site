/* =============================================================
   ResultsXL Footer — Dark Technical Premium
   ============================================================= */

import { Link } from "wouter";
import { Zap, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#06060A] border-t border-white/8">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Results</span>
                <span className="text-white">XL</span>
              </span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              We rebuild outdated local business websites into high-performance, AI-search-optimized Next.js applications — at a fraction of the cost of a traditional agency.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
              <Mail className="w-4 h-4" />
              <a href="mailto:hello@resultsxl.com" className="hover:text-white transition-colors">
                hello@resultsxl.com
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
            <ul className="space-y-3">
              {[
                { label: "Website Rebuild Engine", href: "/#how-it-works" },
                { label: "Free Website Scanner", href: "/scan" },
                { label: "AI SEO Optimization", href: "/#how-it-works" },
                { label: "Before & After Showcase", href: "/#showcase" },
                { label: "Get Started", href: "/get-started" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-zinc-400 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-3">
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
                    className="text-zinc-400 hover:text-white text-sm transition-colors flex items-center gap-1"
                  >
                    {item.label}
                    {item.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} ResultsXL (BoostXL). All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-zinc-500 text-sm">
            <span>Built with</span>
            <span className="gradient-text font-semibold">Next.js · TypeScript · Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
