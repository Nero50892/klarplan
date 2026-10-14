import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanOffer } from '../angebote/offer.model';
import { API_URL } from '../core/api-url';
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
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vergleich],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: 'http://api.test' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Vergleich);
    http = TestBed.inject(HttpTestingController);
    TestBed.flushEffects();
    fixture.detectChanges();
  });

  afterEach(() => {
    for (const request of http.match(() => true)) {
      request.flush([]);
    }
    http.verify();
  });

  it('zeigt den leeren Zustand', async () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[aria-busy="true"]')).not.toBeNull();

    http.expectOne('http://api.test/api/angebote').flush([]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(element.querySelector('h1')?.textContent).toContain('Angebote vergleichen');
    expect(element.textContent).toContain('Noch keine Demo-Angebote');
    expect(element.textContent).toContain('Platz für Angebot 1');
  });

  it('wählt höchstens drei Angebote und behält die Reihenfolge', async () => {
    http.expectOne('http://api.test/api/angebote').flush([
      offer('nord', 'Demo-Bank Nord'),
      offer('sued', 'Demo-Bank Süd'),
      offer('west', 'Demo-Bank West'),
      offer('ost', 'Demo-Bank Ost'),
    ]);
    await fixture.whenStable();
    fixture.detectChanges();

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
