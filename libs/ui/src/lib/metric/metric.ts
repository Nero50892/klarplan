import { Component, input } from '@angular/core';

let nextMetricId = 0;

@Component({
  selector: 'kp-metric',
  templateUrl: './metric.html',
  styleUrl: './metric.scss',
})
export class Metric {
  readonly labelId = `kp-metric-${nextMetricId++}`;
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly hint = input('');
}
