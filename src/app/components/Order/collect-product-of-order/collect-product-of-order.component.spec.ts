import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectProductOfOrderComponent } from './collect-product-of-order.component';

describe('CollectProductOfOrderComponent', () => {
  let component: CollectProductOfOrderComponent;
  let fixture: ComponentFixture<CollectProductOfOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectProductOfOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectProductOfOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
