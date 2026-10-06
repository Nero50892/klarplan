import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTable, TableColumn } from './data-table';

describe('DataTable', () => {
  const columns: TableColumn[] = [
    { key: 'month', label: 'Monat' },
    { key: 'payment', label: 'Rate', numeric: true },
  ];

  let fixture: ComponentFixture<DataTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTable],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTable);
    fixture.componentRef.setInput('caption', 'Tilgungsplan');
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('rows', []);
    fixture.componentRef.setInput('emptyText', 'Noch keine Raten.');
    await fixture.whenStable();
  });

  it('zeigt den leeren Zustand', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('caption')?.textContent).toContain('Tilgungsplan');
    expect(element.textContent).toContain('Noch keine Raten.');
  });

  it('rendert Zeilen und richtet Zahlen rechts aus', () => {
    fixture.componentRef.setInput('rows', [{ month: '1', payment: '188,71 €' }]);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const cells = element.querySelectorAll('td');
    expect(cells[0]?.textContent).toContain('1');
    expect(cells[1]?.textContent).toContain('188,71 €');
    expect(cells[1]?.classList.contains('kp-table__numeric')).toBe(true);
  });
});
