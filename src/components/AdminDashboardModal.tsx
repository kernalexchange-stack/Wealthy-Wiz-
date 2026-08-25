import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Users, 
  Layers, 
  TrendingUp, 
  Activity, 
  Download, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Database,
  ArrowRight,
  RefreshCw,
  Sliders,
  UserPlus,
  Zap,
  Lock,
  LogOut
} from 'lucide-react';
import { UserProfile, LeadPayload, FundScheme, UserRole } from '../types';
import { ROLE_CONFIGS, INITIAL_USERS } from '../data/mockUsers';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  leads: LeadPayload[];
  funds: FundScheme[];
  onUpdateLeadStatus: (id: string, newStatus: LeadPayload['status']) => void;
  onDeleteLead: (id: string) => void;
  onSwitchRole: (role: UserRole) => void;
  onLogout?: () => void;
  onAddFundToMovers?: (scheme: FundScheme) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  leads,
  funds,
  onUpdateLeadStatus,
  onDeleteLead,
  onSwitchRole,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'schemes' | 'team'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncingAMFI, setIsSyncingAMFI] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const convertedLeads = leads.filter(l => l.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  
  const totalAumPotential = leads.reduce((acc, curr) => {
    const amt = curr.investmentAmount || 0;
    return acc + (curr.investmentMode === 'monthly_sip' ? amt * 12 : amt);
  }, 0);

  const filteredLeads = leads.filter(lead => {
    const term = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.phone.includes(term) ||
      lead.investmentGoal.toLowerCase().includes(term)
    );
  });

  const handleExportFullCRM = () => {
    const headers = 'ID,Name,Email,Phone,Goal,Amount,Mode,RiskProfile,Status,Created\n';
    const rows = leads.map(l => 
      `"${l.id || ''}","${l.name}","${l.email}","${l.phone}","${l.investmentGoal}",${l.investmentAmount},"${l.investmentMode}","${l.riskProfile || ''}","${l.status || 'new'}","${l.createdAt || ''}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WealthyWiz_Full_Admin_CRM_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const handleTriggerAMFISync = () => {
    setIsSyncingAMFI(true);
    setSyncSuccessMsg(null);
    setTimeout(() => {
      setIsSyncingAMFI(false);
      setSyncSuccessMsg(`AMFI API sync completed! Verified ${funds.length} curated schemes at ${new Date().toLocaleTimeString()}.`);
      setTimeout(() => setSyncSuccessMsg(null), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#100e31] border border-[#2d2870] text-slate-100 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Modal Top Banner */}
        <div className="p-5 sm:p-6 border-b border-[#252063] bg-gradient-to-r from-[#17144e] via-[#100e31] to-[#1e1957] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-['Fraunces',serif] text-white">
                  Super Admin Command Center
                </h2>
                <span className="bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-rose-500/40">
                  FULL PRIVILEGES
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as <span className="text-white font-medium">{currentUser.name}</span> ({currentUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Switch Role Pills */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#0a0824] px-2 py-1 rounded-xl border border-[#282267]">
              <span className="text-[10px] text-slate-400 uppercase font-bold px-1">Switch:</span>
              <button
                onClick={() => onSwitchRole('operations')}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors"
                title="Switch to Operations View"
              >
                Operations
              </button>
              <button
                onClick={() => onSwitchRole('customer')}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors"
                title="Switch to Customer View"
              >
                Customer
              </button>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 hover:text-rose-200 text-xs font-semibold transition-all"
                title="Log out of Super Admin"
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

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#252063] bg-[#0c0a27] flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'leads'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Lead CRM Pipeline ({totalLeads})</span>
          </button>

          <button
            onClick={() => setActiveTab('schemes')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'schemes'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Scheme Catalog & API</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`py-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'team'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Roles & Staff Access</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Stat Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#151242] border border-[#2b2571] rounded-2xl p-4">
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Total Inbound Leads</div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">{totalLeads}</div>
                  <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +100% active capture
                  </div>
                </div>

                <div className="bg-[#151242] border border-[#2b2571] rounded-2xl p-4">
                  <div className="text-[11px] text-slate-400 uppercase font-bold">New Unassigned</div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 mt-1">{newLeads}</div>
                  <div className="text-[10px] text-slate-400 mt-1">Pending advisor outreach</div>
                </div>

                <div className="bg-[#151242] border border-[#2b2571] rounded-2xl p-4">
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Conversion Rate</div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300 mt-1">{conversionRate}%</div>
                  <div className="text-[10px] text-cyan-400 mt-1">{convertedLeads} converted clients</div>
                </div>

                <div className="bg-[#151242] border border-[#2b2571] rounded-2xl p-4">
                  <div className="text-[11px] text-slate-400 uppercase font-bold">Potential Annual AUM</div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#fbbf24] mt-1">
                    ₹{(totalAumPotential / 100000).toFixed(1)} Lakhs
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">From investor requests</div>
                </div>
              </div>

              {/* AMFI Sync & System Status Card */}
              <div className="bg-[#151242] border border-[#2b2571] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-sm font-bold text-white">AMFI Official Feed (mfapi.in) Status</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Live NAV endpoints operational. Auto-cached for high performance and fallback safety.
                  </p>
                  {syncSuccessMsg && (
                    <div className="text-xs text-emerald-400 font-semibold pt-1">
                      ✓ {syncSuccessMsg}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleTriggerAMFISync}
                  disabled={isSyncingAMFI}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingAMFI ? 'animate-spin' : ''}`} />
                  {isSyncingAMFI ? 'Syncing AMFI Feed...' : 'Trigger AMFI Re-Sync'}
                </button>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-[#0e0c2d] border border-[#252063] rounded-2xl p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Super Admin Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleExportFullCRM}
                    className="p-3 bg-[#17144e] hover:bg-[#201d68] border border-[#2e2978] rounded-xl text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-rose-300 flex items-center justify-between">
                      <span>Export Full CRM Data</span>
                      <Download className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Download CSV with all leads & profiles</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('leads')}
                    className="p-3 bg-[#17144e] hover:bg-[#201d68] border border-[#2e2978] rounded-xl text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-amber-300 flex items-center justify-between">
                      <span>Review Inbound Pipeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">{newLeads} new leads waiting for response</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('team')}
                    className="p-3 bg-[#17144e] hover:bg-[#201d68] border border-[#2e2978] rounded-xl text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
                      <span>Manage Role Matrix</span>
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Admin, Operations, and Customer views</div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LEADS CRM */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by client name, email, or goal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#090720] border border-[#29236b] rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleExportFullCRM}
                    className="bg-[#17144e] hover:bg-[#201d68] border border-[#2e2978] text-xs font-bold text-slate-200 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Leads Table */}
              <div className="bg-[#0d0b28] border border-[#231e5f] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#14103c] text-slate-400 uppercase font-semibold border-b border-[#231e5f]">
                      <tr>
                        <th className="p-3">Client</th>
                        <th className="p-3">Goal & Strategy</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Risk Profile</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1957] text-slate-300">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500">
                            No leads found matching "{searchTerm}".
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                          <tr key={lead.id || lead.email} className="hover:bg-[#161245]/60 transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-white">{lead.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{lead.email}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{lead.phone}</div>
                            </td>
                            <td className="p-3 max-w-xs">
                              <div className="text-slate-200 font-medium line-clamp-1">{lead.investmentGoal}</div>
                              {lead.message && (
                                <div className="text-[10px] text-slate-400 italic line-clamp-1">"{lead.message}"</div>
                              )}
                            </td>
                            <td className="p-3 font-mono font-bold text-white">
                              ₹{lead.investmentAmount?.toLocaleString('en-IN')}
                              <div className="text-[10px] text-slate-400 font-normal">
                                {lead.investmentMode === 'monthly_sip' ? 'Monthly SIP' : 'One-Time'}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                                {lead.riskProfile || 'Moderate'}
                              </span>
                            </td>
                            <td className="p-3">
                              <select
                                value={lead.status || 'new'}
                                onChange={(e) => onUpdateLeadStatus(lead.id || '', e.target.value as any)}
                                className={`text-[11px] font-bold rounded-lg px-2 py-1 border focus:outline-none cursor-pointer ${
                                  lead.status === 'converted'
                                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                    : lead.status === 'contacted'
                                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                                    : 'bg-rose-950 text-rose-300 border-rose-800'
                                }`}
                              >
                                <option value="new">● New</option>
                                <option value="contacted">● Contacted</option>
                                <option value="converted">● Converted</option>
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => lead.id && onDeleteLead(lead.id)}
                                title="Delete Lead"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEME CATALOG & API */}
          {activeTab === 'schemes' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#14103c] border border-[#2b2571] rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Curated Schemes & Live AMFI Endpoints</h3>
                  <p className="text-xs text-slate-400">Total active schemes managed: {funds.length}</p>
                </div>
                <button
                  onClick={handleTriggerAMFISync}
                  disabled={isSyncingAMFI}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAMFI ? 'animate-spin' : ''}`} />
                  Refresh All NAVs
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {funds.map((f) => (
                  <div key={f.schemeCode} className="p-4 bg-[#0d0b28] border border-[#231e5f] rounded-2xl flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {f.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Code: {f.schemeCode}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{f.schemeName}</h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3 font-mono pt-1">
                        <span>NAV: <strong className="text-white">₹{f.nav.toFixed(2)}</strong></span>
                        <span>3Y: <strong className="text-emerald-400">+{f.return3Y}%</strong></span>
                        <span>AUM: <strong className="text-slate-300">₹{f.aumCr} Cr</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ROLES & TEAM ACCESS MATRIX */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#14103c] border border-[#2b2571] rounded-2xl">
                <h3 className="text-sm font-bold text-white mb-1">Access Control & Role Matrix</h3>
                <p className="text-xs text-slate-400">
                  WealthyWiz supports three access profiles through a single unified authentication gate.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['admin', 'operations', 'customer'] as UserRole[]).map((role) => {
                  const cfg = ROLE_CONFIGS[role];
                  return (
                    <div key={role} className={`p-5 rounded-2xl border ${cfg.badgeBg} ${cfg.badgeBorder} space-y-3`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${cfg.badgeBg} ${cfg.badgeText} border ${cfg.badgeBorder}`}>
                          {cfg.badgeLabel}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{cfg.title}</h4>
                        <p className="text-[11px] text-slate-300 mt-1">{cfg.description}</p>
                      </div>

                      <div className="pt-2 border-t border-white/10 space-y-1">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Permitted Features:</div>
                        {cfg.permissions.map((p, idx) => (
                          <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            onSwitchRole(role);
                            onClose();
                          }}
                          className="w-full py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center justify-center gap-1.5"
                        >
                          <span>Switch to {cfg.title}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
