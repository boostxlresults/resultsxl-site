/* =============================================================
   ResultsXL Website Scanner — Core Scanning Logic
   
   Performs client-side analysis of a website using:
   1. Fetch + HTML parsing for SEO/schema/meta analysis
   2. CORS proxy for cross-origin requests
   3. Sitemap crawling for page counting
   4. Performance estimation from response timing
   ============================================================= */

export interface ScanCategory {
  id: string;
  name: string;
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  issues: ScanIssue[];
  passed: string[];
}

export interface ScanIssue {
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  fix: string;
}

export interface PageCountResult {
  total: number;
  content: number;
  blog: number;
  utility: number;
  urls: string[];
}

export interface ScanResult {
  url: string;
  domain: string;
  scannedAt: string;
  overallScore: number;
  overallGrade: "A" | "B" | "C" | "D" | "F";
  categories: ScanCategory[];
  pageCount: PageCountResult;
  rebuildRecommendation: RebuildRecommendation;
  techStack: string[];
  loadTimeEstimate: string;
}

export interface PricingTier {
  label: string;          // e.g. "0–19 pages"
  pricePerPage: number;   // e.g. 100
  totalPages: number;
  basePrice: number;      // pricePerPage * totalPages
  nextTierPages: number | null;  // pages needed to reach next tier (or null if already at best)
  nextTierSavings: number | null; // savings if they add pages to hit next tier
}

export interface RebuildPricing {
  totalPages: number;
  pricePerPage: number;
  tierLabel: string;
  totalCost: number;
  halfUpfront: number;
  halfOnCompletion: number;
  monthlyPayment: number | null;  // null if total < $1000
  showMonthlyOption: boolean;
  nextTierPages: number | null;
  nextTierSavings: number | null;
  hasBilingualPages: boolean;     // detected from scan
  bilingualAddonCost: number;     // 399 if no bilingual detected, 0 if already bilingual
}

export interface RebuildRecommendation {
  urgency: "critical" | "high" | "medium" | "low";
  summary: string;
  topIssues: string[];
  estimatedPages: number;
  estimatedTimeline: string;
  keyBenefits: string[];
  pricing: RebuildPricing;
}

/* ---- Utility: normalize URL ---- */
export function normalizeUrl(input: string): string {
  let url = input.trim().toLowerCase();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url.replace(/\/$/, "");
}

/* ---- Utility: extract domain ---- */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/* ---- Utility: grade from score ---- */
export function gradeFromScore(score: number): "A" | "B" | "C" | "D" | "F" {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  if (score >= 45) return "D";
  return "F";
}

/* ---- Utility: fetch via CORS proxy ---- */
async function fetchViaProxy(url: string): Promise<{ html: string; status: number; headers: Record<string, string>; loadTime: number }> {
  const start = Date.now();
  
  // Try direct fetch first (works for some sites)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "ResultsXL-Scanner/1.0" }
    });
    clearTimeout(timeout);
    const html = await res.text();
    const loadTime = Date.now() - start;
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => { headers[k] = v; });
    return { html, status: res.status, headers, loadTime };
  } catch {
    // Fall back to allorigins proxy
  }

  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeout);
    const data = await res.json();
    const loadTime = Date.now() - start;
    return {
      html: data.contents || "",
      status: data.status?.http_code || 200,
      headers: {},
      loadTime,
    };
  } catch {
    // Try corsproxy.io
  }

  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeout);
    const html = await res.text();
    const loadTime = Date.now() - start;
    return { html, status: res.status, headers: {}, loadTime };
  } catch {
    return { html: "", status: 0, headers: {}, loadTime: Date.now() - start };
  }
}

/* ---- Parse HTML into a DOM ---- */
function parseHtml(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, "text/html");
}

