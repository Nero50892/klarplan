import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { API_URL } from '../core/api-url';
import { LoanOffer } from './offer.model';
import { OfferService } from './offer.service';

const api = 'http://api.test';

function offer(id: string, isDemo: boolean): LoanOffer {
  return {
    id,
    bankName: 'Demo-Bank Nord',
    productName: 'Übungsratenkredit',
    nominalAnnualPercent: 5,
    effectiveAnnualPercent: 5.12,
    termMonths: 60,
    principalEuro: 10000,
    monthlyPaymentEuro: 188.71,
    isDemo,
    disclaimer: 'Erfundenes Demo-Angebot.',
  };
}

describe('Angebotsservice', () => {
  let service: OfferService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: api },
      ],
    });
    service = TestBed.inject(OfferService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  async function antwortAbwarten(): Promise<void> {
    await TestBed.inject(ApplicationRef).whenStable();
  }

  it('startet im Zustand leer und ohne Angebote', () => {
    TestBed.flushEffects();
    expect(service.status()).toBe('leer');
    expect(service.offers()).toEqual([]);
    expect(service.errorMessage()).toBe('');
    http.expectNone(`${api}/api/angebote`);
  });

  it('setzt beim Laden den Zustand auf laedt und danach auf bereit', async () => {
    service.load();
    TestBed.flushEffects();
    expect(service.status()).toBe('laedt');

    const request = http.expectOne(`${api}/api/angebote`);
    expect(request.request.method).toBe('GET');
    request.flush([offer('demo-nord', true)]);
    await antwortAbwarten();

    expect(service.status()).toBe('bereit');
    expect(service.offers().map((item) => item.id)).toEqual(['demo-nord']);
  });

  it('lässt eine leere Antwort im Zustand leer', async () => {
    service.load();
    TestBed.flushEffects();
    http.expectOne(`${api}/api/angebote`).flush([]);
    await antwortAbwarten();

    expect(service.status()).toBe('leer');
    expect(service.offers()).toEqual([]);
  });

  it('setzt bei einem Netzwerkfehler den Zustand auf fehler und einen lesbaren Text', async () => {
    service.load();
    TestBed.flushEffects();
    http.expectOne(`${api}/api/angebote`).error(new ProgressEvent('error'));
    await antwortAbwarten();

    expect(service.status()).toBe('fehler');
    expect(service.offers()).toEqual([]);
    expect(service.errorMessage()).toContain('Demo-API');
  });

  it('übernimmt nur Angebote, die als Demo gekennzeichnet sind', async () => {
    service.load();
    TestBed.flushEffects();
    http.expectOne(`${api}/api/angebote`).flush([
      offer('demo-nord', true),
      offer('echt', false),
    ]);
    await antwortAbwarten();

    expect(service.status()).toBe('bereit');
    expect(service.offers().map((item) => item.id)).toEqual(['demo-nord']);
  });
});
