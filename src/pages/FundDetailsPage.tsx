import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Share2, 
  Check, 
  Calculator, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Percent, 
  ArrowRight, 
  Info, 
  Clock, 
  DollarSign, 
  Send,
  BarChart3,
  Flame,
  PieChart,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { FundScheme, NavHistoryPoint } from '../types';
import { CURATED_FUNDS } from '../data/fundsData';
import { fetchSchemeDetails, resolveSchemeByNameOrSlug, formatINR, MfApiResponse } from '../utils/mfapi';
import { NavInteractiveChart } from '../components/NavInteractiveChart';
import { navigateToRoute, navigateToFund, updateFundSeoMetadata, slugifySchemeName, findFundBySlug } from '../utils/seoAndRouting';
import { sendLeadToFormspree } from '../utils/formspree';

interface FundDetailsPageProps {
  schemeSlug?: string;
  schemeName?: string;
  schemeCode?: number;
  onOpenLeadModal?: (fundSchemeName?: string) => void;
}

export const FundDetailsPage: React.FC<FundDetailsPageProps> = ({
  schemeSlug,
  schemeName,
  schemeCode: propSchemeCode,
  onOpenLeadModal,
}) => {
  // Find curated fund or initialize fallback by slug, name, or code
  const curatedFund = useMemo(() => {
    if (schemeSlug) {
      const bySlug = findFundBySlug(schemeSlug);
      if (bySlug) return bySlug;
    }
    if (schemeName) {
      const byName = CURATED_FUNDS.find(
        f => f.schemeName.toLowerCase() === schemeName.toLowerCase() ||
             slugifySchemeName(f.schemeName) === slugifySchemeName(schemeName)
      );
      if (byName) return byName;
    }
    if (propSchemeCode) {
      return CURATED_FUNDS.find(f => f.schemeCode === propSchemeCode);
    }
    return undefined;
  }, [schemeSlug, schemeName, propSchemeCode]);

  const [fund, setFund] = useState<FundScheme | null>(curatedFund || null);
  const [history, setHistory] = useState<NavHistoryPoint[]>([]);
  const [fullData, setFullData] = useState<MfApiResponse | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // In-page SIP Calculator State
  const [monthlySip, setMonthlySip] = useState(curatedFund?.minSipAmount ? Math.max(curatedFund.minSipAmount, 5000) : 5000);
  const [tenureYears, setTenureYears] = useState(10);
  const [expectedReturnPct, setExpectedReturnPct] = useState(curatedFund?.return3Y ? Math.min(Math.max(curatedFund.return3Y, 8), 30) : 15);
  const [annualStepUp, setAnnualStepUp] = useState(10);

  // Quick Lead Submission State
  const [consultName, setConsultName] = useState('');
  const [consultPhone, setConsultPhone] = useState('');
  const [consultEmail, setConsultEmail] = useState('');
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  // Load live scheme details from AMFI using scheme name/slug resolution
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadSchemeData() {
      try {
        let activeCode = curatedFund?.schemeCode || propSchemeCode;

        // If no scheme code known, resolve scheme by slug/name from AMFI directory
        if (!activeCode && (schemeSlug || schemeName)) {
          const resolved = await resolveSchemeByNameOrSlug(schemeSlug || schemeName || '');
          if (resolved && resolved.schemeCode) {
            activeCode = resolved.schemeCode;
          }
        }

        if (activeCode) {
          const res = await fetchSchemeDetails(activeCode);
          if (!isMounted) return;
          if (res) {
            setFund(res.scheme);
            setHistory(res.history);
            setFullData(res.fullData);
            updateFundSeoMetadata(res.scheme);
            if (res.scheme.return3Y) {
              setExpectedReturnPct(Math.min(Math.max(res.scheme.return3Y, 8), 30));
            }
            return;
          }
        }

        if (curatedFund && isMounted) {
          setFund(curatedFund);
          updateFundSeoMetadata(curatedFund);
        }
      } catch (err) {
        console.error('Failed to load fund scheme details:', err);
        if (curatedFund && isMounted) {
          setFund(curatedFund);
          updateFundSeoMetadata(curatedFund);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSchemeData();

    return () => {
      isMounted = false;
    };
  }, [schemeSlug, schemeName, propSchemeCode, curatedFund]);

  // Peer funds in the same category
  const peerFunds = useMemo(() => {
    if (!fund) return [];
    return CURATED_FUNDS.filter(
      f => f.schemeCode !== fund.schemeCode && (f.category === fund.category || f.category === 'Flexi Cap')
    ).slice(0, 3);
  }, [fund]);

  // SIP Computation with Step-Up
  const sipMetrics = useMemo(() => {
    const monthlyRate = expectedReturnPct / 12 / 100;
    const totalMonths = tenureYears * 12;
    let totalInvested = 0;
    let accumulatedCorpus = 0;
    let currentMonthly = monthlySip;

    for (let m = 1; m <= totalMonths; m++) {
      // Apply annual step-up
      if (m > 1 && (m - 1) % 12 === 0 && annualStepUp > 0) {
        currentMonthly = Math.round(currentMonthly * (1 + annualStepUp / 100));
      }
      totalInvested += currentMonthly;
      accumulatedCorpus = (accumulatedCorpus + currentMonthly) * (1 + monthlyRate);
    }

    const estimatedGain = Math.max(0, accumulatedCorpus - totalInvested);
    const wealthMultiplier = totalInvested > 0 ? (accumulatedCorpus / totalInvested).toFixed(1) : '1.0';

    return {
      totalInvested: Math.round(totalInvested),
      accumulatedCorpus: Math.round(accumulatedCorpus),
      estimatedGain: Math.round(estimatedGain),
      wealthMultiplier,
    };
  }, [monthlySip, tenureYears, expectedReturnPct, annualStepUp]);

  // Share fund link
  const handleShare = () => {
    const slug = slugifySchemeName(fund?.schemeName || schemeSlug || schemeName || 'fund');
    const shareUrl = `https://wealthywiz.online/fund/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Submit in-page consultation lead
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName || !consultPhone) return;

    setLeadSubmitting(true);
    try {
      await sendLeadToFormspree({
        name: consultName,
        phone: consultPhone,
        email: consultEmail || `${consultPhone}@client.wealthywiz.online`,
        investmentGoal: `Direct SIP Investment in ${fund?.schemeName || schemeName || 'Mutual Fund'}`,
        investmentAmount: monthlySip,
        investmentMode: 'SIP',
        riskProfile: fund?.riskLevel || 'Aggressive',
        recommendedFunds: [fund?.schemeName || schemeName || 'Selected Scheme'],
        sourcePage: `Fund Detail: ${fund?.schemeName || schemeName || schemeSlug || 'Mutual Fund Scheme'}`,
        message: `Client requested consultation for starting ₹${monthlySip.toLocaleString('en-IN')}/mo SIP in ${fund?.schemeName || schemeName}.`,
      });
      setLeadSuccess(true);
    } catch (err) {
      console.error('Lead submit error:', err);
    } finally {
      setLeadSubmitting(false);
    }
  };

  const isPositive1D = (fund?.change1D ?? 0) >= 0;

  return (
    <div className="min-h-screen bg-[#011415] text-slate-100 font-sans selection:bg-[#2dd4bf]/30">
      
      {/* Top Banner & Breadcrumb */}
      <div className="bg-[#021c1d] border-b border-[#04383a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-slate-400 overflow-x-auto whitespace-nowrap">
            <button 
              onClick={() => navigateToRoute('home')}
              className="hover:text-[#c2ece2] transition-colors"
            >
              Home
            </button>
            <span>/</span>
            <button 
              onClick={() => navigateToRoute('home')}
              className="hover:text-[#c2ece2] transition-colors"
            >
              Mutual Funds
            </button>
            <span>/</span>
            <span className="text-[#2dd4bf] font-medium">
              {fund?.category || 'Equity'}
            </span>
            <span>/</span>
            <span className="text-slate-200 truncate max-w-[200px] sm:max-w-xs font-semibold">
              {fund?.schemeName || schemeName || (schemeSlug ? schemeSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Mutual Fund Scheme')}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => {
                if (onOpenLeadModal) {
                  onOpenLeadModal(fund?.schemeName);
                } else {
                  const el = document.getElementById('consult-form-box');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-sm text-xs"
              title="Book Free Portfolio Consultation for this Scheme"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Portfolio Consultation</span>
            </button>

            <button
              onClick={() => navigateToRoute('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#012f31] hover:bg-[#013f42] text-slate-300 hover:text-white transition-colors border border-[#045558] text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Explorer</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#017374]/30 hover:bg-[#017374]/50 text-[#c2ece2] transition-colors border border-[#017374]/60"
              title="Copy link to this fund"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Fund URL</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">

        {/* Fund Hero Header Card */}
        <section className="bg-gradient-to-br from-[#022223] via-[#021d1e] to-[#011718] border border-[#044c4e] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#017374]/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-[#017374]/30 text-[#c2ece2] border border-[#017374]/60 font-semibold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  {fund?.fundHouse || 'Mutual Fund AMC'}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-[#012829] text-slate-300 border border-[#044547] font-mono">
                  AMFI: #{fund?.schemeCode || propSchemeCode || 'Direct'}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-700/40 font-medium">
                  {fund?.category || 'Equity Scheme'}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-700/40 font-medium">
                  Risk: {fund?.riskLevel || 'Very High'}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-[#2dd4bf]/15 text-[#2dd4bf] border border-[#2dd4bf]/40 font-bold uppercase tracking-wider text-[10px]">
                  Direct Plan • Growth
                </span>
              </div>

              {/* Fund Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-['Fraunces',serif] leading-tight">
                {fund?.schemeName || schemeName || (schemeSlug ? schemeSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Mutual Fund Scheme')}
              </h1>

              {/* Description */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {fund?.description || 'Top-tier direct mutual fund scheme focused on disciplined long-term capital compounding and alpha generation across market cycles.'}
              </p>
            </div>

            {/* Live NAV Box */}
            <div className="shrink-0 bg-[#011718]/90 border border-[#045254] rounded-2xl p-5 sm:p-6 min-w-[260px] shadow-xl backdrop-blur-md">
              <div className="text-[11px] font-mono text-[#c2ece2]/80 uppercase tracking-wider flex items-center justify-between">
                <span>Current AMFI NAV</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl sm:text-4xl font-bold text-white font-mono tracking-tight">
                  ₹{fund ? fund.nav.toFixed(2) : '---'}
                </span>
              </div>

              {/* 1D Change */}
              <div className={`flex items-center gap-1.5 mt-2 text-xs font-semibold ${isPositive1D ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive1D ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>
                  {isPositive1D ? '+' : ''}{fund?.change1D?.toFixed(2)} ({isPositive1D ? '+' : ''}{fund?.change1DPct?.toFixed(2)}%) 1D Change
                </span>
              </div>

              <div className="text-[11px] text-slate-400 mt-1">
                NAV date: <strong className="text-slate-200">{fund?.navDate || 'Latest Business Day'}</strong>
              </div>

              {/* CTA row */}
              <div className="mt-4 pt-3 border-t border-[#033638] space-y-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('fund-sip-planner');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full bg-[#017374] hover:bg-[#005f60] text-white font-semibold text-xs py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 border border-[#2dd4bf]/30"
                >
                  <Calculator className="w-3.5 h-3.5 text-[#c2ece2]" />
                  <span>Calculate Fund SIP</span>
                </button>

                <button
                  onClick={() => navigateToRoute('loan-against-securities')}
                  className="w-full bg-[#240e1f] hover:bg-[#331127] text-rose-200 font-semibold text-xs py-2 rounded-xl transition-all border border-rose-500/40 flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5 text-rose-400" />
                  <span>Borrow Up to 50% (LAS @ 9.0%)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 6 Key Scheme Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-8 pt-6 border-t border-[#04383a]">
            
            <div className="bg-[#011a1b]/80 border border-[#033638] rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-medium">3Y Annualized</div>
              <div className="text-lg font-bold text-[#2dd4bf] font-mono mt-0.5">
                +{fund?.return3Y ?? 24.2}%
              </div>
              <div className="text-[10px] text-slate-500">CAGR Return</div>
            </div>

            <div className="bg-[#011a1b]/80 border border-[#033638] rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-medium">5Y Annualized</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                +{fund?.return5Y ?? 23.8}%
              </div>
              <div className="text-[10px] text-slate-500">Compounder</div>
            </div>

            <div className="bg-[#011a1b]/80 border border-[#033638] rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-medium">1Y Return</div>
              <div className="text-lg font-bold text-slate-200 font-mono mt-0.5">
                +{fund?.return1Y ?? 28.4}%
              </div>
              <div className="text-[10px] text-slate-500">Trailing Return</div>
            </div>

            <div className="bg-[#011a1b]/80 border border-[#033638] rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-medium">Expense Ratio</div>
              <div className="text-lg font-bold text-amber-300 font-mono mt-0.5">
                {fund?.expenseRatio ?? 0.62}%
              </div>
              <div className="text-[10px] text-slate-500">Direct Plan Edge</div>
            </div>

            <div className="bg-[#011a1b]/80 border border-[#033638] rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-medium">AUM (Fund Size)</div>
              <div className="text-lg font-bold text-slate-200 font-mono mt-0.5 truncate">
                ₹{fund?.aumCr ? fund.aumCr.toLocaleString('en-IN') : '72,400'} Cr
              </div>
              <div className="text-[10px] text-slate-500">Assets Managed</div>
            </div>

            <div className="bg-[#011a1b]/80 border border-[#033638] rounded-xl p-3">
              <div className="text-[11px] text-slate-400 font-medium">Minimum SIP</div>
              <div className="text-lg font-bold text-slate-200 font-mono mt-0.5">
                ₹{fund?.minSipAmount ? fund.minSipAmount.toLocaleString('en-IN') : '500'}
              </div>
              <div className="text-[10px] text-slate-500">Per Month</div>
            </div>

          </div>
        </section>

        {/* Interactive NAV Performance Chart */}
        <section className="bg-[#021d1e] border border-[#044c4e] rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#2dd4bf] uppercase tracking-wider mb-1">
                <BarChart3 className="w-4 h-4" />
                <span>Historical NAV & Return Trajectory</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Fraunces',serif]">
                Interactive Performance Chart
              </h2>
            </div>
            
            <div className="text-xs text-slate-400 bg-[#012829] px-3 py-1.5 rounded-lg border border-[#034446]">
              Verified AMFI Data Points • Real-Time Daily NAV
            </div>
          </div>

          {loading ? (
            <div className="h-72 flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-[#2dd4bf] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs">Fetching live daily NAV records from AMFI repository...</p>
            </div>
          ) : (
            <NavInteractiveChart
              schemeName={fund?.schemeName || ''}
              schemeCode={fund?.schemeCode || propSchemeCode || 0}
              currentNav={fund?.nav || 91.19}
              navDate={fund?.navDate || 'Today'}
              rawHistoryData={fullData?.data}
              category={fund?.category}
              return1Y={fund?.return1Y}
              return3Y={fund?.return3Y}
              return5Y={fund?.return5Y}
            />
          )}
        </section>

        {/* In-Page Fund SIP Calculator */}
        <section id="fund-sip-planner" className="bg-[#021d1e] border border-[#044c4e] rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#017374]/30 text-[#c2ece2] border border-[#017374]/60 text-xs font-bold uppercase tracking-wider mb-2">
              <Calculator className="w-3.5 h-3.5 text-[#2dd4bf]" />
              <span>Dedicated Scheme SIP Planner</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Fraunces',serif]">
              How Much Can You Grow with {fund?.schemeName.split('-')[0] || 'this Scheme'}?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5">
              Simulate monthly compounding with realistic returns and annual step-up increments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6 bg-[#011718] p-5 sm:p-7 rounded-2xl border border-[#04383a]">
              
              {/* Monthly SIP Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">Monthly SIP Amount</label>
                  <span className="text-base font-bold text-[#2dd4bf] font-mono">
                    ₹{monthlySip.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={monthlySip}
                  onChange={(e) => setMonthlySip(Number(e.target.value))}
                  className="w-full h-2 bg-[#022829] rounded-lg appearance-none cursor-pointer accent-[#2dd4bf]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>₹500</span>
                  <span>₹25,000</span>
                  <span>₹50,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              {/* Horizon Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">Investment Horizon</label>
                  <span className="text-base font-bold text-white font-mono">
                    {tenureYears} Years ({tenureYears * 12} Installments)
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full h-2 bg-[#022829] rounded-lg appearance-none cursor-pointer accent-[#2dd4bf]"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>1 Year</span>
                  <span>5 Years</span>
                  <span>10 Years</span>
                  <span>15 Years</span>
                  <span>25 Years</span>
                </div>
              </div>

              {/* Expected Return Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">Expected Annual Return</label>
                  <span className="text-base font-bold text-amber-300 font-mono">
                    {expectedReturnPct}% p.a.
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="30"
                  step="0.5"
                  value={expectedReturnPct}
                  onChange={(e) => setExpectedReturnPct(Number(e.target.value))}
                  className="w-full h-2 bg-[#022829] rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>8% (Conservative)</span>
                  <span>15% (Fund 3Y: {fund?.return3Y || 24.2}%)</span>
                  <span>30% (Aggressive)</span>
                </div>
              </div>

              {/* Step Up SIP */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">Annual Step-Up Top-Up</label>
                  <span className="text-base font-bold text-emerald-400 font-mono">
                    +{annualStepUp}% / year
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="5"
                  value={annualStepUp}
                  onChange={(e) => setAnnualStepUp(Number(e.target.value))}
                  className="w-full h-2 bg-[#022829] rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0% (Static)</span>
                  <span>5%</span>
                  <span>10% (Recommended)</span>
                  <span>20%</span>
                </div>
              </div>

            </div>

            {/* Results Output */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#012829] to-[#011a1b] border border-[#035456] rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
              <div>
                <div className="text-xs text-[#c2ece2] font-semibold uppercase tracking-wider">
                  Expected Future Value
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white font-mono mt-1 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#c2ece2] to-[#2dd4bf]">
                  ₹{sipMetrics.accumulatedCorpus.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-400 font-medium mt-1">
                  Wealth Multiplier: <strong>{sipMetrics.wealthMultiplier}x</strong> of Invested Capital
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#034446] text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total Invested Amount:</span>
                  <span className="font-mono font-bold text-slate-200">
                    ₹{sipMetrics.totalInvested.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Estimated Wealth Gain:</span>
                  <span className="font-mono font-bold text-[#2dd4bf]">
                    +₹{sipMetrics.estimatedGain.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Monthly Starting Installment:</span>
                  <span className="font-mono font-bold text-slate-200">
                    ₹{monthlySip.toLocaleString('en-IN')} / mo
                  </span>
                </div>
              </div>

              {/* Quick Consult Trigger */}
              <button
                onClick={() => {
                  if (onOpenLeadModal) {
                    onOpenLeadModal(fund?.schemeName);
                  } else {
                    const formEl = document.getElementById('consult-form-box');
                    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full bg-[#017374] hover:bg-[#005f60] text-white font-bold text-sm py-3 rounded-xl shadow-lg hover:shadow-[#017374]/30 transition-all flex items-center justify-center gap-2 border border-[#2dd4bf]/40"
              >
                <Sparkles className="w-4 h-4 text-[#c2ece2]" />
                <span>Start Direct SIP in {fund?.schemeName.split('-')[0] || 'this Scheme'}</span>
              </button>
            </div>

          </div>
        </section>

        {/* Investment Details, Tax & LAS Information Matrix */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Fund Profile & Mandate */}
          <div className="bg-[#021d1e] border border-[#044c4e] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <PieChart className="w-4 h-4 text-[#2dd4bf]" />
              <h3>Investment Philosophy</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {fund?.description || 'Focuses on disciplined investing in high-conviction companies with robust competitive moats, solid return on equity (ROE), and prudent capital allocation.'}
            </p>
            <div className="space-y-2 pt-2 border-t border-[#033638] text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Asset Management Co.:</span>
                <span className="text-slate-200 font-semibold">{fund?.fundHouse}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scheme Category:</span>
                <span className="text-slate-200 font-semibold">{fund?.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Plan Type:</span>
                <span className="text-emerald-400 font-semibold">Direct Plan (Zero Commission)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Taxation & Exit Load */}
          <div className="bg-[#021d1e] border border-[#044c4e] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Percent className="w-4 h-4 text-amber-400" />
              <h3>Taxation & Exit Load Rules</h3>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-2.5 rounded-lg bg-[#011718] border border-[#033638]">
                <strong className="text-slate-200">LTCG (Holding &gt; 1 Year):</strong> Taxed at 12.5% for capital gains exceeding ₹1.25 Lakh per financial year (Budget 2024 update).
              </div>
              <div className="p-2.5 rounded-lg bg-[#011718] border border-[#033638]">
                <strong className="text-slate-200">STCG (Holding &lt; 1 Year):</strong> Taxed at 20% on short term redemptions.
              </div>
              <div className="p-2.5 rounded-lg bg-[#011718] border border-[#033638]">
                <strong className="text-slate-200">Exit Load:</strong> Nil after 365 days (1% if redeemed within 1 year).
              </div>
            </div>
          </div>

          {/* Card 3: Loan Against this Fund */}
          <div className="bg-[#240e1f]/90 border border-rose-500/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <h3>Overdraft Credit Limit (LAS)</h3>
            </div>
            <p className="text-xs text-rose-100/80 leading-relaxed">
              Pledge your units of <strong className="text-white">{fund?.schemeName.split('-')[0]}</strong> without selling. Get an instant digital overdraft limit starting @ 9.0% p.a.
            </p>
            <div className="space-y-2 pt-2 border-t border-rose-950 text-xs">
              <div className="flex justify-between">
                <span className="text-rose-200/70">RBI Allowed LTV:</span>
                <span className="text-amber-300 font-bold">50% of Portfolio Value</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-200/70">Interest Rate:</span>
                <span className="text-white font-bold">From 9.0% p.a.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-200/70">Unit Liquidation:</span>
                <span className="text-emerald-300 font-bold">Zero (Keep Compounding)</span>
              </div>
            </div>
            <button
              onClick={() => navigateToRoute('loan-against-securities')}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs py-2.5 rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-md mt-2 flex items-center justify-center gap-1.5"
            >
              <span>Check Loan Eligibility for this Fund</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </section>

        {/* Peer Funds / Schemes in Same Category */}
        {peerFunds.length > 0 && (
          <section className="bg-[#021d1e] border border-[#044c4e] rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-['Fraunces',serif]">
                  Peer Funds in {fund?.category}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Explore other top-rated mutual funds with distinct URLs and verified performance.
                </p>
              </div>
              <button
                onClick={() => navigateToRoute('home')}
                className="text-xs text-[#2dd4bf] hover:underline font-semibold"
              >
                View All Funds →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {peerFunds.map((peer) => (
                <div
                  key={peer.schemeCode}
                  onClick={() => navigateToFund(peer)}
                  className="bg-[#011718] hover:bg-[#012425] border border-[#04383a] hover:border-[#017374] rounded-2xl p-5 cursor-pointer transition-all group shadow-md"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{peer.fundHouse}</span>
                    <span className="text-[10px] font-mono bg-[#012829] px-2 py-0.5 rounded text-[#c2ece2]">
                      #{peer.schemeCode}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-[#2dd4bf] transition-colors mt-2 line-clamp-2">
                    {peer.schemeName}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#033638] text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">NAV</div>
                      <div className="font-bold font-mono text-slate-100">₹{peer.nav.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">3Y CAGR</div>
                      <div className="font-bold font-mono text-[#2dd4bf]">+{peer.return3Y}%</div>
                    </div>
                  </div>

                  <div className="mt-3 text-[11px] text-[#2dd4bf] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore Fund Details & URL</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lead Generation & Advisory Consultation Box */}
        <section id="consult-form-box" className="bg-gradient-to-br from-[#022426] via-[#011c1d] to-[#011415] border border-[#044c4e] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#017374]/30 text-[#c2ece2] border border-[#017374]/60 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4 text-[#2dd4bf]" />
                <span>AMFI Registered Advisory • ARN-363293</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-['Fraunces',serif]">
                Get a Free Portfolio Consultation for {fund?.schemeName.split('-')[0] || 'this Scheme'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
                Our certified advisors will analyze whether this scheme aligns with your risk profile, timeline, and tax bracket.
              </p>
            </div>

            {leadSuccess ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Consultation Request Received!</h4>
                <p className="text-xs text-emerald-200">
                  Our certified advisor will contact you within 2 business hours regarding {fund?.schemeName}.
                </p>
                <button
                  onClick={() => setLeadSuccess(false)}
                  className="mt-3 text-xs text-emerald-400 underline font-semibold"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Full Name *"
                  value={consultName}
                  onChange={(e) => setConsultName(e.target.value)}
                  className="bg-[#011718] border border-[#044547] rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2dd4bf]"
                />

                <input
                  type="tel"
                  required
                  placeholder="10-Digit Mobile *"
                  value={consultPhone}
                  onChange={(e) => setConsultPhone(e.target.value)}
                  className="bg-[#011718] border border-[#044547] rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2dd4bf]"
                />

                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  value={consultEmail}
                  onChange={(e) => setConsultEmail(e.target.value)}
                  className="bg-[#011718] border border-[#044547] rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2dd4bf]"
                />

                <button
                  type="submit"
                  disabled={leadSubmitting}
                  className="sm:col-span-3 bg-[#017374] hover:bg-[#005f60] disabled:opacity-60 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border border-[#2dd4bf]/30 mt-1 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#c2ece2]" />
                  <span>{leadSubmitting ? 'Submitting to Advisor...' : `Request Advisory Consultation for ${fund?.schemeName.split('-')[0] || 'Fund'}`}</span>
                </button>
              </form>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 mt-4">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                100% Free & Confidential
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Direct Plans with 0% Commission
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                SEBI & AMFI Registered Guidance
              </span>
            </div>
          </div>
        </section>

      </main>

      {/* Footer minimal strip */}
      <footer className="bg-[#011112] border-t border-[#032e30] py-6 text-center text-xs text-slate-500">
        <p>Mutual Fund investments are subject to market risks, read all scheme related documents carefully.</p>
        <p className="mt-1">WealthyWiz • AMFI Registered Mutual Fund Distributor ARN-363293</p>
      </footer>

    </div>
  );
};
