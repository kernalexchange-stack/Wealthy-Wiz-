import React from 'react';
import { Briefcase, Sparkles, ShieldCheck } from 'lucide-react';

interface PortfolioConsultationTabProps {
  onOpen: () => void;
}

export const PortfolioConsultationTab: React.FC<PortfolioConsultationTabProps> = ({ onOpen }) => {
  return (
    <>
      {/* Desktop Floating Right-Edge Tab */}
      <aside 
        aria-label="Portfolio Consultation Quick Access"
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40"
      >
        <button
          onClick={onOpen}
          className="group flex items-center gap-2.5 bg-[#021d1e] hover:bg-[#013436] text-white border-l-2 border-y border-[#2dd4bf]/60 py-3.5 px-3.5 rounded-l-2xl shadow-2xl transition-all hover:pr-5 hover:translate-x-0 translate-x-1"
          title="Book Free 1-on-1 Portfolio Consultation with AMFI Certified Specialist"
        >
          {/* Pulsing indicator */}
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf] animate-ping absolute opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf]" />
          </div>

          <div className="p-1.5 rounded-lg bg-[#017374]/40 text-[#c2ece2] group-hover:scale-110 transition-transform">
            <Briefcase className="w-4 h-4 text-[#5eead4]" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Free AMFI Advice
            </span>
            <span className="text-xs font-bold text-white tracking-tight whitespace-nowrap">
              Portfolio Consultation
            </span>
          </div>
        </button>
      </aside>

      {/* Mobile Floating Bottom Pill */}
      <div className="md:hidden fixed bottom-5 right-4 z-40">
        <button
          onClick={onOpen}
          className="flex items-center gap-2 bg-[#021d1e]/95 backdrop-blur-md text-white border border-[#2dd4bf]/60 py-2.5 px-4 rounded-full shadow-2xl active:scale-95 transition-transform"
        >
          <span className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse" />
          <Briefcase className="w-4 h-4 text-[#5eead4]" />
          <span className="text-xs font-bold whitespace-nowrap">
            Portfolio Consultation
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-mono">
            FREE
          </span>
        </button>
      </div>
    </>
  );
};
