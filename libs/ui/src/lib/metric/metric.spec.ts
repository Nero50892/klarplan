import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Metric } from './metric';

describe('Metric', () => {
  let fixture: ComponentFixture<Metric>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Metric],
    }).compileComponents();

    fixture = TestBed.createComponent(Metric);
    fixture.componentRef.setInput('label', 'Monatsrate');
    fixture.componentRef.setInput('value', '0,00 €');
    fixture.componentRef.setInput('hint', 'Platzhalter');
    await fixture.whenStable();
  });

  it('zeigt Beschriftung und Wert', () => {
    const element = fixture.nativeElement as HTMLElement;
    const value = element.querySelector('.kp-metric__value');
    expect(element.textContent).toContain('Monatsrate');
    expect(value?.textContent).toContain('0,00 €');
    expect(value?.getAttribute('aria-labelledby')).toBeTruthy();
    expect(element.textContent).toContain('Platzhalter');
  });
});