/* ---- Detect tech stack from HTML ---- */
function detectTechStack(html: string, headers: Record<string, string>): string[] {
  const stack: string[] = [];
  const h = html.toLowerCase();
  
  if (h.includes("wp-content") || h.includes("wp-includes")) stack.push("WordPress");
  if (h.includes("wix.com") || h.includes("wixsite")) stack.push("Wix");
  if (h.includes("squarespace")) stack.push("Squarespace");
  if (h.includes("shopify")) stack.push("Shopify");
  if (h.includes("weebly")) stack.push("Weebly");
  if (h.includes("godaddy")) stack.push("GoDaddy Website Builder");
  if (h.includes("elementor")) stack.push("Elementor");
  if (h.includes("divi")) stack.push("Divi");
  if (h.includes("next.js") || h.includes("__next")) stack.push("Next.js");
  if (h.includes("react")) stack.push("React");
  if (h.includes("jquery")) stack.push("jQuery");
  if (h.includes("bootstrap")) stack.push("Bootstrap");
  if (h.includes("gtag") || h.includes("google-analytics")) stack.push("Google Analytics");
  if (h.includes("gtm.js") || h.includes("googletagmanager")) stack.push("Google Tag Manager");
  if (h.includes("fbq(") || h.includes("facebook-pixel")) stack.push("Meta Pixel");
  
  const server = headers["server"] || headers["x-powered-by"] || "";
  if (server.toLowerCase().includes("apache")) stack.push("Apache");
  if (server.toLowerCase().includes("nginx")) stack.push("Nginx");
  if (server.toLowerCase().includes("cloudflare")) stack.push("Cloudflare");
  
  return Array.from(new Set(stack));
}

/* ---- SEO Analysis ---- */
function analyzeSEO(doc: Document, html: string): ScanCategory {
  const issues: ScanIssue[] = [];
  const passed: string[] = [];
  let score = 100;

  // Title tag
  const title = doc.querySelector("title")?.textContent?.trim() || "";
  if (!title) {
    issues.push({ severity: "critical", title: "Missing Title Tag", description: "No <title> tag found on the homepage.", fix: "Add a descriptive title tag (50-60 characters) with your primary keyword." });
    score -= 20;
  } else if (title.length < 30) {
    issues.push({ severity: "warning", title: "Title Tag Too Short", description: `Title is only ${title.length} characters. Optimal is 50-60.`, fix: "Expand your title tag to include your business name, primary service, and location." });
    score -= 8;
  } else if (title.length > 65) {
    issues.push({ severity: "warning", title: "Title Tag Too Long", description: `Title is ${title.length} characters — will be truncated in search results.`, fix: "Shorten your title to under 60 characters." });
    score -= 5;
  } else {
    passed.push("Title tag present and well-sized");
  }

  // Meta description
  const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || "";
  if (!metaDesc) {
    issues.push({ severity: "critical", title: "Missing Meta Description", description: "No meta description found. Google may generate one automatically — and it's usually bad.", fix: "Write a compelling meta description (150-160 characters) that includes your primary keyword and a call to action." });
    score -= 15;
  } else if (metaDesc.length < 100) {
    issues.push({ severity: "warning", title: "Meta Description Too Short", description: `Meta description is only ${metaDesc.length} characters.`, fix: "Expand to 150-160 characters with a clear value proposition." });
    score -= 5;
  } else {
    passed.push("Meta description present");
  }

  // H1
  const h1s = doc.querySelectorAll("h1");
  if (h1s.length === 0) {
    issues.push({ severity: "critical", title: "No H1 Tag Found", description: "Missing H1 heading — a critical on-page SEO signal.", fix: "Add exactly one H1 tag with your primary keyword and business name." });
    score -= 15;
  } else if (h1s.length > 1) {
    issues.push({ severity: "warning", title: "Multiple H1 Tags", description: `Found ${h1s.length} H1 tags. Best practice is exactly one.`, fix: "Consolidate to a single H1 tag on the homepage." });
    score -= 5;
  } else {
    passed.push("Single H1 tag present");
  }

  // Canonical
  const canonical = doc.querySelector('link[rel="canonical"]');
  if (!canonical) {
    issues.push({ severity: "warning", title: "No Canonical Tag", description: "Missing canonical URL tag — can cause duplicate content issues.", fix: "Add <link rel='canonical' href='https://yourdomain.com/' /> to every page." });
    score -= 8;
  } else {
    passed.push("Canonical tag present");
  }

  // Open Graph
  const ogTitle = doc.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    issues.push({ severity: "info", title: "Missing Open Graph Tags", description: "No OG tags found — social media shares will look generic.", fix: "Add og:title, og:description, og:image, and og:url meta tags." });
    score -= 5;
  } else {
    passed.push("Open Graph tags present");
  }

  // Image alt text
  const images = doc.querySelectorAll("img");
  const imagesWithoutAlt = Array.from(images).filter(img => !img.getAttribute("alt"));
  if (imagesWithoutAlt.length > 0) {
    issues.push({ severity: "warning", title: `${imagesWithoutAlt.length} Images Missing Alt Text`, description: "Images without alt text are invisible to search engines and screen readers.", fix: "Add descriptive alt text to every image, including your primary keyword where relevant." });
    score -= Math.min(10, imagesWithoutAlt.length * 2);
  } else if (images.length > 0) {
    passed.push("All images have alt text");
  }

  // Robots meta
  const robotsMeta = doc.querySelector('meta[name="robots"]');
  if (robotsMeta?.getAttribute("content")?.includes("noindex")) {
    issues.push({ severity: "critical", title: "Page Set to NOINDEX", description: "The homepage has a noindex directive — Google will not index it.", fix: "Remove the noindex directive immediately." });
    score -= 30;
  }

  return { id: "seo", name: "SEO", score: Math.max(0, score), grade: gradeFromScore(Math.max(0, score)), issues, passed };
}

