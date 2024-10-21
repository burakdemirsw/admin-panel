import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardPaymentProcessListComponent } from './credit-card-payment-process-list.component';

describe('CreditCardPaymentProcessListComponent', () => {
  let component: CreditCardPaymentProcessListComponent;
  let fixture: ComponentFixture<CreditCardPaymentProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardPaymentProcessListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditCardPaymentProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
