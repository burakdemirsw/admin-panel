import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBillingOperationComponent } from './order-billing-operation.component';

describe('OrderBillingOperationComponent', () => {
  let component: OrderBillingOperationComponent;
  let fixture: ComponentFixture<OrderBillingOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderBillingOperationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderBillingOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
