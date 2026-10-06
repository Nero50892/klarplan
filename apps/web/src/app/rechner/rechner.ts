import { Component, computed, inject } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Button, Card, Metric, Notice, TextField } from '@klarplan/ui';
import { formatEuro, formatPercent } from '../core/format';
import { LoanDraft } from '../loan/loan-draft';

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
  protected readonly loanForm = form(this.draft.formModel);

  // TODO(Andreas) [Schritt 8/12]: Fehlertexte aus dem Formular lesen
  // Ziel: die erste message aus loanForm.principalEuro().errors() und den anderen Feldern
  // Akzeptanz: ohne Schema bleibt der Text leer; mit Schema erscheint die deutsche Meldung am Feld
  protected readonly principalError = computed(() => '');
  protected readonly termError = computed(() => '');
  protected readonly rateError = computed(() => '');

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
  }

  // TODO(Andreas) [Schritt 7/12]: Eingaben zurücksetzen
  // Ziel: formModel auf die Anfangswerte, Ergebnis und Plan leeren, calculated auf false
  // Akzeptanz: danach stehen wieder 10.000 €, 60 Monate und 5 %, die Kennzahlen sind Platzhalter
  // Tests: optional ein Komponenten-Test neben diesem Handler
  zuruecksetzen(): void {
    return;
  }
}
