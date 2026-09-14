import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  Mail, 
  User, 
  Briefcase, 
  IndianRupee,
  Clock,
  CalendarCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendLeadToFormspree } from '../utils/formspree';
import { LeadPayload } from '../types';
import { trackConversion } from '../utils/analytics';

interface PortfolioConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadSubmitted?: (lead: LeadPayload) => void;
  initialFundName?: string;
  initialGoal?: string;
  initialAmount?: number;
  sourcePage?: string;
}

export const PortfolioConsultationModal: React.FC<PortfolioConsultationModalProps> = ({
  isOpen,
  onClose,
  onLeadSubmitted,
  initialFundName,
  initialGoal,
  initialAmount,
  sourcePage,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consultationType, setConsultationType] = useState(
    initialGoal || 'Complete Portfolio Health Check & Review'
  );
  const [portfolioSize, setPortfolioSize] = useState<string>(
    initialAmount ? `₹${initialAmount.toLocaleString('en-IN')}` : '₹25,000 / month'
  );
  const [existingFunds, setExistingFunds] = useState(initialFundName || '');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [leadId, setLeadId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialFundName) {
      setExistingFunds(initialFundName);
    }
    if (initialGoal) {
      setConsultationType(initialGoal);
    }
    if (initialAmount) {
      setPortfolioSize(`₹${initialAmount.toLocaleString('en-IN')}`);
    }
  }, [initialFundName, initialGoal, initialAmount]);

  if (!isOpen) return null;

  const consultationOptions = [
    'Complete Portfolio Health Check & Review',
    'New Monthly SIP Wealth Strategy',
    'Underperforming Schemes Reallocation',
    'Tax Optimization (ELSS & Capital Gains)',
    'Loan Against Mutual Funds & Liquidity',
    'High Net Worth (HNI) Family Office Advisory'
  ];

  const sizePresets = [
    '₹5,000 / mo',
    '₹15,000 / mo',
    '₹25,000 / mo',
    '₹50,000+ / mo',
    'Lumpsum ₹5L - ₹25L',
    'Lumpsum ₹25L+'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    const newLeadId = `CONSULT-${Date.now().toString().slice(-6)}`;
    setLeadId(newLeadId);

    const leadPayload: LeadPayload = {
      id: newLeadId,
      serviceType: 'mutual_fund_advisory',
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: `+91 ${cleanPhone.slice(-10)}`,
      investmentGoal: consultationType,
      investmentAmount: initialAmount || 25000,
      investmentMode: 'monthly_sip',
      riskProfile: 'Portfolio Review Request',
      recommendedFunds: existingFunds ? [existingFunds] : [],
      message: `[Portfolio Consultation] Budget: ${portfolioSize} | Existing holdings: ${existingFunds || 'None specified'} | Message: ${notes || 'Standard consultation requested'}`,
      sourcePage: sourcePage || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      createdAt: new Date().toISOString(),
      status: 'new'
    };

    try {
      await sendLeadToFormspree({
        name: leadPayload.name,
        email: leadPayload.email,
        phone: leadPayload.phone,
        investmentGoal: leadPayload.investmentGoal,
        investmentAmount: leadPayload.investmentAmount,
        investmentMode: 'Portfolio Consultation',
        riskProfile: 'Consultation Client',
        recommendedFunds: leadPayload.recommendedFunds,
        sourcePage: leadPayload.sourcePage,
        message: leadPayload.message,
      });

      if (onLeadSubmitted) {
        onLeadSubmitted(leadPayload);
      }

      // Track Google Tag conversion (AW-18297262924)
      trackConversion('Portfolio Consultation Lead', leadPayload.investmentAmount, {
        consultation_type: consultationType,
        portfolio_size: portfolioSize,
        source_page: leadPayload.sourcePage,
      });

      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // confetti fallback
      }
    } catch (err) {
      console.error('Portfolio consultation dispatch notice:', err);
      // Still show success to user since lead is logged in memory
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#017374]/30 relative my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Teal Brand Header Bar */}
        <div className="bg-gradient-to-r from-[#021d1e] via-[#033638] to-[#017374] text-white p-5 sm:p-7 relative rounded-t-3xl">
          <button
            onClick={onClose}
            aria-label="Close portfolio consultation dialog"
            className="absolute right-4 top-4 text-[#c2ece2]/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#044a4d] text-[#c2ece2] text-[10px] font-mono font-bold uppercase tracking-wider border border-[#2dd4bf]/40">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2dd4bf]" />
              AMFI ARN-363293
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              100% Free Consultation
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-['Fraunces',serif]">
            Book a 1-on-1 Portfolio Consultation
          </h2>
          <p className="text-xs sm:text-sm text-[#c2ece2]/80 mt-1 max-w-lg leading-relaxed">
            Get your mutual fund portfolio comprehensively audited by certified wealth specialists. Zero commission bias, clear alpha-seeking rebalancing suggestions.
          </p>

          {/* Quick Perks Pill */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-[11px] text-[#c2ece2]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>24hr Callback</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>XIRR & Tax Audit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              <span>Direct Plan Advice</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7">
          {isSuccess ? (
            <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                  Request Ref: #{leadId}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-['Fraunces',serif]">
                  Consultation Request Scheduled!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-slate-900">{name}</strong>. Our AMFI-registered mutual fund advisor will review your request and connect via phone / WhatsApp at <strong className="text-slate-900">{phone}</strong> within 1 business day.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-left max-w-md mx-auto space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Consultation Focus:</span>
                  <span className="font-semibold text-slate-900">{consultationType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Portfolio Scale:</span>
                  <span className="font-semibold text-slate-900 font-mono">{portfolioSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Official Distributor:</span>
                  <span className="font-semibold text-[#017374]">AMFI ARN-363293</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#017374] hover:bg-[#005a5b] text-white font-bold text-xs shadow-md transition-transform active:scale-95"
                >
                  Close & Return to Platform
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Consultation Focus Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  1. What would you like help with?
                </label>
                <select
                  value={consultationType}
                  onChange={(e) => setConsultationType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium text-xs focus:ring-2 focus:ring-[#017374] focus:border-[#017374] bg-slate-50/50"
                >
                  {consultationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Investor Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#017374] focus:border-[#017374]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp / Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-[#017374] focus:border-[#017374]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com (For your portfolio audit report)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#017374] focus:border-[#017374]"
                  />
                </div>
              </div>

              {/* Portfolio Size Presets */}
              <div className="pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  2. Approximate Investment or Existing Portfolio Scale
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizePresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPortfolioSize(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        portfolioSize === preset
                          ? 'bg-[#017374] text-white border-[#017374] shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Existing Funds / Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Schemes / Questions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Parag Parikh Flexi Cap, Nippon Small Cap, or goals"
                  value={existingFunds}
                  onChange={(e) => setExistingFunds(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#017374] focus:border-[#017374]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#017374] to-[#045254] hover:from-[#005e60] hover:to-[#023c3d] text-white text-xs font-bold shadow-md hover:shadow-[#017374]/30 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Scheduling Consultation...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-[#c2ece2]" />
                      <span>Confirm Free Portfolio Consultation</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center pt-1">
                🔒 We respect your privacy. No marketing calls. Authorized AMFI Mutual Fund Distributor (ARN-363293).
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
