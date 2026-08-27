import { FundScheme, NavHistoryPoint } from '../types';
import { CURATED_FUNDS } from '../data/fundsData';

const CACHE_KEY_LIST = 'wealthywiz_mfapi_full_list';
const CACHE_KEY_TIMESTAMP = 'wealthywiz_mfapi_list_time';
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

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
    date: string; // "25-08-2026"
    nav: string;  // "91.18540"
  }[];
  status?: string;
}

// In-memory cache to avoid duplicate network calls
const memoryCache: Record<number, { timestamp: number; data: MfApiResponse }> = {};

/**
 * Fetches the raw response from AMFI with proxy and fallback
 */
export async function fetchRawSchemeData(schemeCode: number): Promise<MfApiResponse | null> {
  const cached = memoryCache[schemeCode];
  if (cached && Date.now() - cached.timestamp < 3 * 60 * 1000) {
    return cached.data;
  }

  // 1. Try local server endpoint proxy first
  try {
    const res = await fetch(`/api/mf/${schemeCode}`);
    if (res.ok) {
      const data: MfApiResponse = await res.json();
      if (data && data.data && data.data.length > 0) {
        memoryCache[schemeCode] = { timestamp: Date.now(), data };
        return data;
      }
    }
  } catch {
    // Continue to direct fallback
  }

  // 2. Direct fallback to official mfapi.in
  try {
    const res = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
    if (res.ok) {
      const data: MfApiResponse = await res.json();
      if (data && data.data && data.data.length > 0) {
        memoryCache[schemeCode] = { timestamp: Date.now(), data };
        return data;
      }
    }
  } catch (err) {
    console.warn(`Could not reach AMFI endpoint for ${schemeCode}:`, err);
  }

  return null;
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
      try {
        localStorage.setItem(CACHE_KEY_LIST, JSON.stringify(data));
        localStorage.setItem(CACHE_KEY_TIMESTAMP, Date.now().toString());
      } catch {
        // Safe catch for storage limits
      }
      return data;
    }
  } catch (err) {
    console.warn('Using curated fallback directory:', err);
  }

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
    // Fall back
  }

  const fullList = await getFullList();
  const lowerQ = cleanQ.toLowerCase();
  return fullList
    .filter(s => s.schemeName.toLowerCase().includes(lowerQ))
    .slice(0, 30);
}

/**
 * Fetches latest scheme details with live NAV and computed historical performance
 */
