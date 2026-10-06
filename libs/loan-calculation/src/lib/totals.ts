import { LoanInput } from './loan.model';

export interface LoanTotals {
  totalInterestEuro: number;
  totalAmountEuro: number;
}

// TODO(Andreas) [Schritt 3/12]: Gesamtzinsen und Gesamtbetrag
// Ziel: Gesamtbetrag = Summe der ungerundeten Raten, Gesamtzinsen = Gesamtbetrag − Kreditbetrag
// Akzeptanz: 10.000 €, 60 Monate, 5 % → Gesamtbetrag 11.322,74 €, Gesamtzinsen 1.322,74 €; bei 0 % sind die Zinsen 0
// Tests: libs/loan-calculation/src/lib/totals.spec.ts (aktuell it.todo)
// Tipp: nicht die schon auf Cent gerundete Monatsrate mit der Laufzeit malnehmen
export function calculateLoanTotals(_input: LoanInput): LoanTotals {
  return {
    totalInterestEuro: 0,
    totalAmountEuro: 0,
  };
}
