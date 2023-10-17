import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQrComponent } from './create-qr.component';

describe('CreateQrComponent', () => {
  let component: CreateQrComponent;
  let fixture: ComponentFixture<CreateQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
