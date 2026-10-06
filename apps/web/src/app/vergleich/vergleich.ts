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

  // TODO(Andreas) [Schritt 9/12]: Zwei bis drei Angebote auswählen
  // Ziel: selectedIds umschalten, mindestens 2 und höchstens 3. ausgewaehlte liefert die passenden Angebote aus offers.offers()
  // Akzeptanz: ein einzelnes Angebot zeigt noch keinen Vergleich; das vierte lässt sich nicht zusätzlich wählen; abwählen geht immer
  // Tests: apps/web-e2e/src/klarplan.spec.ts (test.fixme zum Vergleich)
  // Tipp: die Reihenfolge der Auswahl beibehalten, damit die Spalten stabil bleiben
  protected readonly ausgewaehlte = computed<LoanOffer[]>(() => []);

  constructor() {
    this.offers.load();
  }

  // TODO(Andreas) [Schritt 9/12]: Auswahl umschalten
  // Ziel: id hinzufügen oder entfernen, Obergrenze 3
  // Akzeptanz: der gedrückte Knopf zeigt aria-pressed passend zur Auswahl
  angebotWaehlen(_id: string): void {
    return;
  }

  protected comparisonRows(): Record<string, string>[] {
    return this.ausgewaehlte().map((offer) => ({
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
