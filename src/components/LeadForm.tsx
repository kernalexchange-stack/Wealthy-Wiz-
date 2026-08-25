import React, { useState } from 'react';
import { LeadPayload, RiskProfileInfo, FundScheme } from '../types';
import { Send, CheckCircle2, ShieldCheck, Sparkles, X, Phone, Mail, User, Target, IndianRupee, MessageSquare, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LeadFormProps {
  quizProfile: RiskProfileInfo | null;
  selectedFunds: string[];
  onRemoveSelectedFund: (fundName: string) => void;
  onLeadSubmitted: (lead: LeadPayload) => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  quizProfile,
  selectedFunds,
  onRemoveSelectedFund,
  onLeadSubmitted,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [investmentGoal, setInvestmentGoal] = useState('Wealth Creation & Long-Term Compounding');
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000);
  const [investmentMode, setInvestmentMode] = useState<'monthly_sip' | 'one_time_lumpsum'>('monthly_sip');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<LeadPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const goals = [
    'Wealth Creation & Long-Term Compounding',
    'Retirement & FIRE (Financial Independence)',
    'Buying a Dream Home / Property',
    'Children’s Higher Education & Marriage',
    'Tax Saving (Section 80C ELSS)',
    'Emergency & Safety Buffer',
  ];

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xljrqnzg';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validation
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    const payload: LeadPayload = {
      id: `LW-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: `+91 ${cleanPhone.slice(-10)}`,
      investmentGoal,
      investmentAmount: Number(investmentAmount) || 10000,
      investmentMode,
      riskProfile: quizProfile?.type || 'Not Specified',
      recommendedFunds: selectedFunds.length > 0 ? selectedFunds : (quizProfile?.sampleFunds.map(f => f.schemeName) || []),
      message: message.trim(),
      sourcePage: window.location.pathname || '/',
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    // 1. Submit lead to Formspree
    try {
      const formspreePayload = {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        investmentGoal: payload.investmentGoal,
        investmentAmount: `₹${payload.investmentAmount.toLocaleString('en-IN')}`,
        investmentMode: payload.investmentMode === 'monthly_sip' ? 'Monthly SIP' : 'One-Time Lumpsum',
        riskProfile: payload.riskProfile,
        recommendedFunds: (payload.recommendedFunds || []).join(', ') || 'General Portfolio',
        message: payload.message || 'No additional notes provided',
        leadId: payload.id,
        sourcePage: payload.sourcePage,
        submittedAt: new Date(payload.createdAt).toLocaleString('en-IN'),
        _subject: `New WealthyWiz Advisory Lead: ${payload.name} (${payload.investmentGoal})`,
      };

      const formspreeRes = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formspreePayload),
      });

      if (!formspreeRes.ok) {
        const errorData = await formspreeRes.json().catch(() => null);
        console.warn('Formspree response warning:', errorData);
      }
    } catch (formspreeErr) {
      console.warn('Formspree network submission notice:', formspreeErr);
    }

    // 2. Post to backend endpoint for internal CRM & cache
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Backend leads API notice:', err);
    }

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#fbbf24', '#818cf8', '#17144e'],
      });
    } catch {
      // Ignored if confetti fails
    }

    onLeadSubmitted(payload);
    setSubmittedLead(payload);
    setIsSubmitting(false);
  };

  const handleDownloadReceipt = () => {
    if (!submittedLead) return;
    const content = `WEALTHYWIZ - MUTUAL FUND ADVISORY REQUEST
--------------------------------------------------
Lead Reference ID: ${submittedLead.id}
Date: ${new Date(submittedLead.createdAt || '').toLocaleString('en-IN')}

Client Name: ${submittedLead.name}
Email: ${submittedLead.email}
Phone: ${submittedLead.phone}

Investment Goal: ${submittedLead.investmentGoal}
Planned Investment: ₹${submittedLead.investmentAmount.toLocaleString('en-IN')} (${submittedLead.investmentMode === 'monthly_sip' ? 'Monthly SIP' : 'One-Time Lumpsum'})
Assessed Risk Profile: ${submittedLead.riskProfile}

Selected / Recommended Funds:
${submittedLead.recommendedFunds?.map((f, i) => `${i + 1}. ${f}`).join('\n') || 'General Multi-Cap Portfolio'}

Client Query:
${submittedLead.message || 'No additional notes'}
--------------------------------------------------
Our AMFI registered mutual fund specialist will contact you within 24 hours.
Visit us at https://wealthywiz.online`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WealthyWiz_Advisory_Request_${submittedLead.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="advice" className="py-16 sm:py-24 bg-gradient-to-b from-[#f8fafc] to-[#0f0e30] text-slate-900 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-500/25">
            <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
            Personalized Wealth Advisory
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-['Fraunces',serif]">
            Get a Customized Mutual Fund Plan
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            No spam. No pushy sales calls. Receive an institutional-grade, zero-commission portfolio blueprint aligned with your risk tolerance and life goals.
          </p>
        </div>

        {/* Form Container Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          
          {submittedLead ? (
            /* Success State */
            <div className="text-center space-y-6 py-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                  Ref #{submittedLead.id}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-['Fraunces',serif]">
                  Advisory Request Received, {submittedLead.name}!
                </h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                  Our certified mutual fund advisory team has logged your plan. We will review your <strong>{submittedLead.riskProfile}</strong> profile and send your detailed portfolio allocation to <strong>{submittedLead.email}</strong>.
                </p>
              </div>

              {/* Summary Details Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs max-w-md mx-auto space-y-2">
                <div className="flex justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Goal:</span>
                  <span className="font-bold text-slate-900">{submittedLead.investmentGoal}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500">Target Investment:</span>
                  <span className="font-bold text-slate-900 font-mono">
                    ₹{submittedLead.investmentAmount.toLocaleString('en-IN')} ({submittedLead.investmentMode === 'monthly_sip' ? 'Monthly SIP' : 'Lumpsum'})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Risk Profile:</span>
                  <span className="font-bold text-cyan-700">{submittedLead.riskProfile}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadReceipt}
                  className="w-full sm:w-auto bg-[#17144e] text-white hover:bg-[#201d68] text-xs font-semibold px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Summary Sheet (.txt)
                </button>

                <button
                  onClick={() => setSubmittedLead(null)}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-5 py-3 rounded-xl transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            </div>
          ) : (
            /* Active Form State */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Contextual Pill if Quiz was Completed */}
              {quizProfile && (
                <div className="bg-cyan-50 border border-cyan-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-700 shrink-0" />
                    <div>
                      <span className="font-bold text-cyan-950">Quiz Profile Attached: </span>
                      <span className="text-cyan-800 font-medium">{quizProfile.title}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-900 bg-cyan-100 px-2 py-0.5 rounded">
                    {quizProfile.equityAllocation}% Equity / {quizProfile.debtAllocation}% Debt
                  </span>
                </div>
              )}

              {/* Selected Funds Chips */}
              {selectedFunds.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Selected Funds to Include in Advisory Analysis ({selectedFunds.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedFunds.map((fundName) => (
                      <span
                        key={fundName}
                        className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-800 text-xs font-medium px-3 py-1 rounded-full"
                      >
                        <span className="truncate max-w-[240px]">{fundName}</span>
                        <button
                          type="button"
                          onClick={() => onRemoveSelectedFund(fundName)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Details Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="rahul@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Phone (Indian format) */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Mobile (+91) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

              </div>

              {/* Goal & Amount Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Investment Goal */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                    Primary Financial Milestone
                  </label>
                  <div className="relative">
                    <Target className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={investmentGoal}
                      onChange={(e) => setInvestmentGoal(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:outline-none"
                    >
                      {goals.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amount & Mode */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Planned Investment (₹)
                    </label>
                    <div className="flex gap-2 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setInvestmentMode('monthly_sip')}
                        className={`px-2 py-0.5 rounded ${
                          investmentMode === 'monthly_sip'
                            ? 'bg-[#17144e] text-white'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        SIP
                      </button>
                      <button
                        type="button"
                        onClick={() => setInvestmentMode('one_time_lumpsum')}
                        className={`px-2 py-0.5 rounded ${
                          investmentMode === 'one_time_lumpsum'
                            ? 'bg-[#17144e] text-white'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Lumpsum
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      step={500}
                      min={500}
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

              </div>

              {/* Optional Query / Message */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                  Specific Questions or Portfolio Needs (Optional)
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    placeholder="e.g. I already have ₹50,000 in FD and want to start an aggressive SIP for 15 years to buy a home..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>

              {/* Error Message if Any */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-cyan-700 shrink-0" />
                  <span>100% Privacy. Zero spam. We never share your contact details.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:brightness-105 text-slate-950 font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/25 active:scale-98 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending Request...' : 'Get My Free Advisory Plan'}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
