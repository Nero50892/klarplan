import { Component, inject } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DataTable, Notice, type TableColumn } from '@klarplan/ui';
import { AmortizationRow } from '@klarplan/loan-calculation';
import { formatEuro } from '../core/format';
import { LoanDraft } from '../loan/loan-draft';

@Component({
  selector: 'kp-tilgungsplan',
  imports: [DataTable, Notice, ScrollingModule],
  templateUrl: './tilgungsplan.html',
})
export class Tilgungsplan {
  protected readonly draft = inject(LoanDraft);
  protected readonly formatEuro = formatEuro;

  protected readonly columns: TableColumn[] = [
    { key: 'month', label: 'Monat' },
    { key: 'payment', label: 'Rate', numeric: true },
    { key: 'interest', label: 'Zinsanteil', numeric: true },
    { key: 'principal', label: 'Tilgungsanteil', numeric: true },
    { key: 'remaining', label: 'Restschuld', numeric: true },
  ];

  protected readonly emptyRows: Record<string, string>[] = [];

  protected scheduleRows(): Record<string, string>[] {
    return this.draft.schedule().map((row) => ({
      month: String(row.month),
      payment: formatEuro(row.paymentEuro),
      interest: formatEuro(row.interestEuro),
      principal: formatEuro(row.principalEuro),
      remaining: formatEuro(row.remainingEuro),
    }));
  }

  protected trackMonth(_index: number, row: AmortizationRow): number {
    return row.month;
  }
}
