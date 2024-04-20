import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailInvoiceListComponent } from './retail-invoice-list.component';

describe('RetailInvoiceListComponent', () => {
  let component: RetailInvoiceListComponent;
  let fixture: ComponentFixture<RetailInvoiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailInvoiceListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
