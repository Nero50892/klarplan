import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextField } from './text-field';

describe('TextField', () => {
  let fixture: ComponentFixture<TextField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextField],
    }).compileComponents();

    fixture = TestBed.createComponent(TextField);
    fixture.componentRef.setInput('label', 'Kreditbetrag');
    fixture.componentRef.setInput('hint', 'Zwischen 1.000 und 100.000 Euro');
    fixture.componentRef.setInput('suffix', 'Euro');
    await fixture.whenStable();
  });

  it('verbindet Beschriftung und Eingabe', () => {
    const element = fixture.nativeElement as HTMLElement;
    const label = element.querySelector('label');
    const input = element.querySelector('input');
    expect(label?.textContent).toContain('Kreditbetrag');
    expect(label?.getAttribute('for')).toBe(input?.id);
    expect(element.textContent).toContain('Euro');
    expect(element.textContent).toContain('Zwischen 1.000 und 100.000 Euro');
  });

  it('zeigt den Fehler und setzt aria-invalid', () => {
    fixture.componentRef.setInput('error', 'Mindestens 1.000 Euro.');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const input = element.querySelector('input');
    const alert = element.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Mindestens 1.000 Euro.');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-describedby')).toBe(alert?.id);
    expect(element.textContent).not.toContain('Zwischen 1.000 und 100.000 Euro');
  });
});
