import { computed, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Notice } from '@klarplan/ui';
import { ApiStatus } from './core/api-status';

@Component({
  selector: 'kp-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Notice],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly apiStatus = inject(ApiStatus);

  protected readonly apiDown = computed(
    () => this.apiStatus.health.status() === 'error',
  );
}