/* ---- Schema / Structured Data Analysis ---- */
function analyzeSchema(doc: Document, html: string): ScanCategory {
  const issues: ScanIssue[] = [];
  const passed: string[] = [];
  let score = 100;

  // JSON-LD schemas
  const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  const schemaTypes: string[] = [];
  
  jsonLdScripts.forEach(script => {
    try {
      const data = JSON.parse(script.textContent || "{}");
      const type = data["@type"] || (Array.isArray(data["@graph"]) ? "Graph" : "Unknown");
      if (Array.isArray(type)) schemaTypes.push(...type);
      else schemaTypes.push(type);
    } catch { /* ignore */ }
  });

  if (jsonLdScripts.length === 0) {
    issues.push({ severity: "critical", title: "No Schema Markup Found", description: "Zero structured data on your homepage. Google's rich results, AI Overviews, and featured snippets all require schema markup.", fix: "Add LocalBusiness, Organization, and WebSite JSON-LD schema to your homepage." });
    score -= 40;
  } else {
    passed.push(`${jsonLdScripts.length} JSON-LD schema block(s) found`);
    
    // Check for LocalBusiness
    if (!schemaTypes.some(t => t.includes("LocalBusiness") || t.includes("Organization") || t.includes("Business"))) {
      issues.push({ severity: "critical", title: "No LocalBusiness Schema", description: "No LocalBusiness or Organization schema found. AI systems use this to understand and recommend your business.", fix: "Add a LocalBusiness schema with your NAP (Name, Address, Phone), hours, and service area." });
      score -= 20;
    } else {
      passed.push("LocalBusiness/Organization schema present");
    }
  }

  // FAQ schema
  if (!schemaTypes.includes("FAQPage") && !html.includes('"FAQPage"')) {
    issues.push({ severity: "warning", title: "No FAQ Schema", description: "FAQ schema unlocks rich results in Google and helps AI systems extract Q&A content.", fix: "Add FAQPage schema to your services pages and homepage." });
    score -= 10;
  } else {
    passed.push("FAQ schema present");
  }

  // BreadcrumbList
  if (!schemaTypes.includes("BreadcrumbList") && !html.includes('"BreadcrumbList"')) {
    issues.push({ severity: "info", title: "No Breadcrumb Schema", description: "Breadcrumb schema improves navigation display in search results.", fix: "Add BreadcrumbList schema to all interior pages." });
    score -= 5;
  }

  // llms.txt
  if (!html.includes("llms.txt")) {
    issues.push({ severity: "warning", title: "No llms.txt File", description: "llms.txt is the emerging standard for telling AI systems (ChatGPT, Perplexity, Gemini) who you are and what you do. Without it, AI systems may not accurately represent your business.", fix: "Create an llms.txt file at the root of your domain with structured business information." });
    score -= 15;
  } else {
    passed.push("llms.txt file present");
  }

  return { id: "schema", name: "Schema & AI Signals", score: Math.max(0, score), grade: gradeFromScore(Math.max(0, score)), issues, passed };
}

