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
  CreditCard,
  Home
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { ROLE_CONFIGS } from '../data/mockUsers';
import { PageRoute, navigateToRoute } from '../utils/seoAndRouting';

interface NavbarProps {
  onOpenAdvisorVault: () => void;
  leadCount: number;
  currentUser: UserProfile | null;
  onOpenLoginModal: (role?: UserRole) => void;
  onLogout: () => void;
  onOpenRoleWorkspace: () => void;
  currentRoute?: PageRoute;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAdvisorVault, 
  leadCount,
  currentUser,
  onOpenLoginModal,
  onLogout,
  onOpenRoleWorkspace,
  currentRoute = 'home',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigateOrScroll = (target: PageRoute | string, sectionId?: string) => {
    setMobileMenuOpen(false);

    if (target === 'loan-against-securities' || target === 'sip-calculator' || target === 'home') {
      navigateToRoute(target as PageRoute);
      if (sectionId && target === 'home') {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            window.scrollTo({
              top: elementPosition - offset,
              behavior: 'smooth',
            });
          }
        }, 150);
      }
      return;
    }

    // Scroll within current page or redirect to home first
    if (currentRoute !== 'home') {
      navigateToRoute('home');
      setTimeout(() => {
        const element = document.getElementById(target as string);
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth',
          });
        }
      }, 150);
    } else {
      const element = document.getElementById(target as string);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth',
        });
      }
    }
  };

  const currentRoleConfig = currentUser ? ROLE_CONFIGS[currentUser.role] : null;

  return (
    <nav className="sticky top-0 z-50 bg-[#021d1e]/95 backdrop-blur-md border-b border-[#043d3e] text-slate-100 transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => navigateOrScroll('home')}
          >
            <OwlLogo size={46} className="transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-cardia">
                  Wealthy<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c2ece2] via-[#5eead4] to-[#017374]">Wiz</span>
                </span>
                <span 
                  className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#043335] text-[#c2ece2] border border-[#0d9488]/40 hidden sm:inline-block shadow-sm"
                  title="AMFI Registered Mutual Fund Distributor"
                >
                  AMFI • ARN-363293
                </span>
              </div>
              <span className="text-[11px] text-[#c2ece2]/70 font-medium tracking-wide hidden sm:block">
                AMFI Registered Distributor • ARN-363293
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => navigateOrScroll('home', 'explorer')}
              className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                currentRoute === 'home'
                  ? 'bg-white/10 text-white font-semibold shadow-xs'
                  : 'text-slate-200 hover:text-[#c2ece2] hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#2dd4bf]" />
              Explore Funds
            </button>

            {/* Separate Page 1: Loan Against Securities */}
            <button
              onClick={() => navigateOrScroll('loan-against-securities')}
              className={`px-2.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
                currentRoute === 'loan-against-securities'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 border border-amber-500/30'
              }`}
            >
              <CreditCard className={`w-3.5 h-3.5 ${currentRoute === 'loan-against-securities' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Loan Against Securities</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                currentRoute === 'loan-against-securities' ? 'bg-slate-900 text-amber-300' : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950'
              }`}>
                9.0%
              </span>
            </button>

            {/* Separate Page 2: SIP Calculator */}
            <button
              onClick={() => navigateOrScroll('sip-calculator')}
              className={`px-2.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
                currentRoute === 'sip-calculator'
                  ? 'bg-[#017374] text-white font-bold border border-[#2dd4bf]/50 shadow-md'
                  : 'text-teal-300 hover:text-white hover:bg-teal-950/40 border border-teal-500/30'
              }`}
            >
              <Calculator className={`w-3.5 h-3.5 ${currentRoute === 'sip-calculator' ? 'text-white' : 'text-[#2dd4bf]'}`} />
              <span>SIP Calculator</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                currentRoute === 'sip-calculator' ? 'bg-[#043335] text-teal-200' : 'bg-teal-400 text-slate-950'
              }`}>
                Step-Up
              </span>
            </button>

            <button
              onClick={() => navigateOrScroll('quiz')}
              className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-amber-300 hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
              Risk Quiz
            </button>

            <button
              onClick={() => navigateOrScroll('blog')}
              className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-[#c2ece2] hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Guides
            </button>

            <button
              onClick={() => navigateOrScroll('faq')}
              className="px-2.5 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-[#c2ece2] hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#2dd4bf]" />
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
                      ? 'bg-[#023133] border-[#017374] text-[#c2ece2] hover:bg-[#034042]'
                      : currentUser.role === 'operations'
                      ? 'bg-amber-950/50 border-amber-800/60 text-amber-200 hover:bg-amber-900/50'
                      : 'bg-[#032e30]/70 border-[#0a5254]/70 text-[#c2ece2] hover:bg-[#043b3d]'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    currentUser.role === 'admin' ? 'bg-[#2dd4bf]' : currentUser.role === 'operations' ? 'bg-amber-400' : 'bg-[#c2ece2]'
                  }`} />
                  
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2dd4bf]" />
                  ) : currentUser.role === 'operations' ? (
                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#c2ece2]" />
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
                    <div className="absolute right-0 mt-2 w-64 bg-[#022425] border border-[#044c4e] rounded-2xl p-3 shadow-2xl z-50 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-2 bg-[#011819] rounded-xl border border-[#033638] space-y-0.5">
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
                          <LayoutDashboard className="w-4 h-4 text-[#2dd4bf]" />
                          <span>Open {currentUser.role.toUpperCase()} Workspace</span>
                        </div>
                      </button>

                      {/* Switch Role Trigger */}
                      <div className="pt-2 border-t border-[#043d3f]">
                        <div className="text-[10px] text-slate-400 uppercase font-bold px-2 mb-1.5">
                          Switch Role View
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              onOpenLoginModal('admin');
                            }}
                            className="p-1.5 rounded-lg text-center bg-[#013536] hover:bg-[#014d4e] text-[#c2ece2] text-[10px] font-bold border border-[#017374]/60"
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
                            className="p-1.5 rounded-lg text-center bg-[#022829] hover:bg-[#033c3e] text-[#c2ece2] text-[10px] font-bold border border-[#045254]"
                          >
                            Customer
                          </button>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#043d3f]">
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
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#c2ece2] hover:text-white bg-[#022a2b] hover:bg-[#033e40] border border-[#017374]/60 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5 text-[#2dd4bf]" />
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
                      ? 'bg-[#017374]/30 text-[#c2ece2] border-[#017374]/60 hover:bg-[#017374]/50'
                      : currentUser.role === 'operations'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-[#023335] text-[#c2ece2] border-[#045456] hover:bg-[#034446]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden xl:inline capitalize">{currentUser.role} Desk</span>
                </button>

                {/* Direct 1-Click Logout Action */}
                <button
                  onClick={onLogout}
                  title="Sign out of account"
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#022324] hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-[#044345] transition-all flex items-center gap-1.5 shadow-sm"
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
              className="p-2 rounded-xl text-slate-300 hover:text-[#c2ece2] hover:bg-white/5 transition-colors relative"
            >
              <UserCheck className="w-5 h-5" />
              {leadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#c2ece2] to-[#2dd4bf] text-[#013536] text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono shadow-sm">
                  {leadCount}
                </span>
              )}
            </button>

            {/* Primary CTA in Echo & Keenon */}
            <button
              onClick={() => navigateOrScroll('home', 'advice')}
              className="bg-[#017374] hover:bg-[#005f60] text-white font-semibold text-xs sm:text-sm px-4 sm:px-4.5 py-2 sm:py-2.5 rounded-xl shadow-md hover:shadow-[#017374]/30 active:scale-98 transition-all flex items-center gap-1.5 border border-[#2dd4bf]/30"
            >
              <Send className="w-3.5 h-3.5 text-[#c2ece2]" />
              <span>Get Advice</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {currentUser ? (
              <button
                onClick={onOpenRoleWorkspace}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-[#017374]/40 text-[#c2ece2] border border-[#017374]/60 flex items-center gap-1"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{currentUser.role}</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenLoginModal('customer')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#022425] text-white border border-[#044c4e] flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-[#2dd4bf]" />
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
        <div className="lg:hidden bg-[#021819] border-b border-[#033638] px-4 pt-2 pb-6 space-y-2 shadow-2xl">
          
          {/* AMFI ARN Mobile Trust Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#03292a] rounded-lg border border-[#017374]/50 text-[11px] text-[#c2ece2] mb-2 font-mono">
            <span className="font-semibold">AMFI Registered Distributor</span>
            <span className="font-bold text-white bg-[#017374] px-2 py-0.5 rounded text-[10px]">ARN-363293</span>
          </div>

          {/* User Status Bar in Mobile */}
          {currentUser ? (
            <div className="p-3 bg-[#011011] rounded-xl border border-[#03292a] flex items-center justify-between mb-2">
              <div>
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <div className="text-[10px] text-[#c2ece2] font-bold uppercase">{currentUser.role} ACCESS</div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRoleWorkspace();
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#017374]/40 text-[#c2ece2] border border-[#017374]/60"
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
              className="w-full py-2.5 bg-gradient-to-r from-[#023335] to-[#011b1c] border border-[#017374]/50 rounded-xl text-xs font-bold text-[#c2ece2] flex items-center justify-center gap-2 mb-2"
            >
              <LogIn className="w-4 h-4 text-[#2dd4bf]" />
              <span>Sign In (Admin / Operations / Customer)</span>
            </button>
          )}

          <button
            onClick={() => navigateOrScroll('home', 'explorer')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 transition-colors ${
              currentRoute === 'home' ? 'bg-white/10 text-white font-semibold' : 'text-slate-200 hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 text-[#2dd4bf]" />
            Explore Mutual Funds
          </button>
          
          {/* Mobile Page 1: Loan Against Securities */}
          <button
            onClick={() => navigateOrScroll('loan-against-securities')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold flex items-center justify-between transition-colors ${
              currentRoute === 'loan-against-securities'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-amber-300 bg-amber-950/30 border border-amber-500/40 hover:bg-amber-950/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CreditCard className={`w-4 h-4 ${currentRoute === 'loan-against-securities' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Loan Against Securities</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
              currentRoute === 'loan-against-securities' ? 'bg-slate-900 text-amber-300' : 'bg-amber-400 text-slate-950'
            }`}>
              9.0% ROI
            </span>
          </button>

          {/* Mobile Page 2: SIP Calculator */}
          <button
            onClick={() => navigateOrScroll('sip-calculator')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold flex items-center justify-between transition-colors ${
              currentRoute === 'sip-calculator'
                ? 'bg-[#017374] text-white font-bold'
                : 'text-teal-300 bg-teal-950/30 border border-teal-500/40 hover:bg-teal-950/50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calculator className={`w-4 h-4 ${currentRoute === 'sip-calculator' ? 'text-white' : 'text-[#2dd4bf]'}`} />
              <span>SIP Calculator</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
              currentRoute === 'sip-calculator' ? 'bg-[#043335] text-teal-200' : 'bg-teal-400 text-slate-950'
            }`}>
              Step-Up
            </span>
          </button>

          <button
            onClick={() => navigateOrScroll('quiz')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
          >
            <Sparkles className="w-4 h-4 text-[#fbbf24]" />
            Take Risk Profiler Quiz
          </button>
          <button
            onClick={() => navigateOrScroll('blog')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            Educational Guides & News
          </button>
          <button
            onClick={() => navigateOrScroll('faq')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:bg-white/5 flex items-center gap-2.5"
          >
            <HelpCircle className="w-4 h-4 text-[#2dd4bf]" />
            Frequently Asked Questions
          </button>
          
          <div className="pt-2 border-t border-[#033638] flex flex-col gap-2">
            <button
              onClick={() => navigateOrScroll('home', 'advice')}
              className="w-full bg-[#017374] hover:bg-[#005f60] text-white text-center font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 shadow"
            >
              <Send className="w-4 h-4 text-[#c2ece2]" />
              Request Custom Advisory Plan
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdvisorVault();
              }}
              className="w-full bg-[#022425] text-[#c2ece2] text-center font-medium text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 border border-[#043d3f]"
            >
              <UserCheck className="w-4 h-4 text-[#2dd4bf]" />
              Advisor Lead Vault ({leadCount})
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

