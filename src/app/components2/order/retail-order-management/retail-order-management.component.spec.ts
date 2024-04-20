import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailOrderManagementComponent } from './retail-order-management.component';

describe('RetailOrderManagementComponent', () => {
  let component: RetailOrderManagementComponent;
  let fixture: ComponentFixture<RetailOrderManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailOrderManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailOrderManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
