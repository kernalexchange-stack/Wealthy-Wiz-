/**
 * SEO & Routing Utility for WealthyWiz
 * Provides full SPA route management, history synchronization,
 * dynamic meta tags, canonical links, and Schema.org JSON-LD generation
 * for Google Rich Snippets.
 */

import { CURATED_FUNDS } from '../data/fundsData';
import { FundScheme } from '../types';
import { trackPageView } from './analytics';

export type PageRoute = 'home' | 'loan-against-securities' | 'sip-calculator' | 'fund-detail';

export interface RouteState {
  route: PageRoute;
  schemeSlug?: string;
  schemeName?: string;
  schemeCode?: number;
}

export interface SeoConfig {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  schema: Record<string, any>;
}

export const SEO_CONFIGS: Record<PageRoute, SeoConfig> = {
  home: {
    title: "WealthyWiz — Smart Mutual Fund Discovery, Live NAVs, Risk Quiz & Return Calculator",
    description: "Discover India's top direct mutual funds with real-time AMFI NAVs, interactive 1M-MAX performance charts, 60-second risk profiling quiz, and mutual funds vs fixed deposit compounding calculator.",
    keywords: "mutual fund calculator, live mutual fund NAV, mutual fund vs fixed deposit, ELSS tax saving funds, how to start SIP, AMFI mutual funds India, Parag Parikh Flexi Cap, direct mutual fund plans, wealth advisor India",
    canonicalPath: "/",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://wealthywiz.online/#website",
          "url": "https://wealthywiz.online",
          "name": "WealthyWiz",
          "description": "Smart Mutual Fund Discovery, Live NAV Tracking, Investor Risk Profiling & SIP Compounding Calculator.",
          "inLanguage": "en-IN"
        },
        {
          "@type": "FinancialService",
          "@id": "https://wealthywiz.online/#organization",
          "name": "WealthyWiz",
          "url": "https://wealthywiz.online",
          "description": "Direct mutual fund research, personalized risk profiling, and wealth advisory lead generation in India.",
          "areaServed": "IN",
          "currenciesAccepted": "INR"
        }
      ]
    }
  },
  'loan-against-securities': {
    title: "Loan Against Securities (LAS) & Mutual Funds Calculator — Instant Overdraft @ 9.0% | WealthyWiz",
    description: "Pledge your Mutual Funds, Demat Shares, SGBs & Bonds for an instant overdraft credit limit starting at 9.0% p.a. Zero prepayment charges, keep earning dividends & compounding without selling securities. RBI compliant LTV.",
    keywords: "loan against securities, loan against mutual funds, LAMF calculator, LAS calculator India, overdraft against shares, pledge mutual funds CAMS KFintech, borrow against stocks, loan against sovereign gold bonds, low interest credit line against portfolio",
    canonicalPath: "/loan-against-securities",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "FinancialProduct",
          "name": "Loan Against Securities (LAS) & Mutual Funds",
          "description": "Instant digital overdraft credit limit against pledged mutual funds, listed shares, and sovereign gold bonds with interest only on utilized funds.",
          "provider": {
            "@type": "FinancialService",
            "name": "WealthyWiz",
            "url": "https://wealthywiz.online"
          },
          "annualPercentageRate": "9.0% - 10.5%",
          "feesAndCommissionsSpecification": "Zero foreclosure charges, nominal 0.5% digital processing fee.",
          "areaServed": "IN",
          "currency": "INR"
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://wealthywiz.online"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Loan Against Securities",
              "item": "https://wealthywiz.online/loan-against-securities"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is Loan Against Securities (LAS) and how does it work in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Loan Against Securities (LAS) is an overdraft credit facility where you pledge your equity mutual funds, demat listed shares, debt funds, or Sovereign Gold Bonds (SGB) as collateral. Instead of selling your investments and losing compounding growth or paying capital gains tax, you receive an instant credit line and pay interest only on the amount you withdraw."
              }
            },
            {
              "@type": "Question",
              "name": "What is the maximum Loan-to-Value (LTV) ratio allowed for securities by RBI?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Under Reserve Bank of India (RBI) prudential guidelines, investors can avail up to 50% LTV for equity shares and equity mutual funds, up to 65% for hybrid/balanced funds, and up to 80% for debt mutual funds and Sovereign Gold Bonds."
              }
            },
            {
              "@type": "Question",
              "name": "Do I still earn dividends and NAV growth while my securities are pledged?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes! You retain 100% economic ownership of your portfolio. All mutual fund NAV compounding, corporate actions, stock splits, bonuses, and cash dividends continue to accrue directly to you."
              }
            }
          ]
        }
      ]
    }
  },
  'sip-calculator': {
    title: "SIP Calculator — Systematic Investment Plan Wealth & Returns Calculator with Step-Up | WealthyWiz",
    description: "Free advanced SIP Calculator for Indian mutual funds with annual Step-Up top-up option and inflation adjustment. Calculate total wealth gain, compounding growth schedule, and plan ₹1 Crore retirement corpus.",
    keywords: "SIP calculator, step up sip calculator, systematic investment plan calculator India, mutual fund return calculator, sip vs lumpsum, inflation adjusted sip calculator, how much to invest for 1 crore, mutual fund compounding chart",
    canonicalPath: "/sip-calculator",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "name": "WealthyWiz Advanced SIP & Step-Up Compounding Calculator",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "All modern web browsers",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          },
          "description": "Interactive Systematic Investment Plan (SIP) calculator with annual Step-Up %, inflation-adjusted real purchasing power, and year-by-year compounding growth schedule."
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://wealthywiz.online"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "SIP Calculator",
              "item": "https://wealthywiz.online/sip-calculator"
            }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is a Systematic Investment Plan (SIP) and how is future value calculated?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A Systematic Investment Plan (SIP) is a disciplined method of investing fixed sums monthly into mutual funds. Future value is computed using the monthly compound interest formula: M = P × ({[1 + i]^n - 1} / i) × (1 + i), where P is the periodic investment, i is the periodic interest rate, and n is the total number of payments."
              }
            },
            {
              "@type": "Question",
              "name": "What is a Step-Up SIP and why should investors use it?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "A Step-Up (or Top-Up) SIP automatically increases your monthly investment by a chosen percentage (e.g. 10% annually) in line with annual salary increments. A 10% annual step-up can often double your final corpus compared to a static SIP over a 15-year horizon."
              }
            },
            {
              "@type": "Question",
              "name": "What is the 15-15-15 rule of mutual funds in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The 15-15-15 rule states that investing ₹15,000 per month for 15 years at an expected 15% annualized return builds an accumulated corpus of approximately ₹1 Crore (₹10 Million) with only ₹27 Lakhs of principal invested."
              }
            }
          ]
        }
      ]
    }
  },
  'fund-detail': {
    title: "Mutual Fund Scheme Live NAV, Historical Charts & SIP Calculator — WealthyWiz",
    description: "Analyze live AMFI NAV, interactive 1M-MAX performance charts, annualized returns, expense ratio, and compute SIP returns for top direct mutual funds in India.",
    keywords: "mutual fund NAV today, direct mutual fund scheme, mutual fund returns, SIP calculator for mutual funds, wealth advisory India",
    canonicalPath: "/fund",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://wealthywiz.online/#website",
          "url": "https://wealthywiz.online",
          "name": "WealthyWiz",
          "description": "Smart Mutual Fund Discovery, Live NAV Tracking, Investor Risk Profiling & SIP Compounding Calculator.",
          "inLanguage": "en-IN"
        }
      ]
    }
  }
};

