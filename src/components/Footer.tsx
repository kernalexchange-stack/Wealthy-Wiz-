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
    <footer className="bg-[#021819] text-[#c2ece2]/70 pt-16 pb-12 border-t border-[#043638]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand Col (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <OwlLogo size={36} />
              <span className="text-2xl font-bold text-white font-cardia">
                Wealthy<span className="text-[#c2ece2]">Wiz</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#c2ece2]/80 leading-relaxed max-w-sm">
              India's premier mutual fund discovery platform. Empowering retail investors with live AMFI data, quantitative risk profiling, and institutional-grade portfolio advisory.
            </p>

            <div className="text-xs text-[#c2ece2]/60 space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <span>AMFI Registration:</span>
                <span className="text-white font-mono font-bold bg-[#017374] px-2 py-0.5 rounded text-[11px] border border-[#2dd4bf]/40 shadow-sm">
                  ARN-363293
                </span>
              </div>
              <div>Domain: <span className="text-amber-300 font-mono">wealthywiz.online</span></div>
              <div>Data Source: <span className="text-[#c2ece2]/90">AMFI / mfapi.in (Live Official Feed)</span></div>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-cardia">
              Navigation & Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollTo('explorer')} className="hover:text-[#c2ece2] transition-colors">
                  Mutual Fund Scheme Explorer
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('quiz')} className="hover:text-[#c2ece2] transition-colors">
                  60-Second Risk Profiler Quiz
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('calculator')} className="hover:text-[#c2ece2] transition-colors">
                  Mutual Fund vs FD Compounding Calculator
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('loan-against-mf')} className="hover:text-amber-300 transition-colors">
                  Loan Against Mutual Funds (LAMF)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('blog')} className="hover:text-[#c2ece2] transition-colors">
                  Educational Investment Guides
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('faq')} className="hover:text-[#c2ece2] transition-colors">
                  Frequently Asked Questions (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('advice')} className="hover:text-[#c2ece2] transition-colors">
                  Request Custom Advisory Plan
                </button>
              </li>
              <li className="pt-2 border-t border-[#043638]">
                <button 
                  onClick={() => onOpenLegal ? onOpenLegal('privacy') : null} 
                  className="hover:text-[#c2ece2] transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-[#2dd4bf]" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal ? onOpenLegal('terms') : null} 
                  className="hover:text-[#c2ece2] transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-[#2dd4bf]" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenLegal ? onOpenLegal('adsense') : null} 
                  className="hover:text-[#c2ece2] transition-colors flex items-center gap-1.5"
                >
                  <Cookie className="w-3 h-3 text-[#2dd4bf]" />
                  <span>Google AdSense & Cookies</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Categories & AdSense Verification (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-cardia">
                Popular Mutual Fund Categories
              </h4>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-[#022425] px-2.5 py-1 rounded-lg text-[#c2ece2] border border-[#044a4c]">Flexi Cap Funds</span>
                <span className="bg-[#022425] px-2.5 py-1 rounded-lg text-[#c2ece2] border border-[#044a4c]">Small Cap Alpha</span>
                <span className="bg-[#022425] px-2.5 py-1 rounded-lg text-[#c2ece2] border border-[#044a4c]">Large & Mid Cap</span>
                <span className="bg-[#022425] px-2.5 py-1 rounded-lg text-[#c2ece2] border border-[#044a4c]">ELSS Tax Savers (80C)</span>
                <span className="bg-[#022425] px-2.5 py-1 rounded-lg text-[#c2ece2] border border-[#044a4c]">Balanced Advantage</span>
                <span className="bg-[#022425] px-2.5 py-1 rounded-lg text-[#c2ece2] border border-[#044a4c]">Liquid & Overnight</span>
              </div>
            </div>

            {/* AdSense Verification Badge */}
            <div className="p-3 bg-[#022425] rounded-xl border border-[#044a4c] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-stone-300 font-semibold text-[11px]">Ad Transparency</span>
                <span className="text-[10px] font-mono text-amber-400">Google AdSense</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#c2ece2]/70">
                <span>Verified Direct Relationship</span>
                <a 
                  href="/ads.txt" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#c2ece2] hover:underline flex items-center gap-1 font-mono"
                >
                  ads.txt <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Regulatory AMFI / SEBI Compliance Disclaimer */}
        <div className="p-5 bg-[#022425] rounded-2xl border border-[#044a4c] text-[11px] leading-relaxed text-[#c2ece2]/80 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Statutory Regulatory Notice & Disclaimer • AMFI Registered Distributor (ARN-363293)</span>
            </div>
            {onOpenLegal && (
              <button
                onClick={() => onOpenLegal('disclaimer')}
                className="text-[#c2ece2] hover:text-white underline font-semibold transition-colors"
              >
                View Complete SEBI Disclosures →
              </button>
            )}
          </div>
          <p>
            <strong>AMFI Registration Notice:</strong> WealthyWiz is an AMFI-Registered Mutual Fund Distributor holding Registration Number <strong className="text-white font-mono">ARN-363293</strong>. <strong>Mutual fund investments are subject to market risks, read all scheme related documents carefully.</strong> Past performance is not indicative of future returns. The calculations, simulators, and risk profiles provided by WealthyWiz are for educational and illustrative purposes only and should not be construed as investment, tax, or legal advice. NAV data is sourced directly from AMFI through public APIs.
          </p>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-6 border-t border-[#043638] flex flex-col sm:flex-row items-center justify-between text-xs text-[#c2ece2]/50 gap-4">
          <div>
            © {new Date().getFullYear()} WealthyWiz • AMFI Registered Distributor (ARN-363293). All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button 
              onClick={() => onOpenLegal ? onOpenLegal('privacy') : null} 
              className="hover:text-[#c2ece2] transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegal ? onOpenLegal('terms') : null} 
              className="hover:text-[#c2ece2] transition-colors"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegal ? onOpenLegal('adsense') : null} 
              className="hover:text-[#c2ece2] transition-colors"
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
            <a href="https://wealthywiz.online" className="hover:text-[#c2ece2] transition-colors">
              wealthywiz.online
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
