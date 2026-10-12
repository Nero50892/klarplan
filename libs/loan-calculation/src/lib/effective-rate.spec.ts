import { LoanInput } from "./loan.model";
import { calculateEffectiveAnnualPercent } from "./effective-rate";

describe('Effektiver Jahreszins', () => {
  let input: LoanInput;

  beforeEach(() => {
    input = {
      principalEuro: 10000,
      termMonths: 60,
      nominalAnnualPercent: 5,
    };
  });

  it('5 % nominal ohne Gebühren ergeben etwa 5,116 % effektiv', () => {
    expect(calculateEffectiveAnnualPercent(input)).toBe(5.12);
  });

  it('0 % nominal bleibt 0 % effektiv', () => {
    input.nominalAnnualPercent = 0;
    expect(calculateEffectiveAnnualPercent(input)).toBe(0);
  });

  it('der Effektivzins liegt bei monatlicher Verzinsung über dem Nominalzins, sobald der Zins größer als 0 ist', () => {
    input.nominalAnnualPercent = 10;
    expect(calculateEffectiveAnnualPercent(input)).toBeGreaterThan(input.nominalAnnualPercent);
  });
});
