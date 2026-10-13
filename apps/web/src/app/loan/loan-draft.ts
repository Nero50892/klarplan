import { computed, Service, Signal, signal } from '@angular/core';
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

  // TODO(Andreas) [Schritt 6/12]: Kennzahlen mit computed() ableiten
  // Ziel: die vier Werte aus result() oder direkt aus den Berechnungsfunktionen ableiten, nicht als feste 0
  // Akzeptanz: ändert sich das Ergebnis, ändern sich die abgeleiteten Werte ohne weiteres Setzen
  // Tests: derselbe Playwright-Fall zur Berechnung
  readonly monthlyPaymentEuro = computed(() => 0);
  readonly totalInterestEuro = computed(() => 0);
  readonly totalAmountEuro = computed(() => 0);
  readonly effectiveAnnualPercent = computed(() => 0);

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
