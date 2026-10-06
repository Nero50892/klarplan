export interface LoanFormModel {
  principalEuro: number;
  termMonths: number;
  nominalAnnualPercent: number;
}

export const initialLoanForm: LoanFormModel = {
  principalEuro: 10000,
  termMonths: 60,
  nominalAnnualPercent: 5,
};
