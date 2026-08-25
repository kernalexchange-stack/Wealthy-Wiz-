import React, { useState, useMemo } from 'react';
import { CalculatorInputs } from '../types';
import { calculateReturns } from '../utils/calculator';
import { CATEGORY_RETURN_PRESETS } from '../data/fundsData';
import { formatINR, formatNumberINR } from '../utils/mfapi';
import { Calculator, ArrowRight, Sparkles, TrendingUp, ShieldCheck, Flame, Zap, HelpCircle } from 'lucide-react';

export const ReturnCalculator: React.FC = () => {
  const [mode, setMode] = useState<'sip' | 'lumpsum'>('sip');
  const [selectedCategory, setSelectedCategory] = useState('Flexi Cap');
  const [amount, setAmount] = useState<number>(10000); // Default ₹10,000 monthly or ₹1,00,000 lumpsum
  const [years, setYears] = useState<number>(10);
  const [mfExpectedReturn, setMfExpectedReturn] = useState<number>(14.5);
  const [fdInterestRate, setFdInterestRate] = useState<number>(6.5); // Default 6.5% as per README
  const [stepUpPct, setStepUpPct] = useState<number>(10); // Optional 10% annual step up

  // Handle category preset change
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    const preset = CATEGORY_RETURN_PRESETS[cat];
    if (preset) {
      setMfExpectedReturn(preset.mfRate);
    }
  };

  // Recompute results live on every input change
  const results = useMemo(() => {
    const inputs: CalculatorInputs = {
      mode,
      categoryPreset: selectedCategory,
      amount,
      years,
      mfExpectedReturn,
      fdInterestRate,
      stepUpPct: mode === 'sip' ? stepUpPct : 0,
    };
    return calculateReturns(inputs);
  }, [mode, selectedCategory, amount, years, mfExpectedReturn, fdInterestRate, stepUpPct]);

  const handleScrollToAdvice = () => {
    const el = document.getElementById('advice');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="calculator" className="py-16 sm:py-24 bg-[#f8fafc] text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-900 text-xs font-semibold uppercase tracking-wider mb-3 border border-cyan-200">
            <Calculator className="w-3.5 h-3.5 text-cyan-700" />
            Compounding & Wealth Multiplier
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-['Fraunces',serif]">
            Mutual Fund vs Fixed Deposit Return Calculator
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            See the exact compounding difference side-by-side. Compare how equity mutual funds outpace bank Fixed Deposits after inflation and taxes over your investment horizon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Form (Left 5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
            
            {/* Mode Switcher: SIP vs Lumpsum */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Investment Strategy Mode
              </label>
              <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => {
                    setMode('sip');
                    if (amount > 100000) setAmount(10000);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === 'sip'
                      ? 'bg-[#161448] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly SIP
                </button>
                <button
                  onClick={() => {
                    setMode('lumpsum');
                    if (amount < 25000) setAmount(100000);
                  }}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    mode === 'lumpsum'
                      ? 'bg-[#161448] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  One-Time Lumpsum
                </button>
              </div>
            </div>

            {/* Category Return Preset Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Target Fund Category
                </label>
                <span className="text-[11px] text-cyan-700 font-semibold font-mono">
                  Benchmark: {CATEGORY_RETURN_PRESETS[selectedCategory]?.mfRate}% p.a.
                </span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
              >
                {Object.keys(CATEGORY_RETURN_PRESETS).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} (Assumed ~{CATEGORY_RETURN_PRESETS[cat].mfRate}% p.a.)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                {CATEGORY_RETURN_PRESETS[selectedCategory]?.desc}
              </p>
            </div>

            {/* Investment Amount Slider & Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {mode === 'sip' ? 'Monthly SIP Amount' : 'Lumpsum Investment Amount'}
                </label>
                <span className="text-base font-bold font-mono text-slate-900">
                  ₹{formatNumberINR(amount)}
                </span>
              </div>
              <input
                type="range"
                min={mode === 'sip' ? 500 : 5000}
                max={mode === 'sip' ? 150000 : 5000000}
                step={mode === 'sip' ? 500 : 10000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>{mode === 'sip' ? '₹500/mo' : '₹5,000'}</span>
                <span>{mode === 'sip' ? '₹1.5 Lakh/mo' : '₹50 Lakhs'}</span>
              </div>
            </div>

            {/* Investment Horizon Slider & Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Time Horizon
                </label>
                <span className="text-base font-bold font-mono text-slate-900">
                  {years} {years === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>1 Year</span>
                <span>15 Years</span>
                <span>30 Years</span>
              </div>
            </div>

            {/* Rates Comparison Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              
              {/* Mutual Fund Rate */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  MF Expected Return (%)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={5}
                    max={30}
                    step={0.5}
                    value={mfExpectedReturn}
                    onChange={(e) => setMfExpectedReturn(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold font-mono text-cyan-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
              </div>

              {/* FD Rate (6.5% default as per README) */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Bank FD Rate (%)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={3}
                    max={10}
                    step={0.1}
                    value={fdInterestRate}
                    onChange={(e) => setFdInterestRate(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400"
                  />
                  <span className="text-xs font-bold text-slate-500">%</span>
                </div>
              </div>

            </div>

            {/* Optional Step-Up SIP */}
            {mode === 'sip' && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-[#fbbf24]" />
                      Annual SIP Step-Up (%)
                    </span>
                    <span className="text-[10px] text-slate-400 block">Increase SIP yearly with salary hikes</span>
                  </div>
                  <select
                    value={stepUpPct}
                    onChange={(e) => setStepUpPct(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold font-mono text-slate-800"
                  >
                    <option value={0}>0% (Flat)</option>
                    <option value={5}>+5% / yr</option>
                    <option value={10}>+10% / yr (Recommended)</option>
                    <option value={15}>+15% / yr</option>
                    <option value={20}>+20% / yr</option>
                  </select>
                </div>
              </div>
            )}

          </div>

          {/* Side-by-Side Comparison Output (Right 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Wealth Advantage Hero Callout */}
            <div className="brand-gradient-dark text-white p-6 sm:p-7 rounded-3xl border border-[#2b3378] shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-cyan-950/90 text-cyan-300 px-3 py-1 rounded-full border border-cyan-800/60">
                  <Flame className="w-3.5 h-3.5 text-[#fbbf24]" />
                  Mutual Fund Wealth Edge
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {years} Years Compounding
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-300">
                  Extra Wealth Generated by Mutual Funds over Fixed Deposit:
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#38bdf8] tracking-tight">
                  +{formatINR(results.extraWealthOverFd)}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
                <div>
                  Capital Multiplier: <span className="font-bold text-cyan-300 font-mono text-sm">{results.wealthMultiplier}x</span> of invested money
                </div>
                <button
                  onClick={handleScrollToAdvice}
                  className="text-xs font-bold text-white hover:text-amber-300 flex items-center gap-1 underline underline-offset-4"
                >
                  Create Custom SIP Plan <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SIDE-BY-SIDE RESULT CARDS: MUTUAL FUND VS FIXED DEPOSIT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Card 1: Mutual Fund Outcome */}
              <div className="bg-white border-2 border-cyan-500/40 rounded-3xl p-5 shadow-sm space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-900 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
                    Mutual Fund ({mfExpectedReturn}% p.a.)
                  </span>
                  <TrendingUp className="w-4 h-4 text-cyan-600" />
                </div>

                <div>
                  <div className="text-xs text-slate-500 font-medium">Estimated Maturity Corpus</div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono mt-0.5">
                    {formatINR(results.mfMaturityValue)}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Invested:</span>
                    <span className="font-bold text-slate-900 font-mono">{formatINR(results.totalInvested)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Gains:</span>
                    <span className="font-bold text-emerald-700 font-mono">+{formatINR(results.mfWealthGain)}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Fixed Deposit Outcome */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                    Bank Fixed Deposit ({fdInterestRate}% p.a.)
                  </span>
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                </div>

                <div>
                  <div className="text-xs text-slate-500 font-medium">Estimated Maturity Corpus</div>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-700 font-mono mt-0.5">
                    {formatINR(results.fdMaturityValue)}
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Invested:</span>
                    <span className="font-bold text-slate-900 font-mono">{formatINR(results.totalInvested)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Gains:</span>
                    <span className="font-bold text-slate-700 font-mono">+{formatINR(results.fdWealthGain)}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Growth Breakdown Table */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs">
              <div className="font-bold text-slate-800 mb-2">Milestone Year-by-Year Growth Check</div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="pb-1.5">Timeline</th>
                      <th className="pb-1.5">Total Invested</th>
                      <th className="pb-1.5 text-cyan-700">Mutual Fund</th>
                      <th className="pb-1.5 text-slate-600">Fixed Deposit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                    {results.yearlyBreakdown.filter((_, idx) => {
                      const total = results.yearlyBreakdown.length;
                      if (total <= 5) return true;
                      return idx === 0 || idx === 2 || idx === 4 || idx === 9 || idx === total - 1;
                    }).map((row) => (
                      <tr key={row.year} className="hover:bg-slate-50">
                        <td className="py-1.5 font-sans font-medium text-slate-800">Year {row.year}</td>
                        <td className="py-1.5">{formatINR(row.invested)}</td>
                        <td className="py-1.5 font-bold text-cyan-700">{formatINR(row.mfValue)}</td>
                        <td className="py-1.5 text-slate-500">{formatINR(row.fdValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
