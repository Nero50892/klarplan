import { httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { API_URL } from './api-url';

interface HealthBody {
  status: string;
}

@Service()
export class ApiStatus {
  private readonly apiUrl = inject(API_URL);

  readonly health = httpResource<HealthBody>(() => `${this.apiUrl}/health`);
}
