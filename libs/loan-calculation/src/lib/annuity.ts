import { LoanInput } from './loan.model';

export function calculateMonthlyPayment(input: LoanInput): number {
  const {
    principalEuro: K,
    termMonths: months,
    nominalAnnualPercent: interest,
  } = input;

  if (!K) {
    return 0;
  }

  if (!interest) {
    return roundTo(K / months);
  }

  const q = 1 + interest / (12 * 100);
  if (months === 1) {
    return roundTo(K * q);
  }

  const qn = Math.pow(q, months);
  return roundTo((K * (qn * (q - 1))) / (qn - 1));
}

/** Kaufmännisches Runden ohne Angular — die Lib bleibt frameworkfrei. */
export function roundTo(value: number, places = 2): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  const factor = 10 ** places;
  // + 0 normalisiert -0 zu 0
  return Math.round(value * factor) / factor + 0;
}
