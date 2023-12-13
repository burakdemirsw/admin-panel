import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogManagamentComponent } from './log-managament.component';

describe('LogManagamentComponent', () => {
  let component: LogManagamentComponent;
  let fixture: ComponentFixture<LogManagamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogManagamentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogManagamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
