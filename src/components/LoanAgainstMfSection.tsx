import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Sparkles, 
  IndianRupee, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Percent, 
  HelpCircle, 
  Send, 
  Download, 
  Building2, 
  BadgePercent,
  Check,
  Lock,
  Phone,
  Mail,
  User,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LeadPayload } from '../types';
import { getFormspreeEndpoint, getFormspreeFormId } from '../utils/formspree';
import { navigateToRoute } from '../utils/seoAndRouting';

interface LoanAgainstMfSectionProps {
  onLeadSubmitted: (lead: LeadPayload) => void;
}

export const LoanAgainstMfSection: React.FC<LoanAgainstMfSectionProps> = ({ onLeadSubmitted }) => {
  // Calculator state
  const [portfolioValue, setPortfolioValue] = useState<number>(500000); // 5 Lakhs default
  const [portfolioType, setPortfolioType] = useState<'equity' | 'debt' | 'hybrid'>('equity');
  const [requestedLoanAmount, setRequestedLoanAmount] = useState<number>(250000);
  const [utilizationMonths, setUtilizationMonths] = useState<number>(12);

  // Application form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [rtaProvider, setRtaProvider] = useState<'CAMS' | 'KFintech' | 'Both' | 'Not Sure'>('Both');
  const [loanPurpose, setLoanPurpose] = useState('Emergency / Short-term Liquidity');
  const [applicantMessage, setApplicantMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<LeadPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const FORMSPREE_ENDPOINT = getFormspreeEndpoint();
  const FORMSPREE_FORM_ID = getFormspreeFormId();

  // LTV (Loan to Value) Ratios according to RBI guidelines
  const ltvRatio = useMemo(() => {
    switch (portfolioType) {
      case 'debt': return 0.80; // 80% for Debt & Liquid Funds
      case 'hybrid': return 0.65; // 65% for Hybrid & Balanced Advantage Funds
      case 'equity': 
      default: return 0.50; // 50% for Equity Mutual Funds
    }
  }, [portfolioType]);

  // Max Approved Overdraft Limit
  const maxApprovedLimit = useMemo(() => {
    return Math.round(portfolioValue * ltvRatio);
  }, [portfolioValue, ltvRatio]);

  // Ensure requested loan doesn't exceed max approved limit initially
  const effectiveLoanAmount = Math.min(requestedLoanAmount, maxApprovedLimit);

  // Interest Rates
  const lamfRate = 9.50; // 9.50% p.a.
  const personalLoanRate = 15.50; // 15.50% p.a. typical personal loan

  // Monthly & Annual Calculations
  const lamfMonthlyInterest = Math.round((effectiveLoanAmount * (lamfRate / 100)) / 12);
  const personalLoanMonthlyInterest = Math.round((effectiveLoanAmount * (personalLoanRate / 100)) / 12);
  const monthlyInterestSavings = personalLoanMonthlyInterest - lamfMonthlyInterest;
  const annualSavings = monthlyInterestSavings * 12;

  // Estimated portfolio market growth while pledged (assuming 13% CAGR long term)
  const estimatedPortfolioGrowth1Y = Math.round(portfolioValue * 0.13);

  const portfolioPresets = [
    { label: '₹2 Lakh', value: 200000 },
    { label: '₹5 Lakh', value: 500000 },
    { label: '₹10 Lakh', value: 1000000 },
    { label: '₹25 Lakh', value: 2500000 },
    { label: '₹50 Lakh', value: 5000000 },
  ];

  const loanPurposes = [
    'Emergency / Short-term Liquidity',
    'Business Expansion / Working Capital',
    'Home Renovation / Property Downpayment',
    'Debt & Credit Card Consolidation',
    'Education / Travel / Wedding',
    'Bridge Loan for Tax / Financial Obligations',
  ];

  const handleSubmitLoanApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!applicantName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!applicantEmail.trim() || !applicantEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    const cleanPhone = applicantPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    const payload: LeadPayload = {
      id: `LAMF-${Date.now().toString().slice(-6)}`,
      serviceType: 'loan_against_mf',
      name: applicantName.trim(),
      email: applicantEmail.trim().toLowerCase(),
      phone: `+91 ${cleanPhone.slice(-10)}`,
      investmentGoal: `Loan Against MF: ${loanPurpose}`,
      investmentAmount: effectiveLoanAmount,
      investmentMode: 'lamf_overdraft',
      portfolioValue: portfolioValue,
      requestedLoanAmount: effectiveLoanAmount,
      portfolioType: portfolioType === 'equity' ? 'Equity Mutual Funds' : portfolioType === 'debt' ? 'Debt & Liquid Funds' : 'Hybrid / Multi-Asset',
      rtaProvider: rtaProvider,
      message: applicantMessage.trim() || `Requested ₹${effectiveLoanAmount.toLocaleString('en-IN')} credit limit against ₹${portfolioValue.toLocaleString('en-IN')} mutual fund portfolio.`,
      sourcePage: '/#loan-against-mf',
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    // 1. Submit lead to Formspree
    try {
      const formspreePayload = {
        serviceType: 'Loan Against Mutual Funds (LAMF)',
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        portfolioValue: `₹${portfolioValue.toLocaleString('en-IN')}`,
        requestedCreditLimit: `₹${effectiveLoanAmount.toLocaleString('en-IN')}`,
        maxApprovedLimit: `₹${maxApprovedLimit.toLocaleString('en-IN')}`,
        portfolioType: payload.portfolioType,
        rtaRegistrar: payload.rtaProvider,
        loanPurpose: loanPurpose,
        interestRateQuoted: `${lamfRate}% p.a.`,
        message: payload.message || 'No additional notes provided',
        leadId: payload.id,
        sourcePage: payload.sourcePage,
        submittedAt: new Date(payload.createdAt || '').toLocaleString('en-IN'),
        _subject: `[Loan Against MF Lead] ${payload.name} - ₹${effectiveLoanAmount.toLocaleString('en-IN')} (Portfolio: ₹${portfolioValue.toLocaleString('en-IN')})`,
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
        console.warn('Formspree LAMF submission notice:', errorData);
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

    // Confetti celebration
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#fbbf24', '#10b981', '#17144e'],
      });
    } catch {
      // ignore
    }

    onLeadSubmitted(payload);
    setSubmittedLead(payload);
    setIsSubmitting(false);
  };

  const handleDownloadReceipt = () => {
    if (!submittedLead) return;
    const content = `WEALTHYWIZ - LOAN AGAINST MUTUAL FUNDS (LAMF) APPLICATION
----------------------------------------------------------------------
Application Ref ID: ${submittedLead.id}
Timestamp: ${new Date(submittedLead.createdAt || '').toLocaleString('en-IN')}

APPLICANT DETAILS:
Name: ${submittedLead.name}
Email: ${submittedLead.email}
Phone: ${submittedLead.phone}

PORTFOLIO & LOAN SUMMARY:
Mutual Fund Portfolio Value: ₹${(submittedLead.portfolioValue || portfolioValue).toLocaleString('en-IN')}
Portfolio Category: ${submittedLead.portfolioType || 'Equity Mutual Funds'}
RTA Registrar: ${submittedLead.rtaProvider || 'Both / Not Sure'}

Requested Credit Line / Overdraft: ₹${(submittedLead.requestedLoanAmount || effectiveLoanAmount).toLocaleString('en-IN')}
Sanctioned Interest Rate: 9.50% per annum (Pay interest only on drawn amount)
Loan Purpose: ${submittedLead.investmentGoal}

BENEFITS SUMMARY:
• Your mutual fund units remain invested and continue compounding in the market.
• Zero Capital Gains Tax (STCG/LTCG) triggered as units are pledged, not sold.
• Zero prepayment / foreclosure charges anytime.

NEXT STEPS:
1. Our credit operations officer will verify your CAMS/KFintech CAS statement.
2. Complete 2-minute digital OTP pledge on the official RTA portal.
3. Overdraft limit activated and disbursed to your linked bank account.
----------------------------------------------------------------------
WealthyWiz Financial Intelligence • https://wealthywiz.online`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WealthyWiz_LAMF_Sanction_${submittedLead.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lamfFaqs = [
    {
      q: 'Why should I take a Loan Against Mutual Funds instead of redeeming/selling my units?',
      a: 'When you redeem mutual funds, you permanently stop compounding growth and trigger immediate Short-Term (STCG) or Long-Term Capital Gains (LTCG) tax (up to 20%). With a Loan Against Mutual Funds, your units remain 100% invested in the market earning dividends and compounding, while you access instant liquidity at low interest rates (starting 9.5% p.a.).'
    },
    {
      q: 'How much loan can I get against my mutual fund portfolio?',
      a: 'As per RBI guidelines, you can get up to 50% of the portfolio value for Equity Mutual Funds and up to 80% for Debt, Liquid, and Arbitrage Mutual Funds. For example, on a ₹10 Lakh equity portfolio, you get an instant credit line of ₹5 Lakh.'
    },
    {
      q: 'How does the Overdraft / Credit Line facility work?',
      a: 'You only pay interest on the amount you actually withdraw and for the exact number of days you use it. If you have an approved limit of ₹5,00,000 but only withdraw ₹50,000 for 15 days, you pay interest only on ₹50,000 for those 15 days.'
    },
    {
      q: 'Is physical paperwork required or is it 100% digital?',
      a: 'The entire process is 100% digital and paperless. Mutual fund units registered with CAMS and KFintech are pledged online through an instantaneous Aadhaar / Mobile OTP confirmation without submitting physical documents.'
    },
    {
      q: 'Can I repay or close the loan anytime without penalty?',
      a: 'Yes! There are zero foreclosure fees and zero prepayment penalties. You can repay whenever you want, and your mutual fund units are immediately unpledged.'
    }
  ];

  return (
    <section id="loan-against-mf" className="py-16 sm:py-24 bg-[#180914] text-white scroll-mt-20 relative overflow-hidden border-t border-[#38142c]">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/80 border border-rose-400/40 text-rose-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <CreditCard className="w-4 h-4 text-rose-300" />
            <span>Instant Liquidity Without Selling Units</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="text-amber-300">Starting @ 9.0% p.a.</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-['Fraunces',serif] leading-tight">
            Loan Against Mutual Funds & Securities
          </h2>

          <p className="text-rose-100/80 mt-3 text-sm sm:text-base leading-relaxed">
            Need urgent funds for business, emergencies, or real estate? Don't break your compounding. Get an instant digital overdraft limit against your CAMS & KFintech mutual funds in 2 hours with zero capital gains tax.
          </p>

          <div className="mt-5 flex justify-center">
            <button
              onClick={() => navigateToRoute('loan-against-securities')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-md"
            >
              <CreditCard className="w-4 h-4 text-slate-950" />
              <span>Open Dedicated Loan Against Securities Page</span>
              <span className="bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded text-[10px] font-mono">9.0% p.a.</span>
            </button>
          </div>
        </div>

        {/* 4 Core Pillars Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="bg-[#240e1f]/90 border border-[#421736] rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white font-['Fraunces',serif]">Keep Earning Returns</h4>
            <p className="text-xs text-rose-100/70 mt-1">Your mutual fund units stay invested and continue growing at market CAGR.</p>
          </div>

          <div className="bg-[#240e1f]/90 border border-[#421736] rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center mb-3">
              <Percent className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white font-['Fraunces',serif]">Pay Only on Used Funds</h4>
            <p className="text-xs text-rose-100/70 mt-1">Overdraft credit line. Zero interest charged on unused sanction limit.</p>
          </div>

          <div className="bg-[#240e1f]/90 border border-[#421736] rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white font-['Fraunces',serif]">Zero Capital Gains Tax</h4>
            <p className="text-xs text-rose-100/70 mt-1">No redemption means 0% LTCG or STCG tax triggered with the tax department.</p>
          </div>

          <div className="bg-[#240e1f]/90 border border-[#421736] rounded-2xl p-4 sm:p-5 backdrop-blur-md">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white font-['Fraunces',serif]">2-Hour Digital Approval</h4>
            <p className="text-xs text-rose-100/70 mt-1">100% paperless CAMS & KFintech OTP pledge directly to your bank account.</p>
          </div>
        </div>

        {/* Interactive Calculator + Fast Apply Application Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Interactive Calculator (7 cols) */}
          <div className="lg:col-span-7 bg-[#240e1f]/95 border border-[#481a3b] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#3e1632]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <BadgePercent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-['Fraunces',serif]">
                    LAMF Eligibility & Overdraft Calculator
                  </h3>
                  <p className="text-xs text-rose-200/70">
                    Estimate your approved credit line and calculate your monthly interest
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono font-bold text-rose-300 bg-rose-950/80 px-2.5 py-1 rounded-lg border border-rose-700/50">
                RBI Compliant
              </span>
            </div>

            {/* 1. Portfolio Value Input & Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-rose-200">
                  Your Mutual Fund Portfolio Value
                </label>
                <span className="text-xl font-bold font-mono text-amber-300">
                  ₹{portfolioValue.toLocaleString('en-IN')}
                </span>
              </div>

              <input
                type="range"
                min={50000}
                max={10000000}
                step={25000}
                value={portfolioValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPortfolioValue(val);
                  if (requestedLoanAmount > val * ltvRatio) {
                    setRequestedLoanAmount(Math.round(val * ltvRatio));
                  }
                }}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-[#881337]"
              />

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-rose-300/70">Quick Select:</span>
                {portfolioPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setPortfolioValue(preset.value);
                      setRequestedLoanAmount(Math.round(preset.value * ltvRatio));
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                      portfolioValue === preset.value
                        ? 'bg-[#881337] text-white font-bold shadow-sm'
                        : 'bg-[#31132a] hover:bg-[#3d1835] text-rose-200 border border-[#521e44]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Portfolio Category (LTV ratio control) */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-rose-200">
                Portfolio Mix & Asset Type
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setPortfolioType('equity');
                    setRequestedLoanAmount(Math.round(portfolioValue * 0.50));
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    portfolioType === 'equity'
                      ? 'bg-rose-950/70 border-rose-400 text-white shadow-sm'
                      : 'bg-[#1e0a19] border-[#3e1632] text-rose-200 hover:bg-[#2b1025]'
                  }`}
                >
                  <div className="text-xs font-bold">Equity Funds</div>
                  <div className="text-[11px] text-amber-300 font-mono mt-0.5 font-bold">50% LTV Limit</div>
                  <div className="text-[10px] text-rose-300/70 mt-1">Flexi, Small, Mid & Large Cap</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPortfolioType('hybrid');
                    setRequestedLoanAmount(Math.round(portfolioValue * 0.65));
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    portfolioType === 'hybrid'
                      ? 'bg-rose-950/70 border-rose-400 text-white shadow-sm'
                      : 'bg-[#1e0a19] border-[#3e1632] text-rose-200 hover:bg-[#2b1025]'
                  }`}
                >
                  <div className="text-xs font-bold">Hybrid / Balanced</div>
                  <div className="text-[11px] text-amber-300 font-mono mt-0.5 font-bold">65% LTV Limit</div>
                  <div className="text-[10px] text-rose-300/70 mt-1">Dynamic Asset & Multi Asset</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPortfolioType('debt');
                    setRequestedLoanAmount(Math.round(portfolioValue * 0.80));
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    portfolioType === 'debt'
                      ? 'bg-rose-950/70 border-rose-400 text-white shadow-sm'
                      : 'bg-[#1e0a19] border-[#3e1632] text-rose-200 hover:bg-[#2b1025]'
                  }`}
                >
                  <div className="text-xs font-bold">Debt & Liquid</div>
                  <div className="text-[11px] text-amber-300 font-mono mt-0.5 font-bold">80% LTV Limit</div>
                  <div className="text-[10px] text-rose-300/70 mt-1">Liquid, Money Mkt & Ultra Short</div>
                </button>
              </div>
            </div>

            {/* Calculated Output Highlight Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2d1127] to-[#1e0a19] border border-rose-500/30 shadow-inner space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-rose-200/80 font-medium">Max Sanctioned Credit Limit</div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-[#fbbf24] mt-0.5">
                    ₹{maxApprovedLimit.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-rose-300 font-medium mt-0.5">
                    ({Math.round(ltvRatio * 100)}% of your ₹{portfolioValue.toLocaleString('en-IN')} portfolio)
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-rose-200/80 font-medium">Sanctioned Interest Rate</div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 mt-0.5">
                    9.50% <span className="text-xs font-normal text-rose-200">p.a.</span>
                  </div>
                  <div className="text-[11px] text-rose-200 mt-0.5">
                    Only ₹{lamfMonthlyInterest.toLocaleString('en-IN')}/mo per ₹{effectiveLoanAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Personal Loan vs LAMF Comparison Strip */}
              <div className="pt-3 border-t border-[#46193e] grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#1a0816]/80 p-3 rounded-xl border border-[#3e1632]">
                  <span className="text-stone-400 block text-[11px]">Typical Personal Loan (15.5%)</span>
                  <span className="font-bold text-rose-400 font-mono block mt-0.5 text-sm">
                    ₹{personalLoanMonthlyInterest.toLocaleString('en-IN')} / mo
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">+ 2% processing fee & lock-in</span>
                </div>

                <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
                  <span className="text-emerald-300 block text-[11px] font-semibold">Your Annual Interest Savings</span>
                  <span className="font-bold text-emerald-400 font-mono block mt-0.5 text-base">
                    Save ₹{annualSavings.toLocaleString('en-IN')} / yr
                  </span>
                  <span className="text-[10px] text-emerald-300/80 block mt-0.5">Zero prepayment penalties</span>
                </div>
              </div>

              {/* Compounding Growth Retained Banner */}
              <div className="flex items-center gap-2 text-xs text-amber-200 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/25">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Compounding Benefit:</strong> While your ₹{effectiveLoanAmount.toLocaleString('en-IN')} loan is active, your ₹{portfolioValue.toLocaleString('en-IN')} portfolio is estimated to generate <strong>+₹{estimatedPortfolioGrowth1Y.toLocaleString('en-IN')}</strong> in market growth over 1 year (at 13% CAGR)!
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Instant Application Form (5 cols) */}
          <div className="lg:col-span-5 bg-white text-stone-900 border border-[#ecdcd3] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            
            {submittedLead ? (
              /* Success State */
              <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-7 h-7" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-full border border-stone-200">
                    Application Ref #{submittedLead.id}
                  </span>
                  <h3 className="text-xl font-bold text-[#701a2f] font-['Fraunces',serif]">
                    LAMF Application Logged!
                  </h3>
                  <p className="text-xs text-stone-600">
                    Thank you, <strong>{submittedLead.name}</strong>. Your loan against mutual funds inquiry for <strong>₹{submittedLead.investmentAmount.toLocaleString('en-IN')}</strong> has been submitted to our priority desk and Formspree CRM.
                  </p>
                </div>

                <div className="bg-[#faf7f2] border border-[#ecdcd3] rounded-2xl p-4 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Portfolio Declared:</span>
                    <span className="font-bold text-stone-900 font-mono">₹{portfolioValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Credit Line Requested:</span>
                    <span className="font-bold text-emerald-700 font-mono">₹{effectiveLoanAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Registrar / RTA:</span>
                    <span className="font-bold text-stone-900">{rtaProvider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Interest ROI:</span>
                    <span className="font-bold text-[#881337] font-mono">9.50% p.a.</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleDownloadReceipt}
                    className="w-full bg-[#881337] hover:bg-[#70102d] text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download Application Sheet (.txt)
                  </button>

                  <button
                    onClick={() => setSubmittedLead(null)}
                    className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              /* Active Form */
              <form onSubmit={handleSubmitLoanApplication} className="space-y-4">
                
                <div className="border-b border-stone-100 pb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-[#881337] text-[11px] font-bold uppercase tracking-wider mb-1.5 border border-rose-200">
                    <FileCheck className="w-3.5 h-3.5 text-[#881337]" />
                    Zero Paperwork • Digital Pledge
                  </div>
                  <h3 className="text-lg font-bold text-[#701a2f] font-['Fraunces',serif]">
                    Apply for Loan Against MF
                  </h3>
                  <p className="text-xs text-stone-500">
                    Approved within 2 hours. Funds disbursed directly to your bank.
                  </p>
                </div>

                {/* Name */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Sen"
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#faf7f2] border border-[#ecdcd3] rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#881337] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Email & Phone 2-col */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="vikram@gmail.com"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#faf7f2] border border-[#ecdcd3] rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#881337] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                      Mobile (+91) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-[#faf7f2] border border-[#ecdcd3] rounded-xl text-xs font-medium font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#881337] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* RTA & Loan Purpose */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                      Mutual Fund RTA / Registrar
                    </label>
                    <select
                      value={rtaProvider}
                      onChange={(e) => setRtaProvider(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#faf7f2] border border-[#ecdcd3] rounded-xl text-xs font-medium text-stone-800 focus:ring-2 focus:ring-[#881337] focus:outline-none"
                    >
                      <option value="Both">CAMS + KFintech (All AMCs)</option>
                      <option value="CAMS">CAMS (HDFC, ICICI, SBI, etc.)</option>
                      <option value="KFintech">KFintech (Quant, Axis, Mirae, etc.)</option>
                      <option value="Not Sure">I Don't Know / Need Help</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                      Loan Purpose
                    </label>
                    <select
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value)}
                      className="w-full px-3 py-2 bg-[#faf7f2] border border-[#ecdcd3] rounded-xl text-xs font-medium text-stone-800 focus:ring-2 focus:ring-[#881337] focus:outline-none"
                    >
                      {loanPurposes.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pre-filled Requested Loan Amount Display */}
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-600 block text-[11px]">Requested Overdraft Limit:</span>
                    <span className="font-bold font-mono text-[#881337] text-sm">
                      ₹{effectiveLoanAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#881337] font-bold bg-rose-100/90 px-2 py-0.5 rounded">
                    @ 9.50% p.a.
                  </span>
                </div>

                {/* Message */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                    Specific Questions or Urgent Timelines (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Need ₹2 Lakh within 24 hours for business working capital..."
                    value={applicantMessage}
                    onChange={(e) => setApplicantMessage(e.target.value)}
                    className="w-full p-2.5 bg-[#faf7f2] border border-[#ecdcd3] rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#881337] focus:bg-white transition-all resize-none"
                  />
                </div>

                {errorMessage && (
                  <div className="p-2.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#881337] hover:bg-[#70102d] text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting Application...' : 'Apply for Instant Loan Limit'}
                </button>

                <p className="text-[10px] text-stone-500 text-center flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-stone-400" />
                  <span>Your mutual fund units remain secure with your registered AMC & RTA.</span>
                </p>

              </form>
            )}

          </div>

        </div>

        {/* 3-Step Simple Digital Journey */}
        <div className="bg-[#240e1f]/70 border border-[#3e1632] rounded-3xl p-6 sm:p-8 mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">How It Works</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Fraunces',serif] mt-1">
              3 Simple Steps to Your Loan Disbursal
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="bg-[#1e0a19] border border-[#3e1632] p-5 rounded-2xl relative">
              <div className="w-8 h-8 rounded-full bg-[#881337] text-white font-bold text-sm flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-white mb-1 font-['Fraunces',serif]">Check Eligibility & Fetch CAS</h4>
              <p className="text-xs text-rose-100/70 leading-relaxed">
                Submit your mutual fund portfolio value. Our system checks your approved credit limit across 40+ Indian AMCs.
              </p>
            </div>

            <div className="bg-[#1e0a19] border border-[#3e1632] p-5 rounded-2xl relative">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-white mb-1 font-['Fraunces',serif]">Digital OTP Pledge</h4>
              <p className="text-xs text-rose-100/70 leading-relaxed">
                Receive an official CAMS / KFintech pledge link on your registered mobile. Approve with Aadhaar OTP in under 2 minutes.
              </p>
            </div>

            <div className="bg-[#1e0a19] border border-[#3e1632] p-5 rounded-2xl relative">
              <div className="w-8 h-8 rounded-full bg-emerald-400 text-stone-950 font-bold text-sm flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="text-sm font-bold text-white mb-1 font-['Fraunces',serif]">Instant Limit Disbursal</h4>
              <p className="text-xs text-rose-100/70 leading-relaxed">
                Overdraft credit line is activated in your bank account. Withdraw money 24/7 and pay interest only on used funds!
              </p>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table: LAMF vs Personal Loan vs Selling MF */}
        <div className="bg-[#240e1f]/90 border border-[#3e1632] rounded-3xl p-6 sm:p-8 mb-16 overflow-x-auto">
          <div className="text-left mb-6">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">Comparison Guide</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Fraunces',serif] mt-1">
              Why Loan Against Mutual Funds Beats Personal Loans & Redemption
            </h3>
          </div>

          <table className="w-full text-left text-xs min-w-[600px]">
            <thead>
              <tr className="border-b border-[#3e1632] text-rose-200">
                <th className="pb-3 font-bold uppercase text-[11px]">Feature</th>
                <th className="pb-3 font-bold uppercase text-[11px] text-amber-300 bg-rose-950/60 px-3 py-1 rounded-t-lg">
                  Loan Against MF (LAMF)
                </th>
                <th className="pb-3 font-bold uppercase text-[11px]">Personal Loan</th>
                <th className="pb-3 font-bold uppercase text-[11px]">Redeeming / Selling MF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#38142c] text-rose-100/90">
              <tr>
                <td className="py-3 font-semibold text-white">Interest Rate</td>
                <td className="py-3 font-bold text-emerald-400 bg-rose-950/40 px-3 font-mono">9.50% - 10.50% p.a.</td>
                <td className="py-3 text-rose-400 font-mono">14.00% - 24.00% p.a.</td>
                <td className="py-3 text-rose-300/50">N/A (Loss of compounding)</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Ongoing Compounding Growth</td>
                <td className="py-3 font-bold text-emerald-400 bg-rose-950/40 px-3">
                  <Check className="w-4 h-4 inline mr-1 text-emerald-400" />
                  100% Retained (Units grow)
                </td>
                <td className="py-3 text-rose-200">Retained</td>
                <td className="py-3 text-rose-400 font-bold">Permanently Lost</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Tax Impact</td>
                <td className="py-3 font-bold text-emerald-400 bg-rose-950/40 px-3">
                  0% Tax Triggered (No Sale)
                </td>
                <td className="py-3 text-rose-200">0% Tax</td>
                <td className="py-3 text-rose-400 font-bold">Up to 20% LTCG/STCG Tax</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Interest Payment Mechanism</td>
                <td className="py-3 font-bold text-amber-300 bg-rose-950/40 px-3">
                  Pay ONLY on amount used
                </td>
                <td className="py-3 text-rose-200">Full EMI on total loan</td>
                <td className="py-3 text-rose-300/50">N/A</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Prepayment / Foreclosure Fees</td>
                <td className="py-3 font-bold text-emerald-400 bg-rose-950/40 px-3">
                  ₹0 (Nil charges anytime)
                </td>
                <td className="py-3 text-rose-400">2% - 5% Penalty charges</td>
                <td className="py-3 text-rose-300/50">Exit Load (0.5% - 1%)</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Approval Time</td>
                <td className="py-3 font-bold text-amber-300 bg-rose-950/40 px-3">
                  2 Hours (Digital OTP)
                </td>
                <td className="py-3 text-rose-200">2 - 5 Business Days</td>
                <td className="py-3 text-rose-200">T+2 to T+3 Days</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* LAMF FAQs */}
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">LAMF Questions</span>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-['Fraunces',serif] mt-1">
              Frequently Asked Questions About Loan Against Mutual Funds
            </h3>
          </div>

          {lamfFaqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#240e1f] border border-[#3e1632] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white"
                >
                  <span>{faq.q}</span>
                  <span className={`p-1 rounded bg-[#180914] text-rose-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 text-xs text-rose-100/80 leading-relaxed border-t border-[#38142c] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
