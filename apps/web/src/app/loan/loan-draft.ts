import { computed, Service, signal } from '@angular/core';
import {
  AmortizationRow,
  emptyLoanSummary,
  LoanSummary,
} from '@klarplan/loan-calculation';
import { initialLoanForm, LoanFormModel } from './loan-form.model';

@Service()
export class LoanDraft {
  readonly formModel = signal<LoanFormModel>({ ...initialLoanForm });

  readonly result = signal<LoanSummary>({ ...emptyLoanSummary });

  readonly schedule = signal<AmortizationRow[]>([]);

  readonly calculated = signal(false);

  // TODO(Andreas) [Schritt 5/12]: Rechner-Zustand mit den Berechnungen verbinden
  // Ziel: aus formModel eine LoanInput lesen und result sowie schedule setzen, sobald berechnet wird
  // Akzeptanz: nach "Rate berechnen" stehen Monatsrate, Zinsen, Gesamtbetrag, Effektivzins und der Plan in diesen Signals; calculated wird true
  // Tests: apps/web-e2e/src/klarplan.spec.ts (test.fixme zur Berechnung)
  // Tipp: die Funktionen aus @klarplan/loan-calculation aufrufen, diese Klasse hält nur den Zustand

  // TODO(Andreas) [Schritt 6/12]: Kennzahlen mit computed() ableiten
  // Ziel: die vier Werte aus result() oder direkt aus den Berechnungsfunktionen ableiten, nicht als feste 0
  // Akzeptanz: ändert sich das Ergebnis, ändern sich die abgeleiteten Werte ohne weiteres Setzen
  // Tests: derselbe Playwright-Fall zur Berechnung
  readonly monthlyPaymentEuro = computed(() => 0);
  readonly totalInterestEuro = computed(() => 0);
  readonly totalAmountEuro = computed(() => 0);
  readonly effectiveAnnualPercent = computed(() => 0);
}
