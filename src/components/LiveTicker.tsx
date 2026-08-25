import React from 'react';
import { FundScheme } from '../types';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface LiveTickerProps {
  funds: FundScheme[];
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ funds }) => {
  // Duplicate for seamless infinite ticker loop
  const tickerItems = [...funds, ...funds];

  return (
    <div className="bg-[#14113e] border-y border-[#232766] text-slate-200 overflow-hidden py-2 select-none relative shadow-inner">
      <div className="flex items-center">
        
        {/* Live Badge Fixed Left */}
        <div className="z-10 pl-3 pr-4 bg-[#14113e] flex items-center gap-1.5 border-r border-[#2d3480] shadow-lg text-[11px] font-semibold tracking-wide text-cyan-300 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="font-mono uppercase tracking-wider text-[10px]">AMFI LIVE NAV</span>
        </div>

        {/* Scrolling Ticker Stream */}
        <div className="overflow-hidden flex-1 relative flex items-center">
          <div className="animate-ticker flex items-center gap-8 pl-4">
            {tickerItems.map((fund, idx) => {
              const isPositive = (fund.change1DPct ?? 0) >= 0;
              return (
                <div
                  key={`${fund.schemeCode}-${idx}`}
                  className="flex items-center gap-2 text-xs shrink-0 cursor-pointer hover:bg-[#1f2669] px-2 py-1 rounded transition-colors"
                  onClick={() => {
                    const el = document.getElementById('explorer');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span className="font-medium text-slate-300 truncate max-w-[200px]">
                    {fund.schemeName.replace(' - Direct Plan - Growth', '').replace(' - Direct - Growth', '')}
                  </span>
                  <span className="font-mono font-semibold text-slate-100">
                    ₹{fund.nav.toFixed(2)}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                      isPositive
                        ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40'
                        : 'text-rose-400 bg-rose-950/60 border border-rose-800/40'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                    )}
                    {isPositive ? '+' : ''}
                    {fund.change1DPct?.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
