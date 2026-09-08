import React, { useState } from 'react';
import { OwlLogo } from './OwlLogo';
import { 
  Sparkles, 
  Menu, 
  X, 
  ShieldCheck, 
  Calculator, 
  Compass, 
  BookOpen, 
  Send, 
  UserCheck, 
  LogIn, 
  LogOut, 
  User, 
  Briefcase, 
  ChevronDown,
  LayoutDashboard,
  KeyRound,
  HelpCircle,
  CreditCard
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { ROLE_CONFIGS } from '../data/mockUsers';

interface NavbarProps {
  onOpenAdvisorVault: () => void;
  leadCount: number;
  currentUser: UserProfile | null;
  onOpenLoginModal: (role?: UserRole) => void;
  onLogout: () => void;
  onOpenRoleWorkspace: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAdvisorVault, 
  leadCount,
  currentUser,
  onOpenLoginModal,
  onLogout,
  onOpenRoleWorkspace,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const currentRoleConfig = currentUser ? ROLE_CONFIGS[currentUser.role] : null;

  return (
    <nav className="sticky top-0 z-50 bg-[#190a16]/95 backdrop-blur-md border-b border-[#38142b] text-slate-100 transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <OwlLogo size={46} className="transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Fraunces',serif]">
                  Wealthy<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#f43f5e]">Wiz</span>
                </span>
                <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#3b1228] text-rose-200 border border-[#581c3e] hidden sm:inline-block">
                  AMFI INDIA
                </span>
              </div>
              <span className="text-[11px] text-rose-200/70 font-medium tracking-wide hidden sm:block">
                Mutual Fund Intelligence & Advisory
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => scrollTo('explorer')}
              className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-rose-200 hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-rose-400" />
              Explore Funds
            </button>

            <button
              onClick={() => scrollTo('loan-against-mf')}
              className="px-2.5 py-2 rounded-lg text-xs font-semibold text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
              <span>Loan Against MF</span>
              <span className="text-[9px] bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold px-1.5 py-0.2 rounded font-mono">9.5%</span>
            </button>

            <button
              onClick={() => scrollTo('quiz')}
              className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-amber-300 hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
              Risk Quiz
            </button>

            <button
              onClick={() => scrollTo('calculator')}
              className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-rose-200 hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-rose-400" />
              MF vs FD
            </button>

            <button
              onClick={() => scrollTo('blog')}
              className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-rose-200 hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Guides
            </button>

            <button
              onClick={() => scrollTo('faq')}
              className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-rose-200 hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
              FAQ
            </button>
          </div>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-2.5">
            
            {/* LOGIN OPTION / ACTIVE USER PROFILE */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-semibold ${
                    currentUser.role === 'admin'
                      ? 'bg-rose-950/50 border-rose-800/60 text-rose-200 hover:bg-rose-900/50'
                      : currentUser.role === 'operations'
                      ? 'bg-amber-950/50 border-amber-800/60 text-amber-200 hover:bg-amber-900/50'
                      : 'bg-[#3b152d]/60 border-[#61244b]/60 text-rose-200 hover:bg-[#4d1c3c]/60'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    currentUser.role === 'admin' ? 'bg-rose-400' : currentUser.role === 'operations' ? 'bg-amber-400' : 'bg-rose-300'
                  }`} />
                  
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  ) : currentUser.role === 'operations' ? (
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-rose-300" />
                  )}

                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    {currentUser.role}
                  </span>
                  
                  <span className="max-w-[100px] truncate text-white font-normal">
                    {currentUser.name}
                  </span>

                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserDropdownOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-[#230f1e] border border-[#481c3c] rounded-2xl p-3 shadow-2xl z-50 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-2 bg-[#170914] rounded-xl border border-[#38142f] space-y-0.5">
                        <div className="font-bold text-white text-sm">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{currentUser.email}</div>
                        <div className="text-[10px] font-bold text-amber-400 uppercase pt-1">
                          Role: {currentRoleConfig?.title}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenRoleWorkspace();
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4 text-rose-400" />
                          <span>Open {currentUser.role.toUpperCase()} Workspace</span>
                        </div>
                      </button>

                      {/* Switch Role Trigger */}
                      <div className="pt-2 border-t border-[#38142f]">
                        <div className="text-[10px] text-slate-400 uppercase font-bold px-2 mb-1.5">
                          Switch Role View
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenLoginModal('admin');
                            }}
                            className="p-1.5 rounded-lg text-center bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-[10px] font-bold border border-rose-800/40"
                          >
                            Admin
                          </button>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenLoginModal('operations');
                            }}
                            className="p-1.5 rounded-lg text-center bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 text-[10px] font-bold border border-amber-800/40"
                          >
                            Ops
                          </button>
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenLoginModal('customer');
                            }}
                            className="p-1.5 rounded-lg text-center bg-[#3a132c]/50 hover:bg-[#4d1c3c] text-rose-200 text-[10px] font-bold border border-[#5d2146]"
                          >
                            Customer
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#38142f]">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 transition-colors font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* LOGIN BUTTON (WHEN LOGGED OUT) */
              <button
                onClick={() => onOpenLoginModal('customer')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-[#2e1327] hover:bg-[#3d1834] border border-[#4d1f42] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-rose-300" />
                <span>Sign In / Roles</span>
              </button>
            )}

            {/* Quick Workspace Trigger Button if Logged in */}
            {currentUser && (
              <>
                <button
                  onClick={onOpenRoleWorkspace}
                  title={`Open ${currentUser.role.toUpperCase()} Workspace`}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                    currentUser.role === 'admin'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                      : currentUser.role === 'operations'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-rose-900/30 text-rose-200 border-rose-700/40 hover:bg-rose-900/50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden xl:inline capitalize">{currentUser.role} Desk</span>
                </button>

                {/* Direct 1-Click Logout Action */}
                <button
                  onClick={onLogout}
                  title="Sign out of account"
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 hover:text-rose-100 border border-rose-800/50 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Log Out</span>
                </button>
              </>
            )}

            {/* Advisor Leads Vault Access */}
            <button
              onClick={onOpenAdvisorVault}
              title="Advisor Lead Management Vault"
              className="p-2 rounded-xl text-slate-300 hover:text-rose-300 hover:bg-white/5 transition-colors relative"
            >
              <UserCheck className="w-5 h-5" />
              {leadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono shadow-sm">
                  {leadCount}
                </span>
              )}
            </button>

            {/* Primary CTA in Royal Burgundy */}
            <button
              onClick={() => scrollTo('advice')}
              className="bg-[#881337] hover:bg-[#70102d] text-white font-semibold text-xs sm:text-sm px-4 sm:px-4.5 py-2 sm:py-2.5 rounded-xl shadow-md hover:shadow-rose-900/30 active:scale-98 transition-all flex items-center gap-1.5 border border-rose-700/40"
            >
              <Send className="w-3.5 h-3.5 text-rose-200" />
              <span>Get Advice</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser ? (
              <button
                onClick={onOpenRoleWorkspace}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-rose-900/40 text-rose-200 border border-rose-700/40 flex items-center gap-1"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{currentUser.role}</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenLoginModal('customer')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#2a1123] text-white border border-[#421b37] flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-rose-300" />
                <span>Sign In</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1f0d1b] border-b border-[#3b172e] px-4 pt-2 pb-6 space-y-2 shadow-2xl">
          
          {/* User Status Bar in Mobile */}
          {currentUser ? (
            <div className="p-3 bg-[#150812] rounded-xl border border-[#331328] flex items-center justify-between mb-2">
              <div>
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <div className="text-[10px] text-rose-300 font-bold uppercase">{currentUser.role} ACCESS</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRoleWorkspace();
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-900/40 text-rose-200 border border-rose-700/40"
                >
                  Workspace
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="p-1 text-rose-400"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLoginModal('customer');
              }}
              className="w-full py-2.5 bg-gradient-to-r from-[#3b122a] to-[#200c19] border border-[#5c1e43] rounded-xl text-xs font-bold text-rose-200 flex items-center justify-center gap-2 mb-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In (Admin / Operations / Customer)</span>
            </button>
          )}

          <button
            onClick={() => scrollTo('explorer')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
          >
            <Compass className="w-4 h-4 text-rose-400" />
            Explore Mutual Funds
          </button>
          <button
            onClick={() => scrollTo('loan-against-mf')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-amber-300 bg-amber-950/30 border border-amber-500/40 hover:bg-amber-950/50 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Loan Against Mutual Funds</span>
            </div>
            <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-mono font-bold">9.5% ROI</span>
          </button>
          <button
            onClick={() => scrollTo('quiz')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-[#fbbf24]" />
            Take Risk Profiler Quiz
          </button>
          <button
            onClick={() => scrollTo('calculator')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
          >
            <Calculator className="w-4 h-4 text-rose-400" />
            Mutual Fund vs FD Calculator
          </button>
          <button
            onClick={() => scrollTo('blog')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            Educational Guides & News
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
          >
            <HelpCircle className="w-4 h-4 text-rose-400" />
            Frequently Asked Questions
          </button>
          
          <div className="pt-2 border-t border-[#3b172e] flex flex-col gap-2">
            <button
              onClick={() => scrollTo('advice')}
              className="w-full bg-[#881337] hover:bg-[#70102d] text-white text-center font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 shadow"
            >
              <Send className="w-4 h-4" />
              Request Custom Advisory Plan
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdvisorVault();
              }}
              className="w-full bg-[#271021] text-slate-300 text-center font-medium text-xs py-2 rounded-lg flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-slate-400" />
              Advisor Lead Vault ({leadCount})
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
