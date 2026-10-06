import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();
  });

  it('rendert eine Schaltfläche mit dem projizierten Text', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.textContent = 'Rate berechnen';
    expect(button.type).toBe('submit');
    expect(button.disabled).toBe(false);
  });

  it('deaktiviert die Schaltfläche', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('kennzeichnet die sekundäre Variante', () => {
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.classList.contains('kp-button--secondary')).toBe(true);
  });
});
