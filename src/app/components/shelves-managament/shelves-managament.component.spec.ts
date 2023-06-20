import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelvesManagamentComponent } from './shelves-managament.component';

describe('ShelvesManagamentComponent', () => {
  let component: ShelvesManagamentComponent;
  let fixture: ComponentFixture<ShelvesManagamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShelvesManagamentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelvesManagamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
