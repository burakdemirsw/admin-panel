import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankProcessListComponent } from './bank-process-list.component';

describe('BankProcessListComponent', () => {
  let component: BankProcessListComponent;
  let fixture: ComponentFixture<BankProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankProcessListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
