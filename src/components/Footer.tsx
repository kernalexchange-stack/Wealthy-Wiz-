import React from 'react';
import { OwlLogo } from './OwlLogo';
import { ShieldCheck, Heart, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
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
    <footer className="bg-[#0c0b24] text-slate-400 pt-16 pb-12 border-t border-[#1e1b4b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Col (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <OwlLogo size={36} />
              <span className="text-2xl font-bold text-white font-['Fraunces',serif]">
                Wealthy<span className="text-[#fbbf24]">Wiz</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier mutual fund discovery platform. Empowering retail investors with live AMFI data, quantitative risk profiling, and institutional-grade portfolio advisory.
            </p>

            <div className="text-xs text-slate-500 space-y-1 pt-1">
              <div>Domain: <span className="text-cyan-400 font-mono">wealthywiz.online</span></div>
              <div>Data Source: <span className="text-slate-300">AMFI / mfapi.in (Live Official Feed)</span></div>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Navigation & Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollTo('explorer')} className="hover:text-cyan-300 transition-colors">
                  Mutual Fund Scheme Explorer
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('quiz')} className="hover:text-cyan-300 transition-colors">
                  60-Second Risk Profiler Quiz
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('calculator')} className="hover:text-cyan-300 transition-colors">
                  Mutual Fund vs FD Compounding Calculator
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('blog')} className="hover:text-cyan-300 transition-colors">
                  Educational Investment Guides
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('advice')} className="hover:text-cyan-300 transition-colors">
                  Request Custom Advisory Plan
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Popular Mutual Fund Categories
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-slate-900/90 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-800">Flexi Cap Funds</span>
              <span className="bg-slate-900/90 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-800">Small Cap Alpha</span>
              <span className="bg-slate-900/90 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-800">Large & Mid Cap</span>
              <span className="bg-slate-900/90 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-800">ELSS Tax Savers (80C)</span>
              <span className="bg-slate-900/90 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-800">Balanced Advantage</span>
              <span className="bg-slate-900/90 px-2.5 py-1 rounded-lg text-slate-300 border border-slate-800">Liquid & Overnight</span>
            </div>
          </div>

        </div>

        {/* Regulatory AMFI / SEBI Compliance Disclaimer */}
        <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800/80 text-[11px] leading-relaxed text-slate-400 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Statutory Regulatory Notice & Disclaimer</span>
          </div>
          <p>
            <strong>Mutual fund investments are subject to market risks, read all scheme related documents carefully.</strong> Past performance is not indicative of future returns. The calculations, simulators, and risk profiles provided by WealthyWiz are for educational and illustrative purposes only and should not be construed as investment, tax, or legal advice. NAV data is sourced directly from AMFI through public APIs.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} WealthyWiz. Built for Indian Mutual Fund Investors. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="https://wealthywiz.online" className="hover:text-slate-400 transition-colors">
              wealthywiz.online
            </a>
            <span>•</span>
            <span>AMFI Mirror Feed</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
