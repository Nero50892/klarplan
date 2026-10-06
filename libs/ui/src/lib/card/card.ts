import { Component, input } from '@angular/core';

@Component({
  selector: 'kp-card',
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  readonly title = input('');
}
