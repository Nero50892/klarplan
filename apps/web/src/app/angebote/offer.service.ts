import { Service, signal } from '@angular/core';
import { LoanOffer, OfferLoadStatus } from './offer.model';

@Service()
export class OfferService {
  readonly status = signal<OfferLoadStatus>('leer');
  readonly offers = signal<LoanOffer[]>([]);
  readonly errorMessage = signal('');

  // TODO(Andreas) [Schritt 10/12]: Angebote laden, inklusive Lade- und Fehlerzustand
  // Ziel: GET {apiUrl}/api/angebote. Vorher status auf "laedt", bei Erfolg "bereit" und die Liste setzen, bei Fehler "fehler" und errorMessage.
  // Akzeptanz: leere Liste bleibt "leer" oder zeigt den leeren Zustand; Netzwerkfehler zeigt den Hinweis und lässt "Erneut laden" zu; während des Ladens ist aria-busy gesetzt
  // Tests: apps/web/src/app/angebote/offer.service.spec.ts (aktuell it.todo) und die Playwright-Fälle mit test.fixme
  // Tipp: httpResource oder HttpClient, die Basisadresse kommt aus API_URL
  load(): void {
    return;
  }
}
