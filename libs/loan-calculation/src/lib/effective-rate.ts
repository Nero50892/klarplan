import { LoanInput } from './loan.model';

// TODO(Andreas) [Schritt 4/12]: Effektiven Jahreszins berechnen
// Ziel: ohne Gebühren (1 + p/12/100)^12 − 1, als Prozentzahl. Das ist der Effektivzins nach Preisangabenverordnung für einen Kredit ohne Kosten neben dem Sollzins.
// Akzeptanz: 5 % nominal → 5,116… %, auf zwei Nachkommastellen 5,12 %; 0 % bleibt 0
// Tests: libs/loan-calculation/src/lib/effective-rate.spec.ts (aktuell it.todo)
// Tipp: die Funktion liefert die Prozentzahl (5,116…), nicht den Dezimalbruch 0,05116
export function calculateEffectiveAnnualPercent(_input: LoanInput): number {
  return 0;
}
