import { FundScheme, NavHistoryPoint } from '../types';
import { CURATED_FUNDS } from '../data/fundsData';

const CACHE_KEY_LIST = 'wealthywiz_mfapi_full_list';
const CACHE_KEY_TIMESTAMP = 'wealthywiz_mfapi_list_time';
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours as per README

export interface MfApiSchemeSummary {
  schemeCode: number;
  schemeName: string;
}

export interface MfApiResponse {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: {
    date: string; // "12-08-2026"
    nav: string;  // "82.45000"
  }[];
  status: string;
}

/**
 * Fetches the full AMFI scheme directory with 12h localStorage caching
 */
export async function getFullList(): Promise<MfApiSchemeSummary[]> {
  try {
    const cached = localStorage.getItem(CACHE_KEY_LIST);
    const cachedTime = localStorage.getItem(CACHE_KEY_TIMESTAMP);

    if (cached && cachedTime && Date.now() - parseInt(cachedTime, 10) < CACHE_DURATION_MS) {
      return JSON.parse(cached);
    }

    const res = await fetch('https://api.mfapi.in/mf');
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const data: MfApiSchemeSummary[] = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      // Store in background
      try {
        localStorage.setItem(CACHE_KEY_LIST, JSON.stringify(data));
        localStorage.setItem(CACHE_KEY_TIMESTAMP, Date.now().toString());
      } catch {
        // Quota exceeded safe catch
      }
      return data;
    }
  } catch (err) {
    console.warn('Could not fetch full AMFI list from mfapi.in, using fallback directory:', err);
  }

  // Fallback to curated fund summaries
  return CURATED_FUNDS.map(f => ({
    schemeCode: f.schemeCode,
    schemeName: f.schemeName,
  }));
}

/**
 * Searches schemes by name/code
 */
