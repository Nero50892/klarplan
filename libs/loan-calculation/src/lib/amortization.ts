import { AmortizationRow, LoanInput } from './loan.model';
import { calculateMonthlyPayment, roundTo } from './annuity';

export function buildAmortizationSchedule(input: LoanInput): AmortizationRow[] {
  const { principalEuro: K, termMonths: n, nominalAnnualPercent: p } = input;

  if (n < 1) {
    return [];
  }

  const pPerMonth = p / (12 * 100);
  const monthlyPayment = calculateMonthlyPayment(input);
  const schedule: AmortizationRow[] = [];

  let debt = K;
  for (let month = 1; month <= n; month++) {
    const isLast = month === n;
    const interestEuro = roundTo(debt * pPerMonth, 2);
    // Letzter Monat: Restschuld tilgen, damit Cent-Drift auf 0 geht
    const principalEuro = isLast
      ? debt
      : roundTo(monthlyPayment - interestEuro, 2);
    const paymentEuro = isLast
      ? roundTo(interestEuro + principalEuro, 2)
      : monthlyPayment;

    debt = isLast ? 0 : roundTo(debt - principalEuro, 2);

    schedule.push({
      month,
      paymentEuro,
      interestEuro,
      principalEuro,
      remainingEuro: debt,
    });
  }

  return schedule;
}
