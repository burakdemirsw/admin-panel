import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastTransferListComponent } from './fast-transfer-list.component';

describe('FastTransferListComponent', () => {
  let component: FastTransferListComponent;
  let fixture: ComponentFixture<FastTransferListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FastTransferListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FastTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
