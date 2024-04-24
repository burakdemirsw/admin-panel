import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStateComponent } from './order-state.component';

describe('OrderStateComponent', () => {
  let component: OrderStateComponent;
  let fixture: ComponentFixture<OrderStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
