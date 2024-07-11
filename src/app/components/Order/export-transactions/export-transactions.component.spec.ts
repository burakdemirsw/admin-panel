import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportTransactionsComponent } from './export-transactions.component';

describe('ExportTransactionsComponent', () => {
  let component: ExportTransactionsComponent;
  let fixture: ComponentFixture<ExportTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportTransactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
