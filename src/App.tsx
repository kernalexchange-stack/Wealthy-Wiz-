import React, { useState, useEffect } from 'react';
import { CheckCircle2, Info, LogOut, X, AlertTriangle } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LiveTicker } from './components/LiveTicker';
import { Hero } from './components/Hero';
import { FundExplorer } from './components/FundExplorer';
import { RiskQuiz } from './components/RiskQuiz';
import { ReturnCalculator } from './components/ReturnCalculator';
import { LeadForm } from './components/LeadForm';
import { ArticlesSection } from './components/ArticlesSection';
import { LeadsVaultModal } from './components/LeadsVaultModal';
import { LoginModal } from './components/LoginModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { OperationsDeskModal } from './components/OperationsDeskModal';
import { CustomerPortalModal } from './components/CustomerPortalModal';
import { Footer } from './components/Footer';
import { CURATED_FUNDS } from './data/fundsData';
import { FundScheme, RiskProfileInfo, LeadPayload, UserProfile, UserRole } from './types';
import { fetchSchemeDetails } from './utils/mfapi';
import { INITIAL_USERS } from './data/mockUsers';

const LEADS_STORAGE_KEY = 'wealthywiz_stored_leads';
const SESSION_STORAGE_KEY = 'wealthywiz_visitor_session';
const USER_STORAGE_KEY = 'wealthywiz_active_user';

