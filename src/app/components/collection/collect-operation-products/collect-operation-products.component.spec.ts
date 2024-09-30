import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectOperationProductsComponent } from './collect-operation-products.component';

describe('CollectOperationProductsComponent', () => {
  let component: CollectOperationProductsComponent;
  let fixture: ComponentFixture<CollectOperationProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectOperationProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectOperationProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
