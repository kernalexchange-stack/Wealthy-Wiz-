import React from 'react';
import { OwlLogo } from './OwlLogo';
import { ShieldCheck, Heart, ExternalLink, Mail, Phone, MapPin, Lock, FileText, Cookie } from 'lucide-react';

interface FooterProps {
  onOpenLegal?: (tab: 'privacy' | 'terms' | 'adsense' | 'disclaimer') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
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
    <footer className="bg-[#180914] text-rose-200/70 pt-16 pb-12 border-t border-[#38142c]">
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

            <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed max-w-sm">
              India's premier mutual fund discovery platform. Empowering retail investors with live AMFI data, quantitative risk profiling, and institutional-grade portfolio advisory.
            </p>

            <div className="text-xs text-rose-300/60 space-y-1 pt-1">
              <div>Domain: <span className="text-amber-300 font-mono">wealthywiz.online</span></div>
              <div>Data Source: <span className="text-rose-200/90">AMFI / mfapi.in (Live Official Feed)</span></div>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation & Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollTo('explorer')} className="hover:text-amber-300 transition-colors">
                  Mutual Fund Scheme Explorer
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('quiz')} className="hover:text-amber-300 transition-colors">
                  60-Second Risk Profiler Quiz
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('calculator')} className="hover:text-amber-300 transition-colors">
                  Mutual Fund vs FD Compounding Calculator
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('loan-against-mf')} className="hover:text-amber-300 transition-colors">
                  Loan Against Mutual Funds (LAMF)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('blog')} className="hover:text-amber-300 transition-colors">
                  Educational Investment Guides
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('faq')} className="hover:text-amber-300 transition-colors">
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('advice')} className="hover:text-amber-300 transition-colors">
                  Request Custom Advisory Plan
                </button>
              </li>
              <li className="pt-2 border-t border-[#38142c]">
                <button 
                  onClick={() => onOpenLegal ? onOpenLegal('privacy') : null} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-rose-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal ? onOpenLegal('terms') : null} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-rose-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal ? onOpenLegal('adsense') : null} 
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Cookie className="w-3 h-3 text-rose-400" />
                  <span>Google AdSense & Cookies</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories & AdSense Verification (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Popular Mutual Fund Categories
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-[#240e1f] px-2.5 py-1 rounded-lg text-rose-200 border border-[#3e1632]">Flexi Cap Funds</span>
                <span className="bg-[#240e1f] px-2.5 py-1 rounded-lg text-rose-200 border border-[#3e1632]">Small Cap Alpha</span>
                <span className="bg-[#240e1f] px-2.5 py-1 rounded-lg text-rose-200 border border-[#3e1632]">Large & Mid Cap</span>
                <span className="bg-[#240e1f] px-2.5 py-1 rounded-lg text-rose-200 border border-[#3e1632]">ELSS Tax Savers (80C)</span>
                <span className="bg-[#240e1f] px-2.5 py-1 rounded-lg text-rose-200 border border-[#3e1632]">Balanced Advantage</span>
                <span className="bg-[#240e1f] px-2.5 py-1 rounded-lg text-rose-200 border border-[#3e1632]">Liquid & Overnight</span>
              </div>
            </div>

            {/* AdSense Verification Badge */}
            <div className="p-3 bg-[#240e1f] rounded-xl border border-[#3e1632] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-300 font-semibold text-[11px]">Ad Transparency</span>
                <span className="text-[10px] font-mono text-amber-400">Google AdSense</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-rose-200/70">
                <span>Verified Direct Relationship</span>
                <a 
                  href="/ads.txt" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-amber-300 hover:underline flex items-center gap-1 font-mono"
                >
                  ads.txt <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Regulatory AMFI / SEBI Compliance Disclaimer */}
        <div className="p-5 bg-[#240e1f] rounded-2xl border border-[#3e1632] text-[11px] leading-relaxed text-rose-200/80 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Statutory Regulatory Notice & Disclaimer</span>
            </div>
            {onOpenLegal && (
              <button
                onClick={() => onOpenLegal('disclaimer')}
                className="text-amber-400 hover:text-amber-300 underline font-semibold transition-colors"
              >
                View Complete SEBI Disclosures →
              </button>
            )}
          </div>
          <p>
            <strong>Mutual fund investments are subject to market risks, read all scheme related documents carefully.</strong> Past performance is not indicative of future returns. The calculations, simulators, and risk profiles provided by WealthyWiz are for educational and illustrative purposes only and should not be construed as investment, tax, or legal advice. NAV data is sourced directly from AMFI through public APIs.
          </p>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 border-t border-[#38142c] flex flex-col sm:flex-row items-center justify-between text-xs text-rose-300/50 gap-4">
          <div>
            © {new Date().getFullYear()} WealthyWiz. Built for Indian Mutual Fund Investors. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button 
              onClick={() => onOpenLegal ? onOpenLegal('privacy') : null} 
              className="hover:text-rose-200 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegal ? onOpenLegal('terms') : null} 
              className="hover:text-rose-200 transition-colors"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegal ? onOpenLegal('adsense') : null} 
              className="hover:text-rose-200 transition-colors"
            >
              Cookies & Ads
            </button>
            <span>•</span>
            <a 
              href="/ads.txt" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-amber-300 font-mono transition-colors"
            >
              ads.txt
            </a>
            <span>•</span>
            <a href="https://wealthywiz.online" className="hover:text-rose-200 transition-colors">
              wealthywiz.online
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
