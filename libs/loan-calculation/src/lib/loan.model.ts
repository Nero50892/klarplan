export interface LoanInput {
  principalEuro: number;
  termMonths: number;
  nominalAnnualPercent: number;
}

export interface LoanSummary {
  monthlyPaymentEuro: number;
  totalInterestEuro: number;
  totalAmountEuro: number;
  effectiveAnnualPercent: number;
}

export interface AmortizationRow {
  month: number;
  paymentEuro: number;
  interestEuro: number;
  principalEuro: number;
  remainingEuro: number;
}

export const emptyLoanSummary: LoanSummary = {
  monthlyPaymentEuro: 0,
  totalInterestEuro: 0,
  totalAmountEuro: 0,
  effectiveAnnualPercent: 0,
};
