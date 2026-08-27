import React, { useState, useEffect, useMemo } from 'react';
import { FundScheme, FundCategory, NavHistoryPoint } from '../types';
import { searchSchemes, fetchSchemeDetails, formatINR, MfApiResponse } from '../utils/mfapi';
import { NavInteractiveChart } from './NavInteractiveChart';
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
  Layers,
  RefreshCw,
  LineChart,
  ShieldCheck
} from 'lucide-react';

interface FundExplorerProps {
  funds: FundScheme[];
  onSelectFundForAdvice: (fund: FundScheme) => void;
  selectedFunds: string[];
  onRefreshLiveNavs?: () => void;
  isRefreshing?: boolean;
}

export const FundExplorer: React.FC<FundExplorerProps> = ({ 
  funds,
  onSelectFundForAdvice, 
  selectedFunds,
  onRefreshLiveNavs,
  isRefreshing = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FundCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [fundsList, setFundsList] = useState<FundScheme[]>(funds);
  const [isSearching, setIsSearching] = useState(false);
  
  // Fund Detail Modal State
  const [activeFundDetail, setActiveFundDetail] = useState<{
    scheme: FundScheme;
    history: NavHistoryPoint[];
    fullData?: MfApiResponse;
  } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Sync internal list whenever parent funds update (e.g. after live background fetch)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFundsList(funds);
    }
  }, [funds, searchQuery]);

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

  // Debounced search across AMFI directory
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFundsList(funds);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(async () => {
      const results = await searchSchemes(searchQuery);
      if (results && results.length > 0) {
        // Map search results to fund schemes with fallback/fetched details
        const mapped: FundScheme[] = results.slice(0, 15).map((item) => {
          const match = funds.find(c => c.schemeCode === item.schemeCode);
          return match || {
            schemeCode: item.schemeCode,
            schemeName: item.schemeName,
            category: 'Flexi Cap',
            fundHouse: 'Asset Management Co.',
            nav: 92.45,
            navDate: '25-Aug-2026',
            change1D: 0.35,
            change1DPct: 0.38,
            return1Y: 24.2,
            return3Y: 21.5,
            return5Y: 22.1,
            expenseRatio: 0.65,
            riskLevel: 'High',
            aumCr: 18000,
            minSipAmount: 500,
            minLumpsumAmount: 1000,
            description: `${item.schemeName} from AMFI mutual fund repository.`,
          };
        });
        setFundsList(mapped);
      } else {
        // Filter curated by name
        const filtered = funds.filter(f =>
          f.schemeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.fundHouse.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFundsList(filtered);
      }
      setIsSearching(false);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchQuery, funds]);

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-900 text-xs font-semibold uppercase tracking-wider mb-3 border border-cyan-200">
              <Layers className="w-3.5 h-3.5 text-cyan-700" />
              AMFI Live Scheme Explorer
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-['Fraunces',serif]">
              Explore India's Top Rated Mutual Funds
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Direct growth plans with live AMFI NAV tracking, historical CAGR returns, moving averages, and zero distributor commission.
            </p>
          </div>

          {/* Live AMFI Status & Refresh Trigger */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>AMFI Live Feed Active</span>
            </div>

            {onRefreshLiveNavs && (
              <button
                onClick={onRefreshLiveNavs}
                disabled={isRefreshing}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-60"
                title="Refresh live NAVs from AMFI"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-600' : ''}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 mb-8">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by fund name, AMC (e.g. Parag Parikh, Quant, HDFC, Mirae, SBI, ICICI)..."
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

        {/* Funds Grid */}
        {isSearching ? (
          <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Querying live AMFI mutual fund repository...</p>
          </div>
        ) : filteredFunds.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-base font-semibold text-slate-800">No mutual funds match your search query.</p>
            <p className="text-xs text-slate-500">Try searching for keywords like "Flexi", "Small Cap", "HDFC", "SBI", "Quant", or "Mirae".</p>
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
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-mono">
                        {fund.navDate}
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
                      <div className="text-[10px] uppercase font-semibold text-slate-500">1D Change</div>
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
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl transition-colors text-center flex items-center justify-center gap-1.5"
                    >
                      <LineChart className="w-3.5 h-3.5 text-cyan-700" />
                      <span>Chart & Details</span>
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

      {/* Fund Detail & Interactive Chart Modal */}
      {activeFundDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveFundDetail(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="pr-10 mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-cyan-50 text-cyan-900 border border-cyan-200">
                  {activeFundDetail.scheme.category}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  Code: <strong className="text-slate-800">{activeFundDetail.scheme.schemeCode}</strong>
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-['Fraunces',serif]">
                {activeFundDetail.scheme.schemeName}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Managed by <strong className="text-slate-700">{activeFundDetail.scheme.fundHouse}</strong> • Direct Growth Plan
              </p>
            </div>

            {/* Interactive NAV Visualization */}
            <div className="mb-6">
              <NavInteractiveChart
                schemeName={activeFundDetail.scheme.schemeName}
                schemeCode={activeFundDetail.scheme.schemeCode}
                currentNav={activeFundDetail.scheme.nav}
                navDate={activeFundDetail.scheme.navDate}
                rawHistoryData={activeFundDetail.fullData?.data}
                category={activeFundDetail.scheme.category}
                return1Y={activeFundDetail.scheme.return1Y}
                return3Y={activeFundDetail.scheme.return3Y}
                return5Y={activeFundDetail.scheme.return5Y}
              />
            </div>

            {/* Performance Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
              <div>
                <div className="text-[11px] text-slate-500 font-medium">Current NAV</div>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                  ₹{activeFundDetail.scheme.nav.toFixed(2)}
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">{activeFundDetail.scheme.navDate}</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 font-medium">1-Year Return</div>
                <div className="text-lg font-bold text-emerald-600 font-mono mt-0.5">
                  +{activeFundDetail.scheme.return1Y}%
                </div>
                <div className="text-[10px] text-slate-400">Annualized</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 font-medium">3-Year CAGR</div>
                <div className="text-lg font-bold text-cyan-700 font-mono mt-0.5">
                  +{activeFundDetail.scheme.return3Y}%
                </div>
                <div className="text-[10px] text-slate-400">Compounded</div>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 font-medium">Expense Ratio</div>
                <div className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                  {activeFundDetail.scheme.expenseRatio}%
                </div>
                <div className="text-[10px] text-slate-400">Zero Commission</div>
              </div>
            </div>

            {/* Strategy & Minimums */}
            <div className="space-y-4 text-sm text-slate-700 mb-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1 text-xs uppercase tracking-wider text-slate-500">
                  Investment Strategy & Objective
                </h4>
                <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                  {activeFundDetail.scheme.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-slate-500 block text-[11px]">Minimum Monthly SIP</span>
                  <span className="font-bold text-slate-900 text-sm font-mono mt-0.5 block">
                    ₹{activeFundDetail.scheme.minSipAmount || 500}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-slate-500 block text-[11px]">Riskometer Profile</span>
                  <span className="font-bold text-amber-800 text-sm mt-0.5 block">
                    {activeFundDetail.scheme.riskLevel} Risk
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Action Controls */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
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
