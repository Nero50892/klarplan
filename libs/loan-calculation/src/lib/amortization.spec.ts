import { LoanInput } from './loan.model';
import { buildAmortizationSchedule } from './amortization';

describe('Tilgungsplan', () => {
  let input: LoanInput;

  beforeEach(() => {
    input = {
      principalEuro: 10000,
      termMonths: 60,
      nominalAnnualPercent: 5,
    };
  });

  it('hat genau so viele Zeilen wie Monate in der Laufzeit', () => {
    const schedule = buildAmortizationSchedule(input);
    expect(schedule.length).toBe(input.termMonths);
  });

  it('beginnt bei 10.000 €, 60 Monaten und 5 % mit etwa 41,67 € Zins und 147,05 € Tilgung', () => {
    const schedule = buildAmortizationSchedule(input);
    expect(schedule[0].interestEuro).toBe(41.67);
    // Mit Cent-Rundung: 188,71 − 41,67 = 147,04 (Fahrplan: „etwa 147,05“)
    expect(schedule[0].principalEuro).toBe(147.04);
    expect(schedule[0].remainingEuro).toBe(9852.96);
  });

  it('endet mit einer Restschuld von 0, auch nach Rundung auf Cent', () => {
    const schedule = buildAmortizationSchedule(input);
    const last = schedule[schedule.length - 1];
    expect(last.remainingEuro).toBe(0);
    expect(last.principalEuro + last.interestEuro).toBe(last.paymentEuro);
  });

  it('setzt bei 0 % Zins den Zinsanteil jeder Zeile auf 0', () => {
    input.nominalAnnualPercent = 0;
    const schedule = buildAmortizationSchedule(input);
    expect(schedule.every((row) => row.interestEuro === 0)).toBe(true);
    expect(schedule[schedule.length - 1].remainingEuro).toBe(0);
  });

  it('lehnt eine Laufzeit unter 1 Monat ab oder liefert einen leeren Plan', () => {
    input.termMonths = 0;
    expect(buildAmortizationSchedule(input)).toEqual([]);
  });
});
