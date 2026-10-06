import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vergleich } from './vergleich';

describe('Vergleich', () => {
  let fixture: ComponentFixture<Vergleich>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vergleich],
    }).compileComponents();

    fixture = TestBed.createComponent(Vergleich);
    await fixture.whenStable();
  });

  it('zeigt den leeren Zustand', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Angebote vergleichen');
    expect(element.textContent).toContain('Noch keine Demo-Angebote');
    expect(element.textContent).toContain('Platz für Angebot 1');
  });
});
