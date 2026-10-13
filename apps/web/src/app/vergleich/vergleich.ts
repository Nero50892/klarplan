import { Component, computed, inject, signal } from '@angular/core';
import { Button, Card, DataTable, Metric, Notice, type TableColumn } from '@klarplan/ui';
import { LoanOffer } from '../angebote/offer.model';
import { OfferService } from '../angebote/offer.service';
import { formatEuro, formatPercent } from '../core/format';

@Component({
  selector: 'kp-vergleich',
  imports: [Button, Card, DataTable, Metric, Notice],
  templateUrl: './vergleich.html',
})
export class Vergleich {
  protected readonly offers = inject(OfferService);
  protected readonly formatEuro = formatEuro;
  protected readonly formatPercent = formatPercent;

  protected readonly columns: TableColumn[] = [
    { key: 'bank', label: 'Angebot' },
    { key: 'rate', label: 'Sollzins', numeric: true },
    { key: 'effective', label: 'Effektivzins', numeric: true },
    { key: 'payment', label: 'Monatsrate', numeric: true },
  ];

  readonly selectedIds = signal<string[]>([]);

  protected readonly selectedOffers = computed<LoanOffer[]>(() => {
    const offersById = new Map(this.offers.offers().map((offer) => [offer.id, offer]));
    return this.selectedIds().flatMap((id) => {
      const offer = offersById.get(id);
      return offer ? [offer] : [];
    });
  });

  constructor() {
    this.offers.load();
  }

  angebotWaehlen(selectedId: string): void {
    if (this.selectedIds().includes(selectedId)) {
      this.selectedIds.update((ids) => ids.filter((id) => id !== selectedId));
      return;
    }
    if (this.selectedIds().length >= 3) {
      return;
    }
    this.selectedIds.update((ids) => [...ids, selectedId]);
  }

  protected comparisonRows(): Record<string, string>[] {
    return this.selectedOffers().map((offer) => ({
      bank: `${offer.bankName}: ${offer.productName}`,
      rate: formatPercent(offer.nominalAnnualPercent),
      effective: formatPercent(offer.effectiveAnnualPercent),
      payment: formatEuro(offer.monthlyPaymentEuro),
    }));
  }

  protected isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }
}
