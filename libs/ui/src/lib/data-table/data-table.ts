import { Component, input } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  numeric?: boolean;
}

@Component({
  selector: 'kp-data-table',
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  readonly caption = input.required<string>();
  readonly columns = input.required<TableColumn[]>();
  readonly rows = input.required<Record<string, string>[]>();
  readonly emptyText = input('Keine Einträge.');
}
