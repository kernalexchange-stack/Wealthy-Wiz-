import { UserProfile, UserRole } from '../types';

export interface RoleConfig {
  role: UserRole;
  title: string;
  badgeLabel: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentColor: string;
  description: string;
  permissions: string[];
  officialCredentials: {
    email: string;
    passwordHint: string;
  };
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  admin: {
    role: 'admin',
    title: 'Super Administrator',
    badgeLabel: 'ADMIN ACCESS',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-400',
    badgeBorder: 'border-rose-500/30',
    accentColor: '#f43f5e',
    description: 'Full system control, lead vault management, AMC configurations, user role permissions, and platform analytics.',
    permissions: [
      'Full CRM Lead access & export',
      'Scheme catalog & AMC configuration',
      'Real-time visitor logs & analytics',
      'System settings & API sync triggers',
      'Advisor desk assignment & deletion',
    ],
    officialCredentials: {
      email: 'admin@wealthywiz.com',
      passwordHint: 'admin123',
    },
  },
  operations: {
    role: 'operations',
    title: 'Operations & Advisory Desk',
    badgeLabel: 'OPERATIONS ACCESS',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/30',
    accentColor: '#f59e0b',
    description: 'Lead pipeline management, investor consultation booking, status progression, and AMFI feed synchronizer.',
    permissions: [
      'Lead pipeline tracker (New -> Contacted -> Converted)',
      'Assign financial advisors & notes',
      'Trigger AMFI NAV sync & cache refresh',
      'Investor outreach & meeting logs',
      'Download lead sheets & advisory summaries',
    ],
    officialCredentials: {
      email: 'ops@wealthywiz.com',
      passwordHint: 'ops123',
    },
  },
  customer: {
    role: 'customer',
    title: 'Investor / Client Portal',
    badgeLabel: 'CUSTOMER VIEW',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-300',
    badgeBorder: 'border-cyan-500/30',
    accentColor: '#06b6d4',
    description: 'Personalized wealth hub, risk profile score, tracked schemes watchlist, and submitted advisory status tracker.',
    permissions: [
      'Personal portfolio & fund watchlist',
      'Track submitted advisory request status',
      'Risk assessment profile & score history',
      'Customized fund recommendations & simulation saves',
      'Direct WhatsApp & advisor contact line',
    ],
    officialCredentials: {
      email: 'krishnadasktcr@gmail.com',
      passwordHint: 'investor123',
    },
  },
};

export interface SystemUserRecord extends UserProfile {
  passwordHash: string; // plain text for mock auth
}

const REGISTERED_USERS_KEY = 'wealthywiz_auth_users_db';

export const INITIAL_SYSTEM_USERS: SystemUserRecord[] = [
  {
    id: 'USR-ADM-001',
    name: 'Vikramaditya Sengupta',
    email: 'admin@wealthywiz.com',
    passwordHash: 'admin123',
    role: 'admin',
    phone: '+91 9811002233',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Executive Board / Lead Admin',
    joinedAt: '2025-01-10T09:00:00.000Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'USR-ADM-002',
    name: 'Chief Admin Officer',
    email: 'superadmin@wealthywiz.com',
    passwordHash: 'admin123',
    role: 'admin',
    phone: '+91 9811002234',
    department: 'Executive Board / Super Admin',
    joinedAt: '2025-01-15T09:00:00.000Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'USR-OPS-001',
    name: 'Ananya Deshmukh',
    email: 'ops@wealthywiz.com',
    passwordHash: 'ops123',
    role: 'operations',
    phone: '+91 9822334455',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'Mutual Fund Operations & Advisory Desk',
    joinedAt: '2025-02-15T10:30:00.000Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'USR-OPS-002',
    name: 'Rohan Kulkarni',
    email: 'operations@wealthywiz.com',
    passwordHash: 'ops123',
    role: 'operations',
    phone: '+91 9822334499',
    department: 'Advisory Fulfillment Desk',
    joinedAt: '2025-02-20T10:30:00.000Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: 'USR-CUST-001',
    name: 'Krishna Das',
    email: 'krishnadasktcr@gmail.com',
    passwordHash: 'investor123',
    role: 'customer',
    phone: '+91 9447123456',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Retail Wealth Investor',
    panNumber: 'ABCDE1234F',
    watchlist: [122639, 120503, 118834, 118989],
    joinedAt: '2025-03-01T14:20:00.000Z',
    lastLogin: new Date().toISOString(),
  },
];

