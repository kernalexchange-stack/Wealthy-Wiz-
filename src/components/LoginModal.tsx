import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Briefcase, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Copy,
  Sparkles
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { ROLE_CONFIGS, authenticateUser, registerCustomer } from '../data/mockUsers';
import { OwlLogo } from './OwlLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'customer',
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedHint, setCopiedHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const currentRoleConfig = ROLE_CONFIGS[selectedRole];

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    setIsRegisterMode(false);
    setEmail('');
    setPassword('');
  };

  const handleApplyOfficialCredentials = () => {
    const creds = currentRoleConfig.officialCredentials;
    setEmail(creds.email);
    setPassword(creds.passwordHint);
    setErrorMessage(null);
    setCopiedHint(true);
    setTimeout(() => setCopiedHint(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isRegisterMode) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMessage('Please fill in your name, email, and password.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const res = registerCustomer(name, email, password, phone);
        if (!res.success || !res.user) {
          setErrorMessage(res.error || 'Failed to register account.');
        } else {
          onLoginSuccess(res.user);
          onClose();
        }
      }, 400);
      return;
    }

    // Standard credential authentication
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = authenticateUser(email, password, selectedRole);
      if (!res.success || !res.user) {
        setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
      } else {
        onLoginSuccess(res.user);
        onClose();
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#12103a] border border-[#2d2975] text-slate-100 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-6 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div 
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentRoleConfig.accentColor }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Logo */}
        <div className="flex items-center gap-3 mb-5 relative">
          <OwlLogo size={42} />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Fraunces',serif] text-white tracking-tight flex items-center gap-2">
              Wealthy<span className="text-[#fbbf24]">Wiz</span> Login
            </h2>
            <p className="text-xs text-slate-400">
              Sign in with authorized credentials
            </p>
          </div>
        </div>

        {/* Role Selection Tabs - 3 Access Types */}
        <div className="space-y-2 mb-5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Select Portal Access Level</span>
            <span className="text-slate-500 font-mono text-[10px]">3 Security Tiers</span>
          </label>

          <div className="grid grid-cols-3 gap-2 bg-[#0c0a27] p-1.5 rounded-2xl border border-[#23205b]">
            
            {/* 1. Admin Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                selectedRole === 'admin'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Admin</span>
            </button>

            {/* 2. Operations Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange('operations')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                selectedRole === 'operations'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Operations</span>
            </button>

            {/* 3. Customer Tab */}
            <button
              type="button"
              onClick={() => handleRoleChange('customer')}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                selectedRole === 'customer'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Customer</span>
            </button>
          </div>
        </div>

        {/* Designated Credentials Reference Card */}
        <div className="p-3 bg-[#0d0b2b] border border-[#252063] rounded-2xl mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${currentRoleConfig.badgeBg} ${currentRoleConfig.badgeText} border ${currentRoleConfig.badgeBorder}`}>
                {currentRoleConfig.badgeLabel}
              </span>
              <span className="text-xs font-semibold text-white">{currentRoleConfig.title}</span>
            </div>
            
            <button
              type="button"
              onClick={handleApplyOfficialCredentials}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/60 hover:bg-cyan-900/60 px-2 py-1 rounded-lg border border-cyan-800/60 transition-colors"
            >
              {copiedHint ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300">Filled!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Autofill Credentials</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#14113e] p-2 rounded-xl border border-[#221c5b] text-slate-300">
            <div>
              <span className="text-slate-500 text-[10px] block font-sans">User ID:</span>
              <span className="text-white select-all">{currentRoleConfig.officialCredentials.email}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block font-sans">Password:</span>
              <span className="text-amber-300 select-all">{currentRoleConfig.officialCredentials.passwordHint}</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login / Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {isRegisterMode && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#0a0822] border border-[#2b276e] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#0a0822] border border-[#2b276e] rounded-xl text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
              </div>
            </>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder={currentRoleConfig.officialCredentials.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-[#0a0822] border border-[#2b276e] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={handleApplyOfficialCredentials}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Use Official Password ({currentRoleConfig.officialCredentials.passwordHint})
              </button>
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-[#0a0822] border border-[#2b276e] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] hover:brightness-105 active:scale-98 text-slate-950 font-bold text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>
                  {isRegisterMode 
                    ? 'Register Investor Profile' 
                    : `Authenticate as ${currentRoleConfig.title}`}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Footer Mode Switcher */}
        <div className="mt-5 pt-3.5 border-t border-[#23205b] text-center text-xs text-slate-400">
          {isRegisterMode ? (
            <div>
              Already have an investor profile?{' '}
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="text-cyan-300 font-semibold hover:underline"
              >
                Sign In Instead
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <span>Looking to open a retail investor account?</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('customer');
                  setIsRegisterMode(true);
                }}
                className="text-amber-300 font-semibold hover:underline"
              >
                Register as Client
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
