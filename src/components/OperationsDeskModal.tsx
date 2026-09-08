import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  MessageSquare, 
  Download, 
  Search, 
  Filter, 
  RefreshCw,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Calendar,
  LogOut
} from 'lucide-react';
import { UserProfile, LeadPayload, UserRole } from '../types';

interface OperationsDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  leads: LeadPayload[];
  onUpdateLeadStatus: (id: string, newStatus: LeadPayload['status']) => void;
  onSwitchRole: (role: UserRole) => void;
  onLogout?: () => void;
}

export const OperationsDeskModal: React.FC<OperationsDeskModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  leads,
  onUpdateLeadStatus,
  onSwitchRole,
  onLogout,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'converted'>('all');
  const [activeLeadNotes, setActiveLeadNotes] = useState<Record<string, string>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.investmentGoal.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || (lead.status || 'new') === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportDeskSheet = () => {
    const headers = 'ID,Name,Phone,Email,Goal,Amount,Mode,RiskProfile,Status\n';
    const rows = filteredLeads.map(l => 
      `"${l.id || ''}","${l.name}","${l.phone}","${l.email}","${l.investmentGoal}",${l.investmentAmount},"${l.investmentMode}","${l.riskProfile || ''}","${l.status || 'new'}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WealthyWiz_Operations_Queue_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const handleTriggerDailySync = () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncFeedback('Operations Desk NAV cache refreshed successfully.');
      setTimeout(() => setSyncFeedback(null), 3500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#1e2945] border border-[#3b4f7e] text-slate-100 rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#354a7c] bg-gradient-to-r from-[#243560] via-[#1c2c50] to-[#273d6e] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-['Fraunces',serif] text-white">
                  Operations & Advisory Desk
                </h2>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                  OPERATIONS DESK
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Staff: <span className="text-white font-medium">{currentUser.name}</span> • Mutual Fund Execution & Outreach
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-[#16223d] px-2 py-1 rounded-xl border border-[#334674]">
              <span className="text-[10px] text-slate-300 uppercase font-bold px-1">Switch:</span>
              <button
                onClick={() => onSwitchRole('admin')}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                title="Switch to Admin View"
              >
                Admin
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-all"
                title="Log out of Operations Desk"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Workspace"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action & Metric Bar */}
        <div className="p-4 sm:p-6 border-b border-[#334674] bg-[#18233e] grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#24345c] p-3 rounded-xl border border-[#3b5186] shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-300">Total Leads in Queue</div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{leads.length}</div>
          </div>
          <div className="bg-[#24345c] p-3 rounded-xl border border-[#3b5186] shadow-sm">
            <div className="text-[10px] uppercase font-bold text-amber-400">Action Required</div>
            <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">
              {leads.filter(l => (l.status || 'new') === 'new').length} New
            </div>
          </div>
          <div className="bg-[#24345c] p-3 rounded-xl border border-[#3b5186] shadow-sm">
            <div className="text-[10px] uppercase font-bold text-cyan-300">In Discussion</div>
            <div className="text-xl font-bold font-mono text-cyan-200 mt-0.5">
              {leads.filter(l => l.status === 'contacted').length}
            </div>
          </div>
          <div className="bg-[#24345c] p-3 rounded-xl border border-[#3b5186] shadow-sm">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Converted Clients</div>
            <div className="text-xl font-bold font-mono text-emerald-300 mt-0.5">
              {leads.filter(l => l.status === 'converted').length}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search investor queue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#151f38] border border-[#374c7e] rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-[#18233e] p-1 rounded-xl border border-[#334674]">
                {(['all', 'new', 'contacted', 'converted'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg capitalize transition-all ${
                      statusFilter === st
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleTriggerDailySync}
                disabled={isSyncing}
                className="bg-[#24345c] hover:bg-[#2e4273] border border-[#3d538a] text-xs font-semibold text-cyan-300 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Refresh NAV Feed</span>
              </button>

              <button
                onClick={handleExportDeskSheet}
                className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold text-amber-300 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Export Queue (.CSV)
              </button>
            </div>
          </div>

          {syncFeedback && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{syncFeedback}</span>
            </div>
          )}

          {/* Leads Cards / Stream */}
          <div className="space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center bg-[#1a2542] border border-[#304370] rounded-2xl text-slate-400">
                No investor requests found in this view.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const leadId = lead.id || lead.email;
                return (
                  <div
                    key={leadId}
                    className="p-5 bg-[#24345c] border border-[#384e84] hover:border-amber-500/40 rounded-2xl transition-all space-y-3 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{lead.name}</h4>
                          <span className="text-[10px] font-mono bg-[#1c2847] text-slate-200 px-2 py-0.5 rounded border border-[#354877]">
                            {lead.id || 'LEAD'}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-200 border border-cyan-700/50">
                            {lead.riskProfile || 'Moderate'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 flex flex-wrap items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-slate-200 font-mono">
                            <Mail className="w-3 h-3 text-cyan-400" /> {lead.email}
                          </span>
                          <span className="flex items-center gap-1 text-slate-200 font-mono">
                            <Phone className="w-3 h-3 text-emerald-400" /> {lead.phone}
                          </span>
                          {lead.createdAt && (
                            <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                              <Clock className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <select
                          value={lead.status || 'new'}
                          onChange={(e) => onUpdateLeadStatus(lead.id || '', e.target.value as any)}
                          className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none cursor-pointer ${
                            lead.status === 'converted'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                              : lead.status === 'contacted'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-rose-950 text-rose-300 border-rose-800'
                          }`}
                        >
                          <option value="new">● New Request</option>
                          <option value="contacted">● In Contact / Advisory Call</option>
                          <option value="converted">● Converted Investor</option>
                        </select>
                      </div>
                    </div>

                    {/* Goal & Amount Details */}
                    <div className="p-3 bg-[#1b2645] rounded-xl border border-[#304370] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="text-slate-300">Target Goal: </span>
                        <strong className="text-white">{lead.investmentGoal}</strong>
                      </div>
                      <div>
                        <span className="text-slate-300">Commitment: </span>
                        <strong className="text-amber-300 font-mono">
                          ₹{lead.investmentAmount?.toLocaleString('en-IN')}
                        </strong>{' '}
                        <span className="text-slate-300">
                          ({lead.investmentMode === 'monthly_sip' ? 'Monthly SIP' : 'Lump Sum'})
                        </span>
                      </div>
                    </div>

                    {lead.message && (
                      <div className="text-xs text-slate-200 bg-[#16203b] p-3 rounded-xl border border-[#2d3e69] italic">
                        "{lead.message}"
                      </div>
                    )}

                    {/* Quick Response Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${lead.phone}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" /> Call Investor
                        </a>
                        <a
                          href={`mailto:${lead.email}?subject=WealthyWiz Advisory Consultation`}
                          className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" /> Send Email
                        </a>
                      </div>

                      <button
                        onClick={() => {
                          const note = prompt('Add internal advisor note for this investor:', activeLeadNotes[leadId] || '');
                          if (note !== null) {
                            setActiveLeadNotes(prev => ({ ...prev, [leadId]: note }));
                          }
                        }}
                        className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>{activeLeadNotes[leadId] ? 'Edit Note' : 'Add Internal Note'}</span>
                      </button>
                    </div>

                    {activeLeadNotes[leadId] && (
                      <div className="text-[11px] bg-amber-950/20 border border-amber-800/30 text-amber-200 p-2.5 rounded-lg flex items-start gap-1.5">
                        <span className="font-bold shrink-0">Advisor Note:</span>
                        <span>{activeLeadNotes[leadId]}</span>
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
