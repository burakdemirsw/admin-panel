import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTransactionsComponent } from './import-transactions.component';

describe('ImportTransactionsComponent', () => {
  let component: ImportTransactionsComponent;
  let fixture: ComponentFixture<ImportTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportTransactionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
