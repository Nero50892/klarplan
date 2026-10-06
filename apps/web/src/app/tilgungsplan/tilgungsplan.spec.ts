import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tilgungsplan } from './tilgungsplan';

describe('Tilgungsplan', () => {
  let fixture: ComponentFixture<Tilgungsplan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tilgungsplan],
    }).compileComponents();

    fixture = TestBed.createComponent(Tilgungsplan);
    await fixture.whenStable();
  });

  it('zeigt den leeren Plan', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')?.textContent).toContain('Tilgungsplan');
    expect(element.textContent).toContain('Noch keine Raten.');
    expect(element.textContent).toContain('Monat');
    expect(element.textContent).toContain('Restschuld');
  });
});
