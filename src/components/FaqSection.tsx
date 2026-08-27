import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS_DATA: FAQItem[] = [
  {
    category: 'SIP & Compounding',
    question: 'What is a Systematic Investment Plan (SIP) and why is it recommended for wealth creation?',
    answer: 'A Systematic Investment Plan (SIP) allows investors to invest a fixed sum regularly (e.g. monthly) into chosen mutual fund schemes. SIPs enforce financial discipline, eliminate market timing risk through Rupee Cost Averaging (buying more units when prices fall and fewer when prices rise), and harness the exponential power of compounding over long investment horizons.'
  },
  {
    category: 'Mutual Funds vs Fixed Deposits',
    question: 'How do Mutual Funds compare to Bank Fixed Deposits (FD) for long-term wealth?',
    answer: 'While Bank FDs offer guaranteed capital safety with 6.5%–7.5% annual returns, their real post-tax and post-inflation returns often drop to 1%–2%. Diversified equity and flexi-cap mutual funds historically deliver 12%–15%+ annualized returns over 5–10 year cycles, generating substantially higher compounding wealth and superior inflation protection.'
  },
  {
    category: 'Direct vs Regular Plans',
    question: 'What is the difference between Direct and Regular mutual fund plans?',
    answer: 'Direct Plans are bought directly from the Asset Management Company (AMC) without paying distributor commissions or broker fees. As a result, Direct plans have significantly lower Expense Ratios (often 0.5% to 1.5% lower per year). Over a 15–20 year compounding period, this difference can result in 15%–25% higher accumulated corpus for the investor.'
  },
  {
    category: 'Taxation & Section 80C',
    question: 'What are ELSS Mutual Funds and how do they save income tax?',
    answer: 'Equity Linked Savings Schemes (ELSS) are tax-saving mutual funds eligible for income tax deduction under Section 80C of the Income Tax Act up to ₹1.5 Lakh per financial year. ELSS funds feature the shortest mandatory lock-in period (3 years) among all 80C investment options (compared to 5 years for Tax-Saving FDs and 15 years for PPF) while participating in equity growth.'
  },
  {
    category: 'AMFI Live NAVs',
    question: 'How frequently are Mutual Fund Net Asset Values (NAVs) updated in India?',
    answer: 'In India, Net Asset Values (NAVs) of mutual fund schemes are calculated and published on every business day after market close by the Association of Mutual Funds in India (AMFI) and mutual fund houses, typically by 11:00 PM IST on T+0 trading days.'
  },
  {
    category: 'Risk & Strategy',
    question: 'How should I choose between Large Cap, Mid Cap, and Small Cap mutual funds?',
    answer: 'Your asset allocation should match your investment horizon and risk tolerance. Large-cap funds invest in India’s top 100 established enterprises and offer stability with moderate volatility. Mid-cap and Small-cap funds invest in high-growth, emerging companies that offer higher upside potential but experience greater short-term volatility, making them ideal for investment horizons of 7+ years.'
  }
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elRect = el.getBoundingClientRect().top;
      const elementPosition = elRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-white text-slate-900 scroll-mt-20 border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-900 text-xs font-semibold uppercase tracking-wider mb-3 border border-cyan-200">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight font-['Fraunces',serif]">
            Everything You Need to Know About Mutual Funds
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Clear answers to common questions on SIP compounding, tax benefits, direct plans, and risk profiling.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {FAQS_DATA.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'border-cyan-500/50 bg-cyan-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-cyan-700 uppercase tracking-wider block">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <div className={`p-1.5 rounded-full mt-1 shrink-0 transition-transform ${
                    isOpen ? 'bg-cyan-100 text-cyan-800 rotate-180' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-cyan-100/60 mt-1">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Banner at the bottom of FAQ */}
        <div className="mt-12 bg-gradient-to-r from-[#17144e] to-[#1c2966] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg sm:text-xl font-bold font-['Fraunces',serif]">
              Have custom questions about your mutual fund portfolio?
            </h4>
            <p className="text-xs sm:text-sm text-cyan-200 mt-1 max-w-md">
              Get an unbiased, zero-commission portfolio review and custom asset allocation blueprint.
            </p>
          </div>
          <button
            onClick={() => scrollToSection('advice')}
            className="shrink-0 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] hover:brightness-105 text-slate-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span>Request Free Advisory</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