export function getSystemUsers(): SystemUserRecord[] {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      if (Array.isArray(stored) && stored.length > 0) {
        // Merge stored with initial system users to ensure admin/ops accounts always exist
        const emails = new Set(stored.map((u: SystemUserRecord) => u.email.toLowerCase()));
        const merged = [...stored];
        for (const initUser of INITIAL_SYSTEM_USERS) {
          if (!emails.has(initUser.email.toLowerCase())) {
            merged.push(initUser);
          }
        }
        return merged;
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_SYSTEM_USERS;
}

export function saveSystemUsers(users: SystemUserRecord[]) {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }
}

/**
 * Rigorous Credential Authentication
 */
export function authenticateUser(
  emailInput: string,
  passwordInput: string,
  requestedRole: UserRole
): { success: boolean; user?: UserProfile; error?: string } {
  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Please provide both email and password.' };
  }

  const users = getSystemUsers();
  const matchedUser = users.find(u => u.email.toLowerCase() === cleanEmail);

  if (!matchedUser) {
    if (requestedRole === 'admin') {
      return { 
        success: false, 
        error: `Unauthorized Administrator email: "${cleanEmail}". Valid Admin account: admin@wealthywiz.com` 
      };
    }
    if (requestedRole === 'operations') {
      return { 
        success: false, 
        error: `Unauthorized Operations email: "${cleanEmail}". Valid Operations account: ops@wealthywiz.com` 
      };
    }
    return {
      success: false,
      error: `No account found for "${cleanEmail}". Please check your email or create a new investor account.`
    };
  }

  // Check role match
  if (matchedUser.role !== requestedRole) {
    return {
      success: false,
      error: `Account "${cleanEmail}" is registered as "${matchedUser.role.toUpperCase()}", not "${requestedRole.toUpperCase()}". Please switch to the ${matchedUser.role} tab.`
    };
  }

  // Check password match
  if (matchedUser.passwordHash !== cleanPassword) {
    return {
      success: false,
      error: `Incorrect password for ${matchedUser.role} account. (Hint: ${ROLE_CONFIGS[matchedUser.role].officialCredentials.passwordHint})`
    };
  }

  // Authentication succeeded
  const updatedUser: UserProfile = {
    id: matchedUser.id,
    name: matchedUser.name,
    email: matchedUser.email,
    role: matchedUser.role,
    phone: matchedUser.phone,
    avatar: matchedUser.avatar,
    department: matchedUser.department,
    panNumber: matchedUser.panNumber,
    watchlist: matchedUser.watchlist,
    joinedAt: matchedUser.joinedAt,
    lastLogin: new Date().toISOString(),
  };

  return { success: true, user: updatedUser };
}

/**
 * Register New Customer Profile
 */
export function registerCustomer(
  name: string,
  email: string,
  password: string,
  phone?: string
): { success: boolean; user?: UserProfile; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!name.trim()) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Valid email address is required.' };
  }
  if (!cleanPassword || cleanPassword.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters.' };
  }

  const users = getSystemUsers();
  const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: `An account already exists with ${cleanEmail}. Please sign in.` };
  }

  const newUserRecord: SystemUserRecord = {
    id: `USR-CUST-${Date.now().toString().slice(-5)}`,
    name: name.trim(),
    email: cleanEmail,
    passwordHash: cleanPassword,
    role: 'customer',
    phone: phone?.trim() || undefined,
    department: 'Retail Wealth Investor',
    watchlist: [122639, 120503],
    joinedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  users.push(newUserRecord);
  saveSystemUsers(users);

  return {
    success: true,
    user: {
      id: newUserRecord.id,
      name: newUserRecord.name,
      email: newUserRecord.email,
      role: 'customer',
      phone: newUserRecord.phone,
      department: newUserRecord.department,
      watchlist: newUserRecord.watchlist,
      joinedAt: newUserRecord.joinedAt,
      lastLogin: newUserRecord.lastLogin,
    }
  };
}

export const INITIAL_USERS: UserProfile[] = INITIAL_SYSTEM_USERS.map(u => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  phone: u.phone,
  avatar: u.avatar,
  department: u.department,
  panNumber: u.panNumber,
  watchlist: u.watchlist,
  joinedAt: u.joinedAt,
  lastLogin: u.lastLogin,
}));
