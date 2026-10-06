import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { appRoutes } from './app.routes';
import { API_URL } from './core/api-url';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(appRoutes),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_URL, useValue: 'http://127.0.0.1:9' },
      ],
    }).compileComponents();
  });

  it('zeigt Namen und Navigation', async () => {
    const http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    for (const request of http.match(() => true)) {
      request.flush({ status: 'ok' });
    }
    await fixture.whenStable();
    fixture.detectChanges();
    http.verify();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Klarplan');
    expect(compiled.querySelector('nav')?.textContent).toContain('Rechner');
    expect(compiled.querySelector('nav')?.textContent).toContain('Tilgungsplan');
    expect(compiled.querySelector('nav')?.textContent).toContain('Vergleich');
    expect(compiled.querySelector('[href="#inhalt"]')?.textContent).toContain(
      'Zum Inhalt springen',
    );
  });
});