export function App() {
  const [funds, setFunds] = useState<FundScheme[]>(CURATED_FUNDS);
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [quizProfile, setQuizProfile] = useState<RiskProfileInfo | null>(null);
  
  // User Authentication & Role State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const isLoggedOut = localStorage.getItem('wealthywiz_user_logged_out');
      if (isLoggedOut === 'true') {
        return null;
      }
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // safe fallback
    }
    // Default to a pre-authenticated customer profile so the platform is immediately active
    return INITIAL_USERS.find(u => u.role === 'customer') || null;
  });

  // Modal Visibility States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginInitialRole, setLoginInitialRole] = useState<UserRole>('customer');
  const [isAdminWorkspaceOpen, setIsAdminWorkspaceOpen] = useState(false);
  const [isOpsWorkspaceOpen, setIsOpsWorkspaceOpen] = useState(false);
  const [isCustomerWorkspaceOpen, setIsCustomerWorkspaceOpen] = useState(false);
  const [isAdvisorVaultOpen, setIsAdvisorVaultOpen] = useState(false);
  
  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warn' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(prev => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Sync user state to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // Storage quota fallback
    }
  }, [currentUser]);

  // Leads Management State
  const [leads, setLeads] = useState<LeadPayload[]>(() => {
    try {
      const stored = localStorage.getItem(LEADS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // safe fallback
    }
    return [
      {
        id: 'LW-849201',
        name: 'Arjun Mehta',
        email: 'arjun.mehta@gmail.com',
        phone: '+91 9845012345',
        investmentGoal: 'Retirement & FIRE (Financial Independence)',
        investmentAmount: 25000,
        investmentMode: 'monthly_sip',
        riskProfile: 'Growth',
        recommendedFunds: ['Parag Parikh Flexi Cap Fund', 'Mirae Asset Large Cap Fund'],
        message: 'Looking to optimize tax liability and build a 15-year compounding portfolio.',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        status: 'contacted',
      },
      {
        id: 'LW-732109',
        name: 'Pooja Verma',
        email: 'pooja.verma@yahoo.com',
        phone: '+91 9712345678',
        investmentGoal: 'Children’s Higher Education & Marriage',
        investmentAmount: 15000,
        investmentMode: 'monthly_sip',
        riskProfile: 'Moderate',
        recommendedFunds: ['ICICI Prudential Balanced Advantage Fund'],
        message: 'Want low volatility funds to fund my daughter’s university in 8 years.',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
        status: 'new',
      },
      {
        id: 'LW-519824',
        name: 'Krishna Das',
        email: 'krishnadasktcr@gmail.com',
        phone: '+91 9447123456',
        investmentGoal: 'Long Term Wealth Creation (10+ Years)',
        investmentAmount: 30000,
        investmentMode: 'monthly_sip',
        riskProfile: 'Growth',
        recommendedFunds: ['Nippon India Small Cap Fund', 'Parag Parikh Flexi Cap Fund'],
        message: 'Requesting allocation analysis between Small Cap and Flexi Cap for compounding.',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        status: 'contacted',
      }
    ];
  });

  // Sync leads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch {
      // Storage quota safety
    }
  }, [leads]);

  // Visitor Tracking
  useEffect(() => {
    try {
      let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
      }
      
      fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          page: window.location.pathname,
          referrer: document.referrer || 'direct',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {
        // Silent non-blocking failure
      });
    } catch {
      // Ignored
    }
  }, []);

  // Fetch live NAV updates for top curated funds in background
  useEffect(() => {
    let isMounted = true;
    async function updateLiveNavs() {
      try {
        const promises = CURATED_FUNDS.slice(0, 5).map(f => fetchSchemeDetails(f.schemeCode));
        const results = await Promise.allSettled(promises);
        
        if (!isMounted) return;

        setFunds(prevFunds => {
          return prevFunds.map(fund => {
            const matchedResult = results.find(
              r => r.status === 'fulfilled' && r.value?.scheme.schemeCode === fund.schemeCode
            );
            if (matchedResult && matchedResult.status === 'fulfilled' && matchedResult.value) {
              return matchedResult.value.scheme;
            }
            return fund;
          });
        });
      } catch (err) {
        console.warn('Live NAV background fetch notice:', err);
      }
    }

    updateLiveNavs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers
  const handleSelectFundForAdvice = (fund: FundScheme) => {
    setSelectedFunds(prev => {
      if (prev.includes(fund.schemeName)) {
        return prev.filter(f => f !== fund.schemeName);
      } else {
        return [...prev, fund.schemeName];
      }
    });
  };

  const handleRemoveSelectedFund = (fundName: string) => {
    setSelectedFunds(prev => prev.filter(f => f !== fundName));
  };

  const handleCompleteQuiz = (profile: RiskProfileInfo) => {
    setQuizProfile(profile);
    if (profile.sampleFunds.length > 0) {
      const topFund = profile.sampleFunds[0].schemeName;
      setSelectedFunds(prev => prev.includes(topFund) ? prev : [...prev, topFund]);
    }
  };

  const handleLeadSubmitted = (newLead: LeadPayload) => {
    setLeads(prev => [newLead, ...prev]);
  };

  const handleUpdateLeadStatus = (id: string, newStatus: LeadPayload['status']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Delete this investor lead permanently?')) {
      setLeads(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleClearLeads = () => {
    if (window.confirm('Are you sure you want to clear all stored leads?')) {
      setLeads([]);
    }
  };

  // Auth Handlers
  const handleOpenLoginModal = (role: UserRole = 'customer') => {
    setLoginInitialRole(role);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    localStorage.removeItem('wealthywiz_user_logged_out');
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}! Signed in as ${user.role.toUpperCase()}.`, 'success');
    
    // Optionally open their role workspace directly upon logging in
    if (user.role === 'admin') {
      setIsAdminWorkspaceOpen(true);
    } else if (user.role === 'operations') {
      setIsOpsWorkspaceOpen(true);
    } else {
      setIsCustomerWorkspaceOpen(true);
    }
  };

  const handleLogout = () => {
    const prevName = currentUser?.name;
    localStorage.setItem('wealthywiz_user_logged_out', 'true');
    localStorage.removeItem(USER_STORAGE_KEY);
    setCurrentUser(null);
    setIsAdminWorkspaceOpen(false);
    setIsOpsWorkspaceOpen(false);
    setIsCustomerWorkspaceOpen(false);
    showToast(prevName ? `${prevName} logged out successfully.` : 'You have been logged out.', 'info');
  };

  const handleSwitchRole = (role: UserRole) => {
    // Switch to role requires authenticating with proper credentials
    handleOpenLoginModal(role);
  };

  const handleOpenRoleWorkspace = () => {
    if (!currentUser) {
      handleOpenLoginModal('customer');
      return;
    }
    if (currentUser.role === 'admin') {
      setIsAdminWorkspaceOpen(true);
    } else if (currentUser.role === 'operations') {
      setIsOpsWorkspaceOpen(true);
    } else {
      setIsCustomerWorkspaceOpen(true);
    }
  };

  const handleNavigateToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
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

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-['IBM_Plex_Sans',sans-serif]">
      
      {/* 1. Top Navbar with Login Option & Role Badges */}
      <Navbar 
        onOpenAdvisorVault={() => setIsAdvisorVaultOpen(true)} 
        leadCount={leads.length} 
        currentUser={currentUser}
        onOpenLoginModal={handleOpenLoginModal}
        onLogout={handleLogout}
        onOpenRoleWorkspace={handleOpenRoleWorkspace}
      />

      {/* 2. AMFI Live Scrolling Ticker */}
      <LiveTicker funds={funds} />

      <main className="flex-1">
        {/* 3. Hero Section with Today's Movers */}
        <Hero 
          moversFunds={funds} 
          onSelectFundForAdvice={handleSelectFundForAdvice} 
        />

        {/* 4. Live AMFI Fund Scheme Explorer */}
        <FundExplorer 
          onSelectFundForAdvice={handleSelectFundForAdvice} 
          selectedFunds={selectedFunds} 
        />

        {/* 5. 60-Second Investor Risk Profiler Quiz */}
        <RiskQuiz 
          onCompleteQuiz={handleCompleteQuiz} 
        />

        {/* 6. Mutual Fund vs Fixed Deposit Side-by-Side Calculator */}
        <ReturnCalculator />

        {/* 7. Educational Guides & Market Insights */}
        <ArticlesSection />

        {/* 8. Advisory Lead Generation Form */}
        <LeadForm 
          quizProfile={quizProfile}
          selectedFunds={selectedFunds}
          onRemoveSelectedFund={handleRemoveSelectedFund}
          onLeadSubmitted={handleLeadSubmitted}
        />
      </main>

      {/* 9. Footer with AMFI Disclaimers */}
      <Footer />

      {/* Unified Login Modal (3 Access Types in 1 Login: Admin, Operations, Customer) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={loginInitialRole}
      />

      {/* Admin Command Center Workspace */}
      {currentUser && (
        <AdminDashboardModal
          isOpen={isAdminWorkspaceOpen}
          onClose={() => setIsAdminWorkspaceOpen(false)}
          currentUser={currentUser}
          leads={leads}
          funds={funds}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onDeleteLead={handleDeleteLead}
          onSwitchRole={handleSwitchRole}
          onLogout={handleLogout}
        />
      )}

      {/* Operations & Advisory Desk Workspace */}
      {currentUser && (
        <OperationsDeskModal
          isOpen={isOpsWorkspaceOpen}
          onClose={() => setIsOpsWorkspaceOpen(false)}
          currentUser={currentUser}
          leads={leads}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onSwitchRole={handleSwitchRole}
          onLogout={handleLogout}
        />
      )}

      {/* Customer / Investor Wealth Hub Workspace */}
      {currentUser && (
        <CustomerPortalModal
          isOpen={isCustomerWorkspaceOpen}
          onClose={() => setIsCustomerWorkspaceOpen(false)}
          currentUser={currentUser}
          leads={leads}
          funds={funds}
          quizProfile={quizProfile}
          onSwitchRole={handleSwitchRole}
          onNavigateToSection={handleNavigateToSection}
          onLogout={handleLogout}
        />
      )}

      {/* Advisor Leads Vault Modal */}
      <LeadsVaultModal
        isOpen={isAdvisorVaultOpen}
        onClose={() => setIsAdvisorVaultOpen(false)}
        leads={leads}
        onUpdateStatus={handleUpdateLeadStatus}
        onClearLeads={handleClearLeads}
      />

      {/* Floating Status & Auth Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200 pointer-events-auto">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md text-sm font-semibold ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-100 border-emerald-500/40 shadow-emerald-950/50'
              : toastMessage.type === 'warn'
              ? 'bg-amber-950/90 text-amber-100 border-amber-500/40 shadow-amber-950/50'
              : 'bg-slate-900/90 text-slate-100 border-slate-700/60 shadow-slate-950/50'
          }`}>
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : toastMessage.type === 'warn' ? (
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            ) : (
              <LogOut className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            
            <span>{toastMessage.text}</span>

            <button
              onClick={() => setToastMessage(null)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
