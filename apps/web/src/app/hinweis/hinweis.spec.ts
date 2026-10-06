import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hinweis } from './hinweis';

describe('Hinweis', () => {
  let fixture: ComponentFixture<Hinweis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hinweis],
    }).compileComponents();

    fixture = TestBed.createComponent(Hinweis);
    await fixture.whenStable();
  });

  it('erklärt die Grenzen des Rechners', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Was dieser Rechner ist');
    expect(element.textContent).toContain('Keine Beratung');
    expect(element.textContent).toContain('Restschuld');
  });
});
