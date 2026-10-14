import { httpResource } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { API_URL } from '../core/api-url';
import { LoanOffer, OfferLoadStatus } from './offer.model';

@Service()
export class OfferService {
  private readonly apiUrl = inject(API_URL);
  private readonly angefordert = signal(false);

  private readonly angebote = httpResource<LoanOffer[]>(
    () => (this.angefordert() ? `${this.apiUrl}/api/angebote` : undefined),
    {
      defaultValue: [],
      parse: demoOffers,
    },
  );

  readonly offers = computed(() =>
    this.angebote.status() === 'error' ? [] : this.angebote.value(),
  );

  readonly status = computed<OfferLoadStatus>(() => {
    switch (this.angebote.status()) {
      case 'loading':
      case 'reloading':
        return 'laedt';
      case 'error':
        return 'fehler';
      case 'resolved':
      case 'local':
        return this.angebote.value().length === 0 ? 'leer' : 'bereit';
      default:
        return 'leer';
    }
  });

  readonly errorMessage = computed(() =>
    this.status() === 'fehler' ? 'Die Demo-API hat nicht geantwortet.' : '',
  );

  load(): void {
    if (this.angefordert()) {
      this.angebote.reload();
      return;
    }
    this.angefordert.set(true);
  }
}

function demoOffers(value: unknown): LoanOffer[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((offer): offer is LoanOffer => offer?.isDemo === true);
}
