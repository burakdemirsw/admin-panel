import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseOrderManagamentComponent } from './purchase-order-managament.component';

describe('PurchaseOrderManagamentComponent', () => {
  let component: PurchaseOrderManagamentComponent;
  let fixture: ComponentFixture<PurchaseOrderManagamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseOrderManagamentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseOrderManagamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
