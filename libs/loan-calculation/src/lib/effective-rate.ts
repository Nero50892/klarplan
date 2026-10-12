import { LoanInput } from './loan.model';
import { roundTo } from './annuity';

export function calculateEffectiveAnnualPercent(input: LoanInput): number {
  const { nominalAnnualPercent: interest } = input;

  if (!interest) {
    return 0;
  }

  const q = 1 + interest / (12 * 100);
  const qn = Math.pow(q, 12) - 1;

  return roundTo(qn * 100, 2);
}
