import { Component } from '@angular/core';
import { DataTable, Notice, type TableColumn } from '@klarplan/ui';

@Component({
  selector: 'kp-hinweis',
  imports: [DataTable, Notice],
  templateUrl: './hinweis.html',
})
export class Hinweis {
  protected readonly columns: TableColumn[] = [
    { key: 'column', label: 'Spalte' },
    { key: 'meaning', label: 'Bedeutung' },
  ];

  protected readonly rows: Record<string, string>[] = [
    { column: 'Monat', meaning: 'Die laufende Nummer, beginnend bei 1.' },
    { column: 'Rate', meaning: 'Der gleichbleibende Betrag, den du jeden Monat zahlst.' },
    { column: 'Zinsanteil', meaning: 'Der Teil der Rate, der die Zinsen deckt.' },
    { column: 'Tilgungsanteil', meaning: 'Der Teil der Rate, der die Restschuld senkt.' },
    { column: 'Restschuld', meaning: 'Was nach dieser Rate noch offen ist.' },
  ];
}
