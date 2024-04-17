import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBarcodeComponent } from './create-barcode.component';

describe('CreateBarcodeComponent', () => {
  let component: CreateBarcodeComponent;
  let fixture: ComponentFixture<CreateBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBarcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
