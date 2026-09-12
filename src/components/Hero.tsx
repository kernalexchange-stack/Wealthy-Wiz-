import React from 'react';
import { FundScheme } from '../types';
import { Compass, Calculator, Sparkles, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Zap, CreditCard } from 'lucide-react';

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
      
      {/* Background Decorative Mesh & Radial Highlights matching royal burgundy & gold theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-500/20 via-amber-600/10 to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* AMFI & LAMF Top Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 bg-[#022b2c]/90 border border-[#017374] px-3.5 py-1.5 rounded-full text-xs text-[#c2ece2] backdrop-blur-sm shadow-md">
                <ShieldCheck className="w-4 h-4 text-[#2dd4bf]" />
                <span className="font-semibold tracking-wide">AMFI Registered Distributor</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2dd4bf]"></span>
                <span className="text-white font-mono font-bold text-[11px] bg-[#017374] px-2 py-0.5 rounded border border-[#2dd4bf]/30">ARN-363293</span>
              </div>

              <button
                onClick={() => scrollTo('loan-against-mf')}
                className="inline-flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 px-3 py-1.5 rounded-full text-xs text-amber-200 backdrop-blur-sm transition-all cursor-pointer shadow-sm group"
              >
                <CreditCard className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="font-bold">⚡ Loan Against MF @ 9.5%</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-bold">New</span>
              </button>
            </div>

            {/* Display Headline in Cardia / Echo & Keenon */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] font-cardia">
              Invest Smarter in India's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c2ece2] via-[#2dd4bf] to-[#017374]">Best Mutual Funds</span>
            </h1>

            {/* Body Copy in Plus Jakarta Sans */}
            <p className="text-base sm:text-lg text-slate-200/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Explore live AMFI NAVs, discover your personalized risk profile with our 60-second quiz, compare Mutual Funds vs Fixed Deposits, or get an instant <strong>Loan Against Mutual Funds (LAMF)</strong> starting at 9.5% without selling your portfolio.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              
              <button
                onClick={() => scrollTo('quiz')}
                className="bg-gradient-to-r from-[#c2ece2] via-[#2dd4bf] to-[#017374] hover:brightness-105 text-slate-950 font-bold text-sm sm:text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-[#017374]/30 active:scale-98 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#013536]" />
                <span>Take 60-Sec Risk Quiz</span>
                <ArrowRight className="w-4 h-4 ml-0.5 text-[#013536]" />
              </button>

              <button
                onClick={() => scrollTo('loan-against-mf')}
                className="bg-[#017374] hover:bg-[#005f60] text-white font-semibold text-sm sm:text-base px-5 py-3 rounded-xl border border-[#2dd4bf]/40 backdrop-blur-sm transition-all flex items-center gap-2 shadow-md shadow-[#017374]/30"
              >
                <CreditCard className="w-4 h-4 text-[#c2ece2]" />
                Loan Against MF (LAMF)
              </button>

              <button
                onClick={() => scrollTo('calculator')}
                className="bg-[#022829]/90 hover:bg-[#033b3d] text-slate-100 hover:text-white border border-[#045254] font-semibold text-sm sm:text-base px-5 py-3 rounded-xl backdrop-blur-sm transition-all flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-[#2dd4bf]" />
                Compare MF vs FD
              </button>

              <button
                onClick={() => scrollTo('explorer')}
                className="bg-transparent hover:bg-white/10 text-[#c2ece2] hover:text-white font-medium text-sm px-4 py-3 rounded-xl transition-all flex items-center gap-1.5 border border-[#2dd4bf]/30"
              >
                <Compass className="w-4 h-4 text-[#2dd4bf]" />
                Browse 5,000+ Funds
              </button>

            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-4 gap-3 pt-6 border-t border-white/10 max-w-xl mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white">40+</div>
                <div className="text-xs text-slate-300">AMCs Tracked</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#c2ece2]">100%</div>
                <div className="text-xs text-slate-300">Direct Plan Data</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-amber-300">₹0</div>
                <div className="text-xs text-slate-300">Advisory Fee</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#2dd4bf]">9.5%</div>
                <div className="text-xs text-slate-300">LAMF Starting ROI</div>
              </div>
            </div>

          </div>

          {/* Right Column: Live "Today's Movers" Dynamic Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#021d1e]/95 border border-[#044c4e] rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-md relative">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#033638]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#017374]/20 text-[#c2ece2] border border-[#017374]/40">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-cardia">
                      Today's Market Movers
                    </h3>
                    <p className="text-[11px] text-[#c2ece2]/70">
                      Live daily AMFI NAV updates
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/50 font-semibold">
                  REAL-TIME
                </span>
              </div>

              {/* Fund Rows */}
              <div className="divide-y divide-[#331127]/70 mt-2">
                {topFourMovers.map((fund) => {
                  const isPositive = (fund.change1DPct ?? 0) >= 0;
                  return (
                    <div
                      key={fund.schemeCode}
                      className="py-3 flex items-center justify-between gap-3 group hover:bg-white/5 px-2 -mx-2 rounded-lg transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-slate-100 group-hover:text-rose-200 truncate">
                          {fund.schemeName.replace(' - Direct Plan - Growth', '').replace(' - Direct - Growth', '')}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-rose-200/60 font-medium">
                            {fund.category}
                          </span>
                          <span className="text-slate-500 text-[10px]">•</span>
                          <span className="text-[10px] text-[#2dd4bf] font-mono font-medium">
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
                            isPositive ? 'text-[#2dd4bf]' : 'text-rose-400'
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
              <div className="mt-4 pt-3 border-t border-[#033638] flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Updated from official AMFI feed
                </span>
                <button
                  onClick={() => scrollTo('explorer')}
                  className="text-xs font-semibold text-[#c2ece2] hover:text-[#5eead4] flex items-center gap-1 group"
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
