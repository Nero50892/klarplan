import { formatEuro, formatPercent } from './format';

describe('Format', () => {
  it('formatiert Euro und Prozent auf Deutsch', () => {
    expect(formatEuro(0)).toBe('0,00\u00a0€');
    expect(formatEuro(188.71)).toBe('188,71\u00a0€');
    expect(formatPercent(0)).toBe('0,00\u00a0%');
    expect(formatPercent(5.12)).toBe('5,12\u00a0%');
  });
});
