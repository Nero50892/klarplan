import { buildAmortizationSchedule } from './amortization';
import { LoanInput } from './loan.model';

export interface LoanTotals {
  totalInterestEuro: number;
  totalAmountEuro: number;
}

export function calculateLoanTotals(input: LoanInput): LoanTotals {
  const ammoPlan = buildAmortizationSchedule(input);
  const totalInterestEuro = ammoPlan.reduce((acc, row) => acc + row.interestEuro, 0);
  const totalAmountEuro = ammoPlan.reduce((acc, row) => acc + row.paymentEuro, 0);
  return { totalInterestEuro, totalAmountEuro };
}
