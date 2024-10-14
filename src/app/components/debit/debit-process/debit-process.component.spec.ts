import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitProcessComponent } from './debit-process.component';

describe('DebitProcessComponent', () => {
  let component: DebitProcessComponent;
  let fixture: ComponentFixture<DebitProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebitProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DebitProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
