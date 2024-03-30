import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateArasCargoBarcodeComponent } from './create-aras-cargo-barcode.component';

describe('CreateArasCargoBarcodeComponent', () => {
  let component: CreateArasCargoBarcodeComponent;
  let fixture: ComponentFixture<CreateArasCargoBarcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateArasCargoBarcodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateArasCargoBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
