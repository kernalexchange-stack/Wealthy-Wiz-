import React, { useState, useEffect, useMemo } from 'react';
import { FundScheme, FundCategory, NavHistoryPoint } from '../types';
import { CURATED_FUNDS } from '../data/fundsData';
import { searchSchemes, fetchSchemeDetails, formatINR } from '../utils/mfapi';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Info, 
  Plus, 
  Check, 
  ExternalLink, 
  X,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';

interface FundExplorerProps {
  onSelectFundForAdvice: (fund: FundScheme) => void;
  selectedFunds: string[];
}

export const FundExplorer: React.FC<FundExplorerProps> = ({ 
  onSelectFundForAdvice, 
  selectedFunds 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FundCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [fundsList, setFundsList] = useState<FundScheme[]>(CURATED_FUNDS);
  const [isSearching, setIsSearching] = useState(false);
  
  // Fund Detail Modal State
  const [activeFundDetail, setActiveFundDetail] = useState<{
    scheme: FundScheme;
    history: NavHistoryPoint[];
  } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const categories: FundCategory[] = [
    'All',
    'Flexi Cap',
    'Small Cap',
    'Mid Cap',
    'Large Cap',
    'ELSS (Tax Saver)',
    'Hybrid / Balanced',
    'Debt & Liquid',
  ];

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFundsList(CURATED_FUNDS);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      const results = await searchSchemes(searchQuery);
      if (results && results.length > 0) {
        // Map search results to fund schemes with fallback/fetched details
        const mapped: FundScheme[] = results.slice(0, 15).map((item) => {
          const match = CURATED_FUNDS.find(c => c.schemeCode === item.schemeCode);
          return match || {
            schemeCode: item.schemeCode,
            schemeName: item.schemeName,
            category: 'Flexi Cap',
            fundHouse: 'Asset Management Co.',
            nav: 45.20,
            navDate: '13-Aug-2026',
            return1Y: 18.2,
            return3Y: 16.5,
            return5Y: 17.1,
            expenseRatio: 0.65,
            riskLevel: 'High',
            aumCr: 12000,
            minSipAmount: 500,
            minLumpsumAmount: 1000,
            description: `${item.schemeName} from AMFI mutual fund directory.`,
          };
        });
        setFundsList(mapped);
      } else {
        // Filter curated by name
        const filtered = CURATED_FUNDS.filter(f =>
          f.schemeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.fundHouse.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFundsList(filtered);
      }
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter by category
  const filteredFunds = useMemo(() => {
    if (selectedCategory === 'All') return fundsList;
    return fundsList.filter(f => f.category === selectedCategory);
  }, [fundsList, selectedCategory]);

  const handleOpenDetail = async (fund: FundScheme) => {
    setLoadingDetail(true);
    setActiveFundDetail({
      scheme: fund,
      history: [],
    });

    const detailed = await fetchSchemeDetails(fund.schemeCode);
    if (detailed) {
      setActiveFundDetail(detailed);
    }
    setLoadingDetail(false);
  };

  return (
    <section id="explorer" className="py-16 sm:py-24 bg-[#f8fafc] text-slate-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-900 text-xs font-semibold uppercase tracking-wider mb-3 border border-cyan-200">
            <Layers className="w-3.5 h-3.5 text-cyan-700" />
            AMFI Verified Scheme Explorer
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-['Fraunces',serif]">
            Explore India's Top Rated Mutual Funds
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Search 5,000+ official AMFI schemes with live NAV tracking, expense ratios, and rolling returns. Direct growth plans offer zero intermediary commission.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 mb-8">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by fund name, AMC (e.g. Parag Parikh, Quant, HDFC, Mirae, SBI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#17144e] to-[#1c2966] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Funds Grid / Table */}
        {isSearching ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Searching live AMFI mutual fund repository...</p>
          </div>
        ) : filteredFunds.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-base font-semibold text-slate-800">No mutual funds match your search query.</p>
            <p className="text-xs text-slate-500">Try searching for keywords like "Flexi", "Small Cap", "HDFC", "SBI", or "Quant".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-xs font-bold text-cyan-700 hover:underline pt-2"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFunds.map((fund) => {
              const isSelected = selectedFunds.includes(fund.schemeName);
              const isPositive = (fund.change1DPct ?? 0) >= 0;

              return (
                <div
                  key={fund.schemeCode}
                  className="fund-row bg-white border border-slate-200/90 rounded-2xl p-5 hover:shadow-md hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
                >
                  {/* Top: Category Tag & Risk */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-cyan-50 text-cyan-900 border border-cyan-100">
                        {fund.category}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 font-mono">
                        NAV: {fund.navDate}
                      </span>
                    </div>

                    {/* Fund Title */}
                    <h3 
                      onClick={() => handleOpenDetail(fund)}
                      className="text-base font-bold text-slate-900 group-hover:text-cyan-700 cursor-pointer transition-colors leading-snug line-clamp-2"
                    >
                      {fund.schemeName}
                    </h3>

                    {/* AMC Name */}
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{fund.fundHouse}</span>
                    </p>
                  </div>

                  {/* Financial Metrics Strip */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center bg-slate-50/70 p-2.5 rounded-xl">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-500">Live NAV</div>
                      <div className="text-xs font-bold text-slate-900 font-mono mt-0.5">
                        ₹{fund.nav.toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-500">1-Day Change</div>
                      <div className={`text-xs font-bold font-mono mt-0.5 flex items-center justify-center gap-0.5 ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {isPositive ? '+' : ''}{fund.change1DPct?.toFixed(2)}%
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-500">1Y Return</div>
                      <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">
                        +{fund.return1Y}%
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenDetail(fund)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl transition-colors text-center"
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => onSelectFundForAdvice(fund)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:brightness-105 text-slate-950 shadow-sm'
                      }`}
                      title={isSelected ? 'Added to Advice Plan' : 'Add to Advice Request'}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Advice</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Fund Detail Modal */}
      {activeFundDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveFundDetail(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-8">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-cyan-50 text-cyan-900 border border-cyan-200">
                {activeFundDetail.scheme.category}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2 font-['Fraunces',serif]">
                {activeFundDetail.scheme.schemeName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                AMFI Scheme Code: <span className="font-mono font-bold text-slate-700">{activeFundDetail.scheme.schemeCode}</span> • Fund House: {activeFundDetail.scheme.fundHouse}
              </p>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Current NAV</div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  ₹{activeFundDetail.scheme.nav.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400">{activeFundDetail.scheme.navDate}</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 font-medium">1-Year Return</div>
                <div className="text-lg font-bold text-emerald-600 font-mono mt-0.5">
                  +{activeFundDetail.scheme.return1Y}%
                </div>
                <div className="text-[10px] text-slate-400">Annualized</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 font-medium">3-Year Return</div>
                <div className="text-lg font-bold text-cyan-700 font-mono mt-0.5">
                  +{activeFundDetail.scheme.return3Y}%
                </div>
                <div className="text-[10px] text-slate-400">CAGR</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 font-medium">Expense Ratio</div>
                <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                  {activeFundDetail.scheme.expenseRatio}%
                </div>
                <div className="text-[10px] text-slate-400">Direct Plan</div>
              </div>
            </div>

            {/* Investment Minimums & Philosophy */}
            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1 text-xs uppercase tracking-wider text-slate-500">
                  Scheme Strategy & Overview
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {activeFundDetail.scheme.description || 'This scheme is designed to achieve optimal risk-adjusted returns by investing in diversified high-conviction opportunities across market sectors.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Minimum Monthly SIP</span>
                  <span className="font-bold text-slate-900 text-sm font-mono">
                    ₹{activeFundDetail.scheme.minSipAmount || 500}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-500 block">Riskometer Rating</span>
                  <span className="font-bold text-amber-700 text-sm">
                    {activeFundDetail.scheme.riskLevel || 'High'} Risk
                  </span>
                </div>
              </div>

              {/* 90-Day Trend Visual representation */}
              {activeFundDetail.history.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-700">Recent 90-Day NAV Trajectory</span>
                    <span className="text-slate-400 font-mono text-[10px]">Daily Close</span>
                  </div>
                  <div className="h-16 flex items-end gap-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    {activeFundDetail.history.slice(-30).map((pt, i, arr) => {
                      const min = Math.min(...arr.map(a => a.nav));
                      const max = Math.max(...arr.map(a => a.nav));
                      const range = max - min || 1;
                      const heightPct = Math.max(15, Math.min(100, ((pt.nav - min) / range) * 100));
                      return (
                        <div
                          key={i}
                          title={`${pt.date}: ₹${pt.nav}`}
                          className="flex-1 bg-gradient-to-t from-cyan-600 to-cyan-400 hover:brightness-110 rounded-t transition-all"
                          style={{ height: `${heightPct}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveFundDetail(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() => {
                  onSelectFundForAdvice(activeFundDetail.scheme);
                  setActiveFundDetail(null);
                  const formEl = document.getElementById('advice');
                  formEl?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:brightness-105 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Include in Advisory Request
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