export async function fetchSchemeDetails(schemeCode: number): Promise<{
  scheme: FundScheme;
  history: NavHistoryPoint[];
  fullData?: MfApiResponse;
} | null> {
  const json = await fetchRawSchemeData(schemeCode);

  if (json && json.data && json.data.length > 0) {
    const latestPoint = json.data[0];
    const prevPoint = json.data[1] || latestPoint;
    const latestNav = parseFloat(latestPoint.nav);
    const prevNav = parseFloat(prevPoint.nav);
    const change1D = +(latestNav - prevNav).toFixed(2);
    const change1DPct = prevNav > 0 ? +(((latestNav - prevNav) / prevNav) * 100).toFixed(2) : 0;

    const return1Y = computeReturnFromHistory(json.data, 365);
    const return3Y = computeReturnFromHistory(json.data, 365 * 3);
    const return5Y = computeReturnFromHistory(json.data, 365 * 5);

    const metaCategory = json.meta?.scheme_category || 'Equity Scheme';
    const category = mapAmfiCategory(metaCategory, json.meta?.scheme_name);
    const curatedMatch = CURATED_FUNDS.find(c => c.schemeCode === schemeCode);

    const scheme: FundScheme = {
      schemeCode: json.meta?.scheme_code || schemeCode,
      schemeName: json.meta?.scheme_name || curatedMatch?.schemeName || 'Direct Plan Mutual Fund',
      category,
      fundHouse: json.meta?.fund_house || curatedMatch?.fundHouse || 'Asset Management Co.',
      nav: latestNav,
      navDate: latestPoint.date,
      change1D,
      change1DPct,
      return1Y: return1Y ?? curatedMatch?.return1Y ?? 24.5,
      return3Y: return3Y ?? curatedMatch?.return3Y ?? 21.2,
      return5Y: return5Y ?? curatedMatch?.return5Y ?? 22.0,
      expenseRatio: curatedMatch?.expenseRatio ?? 0.65,
      riskLevel: curatedMatch?.riskLevel ?? (category.includes('Small') || category.includes('Mid') ? 'Very High' : 'High'),
      aumCr: curatedMatch?.aumCr ?? 25000,
      minSipAmount: curatedMatch?.minSipAmount ?? 500,
      minLumpsumAmount: curatedMatch?.minLumpsumAmount ?? 1000,
      description: curatedMatch?.description || `${json.meta?.scheme_category || 'Mutual fund scheme'} managed by ${json.meta?.fund_house || 'AMC'}.`,
    };

    const history: NavHistoryPoint[] = json.data.slice(0, 180).map(d => ({
      date: d.date,
      nav: parseFloat(d.nav),
    })).reverse();

    return { scheme, history, fullData: json };
  }

  // Fallback to curated item if exists
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
 * Calculates sliced timeline data points for chart rendering
 */
export function getChartDataForTimeframe(
  rawData: { date: string; nav: string }[] | undefined,
  timeframe: '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | 'MAX',
  fallbackNav: number = 100
): {
  date: string;
  displayDate: string;
  nav: number;
  returnPct: number;
  sma?: number;
}[] {
  if (!rawData || rawData.length === 0) {
    return generateMockChartSeries(timeframe, fallbackNav);
  }

  const daysMap: Record<string, number> = {
    '1M': 30,
    '3M': 90,
    '6M': 180,
    '1Y': 365,
    '3Y': 365 * 3,
    '5Y': 365 * 5,
    'MAX': rawData.length,
  };

  const days = daysMap[timeframe] || 365;
  // Raw data from AMFI is daily trading days (approx 250/year)
  const tradingDays = timeframe === 'MAX' ? rawData.length : Math.min(rawData.length, Math.floor(days * (250 / 365)) || 22);
  const slice = rawData.slice(0, Math.max(5, tradingDays));

  // Sample to 40-70 evenly spaced points
  const maxPoints = Math.min(60, slice.length);
  const step = Math.max(1, Math.floor(slice.length / maxPoints));

  const sampled: { date: string; displayDate: string; nav: number; returnPct: number }[] = [];
  for (let i = slice.length - 1; i >= 0; i -= step) {
    const item = slice[i];
    if (item && item.nav) {
      sampled.push({
        date: item.date,
        displayDate: formatChartDate(item.date),
        nav: parseFloat(parseFloat(item.nav).toFixed(2)),
        returnPct: 0,
      });
    }
  }

  // Always append latest entry
  const latestItem = slice[0];
  if (latestItem && (sampled.length === 0 || sampled[sampled.length - 1].date !== latestItem.date)) {
    sampled.push({
      date: latestItem.date,
      displayDate: formatChartDate(latestItem.date),
      nav: parseFloat(parseFloat(latestItem.nav).toFixed(2)),
      returnPct: 0,
    });
  }

  if (sampled.length === 0) {
    return generateMockChartSeries(timeframe, fallbackNav);
  }

  const startNav = sampled[0].nav;
  return sampled.map((pt, idx, arr) => {
    const returnPct = startNav > 0 ? +(((pt.nav - startNav) / startNav) * 100).toFixed(2) : 0;
    
    // Simple 5-sample Moving Average
    const windowSlice = arr.slice(Math.max(0, idx - 4), idx + 1);
    const avg = windowSlice.reduce((acc, curr) => acc + curr.nav, 0) / windowSlice.length;

    return {
      ...pt,
      returnPct,
      sma: +avg.toFixed(2),
    };
  });
}

function formatChartDate(dStr: string): string {
  const parts = dStr.split('-');
  if (parts.length === 3) {
    return `${parts[0]} ${parts[1]}`;
  }
  return dStr;
}

function generateMockChartSeries(timeframe: string, currentNav: number) {
  const points = [];
  const count = 30;
  for (let i = count; i >= 0; i--) {
    const factor = 1 - (i * 0.005) + Math.sin(i / 3) * 0.015;
    const nav = +(currentNav * factor).toFixed(2);
    points.push({
      date: `${30 - i}d ago`,
      displayDate: `${30 - i}d`,
      nav,
      returnPct: +(((nav - (currentNav * 0.85)) / (currentNav * 0.85)) * 100).toFixed(2),
      sma: nav,
    });
  }
  return points;
}

/**
 * Calculates percentage return from history for N calendar days
 */
export function computeReturnFromHistory(data: { date: string; nav: string }[], days: number): number | undefined {
  if (!data || data.length < 2) return undefined;
  const latestNav = parseFloat(data[0].nav);
  if (isNaN(latestNav) || latestNav <= 0) return undefined;

  const targetIndex = Math.min(Math.floor(days * (250 / 365)), data.length - 1);
  const oldNav = parseFloat(data[targetIndex].nav);

  if (isNaN(oldNav) || oldNav <= 0) return undefined;

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
 * Maps AMFI scheme category string to standard category tabs
 */
function mapAmfiCategory(rawCat: string, name: string = ''): FundScheme['category'] {
  const c = (rawCat + ' ' + name).toLowerCase();
  if (c.includes('elss') || c.includes('tax saver')) return 'ELSS (Tax Saver)';
  if (c.includes('small cap')) return 'Small Cap';
  if (c.includes('mid cap')) return 'Mid Cap';
  if (c.includes('large & mid') || c.includes('large and mid')) return 'Mid Cap';
  if (c.includes('flexi cap') || c.includes('multi cap') || c.includes('focused')) return 'Flexi Cap';
  if (c.includes('large cap') || c.includes('bluechip') || c.includes('top 100') || c.includes('nifty 50')) return 'Large Cap';
  if (c.includes('hybrid') || c.includes('balanced') || c.includes('multi asset') || c.includes('equity savings')) return 'Hybrid / Balanced';
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
 * Formats Indian Currency
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

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  return `₹${formatted}`;
}

export function formatNumberINR(num: number): string {
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}
