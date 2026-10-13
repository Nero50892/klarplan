import { computed, Service, signal } from '@angular/core';
import {
  AmortizationRow,
  buildAmortizationSchedule,
  calculateEffectiveAnnualPercent,
  calculateLoanTotals,
  calculateMonthlyPayment,
  emptyLoanSummary,
  LoanInput,
  LoanSummary,
} from '@klarplan/loan-calculation';
import { initialLoanForm, LoanFormModel } from './loan-form.model';

@Service()
export class LoanDraft {
  readonly formModel = signal<LoanFormModel>({ ...initialLoanForm });

  readonly result = signal<LoanSummary>({ ...emptyLoanSummary });

  readonly schedule = signal<AmortizationRow[]>([]);

  readonly calculated = signal(false);

  readonly monthlyPaymentEuro = computed(() => this.result().monthlyPaymentEuro);
  readonly totalInterestEuro = computed(() => this.result().totalInterestEuro);
  readonly totalAmountEuro = computed(() => this.result().totalAmountEuro);
  readonly effectiveAnnualPercent = computed(() => this.result().effectiveAnnualPercent);

  calculateLoanData(): void {
    const input: LoanInput = {...this.formModel()};
    const totals = calculateLoanTotals(input);
    this.result.set({
      monthlyPaymentEuro: calculateMonthlyPayment(input),
      totalInterestEuro: totals.totalInterestEuro,
      totalAmountEuro: totals.totalAmountEuro,
      effectiveAnnualPercent: calculateEffectiveAnnualPercent(input),
    });
    this.schedule.set(buildAmortizationSchedule(input));
    this.calculated.set(true);
  }
}
