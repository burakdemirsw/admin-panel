import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashProcessListComponent } from './cash-process-list.component';

describe('CashProcessListComponent', () => {
  let component: CashProcessListComponent;
  let fixture: ComponentFixture<CashProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashProcessListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
