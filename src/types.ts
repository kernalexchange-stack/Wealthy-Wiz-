export type FundCategory = 
  | 'All'
  | 'Large Cap'
  | 'Flexi Cap'
  | 'Mid Cap'
  | 'Small Cap'
  | 'ELSS (Tax Saver)'
  | 'Hybrid / Balanced'
  | 'Debt & Liquid';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High';

export interface FundScheme {
  schemeCode: number;
  schemeName: string;
  category: FundCategory;
  fundHouse: string;
  nav: number;
  navDate: string;
  change1D?: number;
  change1DPct?: number;
  return1Y?: number;
  return3Y?: number;
  return5Y?: number;
  expenseRatio?: number;
  riskLevel: RiskLevel;
  aumCr?: number;
  minSipAmount?: number;
  minLumpsumAmount?: number;
  description?: string;
}

export interface NavHistoryPoint {
  date: string;
  nav: number;
}

export type RiskProfileType = 'Conservative' | 'Moderate' | 'Growth' | 'Aggressive';

export interface RiskProfileInfo {
  type: RiskProfileType;
  title: string;
  tagline: string;
  description: string;
  equityAllocation: number;
  debtAllocation: number;
  goldAllocation: number;
  recommendedCategory: FundCategory;
  sampleFunds: FundScheme[];
  badgeColor: string;
}

export interface QuizOption {
  id: string;
  text: string;
  score: number;
  hint?: string;
}

export interface QuizQuestion {
  id: number;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

export interface CalculatorInputs {
  mode: 'sip' | 'lumpsum';
  categoryPreset: string;
  amount: number;
  years: number;
  mfExpectedReturn: number;
  fdInterestRate: number;
  stepUpPct: number;
}

export interface CalculatorResults {
  totalInvested: number;
  mfMaturityValue: number;
  mfWealthGain: number;
  fdMaturityValue: number;
  fdWealthGain: number;
  extraWealthOverFd: number;
  wealthMultiplier: number;
  yearlyBreakdown: {
    year: number;
    invested: number;
    mfValue: number;
    fdValue: number;
  }[];
}

export interface LeadPayload {
  id?: string;
  name: string;
  email: string;
  phone: string;
  investmentGoal: string;
  investmentAmount: number;
  investmentMode: 'monthly_sip' | 'one_time_lumpsum';
  riskProfile?: RiskProfileType | string;
  recommendedFunds?: string[];
  message?: string;
  sourcePage?: string;
  createdAt?: string;
  status?: 'new' | 'contacted' | 'converted';
}

export interface ArticleItem {
  slug: string;
  title: string;
  subtitle: string;
  category: 'Strategy' | 'Taxation' | 'Basics' | 'Comparison';
  readTime: string;
  publishedDate: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  relatedAction: {
    label: string;
    targetHash: string;
  };
}

export type UserRole = 'admin' | 'operations' | 'customer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  department?: string;
  panNumber?: string;
  watchlist?: number[];
  joinedAt?: string;
  lastLogin?: string;
}
