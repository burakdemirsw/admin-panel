import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardPaymentProcessComponent } from './credit-card-payment-process.component';

describe('CreditCardPaymentProcessComponent', () => {
  let component: CreditCardPaymentProcessComponent;
  let fixture: ComponentFixture<CreditCardPaymentProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardPaymentProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditCardPaymentProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