/* ---- Performance Analysis ---- */
function analyzePerformance(doc: Document, html: string, loadTime: number): ScanCategory {
  const issues: ScanIssue[] = [];
  const passed: string[] = [];
  let score = 100;

  // Load time estimation
  const htmlSize = new Blob([html]).size;
  const estimatedLoadTime = loadTime > 0 ? loadTime : htmlSize / 50000 * 1000 + 2000;
  
  if (estimatedLoadTime > 8000) {
    issues.push({ severity: "critical", title: "Extremely Slow Load Time", description: `Estimated load time: ${(estimatedLoadTime / 1000).toFixed(1)}s. 53% of mobile visitors abandon after 3 seconds.`, fix: "A complete rebuild with Next.js will bring load time to under 2 seconds." });
    score -= 40;
  } else if (estimatedLoadTime > 4000) {
    issues.push({ severity: "critical", title: "Slow Load Time", description: `Estimated load time: ${(estimatedLoadTime / 1000).toFixed(1)}s. Well above the 3-second threshold.`, fix: "Optimize images, eliminate render-blocking resources, and consider a modern framework." });
    score -= 25;
  } else if (estimatedLoadTime > 2000) {
    issues.push({ severity: "warning", title: "Load Time Needs Improvement", description: `Estimated load time: ${(estimatedLoadTime / 1000).toFixed(1)}s. Target is under 2 seconds.`, fix: "Optimize images and eliminate unused CSS/JavaScript." });
    score -= 10;
  } else {
    passed.push("Load time within acceptable range");
  }

  // Page size
  if (htmlSize > 500000) {
    issues.push({ severity: "warning", title: "Large Page Size", description: `HTML document is ${(htmlSize / 1024).toFixed(0)}KB — bloated page builder code.`, fix: "A Next.js rebuild will reduce page size by 60-80% through code splitting and tree shaking." });
    score -= 10;
  }

  // Render-blocking resources
  const blockingScripts = doc.querySelectorAll('script:not([async]):not([defer]):not([type="application/ld+json"])');
  if (blockingScripts.length > 3) {
    issues.push({ severity: "warning", title: `${blockingScripts.length} Render-Blocking Scripts`, description: "Synchronous scripts block page rendering and increase load time.", fix: "Add async or defer attributes to non-critical scripts." });
    score -= 10;
  } else {
    passed.push("Minimal render-blocking scripts");
  }

  // Image optimization
  const images = doc.querySelectorAll("img");
  const unoptimizedImages = Array.from(images).filter(img => {
    const src = img.getAttribute("src") || "";
    return src.match(/\.(jpg|jpeg|png|gif|bmp)$/i) && !src.includes("webp");
  });
  if (unoptimizedImages.length > 2) {
    issues.push({ severity: "warning", title: `${unoptimizedImages.length} Unoptimized Images`, description: "Images are not in modern WebP format — significantly increasing page weight.", fix: "Convert all images to WebP format. Next.js Image component does this automatically." });
    score -= 10;
  }

  // Viewport meta
  const viewport = doc.querySelector('meta[name="viewport"]');
  if (!viewport) {
    issues.push({ severity: "critical", title: "No Viewport Meta Tag", description: "Missing viewport tag — the site will not render correctly on mobile devices.", fix: "Add <meta name='viewport' content='width=device-width, initial-scale=1'>" });
    score -= 15;
  } else {
    passed.push("Viewport meta tag present");
  }

  return { id: "performance", name: "Performance", score: Math.max(0, score), grade: gradeFromScore(Math.max(0, score)), issues, passed };
}

/* ---- Mobile Analysis ---- */
function analyzeMobile(doc: Document, html: string): ScanCategory {
  const issues: ScanIssue[] = [];
  const passed: string[] = [];
  let score = 100;

  // Viewport
  const viewport = doc.querySelector('meta[name="viewport"]');
  if (!viewport) {
    issues.push({ severity: "critical", title: "No Mobile Viewport", description: "Site is not configured for mobile devices.", fix: "Add viewport meta tag." });
    score -= 30;
  } else {
    passed.push("Mobile viewport configured");
  }

  // Responsive indicators
  const hasMediaQueries = html.includes("@media") || html.includes("responsive");
  const hasBootstrap = html.includes("bootstrap");
  const hasTailwind = html.includes("tailwind");
  const hasFlexGrid = html.includes("flexbox") || html.includes("display:flex") || html.includes("display: flex");
  
  if (!hasMediaQueries && !hasBootstrap && !hasTailwind) {
    issues.push({ severity: "critical", title: "No Responsive Design Detected", description: "No media queries or responsive framework detected. The site likely breaks on mobile.", fix: "A complete rebuild with mobile-first design will ensure perfect rendering on all devices." });
    score -= 30;
  } else {
    passed.push("Responsive CSS detected");
  }

  // Touch targets (check for small buttons/links)
  const smallLinks = Array.from(doc.querySelectorAll("a")).filter(a => {
    const text = a.textContent?.trim() || "";
    return text.length > 0 && text.length < 3;
  });
  if (smallLinks.length > 3) {
    issues.push({ severity: "warning", title: "Potentially Small Touch Targets", description: "Several links appear to have very short text, suggesting small touch targets on mobile.", fix: "Ensure all clickable elements are at least 44x44px for mobile usability." });
    score -= 10;
  }

  // Font size
  if (html.includes("font-size: 10px") || html.includes("font-size:10px") || html.includes("font-size: 11px")) {
    issues.push({ severity: "warning", title: "Small Font Sizes Detected", description: "Text smaller than 12px is difficult to read on mobile without zooming.", fix: "Use a minimum font size of 16px for body text." });
    score -= 10;
  }

  return { id: "mobile", name: "Mobile Experience", score: Math.max(0, score), grade: gradeFromScore(Math.max(0, score)), issues, passed };
}

