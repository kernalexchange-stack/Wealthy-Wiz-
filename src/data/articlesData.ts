import { ArticleItem } from '../types';

export const ARTICLES_DATA: ArticleItem[] = [
  {
    slug: 'sip-vs-lumpsum-which-is-better',
    title: 'SIP vs Lumpsum: Which is Truly Better for Long-Term Wealth?',
    subtitle: 'A data-backed comparison across bull, bear, and sideways market cycles in India.',
    category: 'Strategy',
    readTime: '4 min read',
    publishedDate: '12 Aug 2026',
    summary: 'Discover when a Systematic Investment Plan (SIP) outperforms a one-time lumpsum investment, how rupee-cost averaging shields you from market tops, and the mathematical formula to decide between the two.',
    content: [
      'One of the most debated questions in Indian personal finance is whether an investor should deploy capital in a single lumpsum or space it out through monthly Systematic Investment Plans (SIPs).',
      'The short answer depends on two critical variables: market valuation at entry and cash availability.',
      'Rupee Cost Averaging: In a volatile or sideways market, an SIP automatically buys more mutual fund units when prices drop and fewer units when prices rise. Over a 5–10 year horizon, this lowers your average cost per unit without requiring you to time the market.',
      'When is Lumpsum Better? Historical data shows that in a strong, sustained bull market, deploying a lumpsum early yields higher absolute returns because 100% of your capital begins compounding from Day 1.',
      'The Hybrid Solution (STP): If you possess a large cash surplus (such as a bonus or property sale proceeds), the optimal institutional strategy is parking the funds in an Ultra-Short Duration Liquid Fund and setting up a Systematic Transfer Plan (STP) into an equity fund over 6 to 12 months.'
    ],
    keyTakeaways: [
      'SIP removes the psychological stress of market timing through rupee-cost averaging.',
      'Lumpsum is mathematically optimal if you enter at fair/low market valuations.',
      'Use an STP (Systematic Transfer Plan) from a Liquid Fund for large cash windfalls.',
      'Discipline matters more than timing: missing the top 10 market days severely dents 10-year returns.'
    ],
    relatedAction: {
      label: 'Run SIP vs Lumpsum Calculator',
      targetHash: '#calculator',
    },
  },
  {
    slug: 'mutual-fund-vs-fixed-deposit',
    title: 'Mutual Fund vs Fixed Deposit: The Real Inflation & Tax Truth',
    subtitle: 'Why keeping 100% of your savings in Bank FDs leads to invisible negative real returns.',
    category: 'Comparison',
    readTime: '5 min read',
    publishedDate: '08 Aug 2026',
    summary: 'Bank Fixed Deposits give peace of mind, but after 6% consumer inflation and 30% tax brackets, your purchasing power drops. Here is how mutual funds bridge the compounding gap.',
    content: [
      'In India, Fixed Deposits (FDs) are culturally revered for guaranteed safety. However, nominal safety is often financial illusion due to two silent wealth destroyers: Inflation and Taxes.',
      'The Real Return Formula: Real Return = Nominal Interest Rate - Inflation - Tax Liability. If a bank FD pays 6.5% interest and you are in the 30% income tax bracket, your post-tax return is just 4.55%. With retail inflation running around 5.5% to 6.0%, your real purchasing power actually shrinks by over 1% every year.',
      'Equity Mutual Funds historically deliver 12% to 15% CAGR over 7+ year horizons. Even after 12.5% Long Term Capital Gains (LTCG) tax (with an annual ₹1.25 Lakh exemption limit), the net real return remains comfortably positive at +6% to +8% above inflation.',
      'Strategic Allocation: FDs and Liquid Funds should be utilized strictly for emergency funds (6 months of expenses) and immediate goals (<2 years). All 5+ year wealth creation capital belongs in diversified mutual funds.'
    ],
    keyTakeaways: [
      'FD interest is taxed at your slab rate up to 30%+, eroding nominal yields.',
      'Equity mutual funds offer LTCG tax benefits with an annual ₹1.25 Lakh zero-tax exemption.',
      'Over 15 years, a ₹10,000 monthly SIP in an equity fund can yield ₹60+ Lakhs vs ~₹25 Lakhs in an FD.',
      'Maintain FDs for short-term liquidity, and equity mutual funds for long-term purchasing power.'
    ],
    relatedAction: {
      label: 'Compare MF vs FD Returns Side-by-Side',
      targetHash: '#calculator',
    },
  },
  {
    slug: 'elss-tax-saving-funds-guide',
    title: 'ELSS Tax Saving Funds: The Ultimate Section 80C Guide',
    subtitle: 'How to save up to ₹46,800 in income tax with the shortest 3-year lock-in.',
    category: 'Taxation',
    readTime: '4 min read',
    publishedDate: '01 Aug 2026',
    summary: 'Compare ELSS vs PPF vs Tax-Saver FDs. Discover why ELSS delivers the highest wealth generation among all 80C investment options with maximum flexibility.',
    content: [
      'Under Section 80C of the Indian Income Tax Act (Old Tax Regime), individuals can claim deductions up to ₹1,50,000 per financial year, translating to direct tax savings of up to ₹46,800 for individuals in the 30% tax bracket (plus cess).',
      'Why ELSS Beats Other 80C Options:',
      '1. Shortest Lock-in Period: ELSS funds have a mandatory lock-in of only 3 years, compared to 5 years for Tax-Saver FDs and 15 years for PPF (Public Provident Fund).',
      '2. Equity Compounding: While PPF yields fixed interest (~7.1%), top ELSS funds historically generate 13% to 16% annualized returns over 5-year cycles.',
      '3. Professional Fund Management: ELSS funds are actively managed flexi-cap portfolios invested in India’s leading companies.'
    ],
    keyTakeaways: [
      'Save up to ₹46,800 in tax per year under Section 80C.',
      '3-year lock-in is the shortest among all tax-saving financial instruments.',
      'Start a monthly ELSS SIP instead of rushing lumpsum investments in March.',
      'After 3 years, you can redeem tax-free capital or let it continue compounding.'
    ],
    relatedAction: {
      label: 'Explore Top Rated ELSS Funds',
      targetHash: '#explorer',
    },
  },
  {
    slug: 'how-to-start-sip-for-beginners',
    title: 'How to Start Your First SIP in India: A Beginner’s Step-by-Step Guide',
    subtitle: 'From KYC verification to choosing your first fund — everything you need to start investing.',
    category: 'Basics',
    readTime: '6 min read',
    publishedDate: '26 Jul 2026',
    summary: 'A simple, no-jargon handbook on paperless eKYC, setting up bank auto-debit (e-NACH), selecting beginner-friendly index funds, and avoiding common first-time mistakes.',
    content: [
      'Starting a Systematic Investment Plan (SIP) in India today takes less than 10 minutes from your smartphone.',
      'Step 1: Complete Centralized KYC (e-KYC). You need your PAN Card, Aadhaar Card (linked to your mobile for OTP verification), and a bank account in your name.',
      'Step 2: Choose Your Starting Fund. For absolute beginners, an Indian Nifty 50 Index Fund or an established Flexi Cap Fund provides the safest entry point with low expense ratios and zero stock-picking risk.',
      'Step 3: Pick a Comfortable Monthly Amount & Date. Select a date 2–3 days after your salary credit (e.g. 5th of every month) so investments happen automatically before discretionary spending.',
      'Step 4: Enable the Annual Step-Up Feature. Increasing your monthly SIP by just ₹500 or 10% each year dramatically supercharges your 10-year maturity corpus.'
    ],
    keyTakeaways: [
      'You can start an SIP with as little as ₹500 per month.',
      'Direct plans save 0.5% to 1.5% in distributor commissions every single year.',
      'Never stop your SIP during market corrections; that is when your money buys the most units.',
      'Automate through bank mandates so wealth accumulation runs on autopilot.'
    ],
    relatedAction: {
      label: 'Find Your Risk Profile First',
      targetHash: '#quiz',
    },
  },
  {
    slug: 'what-is-nav-and-how-its-calculated',
    title: 'What is NAV in Mutual Funds and How is it Calculated by AMFI?',
    subtitle: 'Debunking the common myth that a ₹10 NAV fund is cheaper or better than a ₹100 NAV fund.',
    category: 'Basics',
    readTime: '4 min read',
    publishedDate: '18 Jul 2026',
    summary: 'Understand Net Asset Value (NAV), how fund management expenses and daily stock market closing prices determine it, and why low NAV does NOT mean a bargain.',
    content: [
      'Net Asset Value (NAV) represents the market value per unit of a mutual fund scheme on any given business day.',
      'The Official Formula: NAV = (Total Market Value of Stocks & Bonds + Accrued Income - Total Liabilities & Operating Expenses) / Total Number of Outstanding Units.',
      'The Low NAV Fallacy: Many new investors mistakenly believe that a fund with a ₹20 NAV is cheaper or has higher upside than an established fund with a ₹200 NAV. This is completely false. If both funds hold the same basket of stocks that rise by 10%, an investment of ₹10,000 in either fund will grow by exactly 10% to ₹11,000.',
      'Daily NAV Publication: As per SEBI regulations, all mutual fund houses calculate and upload daily NAVs to the AMFI portal (and mfapi.in) by 11:00 PM on every trading day.'
    ],
    keyTakeaways: [
      'NAV reflects the per-unit book value, not whether a fund is "cheap" or "expensive".',
      'Percentage growth of the underlying portfolio determines your actual returns.',
      'Daily closing prices of held securities determine the end-of-day NAV.',
      'Track fund manager consistency, expense ratio, and rolling returns rather than absolute NAV.'
    ],
    relatedAction: {
      label: 'View Live AMFI Scheme NAVs',
      targetHash: '#explorer',
    },
  },
  {
    slug: 'large-cap-vs-mid-cap-vs-small-cap',
    title: 'Large Cap vs Mid Cap vs Small Cap: Risk & Reward Decoded',
    subtitle: 'How SEBI defines market capitalization and how to construct the ideal portfolio split.',
    category: 'Comparison',
    readTime: '5 min read',
    publishedDate: '10 Jul 2026',
    summary: 'A clear guide to Indian market tiers. Learn how combining stable bluechips with high-beta small cap compounders creates an all-weather portfolio.',
    content: [
      'SEBI strictly categorizes Indian listed companies based on market capitalization to protect retail investors:',
      '1. Large Cap: Top 100 companies by market cap (e.g. Reliance, TCS, HDFC Bank). High stability, lower drawdown, steady 11–13% historical CAGR.',
      '2. Mid Cap: Companies ranked 101 to 250 (e.g. Cummins, Trent, Polycab). High growth phase, expanding operational scale, 14–17% historical CAGR.',
      '3. Small Cap: Companies ranked 251 and below. High volatility, high alpha potential, multibagger opportunities over 7+ years with 18–25% historical surges.',
      'The Ideal Asset Allocation Formula: For a balanced growth investor with a 7+ year horizon: 50% Large/Flexi Cap (Core stability), 30% Mid Cap (Growth acceleration), and 20% Small Cap (Alpha multiplier).'
    ],
    keyTakeaways: [
      'Large caps offer safety and dividend resilience during bear markets.',
      'Mid and small caps generate explosive returns in expanding economic cycles.',
      'Never allocate 100% of your portfolio to small caps due to steep 30–40% cyclical corrections.',
      'Maintain a disciplined core-and-satellite portfolio structure.'
    ],
    relatedAction: {
      label: 'Get Custom Portfolio Advice',
      targetHash: '#advice',
    },
  },
];
