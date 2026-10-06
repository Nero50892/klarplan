import { Component, input } from '@angular/core';

export type NoticeTone = 'info' | 'warning' | 'error';

@Component({
  selector: 'kp-notice',
  templateUrl: './notice.html',
  styleUrl: './notice.scss',
  host: {
    '[class.kp-notice-host]': 'true',
    '[class.kp-notice-host--warning]': 'tone() === "warning"',
    '[class.kp-notice-host--error]': 'tone() === "error"',
    '[attr.role]': 'tone() === "error" ? "alert" : "status"',
  },
})
export class Notice {
  readonly tone = input<NoticeTone>('info');
  readonly title = input('');
}
