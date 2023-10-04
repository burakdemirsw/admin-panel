import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastTransferComponent } from './fast-transfer.component';

describe('FastTransferComponent', () => {
  let component: FastTransferComponent;
  let fixture: ComponentFixture<FastTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FastTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
