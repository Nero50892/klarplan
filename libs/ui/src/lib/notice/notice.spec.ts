import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Notice } from './notice';

describe('Notice', () => {
  let fixture: ComponentFixture<Notice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notice],
    }).compileComponents();

    fixture = TestBed.createComponent(Notice);
    fixture.componentRef.setInput('title', 'Demo');
    await fixture.whenStable();
  });

  it('ist ein Status und kein Alarm', () => {
    expect(fixture.nativeElement.getAttribute('role')).toBe('status');
    expect(fixture.nativeElement.textContent).toContain('Demo');
  });

  it('wird bei einem Fehler zum Alarm', () => {
    fixture.componentRef.setInput('tone', 'error');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('alert');
  });
});
