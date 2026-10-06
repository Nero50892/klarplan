import { AmortizationRow, LoanInput } from './loan.model';

// TODO(Andreas) [Schritt 2/12]: Tilgungsplan aufbauen
// Ziel: für jeden Monat Rate, Zinsanteil, Tilgungsanteil und Restschuld. Zinsanteil = Restschuld * p/12/100
// Akzeptanz: 10.000 €, 60 Monate, 5 % → Monat 1 Zins ungerundet 41,67 €, Tilgung etwa 147,05 €, Restschuld etwa 9.852,95 €; letzte Restschuld 0
// Tests: libs/loan-calculation/src/lib/amortization.spec.ts (aktuell it.todo)
// Tipp: die Rate aus Schritt 1 wiederverwenden und bei 0 % den Zinsanteil auf 0 setzen
export function buildAmortizationSchedule(_input: LoanInput): AmortizationRow[] {
  return [];
}
