import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSaleOrderComponent } from './create-sale-order.component';

describe('CreateSaleOrderComponent', () => {
  let component: CreateSaleOrderComponent;
  let fixture: ComponentFixture<CreateSaleOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSaleOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSaleOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