/* ---- Accessibility Analysis ---- */
function analyzeAccessibility(doc: Document, html: string): ScanCategory {
  const issues: ScanIssue[] = [];
  const passed: string[] = [];
  let score = 100;

  // Lang attribute
  const htmlEl = doc.querySelector("html");
  if (!htmlEl?.getAttribute("lang")) {
    issues.push({ severity: "warning", title: "Missing Language Attribute", description: "The <html> element has no lang attribute — screen readers can't determine the language.", fix: "Add lang='en' (or appropriate language code) to your <html> tag." });
    score -= 10;
  } else {
    passed.push("Language attribute present");
  }

  // Images without alt
  const images = doc.querySelectorAll("img");
  const missingAlt = Array.from(images).filter(img => !img.hasAttribute("alt"));
  if (missingAlt.length > 0) {
    issues.push({ severity: "warning", title: `${missingAlt.length} Images Missing Alt Text`, description: "Screen readers cannot describe images without alt text.", fix: "Add descriptive alt text to all images." });
    score -= Math.min(20, missingAlt.length * 3);
  } else if (images.length > 0) {
    passed.push("All images have alt text");
  }

  // Form labels
  const inputs = doc.querySelectorAll("input:not([type='hidden']):not([type='submit'])");
  const unlabeledInputs = Array.from(inputs).filter(input => {
    const id = input.getAttribute("id");
    return !id || !doc.querySelector(`label[for="${id}"]`);
  });
  if (unlabeledInputs.length > 0) {
    issues.push({ severity: "warning", title: `${unlabeledInputs.length} Form Inputs Without Labels`, description: "Form inputs without associated labels are inaccessible to screen readers.", fix: "Add <label for='inputId'> elements for all form inputs." });
    score -= Math.min(15, unlabeledInputs.length * 5);
  }

  // Skip navigation
  if (!html.includes("skip") && !html.includes("skipnav")) {
    issues.push({ severity: "info", title: "No Skip Navigation Link", description: "Skip navigation links help keyboard users bypass repetitive navigation.", fix: "Add a 'Skip to main content' link as the first element in the body." });
    score -= 5;
  }

  // Color contrast (heuristic)
  if (html.includes("color: #fff") || html.includes("color:white")) {
    passed.push("White text on dark backgrounds detected");
  }

  return { id: "accessibility", name: "Accessibility", score: Math.max(0, score), grade: gradeFromScore(Math.max(0, score)), issues, passed };
}

