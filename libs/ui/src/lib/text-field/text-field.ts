import { Component, input } from '@angular/core';
import { FormField, type FieldTree } from '@angular/forms/signals';

let nextFieldId = 0;

@Component({
  selector: 'kp-text-field',
  imports: [FormField],
  templateUrl: './text-field.html',
  styleUrl: './text-field.scss',
  host: {
    '[class.kp-field--invalid]': 'error().length > 0',
  },
})
export class TextField {
  readonly label = input.required<string>();
  readonly hint = input('');
  readonly error = input('');
  readonly suffix = input('');
  readonly type = input<'text' | 'number'>('text');
  readonly inputMode = input('');
  readonly step = input<string | null>(null);
  readonly field = input<FieldTree<number> | null>(null);

  readonly inputId = `kp-field-${nextFieldId}`;
  readonly hintId = `kp-field-${nextFieldId}-hint`;
  readonly errorId = `kp-field-${nextFieldId}-error`;

  constructor() {
    nextFieldId += 1;
  }

  describedById(): string {
    if (this.error()) {
      return this.errorId;
    }

    if (this.hint()) {
      return this.hintId;
    }

    return '';
  }
}
