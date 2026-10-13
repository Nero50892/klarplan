import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanOffer } from '../angebote/offer.model';
import { OfferService } from '../angebote/offer.service';
import { Vergleich } from './vergleich';

function offer(id: string, bankName: string): LoanOffer {
  return {
    id,
    bankName,
    productName: 'Demo',
    nominalAnnualPercent: 5,
    effectiveAnnualPercent: 5.12,
    termMonths: 60,
    principalEuro: 10000,
    monthlyPaymentEuro: 188.71,
    isDemo: true,
    disclaimer: 'Demo',
  };
}

describe('Vergleich', () => {
  let fixture: ComponentFixture<Vergleich>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vergleich],
    }).compileComponents();

    fixture = TestBed.createComponent(Vergleich);
    await fixture.whenStable();
  });

  it('zeigt den leeren Zustand', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Angebote vergleichen');
    expect(element.textContent).toContain('Noch keine Demo-Angebote');
    expect(element.textContent).toContain('Platz für Angebot 1');
  });

  it('wählt höchstens drei Angebote und behält die Reihenfolge', async () => {
    const service = TestBed.inject(OfferService);
    service.status.set('bereit');
    service.offers.set([
      offer('nord', 'Demo-Bank Nord'),
      offer('sued', 'Demo-Bank Süd'),
      offer('west', 'Demo-Bank West'),
      offer('ost', 'Demo-Bank Ost'),
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const choose = (bankName: string) => {
      const card = [...element.querySelectorAll('.kp-offer-list kp-card')].find((node) =>
        node.querySelector('h2')?.textContent?.includes(bankName),
      );
      const button = card?.querySelector('button');
      if (!button) {
        throw new Error(`Kein Knopf für ${bankName}`);
      }
      button.click();
      fixture.detectChanges();
      return button;
    };

    const sued = choose('Demo-Bank Süd');
    expect(element.textContent).toContain('Wähle zwei oder drei Angebote');
    expect(sued.getAttribute('aria-pressed')).toBe('true');

    choose('Demo-Bank Nord');
    choose('Demo-Bank West');
    const ost = choose('Demo-Bank Ost');

    const titles = [...element.querySelectorAll('.kp-compare h2')].map((heading) =>
      heading.textContent?.trim(),
    );
    expect(titles).toEqual(['Demo-Bank Süd', 'Demo-Bank Nord', 'Demo-Bank West']);
    expect(ost.getAttribute('aria-pressed')).toBe('false');
    expect(fixture.componentInstance.selectedIds()).toEqual(['sued', 'nord', 'west']);

    const nord = choose('Demo-Bank Nord');
    expect(fixture.componentInstance.selectedIds()).toEqual(['sued', 'west']);
    expect(nord.getAttribute('aria-pressed')).toBe('false');
  });
});