/* ---- AI Readiness Analysis ---- */
function analyzeAIReadiness(doc: Document, html: string): ScanCategory {
  const issues: ScanIssue[] = [];
  const passed: string[] = [];
  let score = 100;

  // llms.txt
  if (!html.includes("llms.txt")) {
    issues.push({ severity: "critical", title: "No llms.txt File", description: "llms.txt is the emerging standard for AI systems to understand your business. Without it, ChatGPT and Perplexity may not accurately represent you.", fix: "Create /llms.txt with structured business information: name, services, location, contact, and service area." });
    score -= 25;
  } else {
    passed.push("llms.txt present");
  }

  // JSON-LD schema
  const jsonLd = doc.querySelectorAll('script[type="application/ld+json"]');
  if (jsonLd.length === 0) {
    issues.push({ severity: "critical", title: "No JSON-LD Structured Data", description: "AI systems use structured data to understand and cite businesses. Without it, you're invisible to AI recommendations.", fix: "Add comprehensive JSON-LD schema: LocalBusiness, Services, FAQPage, and Review markup." });
    score -= 25;
  } else {
    passed.push("JSON-LD structured data present");
  }

  // Semantic HTML
  const hasMain = !!doc.querySelector("main");
  const hasArticle = !!doc.querySelector("article");
  const hasNav = !!doc.querySelector("nav");
  const hasHeader = !!doc.querySelector("header");
  const hasFooter = !!doc.querySelector("footer");
  const semanticCount = [hasMain, hasArticle, hasNav, hasHeader, hasFooter].filter(Boolean).length;
  
  if (semanticCount < 3) {
    issues.push({ severity: "warning", title: "Poor Semantic HTML Structure", description: "AI crawlers rely on semantic HTML to understand page structure. Missing key semantic elements.", fix: "Use proper semantic HTML5 elements: <main>, <nav>, <header>, <footer>, <article>, <section>." });
    score -= 15;
  } else {
    passed.push("Good semantic HTML structure");
  }

  // robots.txt mention
  if (!html.includes("robots.txt")) {
    issues.push({ severity: "info", title: "robots.txt Not Referenced", description: "Ensure your robots.txt properly allows AI crawlers like GPTBot and PerplexityBot.", fix: "Update robots.txt to explicitly allow GPTBot, PerplexityBot, and Google-Extended." });
    score -= 10;
  }

  // Entity clarity
  const hasAddress = !!doc.querySelector('[itemtype*="PostalAddress"]') || html.includes('"address"') || html.includes("streetAddress");
  if (!hasAddress) {
    issues.push({ severity: "warning", title: "Business Address Not Machine-Readable", description: "AI systems need machine-readable address data to recommend local businesses.", fix: "Add address information in JSON-LD LocalBusiness schema." });
    score -= 15;
  } else {
    passed.push("Address data is machine-readable");
  }

  return { id: "ai", name: "AI Search Readiness", score: Math.max(0, score), grade: gradeFromScore(Math.max(0, score)), issues, passed };
}

