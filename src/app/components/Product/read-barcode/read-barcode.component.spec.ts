import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadBarcodeComponent } from './read-barcode.component';

describe('ReadBarcodeComponent', () => {
  let component: ReadBarcodeComponent;
  let fixture: ComponentFixture<ReadBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadBarcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
