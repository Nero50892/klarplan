import { LoanInput } from './loan.model';

// TODO(Andreas) [Schritt 1/12]: Monatsrate berechnen
// Ziel: Annuitätenformel R = K * (q^n * (q - 1)) / (q^n - 1), q = 1 + p/12/100
// Akzeptanz: 10.000 €, 60 Monate, 5 % → 188,71 €; bei 0 % ist die Rate Betrag / Monate (166,67 €)
// Tests: libs/loan-calculation/src/lib/annuity.spec.ts (aktuell it.todo)
// Tipp: auf Cent runden erst bei der Ausgabe, nicht in Zwischenschritten
export function calculateMonthlyPayment(_input: LoanInput): number {
  return 0;
}