/**
 * Converts a Mutual Fund scheme name into a clean, URL-friendly slug
 * e.g. "Parag Parikh Flexi Cap Fund - Direct Plan - Growth" -> "parag-parikh-flexi-cap-fund-direct-plan-growth"
 */
export function slugifySchemeName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Searches curated funds or custom fund list by URL slug
 */
export function findFundBySlug(slug: string, fundList?: FundScheme[]): FundScheme | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().trim();
  const list = fundList && fundList.length > 0 ? fundList : CURATED_FUNDS;
  
  // 1. Direct exact slug match
  const directMatch = list.find(f => slugifySchemeName(f.schemeName) === cleanSlug);
  if (directMatch) return directMatch;

  // 2. Normalize by removing common variations
  const stripPlan = (s: string) => s
    .replace(/-(direct-plan-growth|direct-growth|growth-option|direct-plan|direct|growth|option|regular)/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  const normalizedInput = stripPlan(cleanSlug);
  if (normalizedInput) {
    const fuzzyMatch = list.find(f => {
      const fundNorm = stripPlan(slugifySchemeName(f.schemeName));
      return fundNorm === normalizedInput || fundNorm.startsWith(normalizedInput) || normalizedInput.startsWith(fundNorm);
    });
    if (fuzzyMatch) return fuzzyMatch;
  }

  // 3. Match by schemeCode if a numeric slug was provided as fallback
  if (/^\d+$/.test(cleanSlug)) {
    const code = parseInt(cleanSlug, 10);
    return list.find(f => f.schemeCode === code);
  }

  return undefined;
}

