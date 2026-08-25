import React, { useState } from 'react';
import { 
  X, 
  User, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Compass, 
  Calculator, 
  Phone, 
  Send, 
  ArrowRight,
  ShieldCheck,
  Star,
  Bookmark,
  LogOut
} from 'lucide-react';
import { UserProfile, LeadPayload, FundScheme, RiskProfileInfo, UserRole } from '../types';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  leads: LeadPayload[];
  funds: FundScheme[];
  quizProfile: RiskProfileInfo | null;
  onSwitchRole: (role: UserRole) => void;
  onNavigateToSection: (sectionId: string) => void;
  onLogout?: () => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  leads,
  funds,
  quizProfile,
  onSwitchRole,
  onNavigateToSection,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'hub' | 'watchlist' | 'requests'>('hub');

  if (!isOpen) return null;

  // Filter leads matching this customer's email or default to user leads
  const customerLeads = leads.filter(
    l => l.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  const watchlistCodes = currentUser.watchlist || [122639, 120503];
  const watchlistFunds = funds.filter(f => watchlistCodes.includes(f.schemeCode));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#100d33] border border-[#2c2672] text-slate-100 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#252063] bg-gradient-to-r from-[#17144e] via-[#100d33] to-[#1e1957] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-['Fraunces',serif] text-white">
                  Investor Wealth Hub
                </h2>
                <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-cyan-500/40">
                  CUSTOMER VIEW
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Welcome back, <span className="text-white font-medium">{currentUser.name}</span> ({currentUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-[#0a0824] px-2 py-1 rounded-xl border border-[#282267]">
              <span className="text-[10px] text-slate-400 uppercase font-bold px-1">Switch:</span>
              <button
                onClick={() => onSwitchRole('admin')}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                title="Switch to Admin View"
              >
                Admin
              </button>
              <button
                onClick={() => onSwitchRole('operations')}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                title="Switch to Operations View"
              >
                Operations
              </button>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-all"
                title="Log out of Customer Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Workspace"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="px-6 border-b border-[#252063] bg-[#0c0a27] flex items-center gap-2">
          <button
            onClick={() => setActiveTab('hub')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'hub'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>My Wealth Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('watchlist')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'watchlist'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Fund Watchlist ({watchlistFunds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'requests'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>My Advisory Requests ({customerLeads.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: WEALTH PROFILE HUB */}
          {activeTab === 'hub' && (
            <div className="space-y-6">
              
              {/* Account Quick Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#14113e] border border-[#272166] rounded-2xl space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Investor Status</div>
                  <div className="text-base font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    <span>KYC & PAN Verified</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">PAN: {currentUser.panNumber || 'ABCDE1234F'}</div>
                </div>

                <div className="p-4 bg-[#14113e] border border-[#272166] rounded-2xl space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Risk Profile</div>
                  <div className="text-base font-bold text-[#fbbf24] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#fbbf24]" />
                    <span>{quizProfile ? quizProfile.title : 'Growth Investor'}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {quizProfile ? `${quizProfile.equityAllocation}% Equity / ${quizProfile.debtAllocation}% Debt` : '70% Equity / 25% Debt / 5% Gold'}
                  </div>
                </div>

                <div className="p-4 bg-[#14113e] border border-[#272166] rounded-2xl space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Assigned Advisor</div>
                  <div className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>WealthyWiz Senior Desk</span>
                  </div>
                  <div className="text-[11px] text-cyan-300">AMFI Certified Advisor</div>
                </div>
              </div>

              {/* Advisory Request Progress Banner */}
              <div className="p-5 bg-gradient-to-r from-cyan-950/40 via-[#14113e] to-[#1a164e] border border-cyan-800/40 rounded-2xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Your Mutual Fund Action Plan</span>
                  </h3>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToSection('advice');
                    }}
                    className="text-xs font-bold text-slate-950 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] px-3.5 py-1.5 rounded-xl hover:brightness-105 transition-all flex items-center gap-1 shadow"
                  >
                    <span>Request New Portfolio Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="bg-[#0b0927] p-3 rounded-xl border border-cyan-500/30 text-center">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center mx-auto mb-1">1</div>
                    <div className="text-xs font-bold text-white">Risk Profiling</div>
                    <div className="text-[10px] text-emerald-400">✓ Completed</div>
                  </div>

                  <div className="bg-[#0b0927] p-3 rounded-xl border border-amber-500/30 text-center">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center mx-auto mb-1">2</div>
                    <div className="text-xs font-bold text-white">Fund Selection</div>
                    <div className="text-[10px] text-amber-400">● Curated Live</div>
                  </div>

                  <div className="bg-[#0b0927] p-3 rounded-xl border border-[#272166] text-center opacity-80">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-bold text-xs flex items-center justify-center mx-auto mb-1">3</div>
                    <div className="text-xs font-bold text-slate-300">SIP Execution</div>
                    <div className="text-[10px] text-slate-500">Auto-Debit Ready</div>
                  </div>
                </div>
              </div>

              {/* Quick Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToSection('explorer');
                  }}
                  className="p-4 bg-[#14113e] hover:bg-[#1c1854] border border-[#272166] rounded-2xl text-left transition-all group flex items-start justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-cyan-400" />
                      <span>Explore High Alpha Schemes</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Filter 15+ top mutual funds across Small, Flexi, and Large Cap.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onNavigateToSection('calculator');
                  }}
                  className="p-4 bg-[#14113e] hover:bg-[#1c1854] border border-[#272166] rounded-2xl text-left transition-all group flex items-start justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-emerald-400" />
                      <span>Run SIP vs FD Simulation</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Compare wealth multiplier with 10% annual Step-Up SIP.
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: WATCHLIST */}
          {activeTab === 'watchlist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Your Starred Mutual Funds</h3>
                  <p className="text-xs text-slate-400">Live official AMFI daily NAV tracking</p>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToSection('explorer');
                  }}
                  className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Browse More Funds</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {watchlistFunds.map((fund) => (
                  <div
                    key={fund.schemeCode}
                    className="p-4 bg-[#14113e] border border-[#272166] rounded-2xl flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {fund.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">AMFI: {fund.schemeCode}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{fund.schemeName}</h4>
                      <div className="text-xs text-slate-400">{fund.fundHouse}</div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-base font-bold text-white">₹{fund.nav.toFixed(2)}</div>
                      <div className="text-xs text-emerald-400 font-semibold">
                        +{fund.return3Y}% (3Y CAGR)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ADVISORY REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Your Submitted Advisory Requests</h3>
              
              {customerLeads.length === 0 ? (
                <div className="p-8 text-center bg-[#14113e] border border-[#272166] rounded-2xl text-slate-400 space-y-3">
                  <p>You haven't submitted an advisory request yet.</p>
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToSection('advice');
                    }}
                    className="bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
                  >
                    Request Free Advisory Plan
                  </button>
                </div>
              ) : (
                customerLeads.map((req) => (
                  <div
                    key={req.id || req.createdAt}
                    className="p-5 bg-[#14113e] border border-[#272166] rounded-2xl space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-cyan-400">{req.id || 'ADVISORY-REQ'}</span>
                        <h4 className="text-sm font-bold text-white">{req.investmentGoal}</h4>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                        req.status === 'converted'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : req.status === 'contacted'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                      }`}>
                        {req.status === 'converted' ? '✓ Portfolio Active' : req.status === 'contacted' ? '● Advisor in Contact' : '● Under Review'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 flex flex-wrap gap-4 font-mono">
                      <span>Amount: ₹{req.investmentAmount?.toLocaleString('en-IN')}</span>
                      <span>Mode: {req.investmentMode === 'monthly_sip' ? 'Monthly SIP' : 'Lump Sum'}</span>
                      <span>Risk: {req.riskProfile || 'Moderate'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