export async function searchSchemes(query: string): Promise<MfApiSchemeSummary[]> {
  const cleanQ = query.trim();
  if (!cleanQ) return [];

  // Try direct search endpoint
  try {
    const res = await fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(cleanQ)}`);
    if (res.ok) {
      const results = await res.json();
      if (Array.isArray(results) && results.length > 0) {
        return results.slice(0, 30);
      }
    }
  } catch {
    // Fall back to client search
  }

  // Fallback: search in full list or curated
  const fullList = await getFullList();
  const lowerQ = cleanQ.toLowerCase();
  return fullList
    .filter(s => s.schemeName.toLowerCase().includes(lowerQ))
    .slice(0, 30);
}

/**
 * Fetches NAV history for a specific scheme
 */
export async function fetchSchemeDetails(schemeCode: number): Promise<{
  scheme: FundScheme;
  history: NavHistoryPoint[];
} | null> {
  try {
    const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const json: MfApiResponse = await res.json();

    if (json && json.data && json.data.length > 0) {
      const latestPoint = json.data[0];
      const prevPoint = json.data[1] || latestPoint;
      const latestNav = parseFloat(latestPoint.nav);
      const prevNav = parseFloat(prevPoint.nav);
      const change1D = +(latestNav - prevNav).toFixed(2);
      const change1DPct = prevNav > 0 ? +(((latestNav - prevNav) / prevNav) * 100).toFixed(2) : 0;

      // Compute 1Y, 3Y, 5Y returns from historical points
      const return1Y = computeReturnFromHistory(json.data, 365);
      const return3Y = computeReturnFromHistory(json.data, 365 * 3);
      const return5Y = computeReturnFromHistory(json.data, 365 * 5);

      // Determine category and risk
      const metaCategory = json.meta?.scheme_category || 'Equity Scheme';
      const category = mapAmfiCategory(metaCategory, json.meta?.scheme_name);

      const curatedMatch = CURATED_FUNDS.find(c => c.schemeCode === schemeCode);

      const scheme: FundScheme = {
        schemeCode: json.meta.scheme_code || schemeCode,
        schemeName: json.meta.scheme_name,
        category,
        fundHouse: json.meta.fund_house || curatedMatch?.fundHouse || 'Asset Management Co.',
        nav: latestNav,
        navDate: latestPoint.date,
        change1D,
        change1DPct,
        return1Y: return1Y ?? curatedMatch?.return1Y ?? 18.5,
        return3Y: return3Y ?? curatedMatch?.return3Y ?? 17.2,
        return5Y: return5Y ?? curatedMatch?.return5Y ?? 16.8,
        expenseRatio: curatedMatch?.expenseRatio ?? 0.65,
        riskLevel: curatedMatch?.riskLevel ?? (category.includes('Small') || category.includes('Mid') ? 'Very High' : 'High'),
        aumCr: curatedMatch?.aumCr ?? 15000,
        minSipAmount: curatedMatch?.minSipAmount ?? 500,
        minLumpsumAmount: curatedMatch?.minLumpsumAmount ?? 1000,
        description: curatedMatch?.description || `${json.meta.scheme_category} actively managed by ${json.meta.fund_house}.`,
      };

      const history: NavHistoryPoint[] = json.data.slice(0, 90).map(d => ({
        date: d.date,
        nav: parseFloat(d.nav),
      })).reverse();

      return { scheme, history };
    }
  } catch (err) {
    console.warn(`Could not load live NAV for scheme ${schemeCode}, using curated backup:`, err);
  }

  // Fallback to curated
  const fallback = CURATED_FUNDS.find(c => c.schemeCode === schemeCode);
  if (fallback) {
    return {
      scheme: fallback,
      history: generateMockHistory(fallback.nav),
    };
  }

  return null;
}

/**
 * Calculates percentage return from history for N days
 */
export function computeReturnFromHistory(data: { date: string; nav: string }[], days: number): number | undefined {
  if (!data || data.length < 2) return undefined;
  const latestNav = parseFloat(data[0].nav);
  if (isNaN(latestNav) || latestNav <= 0) return undefined;

  // Approximate index in daily data (trading days ~ 250 per year)
  const targetIndex = Math.min(Math.floor(days * (250 / 365)), data.length - 1);
  const oldNav = parseFloat(data[targetIndex].nav);

  if (isNaN(oldNav) || oldNav <= 0) return undefined;

  // Annualized return (CAGR) if > 1 year, or absolute return if <= 1 year
  const years = days / 365;
  if (years > 1) {
    const cagr = (Math.pow(latestNav / oldNav, 1 / years) - 1) * 100;
    return +cagr.toFixed(1);
  } else {
    const abs = ((latestNav - oldNav) / oldNav) * 100;
    return +abs.toFixed(1);
  }
}

/**
 * Helper to map AMFI scheme category strings into standard category tabs
 */
function mapAmfiCategory(rawCat: string, name: string = ''): FundScheme['category'] {
  const c = (rawCat + ' ' + name).toLowerCase();
  if (c.includes('elss') || c.includes('tax saver')) return 'ELSS (Tax Saver)';
  if (c.includes('small cap')) return 'Small Cap';
  if (c.includes('mid cap')) return 'Mid Cap';
  if (c.includes('large & mid') || c.includes('large and mid')) return 'Mid Cap';
  if (c.includes('flexi cap') || c.includes('multi cap') || c.includes('focused')) return 'Flexi Cap';
  if (c.includes('large cap') || c.includes('bluechip') || c.includes('top 100') || c.includes('nifty 50')) return 'Large Cap';
  if (c.includes('hybrid') || c.includes('balanced') || c.includes('dynamic asset') || c.includes('equity savings')) return 'Hybrid / Balanced';
  if (c.includes('liquid') || c.includes('debt') || c.includes('gilt') || c.includes('overnight') || c.includes('money market') || c.includes('short term')) return 'Debt & Liquid';
  return 'Flexi Cap';
}

function generateMockHistory(currentNav: number): NavHistoryPoint[] {
  const points: NavHistoryPoint[] = [];
  const today = new Date();
  for (let i = 30; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    const factor = 1 - (i * 0.003) + (Math.sin(i / 2) * 0.008);
    points.push({
      date: dayStr,
      nav: +(currentNav * factor).toFixed(2),
    });
  }
  return points;
}

/**
 * Indian Rupee Formatter with Lakhs / Crores units
 */
export function formatINR(amount: number, showDecimals: boolean = false): string {
  if (isNaN(amount)) return '₹0';
  const abs = Math.abs(amount);

  if (abs >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    const lk = amount / 100000;
    return `₹${lk.toFixed(2)} L`;
  }

  // Standard Indian comma separator
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  return `₹${formatted}`;
}

export function formatNumberINR(num: number): string {
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}
