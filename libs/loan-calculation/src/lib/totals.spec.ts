import { roundTo } from "./annuity";
import { LoanInput } from "./loan.model";
import { calculateLoanTotals } from "./totals";

describe('Gesamtzinsen und Gesamtbetrag', () => {
  let input: LoanInput;

  beforeEach(() => {
    input = {
      principalEuro: 10000,
      termMonths: 60,
      nominalAnnualPercent: 5,
    };
  });

  it('10.000 €, 60 Monate und 5 % ergeben 11.322,74 € Gesamtbetrag und 1.322,74 € Zinsen', () => {
    const totals = calculateLoanTotals(input);
    const roundedTotalAmountEuro = roundTo(totals.totalAmountEuro, 2);
    const roundedTotalInterestEuro = roundTo(totals.totalInterestEuro, 2);
    expect(roundedTotalAmountEuro).toBe(11322.74);
    expect(roundedTotalInterestEuro).toBe(1322.74);
  });

  it('bei 0 % Zins ist der Gesamtbetrag der Kreditbetrag und die Zinsen sind 0', () => {
    input.nominalAnnualPercent = 0;
    const totals = calculateLoanTotals(input);
    const roundedTotalAmountEuro = roundTo(totals.totalAmountEuro, 2);
    const roundedTotalInterestEuro = roundTo(totals.totalInterestEuro, 2);
    expect(roundedTotalAmountEuro).toBe(10000);
    expect(roundedTotalInterestEuro).toBe(0);
  });

  it('der Gesamtbetrag ist nie kleiner als der Kreditbetrag', () => {
    input.nominalAnnualPercent = 10;
    const totals = calculateLoanTotals(input);
    expect(totals.totalAmountEuro).toBeGreaterThan(input.principalEuro);
  });
});
