import { buildAmortizationSchedule } from './amortization';
import { LoanInput, LoanTotals } from './loan.model';

export function calculateLoanTotals(input: LoanInput): LoanTotals {
  const ammoPlan = buildAmortizationSchedule(input);
  const totalInterestEuro = ammoPlan.reduce((acc, row) => acc + row.interestEuro, 0);
  const totalAmountEuro = ammoPlan.reduce((acc, row) => acc + row.paymentEuro, 0);
  return { totalInterestEuro, totalAmountEuro };
}
