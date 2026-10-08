import { LoanInput } from './loan.model';
import { calculateMonthlyPayment, roundTo } from './annuity';

describe('Monatsrate', () => {
  let input: LoanInput;

  beforeEach(() => {
    input = {
      principalEuro: 10000,
      termMonths: 60,
      nominalAnnualPercent: 5,
    };
  });

  it('10.000 €, 60 Monate und 5 % Sollzins ergeben ungerundet etwa 188,71 €', () => {
    expect(calculateMonthlyPayment(input)).toBe(188.71);
  });
  it('should round correct according to decimal places', () => {
    expect(roundTo(1.256, 2)).toBe(1.26);
  });

  it('bei 0 % Zins ist die Rate Betrag geteilt durch Monate, also 166,67 €', () => {
    input.nominalAnnualPercent = 0;
    expect(calculateMonthlyPayment(input)).toBe(166.67);
  });

  it('eine Laufzeit von einem Monat gibt den ganzen Betrag plus den Monatszins zurück', () => {
    input.termMonths = 1;
    expect(calculateMonthlyPayment(input)).toBe(10041.67);
  });

  it('ein Kreditbetrag von 0 ergibt eine Rate von 0', () => {
    input.principalEuro = 0;
    expect(calculateMonthlyPayment(input)).toBe(0);
  });
});
