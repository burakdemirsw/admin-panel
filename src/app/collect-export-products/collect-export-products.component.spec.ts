import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectExportProductsComponent } from './collect-export-products.component';

describe('CollectExportProductsComponent', () => {
  let component: CollectExportProductsComponent;
  let fixture: ComponentFixture<CollectExportProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectExportProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectExportProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
