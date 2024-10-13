import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashProcessComponent } from './cash-process.component';

describe('CashProcessComponent', () => {
  let component: CashProcessComponent;
  let fixture: ComponentFixture<CashProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
