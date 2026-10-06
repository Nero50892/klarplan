import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Rechner } from './rechner';

describe('Rechner', () => {
  let fixture: ComponentFixture<Rechner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rechner],
    }).compileComponents();

    fixture = TestBed.createComponent(Rechner);
    await fixture.whenStable();
  });

  it('zeigt Eingaben und Platzhalter', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain(
      'Was kostet der Kredit im Monat?',
    );
    expect(element.textContent).toContain('Kreditbetrag');
    expect(element.textContent).toContain('Laufzeit');
    expect(element.textContent).toContain('Sollzins pro Jahr');
    expect(element.textContent).toContain('0,00');
    expect(element.textContent).toContain('Platzhalter');
  });
});
