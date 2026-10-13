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

  // TODO(Andreas) [Schritt 8/12]: Formularschema für Betrag, Laufzeit und Sollzins
  // Ziel: required, min und max aus @angular/forms/signals. Betrag 1.000–100.000, Laufzeit 12–120, Sollzins 0–15.
  // Akzeptanz: leere oder zu kleine Werte zeigen den Fehler am Feld; 0 % Zins bleibt gültig; der Hinweistext weicht dem Fehler
  // Tests: apps/web-e2e/src/klarplan.spec.ts (test.fixme zur ungültigen Eingabe)
  // Tipp: form(this.draft.formModel, (path) => { min(path.principalEuro, 1000, { message: 'Mindestens 1.000 Euro.' }); })
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

  // TODO(Andreas) [Schritt 8/12]: Fehlertexte aus dem Formular lesen
  // Ziel: die erste message aus loanForm.principalEuro().errors() und den anderen Feldern
  // Akzeptanz: ohne Schema bleibt der Text leer; mit Schema erscheint die deutsche Meldung am Feld
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

  // TODO(Andreas) [Schritt 7/12]: Berechnen auslösen
  // Ziel: Formular prüfen, bei gültigen Werten die Funktionen aus @klarplan/loan-calculation aufrufen und draft.result, draft.schedule sowie draft.calculated setzen
  // Akzeptanz: 10.000 €, 60 Monate, 5 % zeigen 188,71 € Monatsrate; ungültige Eingaben rechnen nicht
  // Tests: apps/web-e2e/src/klarplan.spec.ts (test.fixme)
  // Tipp: event.preventDefault() bleibt, damit die Seite nicht neu lädt
  berechnen(event: Event): void {
    event.preventDefault();

    const hasErrors = this.loanForm().errors().length > 0;
    if (!hasErrors) {
      this.draft.calculateLoanData();
    }
  }

  // TODO(Andreas) [Schritt 7/12]: Eingaben zurücksetzen
  // Ziel: formModel auf die Anfangswerte, Ergebnis und Plan leeren, calculated auf false
  // Akzeptanz: danach stehen wieder 10.000 €, 60 Monate und 5 %, die Kennzahlen sind Platzhalter
  // Tests: optional ein Komponenten-Test neben diesem Handler
  zuruecksetzen(): void {
    this.draft.formModel.set({ ...initialLoanForm });
    this.draft.result.set({ ...emptyLoanSummary });
    this.draft.schedule.set([]);
    this.draft.calculated.set(false);
  }
}
