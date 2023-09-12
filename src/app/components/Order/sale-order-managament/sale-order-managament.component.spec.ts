import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderManagamentComponent } from './sale-order-managament.component';

describe('SaleOrderManagamentComponent', () => {
  let component: SaleOrderManagamentComponent;
  let fixture: ComponentFixture<SaleOrderManagamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleOrderManagamentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleOrderManagamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
