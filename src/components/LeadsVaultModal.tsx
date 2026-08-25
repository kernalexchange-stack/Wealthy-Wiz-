import React, { useState } from 'react';
import { LeadPayload } from '../types';
import { X, Download, Search, UserCheck, Phone, Mail, Calendar, CheckCircle2, Shield, Trash2, Filter } from 'lucide-react';
import { formatINR } from '../utils/mfapi';

interface LeadsVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadPayload[];
  onUpdateStatus: (id: string, newStatus: LeadPayload['status']) => void;
  onClearLeads: () => void;
}

export const LeadsVaultModal: React.FC<LeadsVaultModalProps> = ({
  isOpen,
  onClose,
  leads,
  onUpdateStatus,
  onClearLeads,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('All');

  if (!isOpen) return null;

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.id && lead.id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRisk = filterRisk === 'All' || lead.riskProfile === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['Lead ID', 'Name', 'Email', 'Phone', 'Investment Goal', 'Amount (INR)', 'Mode', 'Risk Profile', 'Recommended Funds', 'Client Message', 'Created At', 'Status'];
    const rows = leads.map(l => [
      l.id || '',
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.investmentGoal}"`,
      l.investmentAmount,
      l.investmentMode,
      `"${l.riskProfile || ''}"`,
      `"${(l.recommendedFunds || []).join('; ').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      l.createdAt || '',
      l.status || 'new',
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WealthyWiz_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#d97706] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-['Fraunces',serif] flex items-center gap-2">
                <span>WealthyWiz Advisory Lead Vault</span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold">
                  Formspree Sync Active
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Incoming investor queries & tailored portfolio requests ({leads.length} total) • Synced to Formspree endpoint (xljrqnzg)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 disabled:opacity-40 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client name, email, phone, or Lead ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Risk Filter:</span>
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl text-xs px-3 py-1.5 font-medium text-slate-700"
            >
              <option value="All">All Profiles</option>
              <option value="Conservative">Conservative</option>
              <option value="Moderate">Moderate</option>
              <option value="Growth">Growth</option>
              <option value="Aggressive">Aggressive</option>
            </select>
          </div>
        </div>

        {/* Leads Table / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <p className="text-sm font-semibold text-slate-700">No leads found in this view.</p>
              <p className="text-xs text-slate-400">Leads captured from the "Get Advice" form and Quiz will be logged here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((lead) => (
                <div
                  key={lead.id || lead.email}
                  className="bg-slate-50/80 hover:bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 transition-all space-y-3"
                >
                  {/* Top Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                        {lead.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {lead.name}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        lead.riskProfile === 'Aggressive' ? 'bg-amber-100 text-amber-800' :
                        lead.riskProfile === 'Growth' ? 'bg-indigo-100 text-indigo-800' :
                        lead.riskProfile === 'Moderate' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {lead.riskProfile}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                      </span>
                      <select
                        value={lead.status || 'new'}
                        onChange={(e) => lead.id && onUpdateStatus(lead.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                          lead.status === 'converted' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                          lead.status === 'contacted' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact & Financial Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lead.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Target: </span>
                      <span className="font-bold text-slate-900 font-mono">
                        {formatINR(lead.investmentAmount)}
                      </span>
                      <span className="text-slate-500 text-[10px]"> ({lead.investmentMode === 'monthly_sip' ? 'SIP' : 'Lumpsum'})</span>
                    </div>
                  </div>

                  {/* Goal & Message */}
                  <div className="text-xs bg-white p-3 rounded-xl border border-slate-200/70 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-700">Goal: </span>
                      <span className="text-slate-800">{lead.investmentGoal}</span>
                    </div>
                    {lead.recommendedFunds && lead.recommendedFunds.length > 0 && (
                      <div>
                        <span className="font-semibold text-teal-800">Attached Funds: </span>
                        <span className="text-slate-600">{lead.recommendedFunds.join(', ')}</span>
                      </div>
                    )}
                    {lead.message && (
                      <p className="text-slate-500 italic mt-1 pt-1 border-t border-slate-100">
                        "{lead.message}"
                      </p>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>All lead data securely recorded in system storage.</span>
          {leads.length > 0 && (
            <button
              onClick={onClearLeads}
              className="text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Leads List
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
