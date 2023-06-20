import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelveOperationComponent } from './shelve-operation.component';

describe('ShelveOperationComponent', () => {
  let component: ShelveOperationComponent;
  let fixture: ComponentFixture<ShelveOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShelveOperationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelveOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