/**
 * Determine the active page route based on window pathname and hash using scheme name slugs
 */
export function getRouteStateFromLocation(): RouteState {
  if (typeof window === 'undefined') return { route: 'home' };

  let pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search;

  // Check for SPA 404 query redirect fallback: e.g. /?p=/fund/...
  const pMatch = search.match(/[?&]p=([^&]+)/);
  if (pMatch && pMatch[1]) {
    const decoded = decodeURIComponent(pMatch[1]).replace(/~and~/g, '&');
    pathname = decoded.toLowerCase();
    // Clean up URL without reload
    try {
      window.history.replaceState(null, '', decoded);
    } catch {
      // Ignore if iframe restricts replaceState
    }
  }

  // 1. Check for dedicated Fund Scheme page using Scheme Name: /fund/:schemeNameSlug or /funds/:schemeNameSlug
  const fundPathMatch = pathname.match(/^\/funds?\/([a-z0-9-]+)/i);
  if (fundPathMatch) {
    const rawSlug = fundPathMatch[1];
    const matched = findFundBySlug(rawSlug);
    if (matched) {
      return {
        route: 'fund-detail',
        schemeSlug: slugifySchemeName(matched.schemeName),
        schemeName: matched.schemeName,
        schemeCode: matched.schemeCode,
      };
    }
    return {
      route: 'fund-detail',
      schemeSlug: rawSlug,
      schemeName: rawSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    };
  }

  // 2. Check for Loan Against Securities & Mutual Funds
  if (
    pathname.startsWith('/loan-against-securities') ||
    pathname.startsWith('/loan-against-mutual-funds') ||
    pathname.startsWith('/las') ||
    pathname.startsWith('/lamf')
  ) {
    return { route: 'loan-against-securities' };
  }

  // 3. Check for SIP Calculator
  if (
    pathname.startsWith('/sip-calculator') ||
    pathname.startsWith('/sip-return-calculator') ||
    pathname.startsWith('/sip')
  ) {
    return { route: 'sip-calculator' };
  }

  // 4. Fallback to hash if hosted on hash-based router or iframe (e.g. #/fund/parag-parikh-flexi-cap...)
  const fundHashMatch = hash.match(/^#\/?funds?\/([a-z0-9-]+)/i);
  if (fundHashMatch) {
    const rawSlug = fundHashMatch[1];
    const matched = findFundBySlug(rawSlug);
    if (matched) {
      return {
        route: 'fund-detail',
        schemeSlug: slugifySchemeName(matched.schemeName),
        schemeName: matched.schemeName,
        schemeCode: matched.schemeCode,
      };
    }
    return {
      route: 'fund-detail',
      schemeSlug: rawSlug,
      schemeName: rawSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    };
  }

  if (
    hash.includes('#loan-against-securities') ||
    hash.includes('#loan-against-mutual-funds') ||
    hash.includes('#las')
  ) {
    return { route: 'loan-against-securities' };
  }

  if (
    hash.includes('#sip-calculator') ||
    hash.includes('#sip-return-calculator')
  ) {
    return { route: 'sip-calculator' };
  }

  return { route: 'home' };
}

/**
 * Backward compatibility helper returning just PageRoute
 */
export function getRouteFromLocation(): PageRoute {
  return getRouteStateFromLocation().route;
}

/**
 * Updates DOM title, meta description, keywords, canonical, OG tags and Schema JSON-LD
 */
export function updateSeoMetadata(route: PageRoute): void {
  if (typeof document === 'undefined') return;

  const config = SEO_CONFIGS[route as keyof typeof SEO_CONFIGS] || SEO_CONFIGS.home;

  // 1. Update Title
  document.title = config.title;

  // 2. Helper to set or create meta tag
  const setMeta = (name: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  setMeta('title', config.title);
  setMeta('description', config.description);
  setMeta('keywords', config.keywords);

  // 3. Update Open Graph & Twitter
  setMeta('og:title', config.title, true);
  setMeta('og:description', config.description, true);
  setMeta('og:url', `https://wealthywiz.online${config.canonicalPath}`, true);

  setMeta('twitter:title', config.title);
  setMeta('twitter:description', config.description);
  setMeta('twitter:url', `https://wealthywiz.online${config.canonicalPath}`);

  // 4. Update Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `https://wealthywiz.online${config.canonicalPath}`);

  // 5. Inject Dynamic Page JSON-LD
  let schemaScript = document.getElementById('dynamic-page-schema') as HTMLScriptElement | null;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'dynamic-page-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(config.schema, null, 2);

  // 6. Track Page View in Google Tag (AW-18297262924)
  trackPageView(config.canonicalPath, config.title);
}

/**
 * Dynamic SEO metadata generator for individual Mutual Fund Scheme URLs using Scheme Name
 */
export function updateFundSeoMetadata(fund: {
  schemeCode?: number;
  schemeName: string;
  category?: string;
  fundHouse?: string;
  nav?: number;
  navDate?: string;
  return1Y?: number;
  return3Y?: number;
  return5Y?: number;
  expenseRatio?: number;
  aumCr?: number;
  description?: string;
}): void {
  if (typeof document === 'undefined') return;

  const schemeSlug = slugifySchemeName(fund.schemeName);
  const category = fund.category || 'Equity';
  const fundHouse = fund.fundHouse || 'Asset Management Co.';
  const navText = fund.nav ? `₹${fund.nav.toFixed(2)}` : '';
  const return3YText = fund.return3Y ? `${fund.return3Y}%` : '20%+';
  const aumText = fund.aumCr ? `₹${fund.aumCr.toLocaleString('en-IN')} Cr` : '';

  const title = `${fund.schemeName} NAV Today ${navText}, 3Y Returns & SIP Calculator | WealthyWiz`;
  const description = `Live AMFI NAV for ${fund.schemeName} (${navText} as on ${fund.navDate || 'today'}). Historical returns: 1Y ${fund.return1Y || 'N/A'}%, 3Y ${return3YText}, 5Y ${fund.return5Y || 'N/A'}%. Expense Ratio: ${fund.expenseRatio || 0.75}%, AUM: ${aumText}. Research portfolio holdings, riskometer, Loan Against MF eligibility & calculate monthly SIP returns.`;
  const keywords = `${fund.schemeName}, ${fundHouse}, ${category} mutual fund, mutual fund NAV today, ${fund.schemeName} SIP returns, direct plan growth, loan against ${fund.schemeName}`;
  const canonicalUrl = `https://wealthywiz.online/fund/${schemeSlug}`;

  // Update Title
  document.title = title;

  const setMeta = (name: string, content: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  setMeta('title', title);
  setMeta('description', description);
  setMeta('keywords', keywords);

  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:url', canonicalUrl, true);

  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  setMeta('twitter:url', canonicalUrl);

  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);

  // Schema.org FinancialProduct + BreadcrumbList JSON-LD
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FinancialProduct",
        "@id": `https://wealthywiz.online/fund/${schemeSlug}#product`,
        "name": fund.schemeName,
        "description": fund.description || `${category} mutual fund direct growth plan managed by ${fundHouse}.`,
        "provider": {
          "@type": "FinancialService",
          "name": fundHouse,
          "url": "https://wealthywiz.online"
        },
        "broker": {
          "@type": "FinancialService",
          "name": "WealthyWiz",
          "description": "AMFI Registered Mutual Fund Distributor ARN-363293"
        },
        "annualPercentageRate": `${return3YText} (3-Year CAGR)`,
        "feesAndCommissionsSpecification": `Expense Ratio: ${fund.expenseRatio || 0.75}% (Direct Plan)`,
        "category": category,
        "currency": "INR",
        "areaServed": "IN"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://wealthywiz.online"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Mutual Funds Explorer",
            "item": "https://wealthywiz.online/#explorer"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": category,
            "item": `https://wealthywiz.online/#${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": fund.schemeName,
            "item": canonicalUrl
          }
        ]
      }
    ]
  };

  let schemaScript = document.getElementById('dynamic-page-schema') as HTMLScriptElement | null;
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'dynamic-page-schema';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(schema, null, 2);

  // Track Fund Page View in Google Tag (AW-18297262924)
  trackPageView(window.location.pathname, title);
}

/**
 * Navigate to a specific page route programmatically
 */
export function navigateToRoute(route: PageRoute): void {
  if (typeof window === 'undefined') return;

  const targetPath = route === 'home' ? '/' : `/${route}`;
  
  // Safe HTML5 pushState
  try {
    window.history.pushState({ route }, '', targetPath);
  } catch {
    // If running in restrictive iframe without pushState permission, fallback to hash
    window.location.hash = `#${route}`;
  }

  // Update SEO metadata
  if (route !== 'fund-detail') {
    updateSeoMetadata(route);
  }

  // Dispatch custom route event so React re-renders immediately
  window.dispatchEvent(new CustomEvent('app-route-change', { detail: { route } }));

  // Scroll to top with instant/smooth behavior
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Navigate to a dedicated Mutual Fund Scheme page URL using Scheme Name (/fund/:scheme-name)
 */
export function navigateToFund(
  schemeTarget: string | number | FundScheme | { schemeName: string; schemeCode?: number },
  fallbackTarget?: string | number
): void {
  if (typeof window === 'undefined') return;

  let schemeName = '';
  let schemeCode: number | undefined = undefined;

  if (typeof schemeTarget === 'string') {
    schemeName = schemeTarget;
    if (typeof fallbackTarget === 'number') {
      schemeCode = fallbackTarget;
    }
  } else if (typeof schemeTarget === 'number') {
    schemeCode = schemeTarget;
    if (typeof fallbackTarget === 'string') {
      schemeName = fallbackTarget;
    } else {
      const found = CURATED_FUNDS.find(f => f.schemeCode === schemeCode);
      if (found) schemeName = found.schemeName;
    }
  } else if (typeof schemeTarget === 'object' && schemeTarget !== null) {
    schemeName = schemeTarget.schemeName;
    schemeCode = schemeTarget.schemeCode;
  }

  if (!schemeName && schemeCode) {
    const found = CURATED_FUNDS.find(f => f.schemeCode === schemeCode);
    if (found) schemeName = found.schemeName;
  }

  const slug = slugifySchemeName(schemeName || `fund-${schemeCode || 'scheme'}`);
  const targetPath = `/fund/${slug}`;

  try {
    window.history.pushState({ route: 'fund-detail', schemeSlug: slug, schemeName, schemeCode }, '', targetPath);
  } catch {
    window.location.hash = `#/fund/${slug}`;
  }

  // Dispatch custom route event with schemeSlug, schemeName and schemeCode
  window.dispatchEvent(new CustomEvent('app-route-change', { 
    detail: { route: 'fund-detail', schemeSlug: slug, schemeName, schemeCode } 
  }));

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