/* ---- Page Counter ---- */
async function countPages(baseUrl: string, html: string): Promise<PageCountResult> {
  const UTILITY_PATTERNS = [
    /privacy[-_]?policy/i, /terms[-_]?(of[-_]?service|and[-_]?conditions)?/i,
    /sitemap/i, /404/i, /not[-_]?found/i, /error/i, /login/i, /logout/i,
    /register/i, /signup/i, /sign[-_]?up/i, /cart/i, /checkout/i,
    /thank[-_]?you/i, /confirmation/i, /unsubscribe/i, /cookie[-_]?policy/i,
    /disclaimer/i, /accessibility/i, /robots\.txt/i, /feed/i, /rss/i,
    /wp[-_]?admin/i, /wp[-_]?login/i, /wp[-_]?json/i, /xmlrpc/i,
    /cdn[-_]?cgi/i, /\.xml$/i, /\.txt$/i, /\.pdf$/i,
  ];

  const BLOG_PATTERNS = [
    /\/blog\//i, /\/news\//i, /\/articles?\//i, /\/posts?\//i,
    /\/insights?\//i, /\/resources?\//i, /\/updates?\//i,
    /\d{4}\/\d{2}\//i, // date-based URLs
  ];

  const domain = new URL(baseUrl).hostname;
  const foundUrls = new Set<string>();
  const contentUrls: string[] = [];
  const blogUrls: string[] = [];
  const utilityUrls: string[] = [];

  // Parse links from homepage HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const links = Array.from(doc.querySelectorAll("a[href]"));
  
  links.forEach(link => {
    const href = link.getAttribute("href") || "";
    try {
      const url = new URL(href, baseUrl);
      if (url.hostname !== domain) return;
      const path = url.pathname;
      if (path === "/" || path === "") return;
      if (foundUrls.has(path)) return;
      foundUrls.add(path);
    } catch { /* ignore */ }
  });

  // Try to fetch sitemap
  try {
    const sitemapUrls = [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap_index.xml`,
      `${baseUrl}/sitemap/`,
    ];
    
    for (const sitemapUrl of sitemapUrls) {
      try {
        const result = await fetchViaProxy(sitemapUrl);
        if (result.html && result.html.includes("<url>")) {
          // Parse sitemap
          const urlMatches = result.html.match(/<loc>(.*?)<\/loc>/g) || [];
          urlMatches.forEach(match => {
            const url = match.replace(/<\/?loc>/g, "").trim();
            try {
              const parsed = new URL(url);
              if (parsed.hostname === domain) {
                foundUrls.add(parsed.pathname);
              }
            } catch { /* ignore */ }
          });
          break; // Found a valid sitemap
        }
      } catch { /* continue */ }
    }
  } catch { /* ignore */ }

  // Categorize URLs
  Array.from(foundUrls).forEach(path => {
    const isUtility = UTILITY_PATTERNS.some(p => p.test(path));
    const isBlog = BLOG_PATTERNS.some(p => p.test(path));
    
    if (isUtility) {
      utilityUrls.push(path);
    } else if (isBlog) {
      blogUrls.push(path);
    } else {
      contentUrls.push(path);
    }
  });

  // Add homepage to content
  contentUrls.unshift("/");

  return {
    total: foundUrls.size + 1,
    content: contentUrls.length,
    blog: blogUrls.length,
    utility: utilityUrls.length,
    urls: [...contentUrls, ...blogUrls].slice(0, 50),
  };
}

/* ---- Pricing Tiers ---- */
const PRICING_TIERS = [
  { min: 0,  max: 19,  pricePerPage: 100, label: "0–19 pages" },
  { min: 20, max: 39,  pricePerPage: 75,  label: "20–39 pages" },
  { min: 40, max: 59,  pricePerPage: 60,  label: "40–59 pages" },
  { min: 60, max: 79,  pricePerPage: 50,  label: "60–79 pages" },
  { min: 80, max: Infinity, pricePerPage: 40, label: "80+ pages" },
];

function calculatePricing(totalPages: number, hasBilingualPages: boolean): RebuildPricing {
  const tier = PRICING_TIERS.find(t => totalPages >= t.min && totalPages <= t.max) || PRICING_TIERS[PRICING_TIERS.length - 1];
  const pricePerPage = tier.pricePerPage;
  const totalCost = totalPages * pricePerPage;
  const halfUpfront = Math.round(totalCost / 2);
  const halfOnCompletion = totalCost - halfUpfront;
  const showMonthlyOption = totalCost >= 1000;
  const monthlyPayment = showMonthlyOption ? Math.round(totalCost / 12) : null;

  // Next tier: find the next tier break above current page count
  const nextTier = PRICING_TIERS.find(t => t.min > totalPages);
  let nextTierPages: number | null = null;
  let nextTierSavings: number | null = null;
  if (nextTier && tier.pricePerPage > nextTier.pricePerPage) {
    const pagesNeeded = nextTier.min - totalPages;
    const currentCost = totalPages * tier.pricePerPage;
    const newTotalPages = nextTier.min;
    const newCost = newTotalPages * nextTier.pricePerPage;
    // Savings = what they'd pay at current rate for those extra pages vs new rate for all pages
    const costAtCurrentRate = newTotalPages * tier.pricePerPage;
    nextTierPages = pagesNeeded;
    nextTierSavings = costAtCurrentRate - newCost;
  }

  const bilingualAddonCost = hasBilingualPages ? 0 : 399;

  return {
    totalPages,
    pricePerPage,
    tierLabel: tier.label,
    totalCost,
    halfUpfront,
    halfOnCompletion,
    monthlyPayment,
    showMonthlyOption,
    nextTierPages,
    nextTierSavings,
    hasBilingualPages,
    bilingualAddonCost,
  };
}

/* ---- Detect Bilingual Pages ---- */
function detectBilingual(urls: string[], html: string): boolean {
  // Check URL patterns for /es/, /en/, /fr/, etc.
  const bilingualUrlPatterns = [/\/es\//i, /\/en\//i, /\/fr\//i, /\/pt\//i, /\/es$/i, /\?lang=/i, /\/spanish/i, /\/espanol/i];
  const hasSpanishUrls = urls.some(u => bilingualUrlPatterns.some(p => p.test(u)));
  // Check HTML for hreflang attributes
  const hasHreflang = html.includes('hreflang=') || html.includes('hreflang =');
  // Check for lang switcher patterns
  const hasLangSwitcher = /lang[-_]?switch|language[-_]?select|translate/i.test(html);
  return hasSpanishUrls || hasHreflang || hasLangSwitcher;
}

/* ---- Build Rebuild Recommendation ---- */
function buildRecommendation(categories: ScanCategory[], pageCount: PageCountResult, html = ""): RebuildRecommendation {
  const avgScore = categories.reduce((sum, c) => sum + c.score, 0) / categories.length;
  const criticalIssues = categories.flatMap(c => c.issues.filter(i => i.severity === "critical"));
  const allIssues = categories.flatMap(c => c.issues);
  
  let urgency: RebuildRecommendation["urgency"];
  let summary: string;
  
  if (avgScore < 40 || criticalIssues.length >= 5) {
    urgency = "critical";
    summary = "This website has critical failures across multiple categories. It is actively losing customers and search visibility every day. An immediate rebuild is strongly recommended.";
  } else if (avgScore < 60 || criticalIssues.length >= 3) {
    urgency = "high";
    summary = "This website has significant performance and SEO deficiencies that are costing you leads. A rebuild would deliver immediate, measurable improvements in rankings and conversions.";
  } else if (avgScore < 75) {
    urgency = "medium";
    summary = "This website has notable gaps in SEO, schema markup, and AI readiness. A rebuild would substantially improve search visibility and AI discoverability.";
  } else {
    urgency = "low";
    summary = "This website performs reasonably well but has opportunities for improvement, particularly in AI search optimization and schema markup completeness.";
  }

  const topIssues = criticalIssues.slice(0, 5).map(i => i.title);
  if (topIssues.length < 3) {
    const warnings = allIssues.filter(i => i.severity === "warning").slice(0, 3 - topIssues.length);
    topIssues.push(...warnings.map(i => i.title));
  }

  // ALL content + blog pages are rebuilt — this is the full rebuild scope
  const estimatedPages = Math.max(pageCount.content + pageCount.blog, 1);
  const estimatedTimeline = estimatedPages <= 10 ? "3–5 days" : estimatedPages <= 25 ? "1–2 weeks" : "2–3 weeks";

  const keyBenefits = [
    "Sub-2-second load times (from current estimated " + (avgScore < 50 ? "8–12s" : "4–8s") + ")",
    "85–95+ Lighthouse mobile score",
    "Schema markup on every page type",
    "llms.txt AI search optimization",
    "Zero broken backlinks — full redirect map",
    `${estimatedPages} pages rebuilt and AI-SEO optimized`,
  ];

  const hasBilingual = detectBilingual(pageCount.urls, html);
  const pricing = calculatePricing(estimatedPages, hasBilingual);

  return { urgency, summary, topIssues, estimatedPages, estimatedTimeline, keyBenefits, pricing };
}

/* ================================================================
   MAIN SCAN FUNCTION
   ================================================================ */
export async function scanWebsite(
  inputUrl: string,
  onProgress: (step: string, progress: number) => void
): Promise<ScanResult> {
  const url = normalizeUrl(inputUrl);
  const domain = extractDomain(url);

  onProgress("Fetching your website...", 10);
  const { html, status, headers, loadTime } = await fetchViaProxy(url);
  
  if (!html && status === 0) {
    throw new Error(`Could not reach ${domain}. Please check the URL and try again.`);
  }

  onProgress("Parsing HTML structure...", 20);
  const doc = parseHtml(html);
  const techStack = detectTechStack(html, headers);

  onProgress("Analyzing SEO signals...", 35);
  const seoCategory = analyzeSEO(doc, html);

  onProgress("Auditing schema markup...", 50);
  const schemaCategory = analyzeSchema(doc, html);

  onProgress("Checking performance metrics...", 60);
  const performanceCategory = analyzePerformance(doc, html, loadTime);

  onProgress("Testing mobile experience...", 70);
  const mobileCategory = analyzeMobile(doc, html);

  onProgress("Evaluating accessibility...", 78);
  const accessibilityCategory = analyzeAccessibility(doc, html);

  onProgress("Checking AI search readiness...", 85);
  const aiCategory = analyzeAIReadiness(doc, html);

  onProgress("Counting all pages & blog posts...", 92);
  const pageCount = await countPages(url, html);

  onProgress("Building your report card...", 98);
  const categories = [performanceCategory, seoCategory, schemaCategory, aiCategory, mobileCategory, accessibilityCategory];
  const overallScore = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);
  const overallGrade = gradeFromScore(overallScore);
  const rebuildRecommendation = buildRecommendation(categories, pageCount, html);

  // Estimate load time for display
  const loadTimeEstimate = loadTime > 0
    ? `~${(loadTime / 1000).toFixed(1)}s`
    : techStack.some(t => ["WordPress", "Wix", "Squarespace", "GoDaddy Website Builder"].includes(t))
      ? "~6–12s (estimated)"
      : "~3–8s (estimated)";

  onProgress("Complete!", 100);

  return {
    url,
    domain,
    scannedAt: new Date().toISOString(),
    overallScore,
    overallGrade,
    categories,
    pageCount,
    rebuildRecommendation,
    techStack,
    loadTimeEstimate,
  };
}
