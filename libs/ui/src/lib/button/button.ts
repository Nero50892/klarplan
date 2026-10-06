import { Component, input } from '@angular/core';

@Component({
  selector: 'kp-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[class.kp-button-host]': 'true',
  },
})
export class Button {
  readonly variant = input<'primary' | 'secondary' | 'ghost'>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly pressed = input<boolean | null>(null);
}
