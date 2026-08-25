import React from 'react';
import { FundScheme } from '../types';
import { Compass, Calculator, Sparkles, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  moversFunds: FundScheme[];
  onSelectFundForAdvice?: (fund: FundScheme) => void;
}

export const Hero: React.FC<HeroProps> = ({ moversFunds, onSelectFundForAdvice }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const topFourMovers = moversFunds.slice(0, 4);

  return (
    <section className="relative brand-gradient text-slate-100 pt-12 pb-20 sm:pt-16 sm:pb-28 overflow-hidden">
      
      {/* Background Decorative Mesh & Radial Highlights matching avatar mascot */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/20 via-indigo-600/10 to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* AMFI Compliance & Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-[#17144d]/90 border border-cyan-500/40 px-3.5 py-1.5 rounded-full text-xs text-cyan-200 backdrop-blur-sm shadow-md">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold tracking-wide">AMFI Registered Data & Unbiased Advisory</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]"></span>
              <span className="text-cyan-100 font-mono text-[11px]">Free & Public</span>
            </div>

            {/* Display Headline in Fraunces */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] font-['Fraunces',serif]">
              Invest Smarter in India's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] via-[#38bdf8] to-[#22d3ee]">Best Mutual Funds</span>
            </h1>

            {/* Body Copy in IBM Plex Sans */}
            <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Explore live AMFI NAVs, discover your personalized risk profile with our 60-second quiz, compare Mutual Funds vs Fixed Deposits, and get tailored portfolio guidance from certified specialists.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              
              <button
                onClick={() => scrollTo('quiz')}
                className="bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] hover:brightness-105 text-slate-950 font-bold text-sm sm:text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-amber-500/30 active:scale-98 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Take 60-Sec Risk Quiz
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                onClick={() => scrollTo('calculator')}
                className="bg-[#1a215a]/90 hover:bg-[#202970] text-slate-100 hover:text-white border border-[#2e3b8a] font-semibold text-sm sm:text-base px-5 py-3 rounded-xl backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-emerald-400" />
                Compare MF vs FD
              </button>

              <button
                onClick={() => scrollTo('explorer')}
                className="bg-transparent hover:bg-white/10 text-cyan-200 hover:text-cyan-100 font-medium text-sm px-4 py-3 rounded-xl transition-all flex items-center gap-1.5 border border-cyan-500/20"
              >
                <Compass className="w-4 h-4 text-cyan-300" />
                Browse 5,000+ Funds
              </button>

            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">40+</div>
                <div className="text-xs text-slate-300">AMCs Tracked</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-300">100%</div>
                <div className="text-xs text-slate-300">Direct Plan Data</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#fbbf24]">₹0</div>
                <div className="text-xs text-slate-300">Advisory Fee</div>
              </div>
            </div>

          </div>

          {/* Right Column: Live "Today's Movers" Dynamic Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#141242]/95 border border-[#2c327a] rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md relative">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#252a6a]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-['Fraunces',serif]">
                      Today's Market Movers
                    </h3>
                    <p className="text-[11px] text-cyan-200/70">
                      Live daily AMFI NAV updates
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-700/50 font-semibold">
                  REAL-TIME
                </span>
              </div>

              {/* Fund Rows */}
              <div className="divide-y divide-[#232766]/70 mt-2">
                {topFourMovers.map((fund) => {
                  const isPositive = (fund.change1DPct ?? 0) >= 0;
                  return (
                    <div
                      key={fund.schemeCode}
                      className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-800/50 px-2 -mx-2 rounded-lg transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-100 group-hover:text-cyan-200 truncate">
                          {fund.schemeName.replace(' - Direct Plan - Growth', '').replace(' - Direct - Growth', '')}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-cyan-200/60 font-medium">
                            {fund.category}
                          </span>
                          <span className="text-slate-500 text-[10px]">•</span>
                          <span className="text-[10px] text-cyan-300 font-mono font-medium">
                            1Y: +{fund.return1Y}%
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-slate-100 font-mono">
                          ₹{fund.nav.toFixed(2)}
                        </div>
                        <div
                          className={`text-[11px] font-mono font-semibold flex items-center justify-end gap-0.5 ${
                            isPositive ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {isPositive ? '+' : ''}
                          {fund.change1DPct?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Card Footer Call to Action */}
              <div className="mt-4 pt-3 border-t border-[#252a6a] flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Updated from official AMFI feed
                </span>
                <button
                  onClick={() => scrollTo('explorer')}
                  className="text-xs font-semibold text-[#fbbf24] hover:text-amber-300 flex items-center gap-1 group"
                >
                  View All Funds
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
