import { Component, computed, inject } from '@angular/core';
import { form, max, min, required } from '@angular/forms/signals';
import { Button, Card, Metric, Notice, TextField } from '@klarplan/ui';
import { formatEuro, formatPercent } from '../core/format';
import { LoanDraft } from '../loan/loan-draft';
import { initialLoanForm } from '../loan/loan-form.model';
import { emptyLoanSummary } from '@klarplan/loan-calculation';

@Component({
  selector: 'kp-rechner',
  imports: [Button, Card, Metric, Notice, TextField],
  templateUrl: './rechner.html',
})
export class Rechner {
  protected readonly draft = inject(LoanDraft);

  protected readonly loanForm = form(this.draft.formModel, (schema) => {
    required(schema.principalEuro, { message: 'Bitte geben Sie einen Betrag ein.' });
    min(schema.principalEuro, 1000, { message: 'Mindestens 1.000 Euro.' });
    max(schema.principalEuro, 100000, { message: 'Höchstens 100.000 Euro.' });
    required(schema.termMonths, { message: 'Bitte geben Sie eine Laufzeit ein.' });
    min(schema.termMonths, 12, { message: 'Mindestens 12 Monate.' });
    max(schema.termMonths, 120, { message: 'Höchstens 120 Monate.' });
    required(schema.nominalAnnualPercent, { message: 'Bitte geben Sie einen Sollzins ein.' });
    min(schema.nominalAnnualPercent, 0, { message: 'Mindestens 0 %.' });
    max(schema.nominalAnnualPercent, 15, { message: 'Höchstens 15 %.' });
  });

  protected readonly principalError = computed(() => this.loanForm.principalEuro().errors()[0]?.message ?? '');
  protected readonly termError = computed(() => this.loanForm.termMonths().errors()[0]?.message ?? '');
  protected readonly rateError = computed(() =>
    this.loanForm.nominalAnnualPercent().errors()[0]?.message ?? '',
  );

  protected readonly monthlyPayment = computed(() =>
    formatEuro(this.draft.monthlyPaymentEuro()),
  );
  protected readonly totalInterest = computed(() =>
    formatEuro(this.draft.totalInterestEuro()),
  );
  protected readonly totalAmount = computed(() =>
    formatEuro(this.draft.totalAmountEuro()),
  );
  protected readonly effectiveRate = computed(() =>
    formatPercent(this.draft.effectiveAnnualPercent()),
  );

  berechnen(event: Event): void {
    event.preventDefault();

    const hasErrors = this.loanForm().errors().length > 0;
    if (!hasErrors) {
      this.draft.calculateLoanData();
    }
  }

  zuruecksetzen(): void {
    this.draft.formModel.set({ ...initialLoanForm });
    this.draft.result.set({ ...emptyLoanSummary });
    this.draft.schedule.set([]);
    this.draft.calculated.set(false);
  }
}
