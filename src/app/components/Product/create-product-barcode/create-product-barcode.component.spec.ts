import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductBarcodeComponent } from './create-product-barcode.component';

describe('CreateProductBarcodeComponent', () => {
  let component: CreateProductBarcodeComponent;
  let fixture: ComponentFixture<CreateProductBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProductBarcodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateProductBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
