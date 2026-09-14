import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Coins, 
  HelpCircle, 
  CheckCircle2, 
  Home, 
  ChevronRight, 
  IndianRupee, 
  CreditCard, 
  Target, 
  Zap, 
  FileText,
  Calendar,
  Percent,
  Flame,
  Award,
  BarChart3,
  Info
} from 'lucide-react';
import { formatINR, formatNumberINR } from '../utils/mfapi';
import { CURATED_FUNDS } from '../data/fundsData';
import { FundScheme } from '../types';
import { navigateToRoute, navigateToFund } from '../utils/seoAndRouting';

interface SipCalculatorPageProps {
  onSelectFundForAdvice?: (fund: FundScheme) => void;
}

export const SipCalculatorPage: React.FC<SipCalculatorPageProps> = ({ onSelectFundForAdvice }) => {
  // Mode: Regular SIP, Step-Up SIP, or Lumpsum
  const [calcMode, setCalcMode] = useState<'sip' | 'stepup' | 'lumpsum'>('sip');

  // Core Inputs
  const [monthlyAmount, setMonthlyAmount] = useState<number>(10000); // Default ₹10,000/month
  const [lumpsumAmount, setLumpsumAmount] = useState<number>(100000); // Default ₹1,00,000
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(14.5); // 14.5% Flexi-Cap average
  const [years, setYears] = useState<number>(15); // 15 years standard compounding cycle
  const [stepUpPct, setStepUpPct] = useState<number>(10); // 10% annual top-up
  const [adjustForInflation, setAdjustForInflation] = useState<boolean>(false);
  const inflationRate = 6.0; // 6% Indian long-term inflation benchmark

  // Goal Planner Active Target
  const [goalTarget, setGoalTarget] = useState<number>(10000000); // ₹1 Crore default target
  const [goalYears, setGoalYears] = useState<number>(15);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Return Presets
  const returnPresets = [
    { label: 'Debt / Liquid (7%)', rate: 7.0, tag: 'Conservative' },
    { label: 'Balanced Hybrid (11%)', rate: 11.0, tag: 'Moderate' },
    { label: 'Large Cap / Index (13%)', rate: 13.0, tag: 'Stable' },
    { label: 'Flexi Cap (14.5%)', rate: 14.5, tag: 'High Growth' },
    { label: 'Mid & Small Cap (18%)', rate: 18.0, tag: 'Aggressive' },
  ];

  // Amount Presets
  const amountPresets = [
    { label: '₹2,500', value: 2500 },
    { label: '₹5,000', value: 5000 },
    { label: '₹10,000', value: 10000 },
    { label: '₹25,000', value: 25000 },
    { label: '₹50,000', value: 50000 },
    { label: '₹1 Lakh', value: 100000 },
  ];

  // Calculation Engine
  const results = useMemo(() => {
    const annualRate = annualReturnRate / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = years * 12;

    let totalInvested = 0;
    let maturityValue = 0;
    const yearlyBreakdown: Array<{
      year: number;
      invested: number;
      wealthGain: number;
      futureValue: number;
      inflationAdjustedValue: number;
    }> = [];

    if (calcMode === 'lumpsum') {
      totalInvested = lumpsumAmount;
      maturityValue = lumpsumAmount * Math.pow(1 + annualRate, years);

      for (let yr = 1; yr <= years; yr++) {
        const fv = Math.round(lumpsumAmount * Math.pow(1 + annualRate, yr));
        const gain = Math.max(0, fv - totalInvested);
        const realVal = Math.round(fv / Math.pow(1 + inflationRate / 100, yr));
        yearlyBreakdown.push({
          year: yr,
          invested: totalInvested,
          wealthGain: gain,
          futureValue: fv,
          inflationAdjustedValue: realVal,
        });
      }
    } else {
      // SIP & Step-Up SIP calculation
      const effectiveStepUp = calcMode === 'stepup' ? stepUpPct : 0;
      let currentSip = monthlyAmount;
      let cumulativeInvested = 0;
      let accumulatedFund = 0;

      for (let m = 1; m <= totalMonths; m++) {
        // Step-up applied every 12 months
        if (m > 1 && (m - 1) % 12 === 0 && effectiveStepUp > 0) {
          currentSip = currentSip * (1 + effectiveStepUp / 100);
        }

        cumulativeInvested += currentSip;
        accumulatedFund = (accumulatedFund + currentSip) * (1 + monthlyRate);

        if (m % 12 === 0) {
          const yr = m / 12;
          const fv = Math.round(accumulatedFund);
          const inv = Math.round(cumulativeInvested);
          const gain = Math.max(0, fv - inv);
          const realVal = Math.round(fv / Math.pow(1 + inflationRate / 100, yr));
          yearlyBreakdown.push({
            year: yr,
            invested: inv,
            wealthGain: gain,
            futureValue: fv,
            inflationAdjustedValue: realVal,
          });
        }
      }

      totalInvested = Math.round(cumulativeInvested);
      maturityValue = Math.round(accumulatedFund);
    }

    const wealthGain = Math.max(0, maturityValue - totalInvested);
    const wealthMultiplier = totalInvested > 0 ? +(maturityValue / totalInvested).toFixed(2) : 1;
    const inflationAdjustedMaturity = Math.round(maturityValue / Math.pow(1 + inflationRate / 100, years));

    // Fixed Deposit comparison (Assuming 6.5% quarterly compounding)
    const fdMaturity = calcMode === 'lumpsum'
      ? Math.round(lumpsumAmount * Math.pow(1 + 0.065 / 4, 4 * years))
      : Math.round(
          // Approximate SIP in FD at 6.5%
          (monthlyAmount * (Math.pow(1 + 0.065 / 12, totalMonths) - 1) / (0.065 / 12)) * (1 + 0.065 / 12)
        );

    const extraWealthOverFd = Math.max(0, maturityValue - fdMaturity);

    return {
      totalInvested,
      maturityValue,
      wealthGain,
      wealthMultiplier,
      inflationAdjustedMaturity,
      fdMaturity,
      extraWealthOverFd,
      yearlyBreakdown,
    };
  }, [calcMode, monthlyAmount, lumpsumAmount, annualReturnRate, years, stepUpPct]);

  // Goal Calculator (Required Monthly SIP to reach Goal)
  const requiredGoalSip = useMemo(() => {
    const monthlyRate = (annualReturnRate / 100) / 12;
    const months = goalYears * 12;
    if (months <= 0 || monthlyRate <= 0) return 0;
    // Formula: SIP = Goal / [ (( (1+i)^n - 1 ) / i) * (1+i) ]
    const denominator = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    return Math.round(goalTarget / denominator);
  }, [goalTarget, goalYears, annualReturnRate]);

  // Visual bar ratios
  const investedPercentage = results.maturityValue > 0
    ? Math.round((results.totalInvested / results.maturityValue) * 100)
    : 50;
  const gainPercentage = 100 - investedPercentage;

  const faqs = [
    {
      q: 'What is a Systematic Investment Plan (SIP) and how does it work?',
      a: 'A Systematic Investment Plan (SIP) is a method of investing a predetermined sum into a mutual fund scheme on a recurring monthly date. Through Rupee Cost Averaging, you acquire more mutual fund units when markets decline and fewer units when prices rise, eliminating the risk of timing the market and driving long-term compounding.'
    },
    {
      q: 'What is a Step-Up SIP (Top-Up SIP) and why is it so powerful?',
      a: 'A Step-Up or Top-Up SIP increases your monthly investment automatically by a specified percentage (e.g. 10% annually) to match your annual career increments. Because returns compound exponentially, increasing your SIP by just 10% each year can generate over 75% to 100% higher final corpus over a 15-year period.'
    },
    {
      q: 'What is the famous "15-15-15 Rule" of mutual funds in India?',
      a: 'The 15-15-15 Rule is a classic financial milestone: investing ₹15,000 per month for 15 years at an expected 15% annualized return builds an accumulated wealth corpus of ₹1 Crore (₹10 Million), with your actual invested principal being only ₹27 Lakhs.'
    },
    {
      q: 'What is the difference between SIP and Lumpsum investing?',
      a: 'A Lumpsum investment puts your entire capital into the market all at once, which works best when market valuations are low or during market corrections. A SIP spreads investments across market cycles, making it ideal for salaried individuals and anyone seeking disciplined monthly wealth accumulation without market anxiety.'
    },
    {
      q: 'How are Mutual Fund SIP returns taxed under the latest 2024 Budget rules?',
      a: 'For Equity Mutual Funds: Long-Term Capital Gains (LTCG held for more than 1 year) are taxed at 12.5% on profits exceeding ₹1.25 Lakh per financial year (increased from ₹1 Lakh previously). Short-Term Capital Gains (STCG held for less than 1 year) are taxed at 20%.'
    },
    {
      q: 'How does inflation affect my future SIP maturity corpus?',
      a: 'Inflation erodes purchasing power over time. While ₹1 Crore today buys a house, at 6% annual inflation, ₹1 Crore in 15 years will have the purchasing power of approximately ₹41.7 Lakhs in today\'s money. Our calculator lets you toggle "Inflation Adjusted" to see the real future purchasing value of your wealth.'
    }
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen">
      
      {/* Breadcrumb Navigation & Top Action Bar */}
      <div className="bg-[#021819] text-[#c2ece2] border-b border-[#043638] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-[#c2ece2]/70">
            <button 
              onClick={() => navigateToRoute('home')}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-white font-semibold">SIP Calculator</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateToRoute('loan-against-securities')}
              className="px-3 py-1 bg-amber-950/60 hover:bg-amber-900/70 text-amber-300 rounded-lg text-xs font-semibold border border-amber-500/40 transition-colors flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Loan Against Securities (@ 9.0%)</span>
            </button>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#043335] text-[#c2ece2] border border-[#0d9488]/40">
              AMFI ARN-363293
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#021d1e] via-[#02282a] to-[#013536] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/30 text-teal-300 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Compounding Engine • Step-Up & Inflation Adjusted</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-['Fraunces',serif] leading-tight">
              SIP Calculator — Systematic Investment Plan Wealth Multiplier
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Plan your path to financial freedom. Calculate compound growth on monthly SIP investments, model annual Step-Up top-ups with career raises, and simulate your ₹1 Crore to ₹5 Crore retirement corpus.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Exponential Compounding</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Annual Step-Up Top-Up</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Inflation-Adjusted Real Value</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-300" />
                <span>Compare vs Bank FDs & PPF</span>
              </span>
            </div>

          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Calculator Main Section */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Controls (6 Cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Strategy Mode Switcher */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Select Investment Mode
              </label>
              <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setCalcMode('sip')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    calcMode === 'sip'
                      ? 'bg-[#017374] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly SIP
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode('stepup')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    calcMode === 'stepup'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Step-Up SIP</span>
                  <span className="text-[9px] bg-white/20 px-1 py-0.2 rounded font-mono">+TopUp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalcMode('lumpsum')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    calcMode === 'lumpsum'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  One-Time Lumpsum
                </button>
              </div>
            </div>

            {/* Monthly Investment or Lumpsum Amount Input */}
            {calcMode === 'lumpsum' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    One-Time Lumpsum Investment
                  </label>
                  <div className="text-lg font-bold font-mono text-slate-900">
                    {formatINR(lumpsumAmount)}
                  </div>
                </div>

                <input
                  type="range"
                  min={10000}
                  max={5000000}
                  step={10000}
                  value={lumpsumAmount}
                  onChange={(e) => setLumpsumAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#017374]"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  {[50000, 100000, 250000, 500000, 1000000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setLumpsumAmount(amt)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                        lumpsumAmount === amt
                          ? 'bg-[#017374] text-white border-[#017374]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Monthly SIP Investment Amount
                  </label>
                  <div className="text-lg font-bold font-mono text-[#017374]">
                    {formatINR(monthlyAmount)} <span className="text-xs text-slate-500 font-normal">/month</span>
                  </div>
                </div>

                <input
                  type="range"
                  min={500}
                  max={200000}
                  step={500}
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#017374]"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  {amountPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setMonthlyAmount(preset.value)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                        monthlyAmount === preset.value
                          ? 'bg-[#017374] text-white border-[#017374]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step-Up Rate Slider (When Step-Up Mode is Active) */}
            {calcMode === 'stepup' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                      Annual Step-Up (Top-Up) Percentage
                    </span>
                    <span className="text-[11px] text-amber-800">
                      Increase your monthly SIP every 12 months with salary appraisals.
                    </span>
                  </div>
                  <span className="text-base font-bold font-mono text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg">
                    +{stepUpPct}% / yr
                  </span>
                </div>

                <input
                  type="range"
                  min={5}
                  max={25}
                  step={1}
                  value={stepUpPct}
                  onChange={(e) => setStepUpPct(Number(e.target.value))}
                  className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />

                <div className="flex gap-2 pt-1">
                  {[5, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setStepUpPct(pct)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                        stepUpPct === pct
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white hover:bg-amber-100/50 text-amber-900 border-amber-200'
                      }`}
                    >
                      +{pct}% Annual
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Expected Annual Return Rate Slider & Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Expected Return Rate (p.a.)
                </label>
                <div className="text-base font-bold font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                  {annualReturnRate}% p.a.
                </div>
              </div>

              <input
                type="range"
                min={5.0}
                max={25.0}
                step={0.5}
                value={annualReturnRate}
                onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                {returnPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setAnnualReturnRate(preset.rate)}
                    className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                      annualReturnRate === preset.rate
                        ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="font-bold">{preset.rate}%</span>
                    <span className={`text-[10px] ${annualReturnRate === preset.rate ? 'text-emerald-200' : 'text-slate-500'}`}>
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Tenure (Years) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Investment Time Horizon
                </label>
                <div className="text-base font-bold font-mono text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  {years} Years <span className="text-xs text-slate-500 font-normal">({years * 12} installments)</span>
                </div>
              </div>

              <input
                type="range"
                min={1}
                max={35}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#017374]"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                {[3, 5, 10, 15, 20, 25, 30].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setYears(yr)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                      years === yr
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {yr} Yrs
                  </button>
                ))}
              </div>
            </div>

            {/* Inflation Adjustment Toggle */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Inflation Adjustment (6.0% p.a.)
                </span>
                <span className="text-[11px] text-slate-500">
                  View purchasing power in today's money value.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAdjustForInflation(!adjustForInflation)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  adjustForInflation ? 'bg-[#017374]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    adjustForInflation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Right Column: Output Cards & Growth Schedule (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Primary Corpus Highlight Card */}
            <div className="bg-gradient-to-br from-[#021d1e] via-[#022c2e] to-[#013f41] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-[#044c4e]">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    Total Estimated Corpus
                  </span>
                  <div className="text-3xl sm:text-4xl font-bold font-mono text-white mt-1">
                    {adjustForInflation
                      ? formatINR(results.inflationAdjustedMaturity)
                      : formatINR(results.maturityValue)}
                  </div>
                  {adjustForInflation && (
                    <div className="text-[11px] text-teal-300 mt-0.5">
                      (Inflation-Adjusted Purchasing Power • Nominal: {formatINR(results.maturityValue)})
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-300 uppercase">Wealth Multiplier</span>
                  <div className="text-2xl font-bold font-mono text-amber-400">
                    {results.wealthMultiplier}x
                  </div>
                </div>
              </div>

              {/* Breakdown Split: Invested vs Wealth Gain */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                    <span>Total Invested</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-100">
                    {formatINR(results.totalInvested)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {investedPercentage}% of corpus
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                  <div className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Estimated Wealth Gain</span>
                  </div>
                  <div className="text-lg font-bold font-mono text-emerald-300">
                    +{formatINR(results.wealthGain)}
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    {gainPercentage}% pure compounding
                  </div>
                </div>
              </div>

              {/* Ratio Visual Bar */}
              <div className="space-y-1.5">
                <div className="h-3 w-full bg-slate-700/60 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${investedPercentage}%` }} 
                    className="bg-slate-400 transition-all duration-500" 
                    title={`Invested: ${investedPercentage}%`}
                  />
                  <div 
                    style={{ width: `${gainPercentage}%` }} 
                    className="bg-emerald-400 transition-all duration-500" 
                    title={`Gain: ${gainPercentage}%`}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                  <span>Principal: {formatINR(results.totalInvested)}</span>
                  <span className="text-emerald-300">Gain: +{formatINR(results.wealthGain)}</span>
                </div>
              </div>

              {/* FD Comparison Callout */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-300">Bank Fixed Deposit (6.5%):</span>
                  <div className="font-bold font-mono text-slate-100">{formatINR(results.fdMaturity)}</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-300 font-bold">Extra SIP Gain over FD:</span>
                  <div className="font-bold font-mono text-emerald-400">+{formatINR(results.extraWealthOverFd)}</div>
                </div>
              </div>

            </div>

            {/* Goal-Based SIP Quick Helper Box */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base font-['Fraunces',serif]">
                <Target className="w-5 h-5 text-amber-500" />
                <span>Goal-Based SIP Target Planner</span>
              </div>
              <p className="text-xs text-slate-500">
                Want to build a specific corpus? See the exact monthly SIP required at {annualReturnRate}% return.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: '₹25 Lakhs', val: 2500000 },
                  { label: '₹50 Lakhs', val: 5000000 },
                  { label: '₹1 Crore', val: 10000000 },
                  { label: '₹5 Crores', val: 50000000 },
                ].map((g) => (
                  <button
                    key={g.label}
                    type="button"
                    onClick={() => setGoalTarget(g.val)}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-colors ${
                      goalTarget === g.val
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-900 font-semibold">
                    To reach {formatINR(goalTarget)} in {years} years:
                  </div>
                  <div className="text-xl font-bold font-mono text-amber-950 mt-0.5">
                    {formatINR(requiredGoalSip)} <span className="text-xs font-normal">/month</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMonthlyAmount(requiredGoalSip);
                    setCalcMode('sip');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Apply to SIP
                </button>
              </div>
            </div>

            {/* Need Liquidity Against Existing SIPs Banner */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Already Have Accumulated Mutual Funds?</span>
                </span>
                <p className="text-xs text-slate-300">
                  Don't break your SIPs or trigger 12.5% LTCG tax. Borrow against them at <strong className="text-amber-300">9.0%</strong>.
                </p>
              </div>
              <button
                onClick={() => navigateToRoute('loan-against-securities')}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex-shrink-0 transition-colors shadow-sm"
              >
                View LAS
              </button>
            </div>

          </div>

        </div>

        {/* Compounding Growth Schedule Table */}
        <div className="mt-16 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 font-['Fraunces',serif]">
                Year-by-Year Wealth Compounding Schedule
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Notice how compounding starts slow in the first 5 years and accelerates exponentially in years 10 to {years}.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 bg-teal-50 text-teal-800 rounded-full border border-teal-200 self-start sm:self-auto">
              Compounded @ {annualReturnRate}% p.a.
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="p-3">Year</th>
                  <th className="p-3">Total Invested</th>
                  <th className="p-3 text-emerald-700">Wealth Gain</th>
                  <th className="p-3 text-slate-900 font-bold">Future Value (Nominal)</th>
                  {adjustForInflation && <th className="p-3 text-teal-800">Purchasing Power (Real)</th>}
                  <th className="p-3 text-right">Growth Multiplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {results.yearlyBreakdown.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-bold font-mono text-slate-900">Year {row.year}</td>
                    <td className="p-3 font-mono">{formatINR(row.invested)}</td>
                    <td className="p-3 font-mono font-semibold text-emerald-700">+{formatINR(row.wealthGain)}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{formatINR(row.futureValue)}</td>
                    {adjustForInflation && (
                      <td className="p-3 font-mono text-teal-800">{formatINR(row.inflationAdjustedValue)}</td>
                    )}
                    <td className="p-3 font-mono text-right text-slate-600">
                      {row.invested > 0 ? (row.futureValue / row.invested).toFixed(2) : 1}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Curated Funds Recommendation for SIP */}
        <div className="mt-16 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[11px] font-bold uppercase tracking-wider mb-1 border border-teal-200">
                <Award className="w-3.5 h-3.5 text-teal-600" />
                <span>Top Compounding Vehicles</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-['Fraunces',serif]">
                Curated High-Alpha Direct Mutual Funds for SIP
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hand-picked direct growth plans with 5-year track records exceeding 20%+ CAGR.
              </p>
            </div>

            <button
              onClick={() => navigateToRoute('home')}
              className="text-xs font-bold text-[#017374] hover:text-[#024a4b] flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View All 15+ Schemes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {CURATED_FUNDS.slice(0, 3).map((fund) => (
              <div 
                key={fund.schemeCode}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-[#017374]/50 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-900 font-bold">
                    {fund.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {fund.return3Y}% (3Y)
                  </span>
                </div>

                <div>
                  <h4 
                    onClick={() => navigateToFund(fund)}
                    className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug cursor-pointer hover:text-[#017374] transition-colors"
                    title={`Open dedicated page for ${fund.schemeName}`}
                  >
                    {fund.schemeName}
                  </h4>
                  <div className="text-[11px] text-slate-500 mt-1">
                    NAV: <strong className="text-slate-800 font-mono">₹{fund.nav}</strong> • Min SIP: ₹{fund.minSipAmount}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigateToFund(fund)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    View Fund →
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectFundForAdvice) {
                        onSelectFundForAdvice(fund);
                      }
                      navigateToRoute('home');
                    }}
                    className="text-xs font-bold text-[#017374] hover:underline flex items-center gap-1"
                  >
                    <span>Get Advisory</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO FAQ Accordion */}
        <div className="mt-16 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Fraunces',serif]">
              Frequently Asked Questions About Mutual Fund SIPs
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Key insights into compounding, step-up strategies, and capital gains taxation.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-[#017374] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 text-sm">
                    {activeFaq === index ? '−' : '+'}
                  </span>
                </button>

                {activeFaq === index && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA to Loan Against Securities & Advisor Vault */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#021d1e] to-[#044c4e] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-bold font-['Fraunces',serif]">
              Need Instant Liquidity Against Your Mutual Funds?
            </h4>
            <p className="text-xs sm:text-sm text-[#c2ece2]/80 max-w-xl">
              Don't redeem your SIP units and lose compounding returns. Avail an instant overdraft facility starting at 9.0% p.a.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={() => navigateToRoute('loan-against-securities')}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Loan Against Securities (@ 9.0%)</span>
            </button>
            <button
              onClick={() => navigateToRoute('home')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
            >
              Back to Home Explorer
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};
