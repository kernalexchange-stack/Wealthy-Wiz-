import { QuizQuestion, RiskProfileInfo } from '../types';
import { CURATED_FUNDS } from './fundsData';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'What is your primary investment time horizon?',
    subtitle: 'How long do you plan to keep this money invested without needing to withdraw?',
    options: [
      { id: 'q1_a', text: 'Less than 1–2 years (Short term needs)', score: 1, hint: 'High safety priority' },
      { id: 'q1_b', text: '3 to 5 years (Medium term milestones)', score: 2, hint: 'Moderate growth focus' },
      { id: 'q1_c', text: '5 to 10 years (Home, education, wealth creation)', score: 3, hint: 'Significant equity advantage' },
      { id: 'q1_d', text: 'More than 10 years / Retirement (Long term compounding)', score: 4, hint: 'Maximum compounding runway' },
    ],
  },
  {
    id: 2,
    title: 'If stock markets drop 20% over 2 months, how would you react?',
    subtitle: 'Market corrections are normal in equity investing. What is your emotional and financial response?',
    options: [
      { id: 'q2_a', text: 'Panic and exit all investments into savings/FD to stop losses', score: 1, hint: 'Zero risk tolerance' },
      { id: 'q2_b', text: 'Feel very anxious and stop further SIP contributions until recovery', score: 2, hint: 'Low risk tolerance' },
      { id: 'q2_c', text: 'Stay calm and continue existing SIPs as planned', score: 3, hint: 'Disciplined compounding mindset' },
      { id: 'q2_d', text: 'Excited! Treat it as a discount sale and deploy extra lump sum capital', score: 4, hint: 'Aggressive alpha seeker' },
    ],
  },
  {
    id: 3,
    title: 'What is your core investment objective?',
    subtitle: 'Which outcome matters the most for this portfolio?',
    options: [
      { id: 'q3_a', text: 'Capital safety: Never losing my principal investment is #1', score: 1, hint: 'Preservation over return' },
      { id: 'q3_b', text: 'Steady growth: Beating fixed deposit returns with low volatility', score: 2, hint: 'Balanced risk-adjusted' },
      { id: 'q3_c', text: 'Long-term wealth creation: Beating inflation by 6–8% annually', score: 3, hint: 'High growth focus' },
      { id: 'q3_d', text: 'Aggressive wealth multiplier: Maximum possible capital appreciation', score: 4, hint: 'Maximum returns target' },
    ],
  },
  {
    id: 4,
    title: 'How would you rate your mutual fund experience & knowledge?',
    subtitle: 'Your familiarity with financial markets and market cycles.',
    options: [
      { id: 'q4_a', text: 'Complete beginner (Never invested in equity/mutual funds before)', score: 1, hint: 'Simple, guided baskets' },
      { id: 'q4_b', text: 'Basic familiarity (Have done FD/PPF and tried 1–2 SIPs)', score: 2, hint: 'Core diversified funds' },
      { id: 'q4_c', text: 'Intermediate (Regularly investing in mutual funds for 2+ years)', score: 3, hint: 'Multi-cap & factor funds' },
      { id: 'q4_d', text: 'Experienced investor (Actively track NAVs, valuations, and portfolio overlaps)', score: 4, hint: 'Thematic & alpha allocation' },
    ],
  },
];

export const RISK_PROFILES: Record<string, RiskProfileInfo> = {
  Conservative: {
    type: 'Conservative',
    title: 'Conservative & Capital Preserver',
    tagline: 'Priority on capital safety, liquidity, and steady interest income.',
    description: 'You prioritize low volatility and absolute safety of capital over high returns. A defensive allocation in debt funds, arbitrage, and conservative hybrids protects your hard-earned money while beating standard savings interest.',
    equityAllocation: 20,
    debtAllocation: 70,
    goldAllocation: 10,
    recommendedCategory: 'Debt & Liquid',
    sampleFunds: CURATED_FUNDS.filter(f => f.category === 'Debt & Liquid' || f.category === 'Hybrid / Balanced'),
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  Moderate: {
    type: 'Moderate',
    title: 'Balanced & Steady Compounding',
    tagline: 'Balanced risk-reward balancing equity upside with debt downside defense.',
    description: 'You want returns higher than Fixed Deposits and PPF, with controlled volatility. Dynamic asset allocation and hybrid funds allow you to capture equity market gains while insulating your portfolio during sudden market crashes.',
    equityAllocation: 55,
    debtAllocation: 35,
    goldAllocation: 10,
    recommendedCategory: 'Hybrid / Balanced',
    sampleFunds: CURATED_FUNDS.filter(f => f.category === 'Hybrid / Balanced' || f.category === 'Large Cap'),
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  Growth: {
    type: 'Growth',
    title: 'Growth & Long-Term Wealth Creator',
    tagline: 'High equity exposure tailored for beating inflation over 5+ year horizons.',
    description: 'You have a multi-year horizon and understand that market dips are temporary. A dominant allocation in Flexi Cap and Large & Mid Cap funds lets you participate aggressively in India’s economic growth story with disciplined risk management.',
    equityAllocation: 75,
    debtAllocation: 15,
    goldAllocation: 10,
    recommendedCategory: 'Flexi Cap',
    sampleFunds: CURATED_FUNDS.filter(f => f.category === 'Flexi Cap' || f.category === 'Large Cap' || f.category === 'ELSS (Tax Saver)'),
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  Aggressive: {
    type: 'Aggressive',
    title: 'Aggressive & Alpha Seeker',
    tagline: 'Maximum capital appreciation targeting multibagger growth via mid & small caps.',
    description: 'You are an ambitious investor who welcomes market volatility as a discount opportunity. By focusing heavily on Small Cap, Mid Cap, and Sectoral growth engines, your portfolio is engineered for maximum 10+ year wealth compounding.',
    equityAllocation: 90,
    debtAllocation: 5,
    goldAllocation: 5,
    recommendedCategory: 'Small Cap',
    sampleFunds: CURATED_FUNDS.filter(f => f.category === 'Small Cap' || f.category === 'Mid Cap' || f.category === 'Flexi Cap'),
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
  },
};

export function calculateRiskProfile(totalScore: number): RiskProfileInfo {
  if (totalScore <= 6) return RISK_PROFILES.Conservative;
  if (totalScore <= 9) return RISK_PROFILES.Moderate;
  if (totalScore <= 13) return RISK_PROFILES.Growth;
  return RISK_PROFILES.Aggressive;
}
