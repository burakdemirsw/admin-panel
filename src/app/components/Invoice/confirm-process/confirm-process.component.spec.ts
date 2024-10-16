import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProcessComponent } from './confirm-process.component';

describe('ConfirmProcessComponent', () => {
  let component: ConfirmProcessComponent;
  let fixture: ComponentFixture<ConfirmProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
