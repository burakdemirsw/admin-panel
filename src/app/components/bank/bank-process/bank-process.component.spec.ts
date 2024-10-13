import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankProcessComponent } from './bank-process.component';

describe('BankProcessComponent', () => {
  let component: BankProcessComponent;
  let fixture: ComponentFixture<BankProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
