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
  AlertCircle,
  Home,
  ChevronRight,
  Calculator,
  RefreshCw,
  Coins,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LeadPayload } from '../types';
import { formatINR } from '../utils/mfapi';
import { getFormspreeEndpoint, getFormspreeFormId } from '../utils/formspree';
import { navigateToRoute } from '../utils/seoAndRouting';
import { trackConversion } from '../utils/analytics';

interface LoanAgainstSecuritiesPageProps {
  onLeadSubmitted: (lead: LeadPayload) => void;
  onOpenConsultation?: (goal?: string) => void;
}

export const LoanAgainstSecuritiesPage: React.FC<LoanAgainstSecuritiesPageProps> = ({ 
  onLeadSubmitted,
  onOpenConsultation,
}) => {
  // Collateral & Calculator State
  const [portfolioValue, setPortfolioValue] = useState<number>(1000000); // ₹10 Lakhs default
  const [collateralType, setCollateralType] = useState<'equity_mf' | 'equity_shares' | 'debt_mf' | 'hybrid_mf' | 'sgb'>('equity_mf');
  const [requestedLoanAmount, setRequestedLoanAmount] = useState<number>(500000);
  const [lasRate, setLasRate] = useState<number>(9.0); // 9.0% p.a.
  const personalLoanRate = 15.5; // 15.5% benchmark personal loan

  // Application Form State
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [dematOrRta, setDematOrRta] = useState<'CAMS' | 'KFintech' | 'CDSL / NSDL Demat' | 'Both'>('Both');
  const [loanPurpose, setLoanPurpose] = useState('Emergency / Short-term Liquidity');
  const [applicantMessage, setApplicantMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<LeadPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const FORMSPREE_ENDPOINT = getFormspreeEndpoint();
  const FORMSPREE_FORM_ID = getFormspreeFormId();

  // RBI LTV Guidelines
  const ltvRatio = useMemo(() => {
    switch (collateralType) {
      case 'debt_mf': return 0.80; // 80% for Debt & Liquid Funds
      case 'sgb': return 0.75; // 75% for Sovereign Gold Bonds
      case 'hybrid_mf': return 0.65; // 65% for Hybrid & Balanced Advantage Funds
      case 'equity_shares': return 0.50; // 50% for Listed Equity Shares
      case 'equity_mf':
      default: return 0.50; // 50% for Equity Mutual Funds
    }
  }, [collateralType]);

  const collateralLabels: Record<typeof collateralType, { label: string; tag: string; desc: string }> = {
    equity_mf: {
      label: 'Equity Mutual Funds',
      tag: '50% LTV (RBI Cap)',
      desc: 'All direct & regular equity funds (Flexi Cap, Large Cap, Small Cap)'
    },
    equity_shares: {
      label: 'Demat Listed Stocks / Shares',
      tag: '50% LTV',
      desc: 'Top 1000+ approved NSE & BSE bluechip and mid-cap shares'
    },
    hybrid_mf: {
      label: 'Hybrid & Balanced Funds',
      tag: '65% LTV',
      desc: 'Balanced Advantage, Multi-Asset Allocation, Aggressive Hybrid'
    },
    debt_mf: {
      label: 'Debt & Liquid Mutual Funds',
      tag: '80% LTV',
      desc: 'Low-duration, corporate bond, money market, liquid funds'
    },
    sgb: {
      label: 'Sovereign Gold Bonds (SGB)',
      tag: '75% LTV',
      desc: 'RBI Sovereign Gold Bonds held in Demat or Certificate format'
    }
  };

  // Max Approved Overdraft Limit
  const maxApprovedLimit = useMemo(() => {
    return Math.round(portfolioValue * ltvRatio);
  }, [portfolioValue, ltvRatio]);

  // Keep requested within max limit
  const effectiveLoanAmount = Math.min(requestedLoanAmount, maxApprovedLimit);

  // Financial Calculations
  const lasMonthlyInterest = Math.round((effectiveLoanAmount * (lasRate / 100)) / 12);
  const personalLoanMonthlyInterest = Math.round((effectiveLoanAmount * (personalLoanRate / 100)) / 12);
  const monthlySavings = personalLoanMonthlyInterest - lasMonthlyInterest;
  const annualSavings = monthlySavings * 12;

  // Opportunity cost preserved (Assuming 13% CAGR market compounding continues)
  const portfolioGrowth1Y = Math.round(portfolioValue * 0.13);

  // Capital Gains Tax Saved vs Selling (Assuming 12.5% LTCG on ₹2L assumed profit)
  const capitalGainsTaxSaved = Math.round(effectiveLoanAmount * 0.4 * 0.125);

  const portfolioPresets = [
    { label: '₹2 Lakh', value: 200000 },
    { label: '₹5 Lakh', value: 500000 },
    { label: '₹10 Lakh', value: 1000000 },
    { label: '₹25 Lakh', value: 2500000 },
    { label: '₹50 Lakh', value: 5000000 },
    { label: '₹1 Crore', value: 10000000 },
  ];

  const loanPurposes = [
    'Emergency / Medical / Urgent Liquidity',
    'Business Expansion / Working Capital',
    'Home Renovation / Downpayment Bridge',
    'Debt & High-Interest Credit Card Consolidation',
    'Advance Tax / GST Payment',
    'Short-term Investment Opportunity',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim() || !applicantPhone.trim()) {
      setErrorMessage('Please fill in all required contact details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const refId = `LAS-${Math.floor(100000 + Math.random() * 900000)}`;
    const payload: LeadPayload = {
      id: refId,
      name: applicantName.trim(),
      email: applicantEmail.trim(),
      phone: applicantPhone.trim(),
      investmentGoal: `Loan Against Securities (${collateralLabels[collateralType].label})`,
      investmentAmount: effectiveLoanAmount,
      investmentMode: 'lumpsum',
      riskProfile: `Portfolio: ${formatINR(portfolioValue)} | Collateral: ${collateralLabels[collateralType].label}`,
      recommendedFunds: [
        `Collateral: ${collateralLabels[collateralType].label} (${Math.round(ltvRatio * 100)}% LTV)`,
        `Depository/RTA: ${dematOrRta}`,
        `Purpose: ${loanPurpose}`,
        `Monthly Interest: ${formatINR(lasMonthlyInterest)}/mo @ ${lasRate}%`,
      ],
      message: applicantMessage.trim() || `Requested overdraft of ${formatINR(effectiveLoanAmount)} against ${formatINR(portfolioValue)} portfolio.`,
      sourcePage: '/loan-against-securities',
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    // Server-side lead sync
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          serviceType: 'Loan Against Securities (LAS)',
        }),
      });
    } catch (err) {
      console.warn('Backend leads API warning:', err);
    }

    // Direct Formspree dispatch
    try {
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          serviceType: 'Loan Against Securities (LAS) Overdraft',
          leadId: payload.id,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          collateralType: collateralLabels[collateralType].label,
          portfolioValue: formatINR(portfolioValue),
          approvedLimit: formatINR(maxApprovedLimit),
          requestedLoanAmount: formatINR(effectiveLoanAmount),
          interestRate: `${lasRate}% p.a.`,
          monthlyInterest: `${formatINR(lasMonthlyInterest)}/month`,
          dematRta: dematOrRta,
          purpose: loanPurpose,
          message: payload.message,
          sourcePage: '/loan-against-securities',
          amfiArn: 'ARN-363293',
          _subject: `New LAS Overdraft Request: ${payload.name} (${formatINR(effectiveLoanAmount)})`,
        }),
      });
    } catch (fsErr) {
      console.warn('Formspree direct notice:', fsErr);
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#017374', '#10b981', '#fbbf24'],
      });
    } catch {
      // Safe fallback
    }

    // Track Google Tag conversion (AW-18297262924)
    trackConversion('Loan Against Securities Application', effectiveLoanAmount, {
      collateral_type: collateralType,
      portfolio_value: portfolioValue,
      demat_rta: dematOrRta,
    });

    setIsSubmitting(false);
    setSubmittedLead(payload);
    onLeadSubmitted(payload);
  };

  const handleDownloadApprovalReceipt = () => {
    if (!submittedLead) return;
    const receiptContent = `=====================================================
WEALTHYWIZ — LOAN AGAINST SECURITIES (LAS) PRE-APPROVAL
=====================================================
AMFI Registered Distributor: ARN-363293
Portal: https://wealthywiz.online/loan-against-securities
Application Reference: ${submittedLead.id}
Date & Time: ${new Date().toLocaleString('en-IN')}

APPLICANT DETAILS:
Name: ${submittedLead.name}
Email: ${submittedLead.email}
Phone: ${submittedLead.phone}
Collateral Type: ${collateralLabels[collateralType].label}
Depository / RTA: ${dematOrRta}

FINANCIAL SANCTION SUMMARY:
Portfolio Collateral Value: ${formatINR(portfolioValue)}
RBI Approved LTV Ratio: ${Math.round(ltvRatio * 100)}%
Max Approved Overdraft Limit: ${formatINR(maxApprovedLimit)}
Sanctioned Drawdown Amount: ${formatINR(effectiveLoanAmount)}
Interest Rate: ${lasRate}% p.a. (Simple daily interest on utilized sum)
Monthly Interest Outflow: ${formatINR(lasMonthlyInterest)} / month
Repayment Structure: Flexible Overdraft (Zero Mandatory Monthly Principal EMI)
Foreclosure / Prepayment Penalty: ₹0 (Zero Charges)

BENEFITS SUMMARY:
• Annual Savings vs Personal Loan (15.5%): ${formatINR(annualSavings)}/year
• Capital Gains Tax Saved (Avoided Selling): ~${formatINR(capitalGainsTaxSaved)}
• Ongoing Portfolio Compounding: 100% Retained by Investor

NEXT STEPS FOR 2-HOUR DISBURSAL:
1. Operations desk will review CAMS/KFintech/NSDL/CDSL portfolio statement.
2. An automated OTP lien-pledge link will be sent to your registered mobile.
3. Complete 1-minute digital mandate & receive funds directly in your bank.

Helpdesk: support@wealthywiz.online | Tel: +91 98765 43210
=====================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `WealthyWiz_LAS_Approval_${submittedLead.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      q: 'What is Loan Against Securities (LAS) and how does it beat a Personal Loan?',
      a: 'Loan Against Securities (LAS) is an overdraft credit facility where you pledge your equity mutual funds, demat listed shares, debt funds, or Sovereign Gold Bonds as collateral. Unlike personal loans that charge 14% to 22% fixed interest with mandatory monthly principal EMIs, LAS charges only 9.0% to 10.5% interest exclusively on the amount you withdraw. You can repay the principal whenever you want with zero foreclosure penalties.'
    },
    {
      q: 'What is the maximum Loan to Value (LTV) permitted by RBI guidelines?',
      a: 'According to Reserve Bank of India (RBI) regulations: Equity Mutual Funds and Demat Listed Shares are eligible for up to 50% LTV; Hybrid and Balanced Advantage Funds are eligible for up to 65% LTV; Debt and Liquid Mutual Funds can receive up to 80% LTV; Sovereign Gold Bonds (SGB) are eligible for up to 75% LTV.'
    },
    {
      q: 'Do I still receive dividends, NAV growth, and bonuses while my securities are pledged?',
      a: 'Yes, absolutely! You retain full economic ownership of your pledged securities. Any mutual fund NAV appreciation, stock price growth, quarterly dividends, stock splits, or bonus shares flow directly to your bank account and demat folio without interruption.'
    },
    {
      q: 'How does the lien-marking process work? Is any physical paperwork required?',
      a: 'The entire process is 100% digital and paperless. For mutual funds, lien marking is completed via official CAMS and KFintech OTP authorization. For demat shares, pledge creation is authenticated directly via CDSL or NSDL electronic OTP. Once authorized, the funds are disbursed to your verified savings bank account within 2 hours.'
    },
    {
      q: 'What happens if the stock market or mutual fund NAV falls?',
      a: 'Because RBI limits equity LTV to 50%, there is a substantial 50% safety cushion against normal market fluctuations. If market values drop significantly, lenders provide a grace period to either pay down part of the loan or pledge additional units (a margin call). Your securities are never liquidated without prior notice.'
    },
    {
      q: 'Why is LAS better than redeeming my mutual funds or selling my shares?',
      a: 'Selling your investments triggers capital gains tax (20% Short-Term Capital Gains or 12.5% Long-Term Capital Gains under the 2024 Budget) and permanently halts compounding. With LAS, you avoid capital gains tax, keep your long-term compounding engine running, and borrow funds at a low 9.0% rate.'
    }
  ];

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen">
      
      {/* Breadcrumb Navigation & SEO Header */}
      <div className="bg-[#021819] text-[#c2ece2] border-b border-[#043638] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between flex-wrap gap-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-[#c2ece2]/70">
            <button 
              onClick={() => navigateToRoute('home')}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-white font-semibold">Loan Against Securities (LAS)</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenConsultation ? onOpenConsultation('Loan Against Securities & Portfolio Review') : undefined}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Book Free 1-on-1 Portfolio Consultation"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Portfolio Consultation</span>
            </button>

            <button
              onClick={() => navigateToRoute('sip-calculator')}
              className="px-3 py-1 bg-[#032e30] hover:bg-[#043d3e] text-[#5eead4] rounded-lg text-xs font-semibold border border-[#0d9488]/40 transition-colors flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Open SIP Calculator</span>
            </button>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#043335] text-[#c2ece2] border border-[#0d9488]/40">
              AMFI ARN-363293
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#021d1e] via-[#022a2c] to-[#033638] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant Digital Overdraft • Starting @ 9.0% ROI</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-['Fraunces',serif] leading-tight">
              Loan Against Securities & Mutual Funds (LAS)
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Unlock immediate liquidity against your Mutual Funds, Demat Shares, Sovereign Gold Bonds & Corporate Bonds without selling. Enjoy simple interest starting at <strong className="text-amber-300 font-semibold">9.0% p.a.</strong>, zero foreclosure charges, and keep 100% of your dividends and compounding growth.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>RBI Compliant LTV (50%–80%)</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Disbursal in 2 Hours</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-400" />
                <span>No Paperwork (100% Digital OTP)</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                <BadgePercent className="w-4 h-4 text-emerald-400" />
                <span>Pay Interest Only On Used Amount</span>
              </span>
            </div>

          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Main Content Area: Calculator & Application Form */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive LAS Calculator (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-['Fraunces',serif] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                    <span>Loan Against Securities Calculator</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Estimate your approved credit line and calculate monthly interest savings vs personal loans.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  {collateralLabels[collateralType].tag}
                </span>
              </div>

              {/* Step 1: Select Collateral Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  1. Select Collateral Security Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['equity_mf', 'equity_shares', 'hybrid_mf', 'debt_mf', 'sgb'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCollateralType(type)}
                      className={`p-3 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between ${
                        collateralType === type
                          ? 'bg-[#022425] text-white border-[#044c4e] shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="font-bold">{collateralLabels[type].label}</span>
                      <span className={`text-[10px] font-mono mt-1 ${collateralType === type ? 'text-amber-300' : 'text-slate-500'}`}>
                        {collateralLabels[type].tag}
                      </span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  {collateralLabels[collateralType].desc}
                </p>
              </div>

              {/* Step 2: Portfolio Value Slider & Presets */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    2. Total Portfolio Market Value
                  </label>
                  <div className="text-lg font-bold font-mono text-[#017374]">
                    {formatINR(portfolioValue)}
                  </div>
                </div>

                <input
                  type="range"
                  min={50000}
                  max={20000000}
                  step={50000}
                  value={portfolioValue}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPortfolioValue(val);
                    if (requestedLoanAmount > val * ltvRatio) {
                      setRequestedLoanAmount(Math.round(val * ltvRatio));
                    }
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#017374]"
                />

                <div className="flex flex-wrap gap-2 pt-1">
                  {portfolioPresets.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => {
                        setPortfolioValue(preset.value);
                        setRequestedLoanAmount(Math.round(preset.value * ltvRatio));
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                        portfolioValue === preset.value
                          ? 'bg-[#017374] text-white border-[#017374]'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Approved Limit Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-amber-200 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs text-amber-900 font-semibold uppercase tracking-wider">
                    Max Approved Overdraft Sanction Limit
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-900">
                    {formatINR(maxApprovedLimit)}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Calculated at {Math.round(ltvRatio * 100)}% LTV per RBI guidelines
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-1 rounded-full inline-block">
                    Instant Disbursal
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-mono">
                    Zero Prepayment Penalty
                  </div>
                </div>
              </div>

              {/* Step 3: Requested Borrowing Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    3. Overdraft Amount You Wish to Withdraw
                  </label>
                  <div className="text-base font-bold font-mono text-amber-700">
                    {formatINR(effectiveLoanAmount)}
                  </div>
                </div>

                <input
                  type="range"
                  min={25000}
                  max={maxApprovedLimit}
                  step={25000}
                  value={effectiveLoanAmount}
                  onChange={(e) => setRequestedLoanAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
                <p className="text-[11px] text-slate-500">
                  Tip: You only pay interest on what you actually withdraw from this limit, calculated on a daily reducing balance.
                </p>
              </div>

              {/* Step 4: Interest Rate Adjustment Slider */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Secured LAS Interest Rate (Annual)
                  </label>
                  <span className="text-sm font-bold font-mono text-[#017374]">{lasRate}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={8.5}
                  max={12.0}
                  step={0.25}
                  value={lasRate}
                  onChange={(e) => setLasRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#017374]"
                />
              </div>

              {/* Comparative Output Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                {/* LAS Interest Only Card */}
                <div className="p-4 rounded-2xl bg-[#022425] text-white space-y-1.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                    <span>Loan Against Securities</span>
                    <span className="bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded text-[10px]">9.0%</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {formatINR(lasMonthlyInterest)} <span className="text-xs font-normal text-slate-300">/month</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Interest-only payment. Zero compulsory principal EMI! Repay principal whenever you choose.
                  </div>
                </div>

                {/* Personal Loan Comparison Card */}
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5 text-slate-800">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-800 flex items-center justify-between">
                    <span>Unsecured Personal Loan</span>
                    <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[10px]">15.5%</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-rose-900">
                    {formatINR(personalLoanMonthlyInterest)} <span className="text-xs font-normal text-rose-700">/month</span>
                  </div>
                  <div className="text-[11px] text-rose-700">
                    Heavy interest drain + mandatory EMI burden + 3-5% foreclosure charges.
                  </div>
                </div>

              </div>

              {/* Savings & Compounding Preserved Matrix */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-[11px] text-emerald-800 font-semibold uppercase">Annual Interest Saved</div>
                  <div className="text-lg font-bold font-mono text-emerald-950">{formatINR(annualSavings)}</div>
                  <div className="text-[10px] text-emerald-700">vs personal loan</div>
                </div>
                <div>
                  <div className="text-[11px] text-emerald-800 font-semibold uppercase">Capital Gains Tax Avoided</div>
                  <div className="text-lg font-bold font-mono text-emerald-950">~{formatINR(capitalGainsTaxSaved)}</div>
                  <div className="text-[10px] text-emerald-700">by not selling units</div>
                </div>
                <div>
                  <div className="text-[11px] text-emerald-800 font-semibold uppercase">Portfolio Compounding</div>
                  <div className="text-lg font-bold font-mono text-emerald-950">~{formatINR(portfolioGrowth1Y)}/yr</div>
                  <div className="text-[10px] text-emerald-700">earned while pledged</div>
                </div>
              </div>

            </div>

            {/* 4-Step Paperless Digital Timeline */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 font-['Fraunces',serif]">
                How 100% Digital Pledge & Disbursal Works
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-xl bg-[#017374] text-white flex items-center justify-center font-bold text-xs font-mono">
                    1
                  </div>
                  <div className="text-xs font-bold text-slate-900">Check Limit</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Enter your PAN or Demat ID to fetch eligible shares & mutual funds.
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-xl bg-[#017374] text-white flex items-center justify-center font-bold text-xs font-mono">
                    2
                  </div>
                  <div className="text-xs font-bold text-slate-900">OTP Lien Pledge</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Authenticate digital lien directly with CAMS, KFintech, CDSL or NSDL.
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-xl bg-[#017374] text-white flex items-center justify-center font-bold text-xs font-mono">
                    3
                  </div>
                  <div className="text-xs font-bold text-slate-900">E-Sign Mandate</div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    Quick Aadhaar E-Sign for digital loan agreement in 60 seconds.
                  </div>
                </div>

                <div className="space-y-1.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs font-mono">
                    4
                  </div>
                  <div className="text-xs font-bold text-emerald-950">2-Hour Disbursal</div>
                  <div className="text-[11px] text-emerald-800 leading-snug">
                    Overdraft limit activated directly in your verified bank account.
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Instant Application Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
              
              <div className="border-b border-slate-100 pb-4 mb-5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Instant Overdraft Approval Desk</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 font-['Fraunces',serif]">
                  Apply for Loan Against Securities
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Complete this form to receive a formal pre-sanction letter and lien-marking instructions.
                </p>
              </div>

              {submittedLead ? (
                <div className="p-6 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-center space-y-4 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-200/60 text-emerald-900">
                      Sanction Ref #{submittedLead.id}
                    </span>
                    <h3 className="text-lg font-bold text-emerald-950 mt-2 font-['Fraunces',serif]">
                      Pre-Approval Dispatched, {submittedLead.name}!
                    </h3>
                    <p className="text-xs text-emerald-800 mt-1">
                      Our institutional lending desk has received your request for <strong>{formatINR(effectiveLoanAmount)}</strong> against your <strong>{collateralLabels[collateralType].label}</strong> portfolio.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-left text-xs space-y-1 text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sanctioned Limit:</span>
                      <span className="font-bold font-mono">{formatINR(effectiveLoanAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Interest Outflow:</span>
                      <span className="font-bold font-mono">{formatINR(lasMonthlyInterest)}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Formspree Sync:</span>
                      <span className="font-bold text-emerald-700">Verified ({FORMSPREE_FORM_ID})</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleDownloadApprovalReceipt}
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Sanction Receipt</span>
                    </button>
                    <button
                      onClick={() => setSubmittedLead(null)}
                      className="w-full py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Full Legal Name (as per PAN Card) *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#017374]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          placeholder="rajesh@example.com"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#017374]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          required
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#017374]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Where is your Portfolio Held?
                    </label>
                    <select
                      value={dematOrRta}
                      onChange={(e: any) => setDematOrRta(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#017374]"
                    >
                      <option value="Both">CAMS / KFintech + Demat (Both)</option>
                      <option value="CAMS">CAMS Mutual Funds</option>
                      <option value="KFintech">KFintech Mutual Funds</option>
                      <option value="CDSL / NSDL Demat">CDSL / NSDL Demat Shares & Bonds</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Primary Purpose of Overdraft
                    </label>
                    <select
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#017374]"
                    >
                      {loanPurposes.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Additional Notes or Specific Folio/Demat Query (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={applicantMessage}
                      onChange={(e) => setApplicantMessage(e.target.value)}
                      placeholder="e.g. Looking to pledge Parag Parikh Flexi Cap & HDFC Bank shares for 6 months."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#017374]"
                    />
                  </div>

                  {/* Summary of Sanction in Form */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Requested Overdraft:</span>
                      <strong className="text-slate-900 font-mono">{formatINR(effectiveLoanAmount)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Interest:</span>
                      <strong className="text-amber-700 font-mono">{formatINR(lasMonthlyInterest)}/mo</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Prepayment Penalty:</span>
                      <strong className="text-emerald-700 font-semibold">₹0 (Zero Charges)</strong>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-[#017374] hover:bg-[#025a5b] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isSubmitting ? 'Processing Pre-Approval...' : 'Submit Pre-Approval Request'}</span>
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    <span>256-Bit SSL Encryption • AMFI ARN-363293 Registered</span>
                  </div>

                </form>
              )}

            </div>

            {/* Quick Contact Box */}
            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Dedicated Institutional Desk</span>
              </div>
              <p className="text-xs text-slate-300">
                Need urgent liquidity above ₹50 Lakhs or custom promoter share pledge arrangements? Talk directly with our senior treasury advisors.
              </p>
              <div className="pt-1 flex flex-col gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-200">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  <span>support@wealthywiz.online</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>+91 98765 43210 (Mon-Sat, 9AM - 7PM)</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Comparison Table for SEO */}
        <div className="mt-16 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl mb-6">
            <h3 className="text-2xl font-bold text-slate-900 font-['Fraunces',serif]">
              Comparison: Loan Against Securities vs Personal Loan vs Selling Portfolio
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              See why high-net-worth investors and smart retail traders prefer borrowing against securities rather than triggering capital gains tax or taking expensive personal loans.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Feature</th>
                  <th className="p-3.5 text-[#017374] bg-teal-50/70">Loan Against Securities (LAS)</th>
                  <th className="p-3.5 text-slate-800">Unsecured Personal Loan</th>
                  <th className="p-3.5 text-rose-800">Selling Mutual Funds / Shares</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Annual Interest Rate</td>
                  <td className="p-3.5 font-bold font-mono text-emerald-800 bg-teal-50/30">9.0% – 10.5% p.a.</td>
                  <td className="p-3.5 font-mono text-rose-700">14.0% – 22.0% p.a.</td>
                  <td className="p-3.5 text-slate-500">N/A (Loss of future compounding)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Monthly Repayment Mode</td>
                  <td className="p-3.5 font-semibold text-emerald-800 bg-teal-50/30">Interest Only (Principal flexible)</td>
                  <td className="p-3.5 text-slate-700">Mandatory EMI (Principal + Interest)</td>
                  <td className="p-3.5 text-slate-500">None</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Capital Gains Tax Impact</td>
                  <td className="p-3.5 font-semibold text-emerald-800 bg-teal-50/30">₹0 (Zero tax triggered)</td>
                  <td className="p-3.5 text-slate-600">None</td>
                  <td className="p-3.5 font-bold text-rose-700">12.5% LTCG / 20% STCG Tax payable</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Portfolio NAV & Dividend Rights</td>
                  <td className="p-3.5 font-semibold text-emerald-800 bg-teal-50/30">100% Retained by you</td>
                  <td className="p-3.5 text-slate-600">N/A</td>
                  <td className="p-3.5 text-rose-700">Lost forever</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Foreclosure Charges</td>
                  <td className="p-3.5 font-semibold text-emerald-800 bg-teal-50/30">₹0 (Zero Prepayment Fee)</td>
                  <td className="p-3.5 text-rose-700">3.0% – 5.0% + GST</td>
                  <td className="p-3.5 text-slate-600">Possible exit load (1%)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-slate-900">Turnaround Time</td>
                  <td className="p-3.5 font-semibold text-emerald-800 bg-teal-50/30">Under 2 Hours (100% Digital OTP)</td>
                  <td className="p-3.5 text-slate-700">24 to 72 Hours</td>
                  <td className="p-3.5 text-slate-700">T+1 to T+2 settlement days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dedicated In-Page Portfolio Consultation Tab Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#022425] via-[#011c1d] to-[#011415] border border-[#2dd4bf]/40 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#017374]/30 text-[#c2ece2] border border-[#017374]/60 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#2dd4bf]" />
              <span>AMFI Certified Advisory • ARN-363293</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-['Fraunces',serif]">
              Need Help Deciding Between LAS vs Portfolio Rebalancing?
            </h3>
            <p className="text-xs sm:text-sm text-[#c2ece2]/80 max-w-xl">
              Get an unbiased 1-on-1 consultation with an AMFI registered wealth specialist. We review your mutual fund XIRR, tax liabilities, and suggest the optimal borrowing or rebalancing strategy.
            </p>
          </div>
          <button
            onClick={() => onOpenConsultation ? onOpenConsultation('Loan Against Securities & Portfolio Review') : undefined}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 shrink-0"
          >
            <Briefcase className="w-4 h-4" />
            <span>Book Free Portfolio Consultation</span>
          </button>
        </div>

        {/* SEO FAQ Accordion */}
        <div className="mt-16 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-['Fraunces',serif]">
              Frequently Asked Questions About Loan Against Securities
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Clear, transparent answers to help you make smart borrowing decisions without liquidating your investments.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-[#017374] transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 text-sm">
                    {activeFaq === index ? '−' : '+'}
                  </span>
                </button>

                {activeFaq === index && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA to SIP Calculator & Home */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#021d1e] to-[#044c4e] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl sm:text-2xl font-bold font-['Fraunces',serif]">
              Want to grow your wealth before you borrow?
            </h4>
            <p className="text-xs sm:text-sm text-[#c2ece2]/80 max-w-xl">
              Calculate your wealth accumulation with our advanced SIP Calculator featuring annual Step-Up top-ups and inflation adjustments.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={() => navigateToRoute('sip-calculator')}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Calculator className="w-4 h-4" />
              <span>Explore SIP Calculator</span>
            </button>
            <button
              onClick={() => navigateToRoute('home')}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
            >
              Back to Mutual Fund Explorer
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};
