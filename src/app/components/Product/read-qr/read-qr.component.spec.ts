import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadQrComponent } from './read-qr.component';

describe('ReadQrComponent', () => {
  let component: ReadQrComponent;
  let fixture: ComponentFixture<ReadQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
