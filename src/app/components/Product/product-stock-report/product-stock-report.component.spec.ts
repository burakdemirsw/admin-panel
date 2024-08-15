import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStockReportComponent } from './product-stock-report.component';

describe('ProductStockReportComponent', () => {
  let component: ProductStockReportComponent;
  let fixture: ComponentFixture<ProductStockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductStockReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
