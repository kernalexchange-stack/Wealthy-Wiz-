import { CalculatorInputs, CalculatorResults } from '../types';

/**
 * Calculates side-by-side Mutual Fund vs Fixed Deposit returns
 */
export function calculateReturns(inputs: CalculatorInputs): CalculatorResults {
  const { mode, amount, years, mfExpectedReturn, fdInterestRate, stepUpPct = 0 } = inputs;
  const mfAnnualRate = mfExpectedReturn / 100;
  const fdAnnualRate = fdInterestRate / 100;

  let totalInvested = 0;
  let mfMaturityValue = 0;
  let fdMaturityValue = 0;

  const yearlyBreakdown: CalculatorResults['yearlyBreakdown'] = [];

  if (mode === 'lumpsum') {
    totalInvested = amount;
    // Mutual fund CAGR compounding
    mfMaturityValue = amount * Math.pow(1 + mfAnnualRate, years);

    // Fixed deposit quarterly compounding (standard in Indian banks)
    fdMaturityValue = amount * Math.pow(1 + fdAnnualRate / 4, 4 * years);

    for (let yr = 1; yr <= years; yr++) {
      yearlyBreakdown.push({
        year: yr,
        invested: totalInvested,
        mfValue: Math.round(amount * Math.pow(1 + mfAnnualRate, yr)),
        fdValue: Math.round(amount * Math.pow(1 + fdAnnualRate / 4, 4 * yr)),
      });
    }
  } else {
    // SIP Mode (Monthly systematic investment)
    const months = years * 12;
    const monthlyMfRate = mfAnnualRate / 12;
    const monthlyFdRate = fdAnnualRate / 12;

    let currentMonthlySip = amount;
    let accumulatedMf = 0;
    let accumulatedFd = 0;
    let cumulativeInvested = 0;

    for (let m = 1; m <= months; m++) {
      // Annual step-up adjustment at every 12 months mark
      if (m > 1 && (m - 1) % 12 === 0 && stepUpPct > 0) {
        currentMonthlySip = currentMonthlySip * (1 + stepUpPct / 100);
      }

      cumulativeInvested += currentMonthlySip;

      // Compound current accumulations forward by 1 month
      accumulatedMf = (accumulatedMf + currentMonthlySip) * (1 + monthlyMfRate);
      accumulatedFd = (accumulatedFd + currentMonthlySip) * (1 + monthlyFdRate);

      if (m % 12 === 0) {
        const currentYear = m / 12;
        yearlyBreakdown.push({
          year: currentYear,
          invested: Math.round(cumulativeInvested),
          mfValue: Math.round(accumulatedMf),
          fdValue: Math.round(accumulatedFd),
        });
      }
    }

    totalInvested = Math.round(cumulativeInvested);
    mfMaturityValue = Math.round(accumulatedMf);
    fdMaturityValue = Math.round(accumulatedFd);
  }

  const mfWealthGain = Math.max(0, mfMaturityValue - totalInvested);
  const fdWealthGain = Math.max(0, fdMaturityValue - totalInvested);
  const extraWealthOverFd = Math.max(0, mfMaturityValue - fdMaturityValue);
  const wealthMultiplier = totalInvested > 0 ? +(mfMaturityValue / totalInvested).toFixed(2) : 1;

  return {
    totalInvested: Math.round(totalInvested),
    mfMaturityValue: Math.round(mfMaturityValue),
    mfWealthGain: Math.round(mfWealthGain),
    fdMaturityValue: Math.round(fdMaturityValue),
    fdWealthGain: Math.round(fdWealthGain),
    extraWealthOverFd: Math.round(extraWealthOverFd),
    wealthMultiplier,
    yearlyBreakdown,
  };
}
