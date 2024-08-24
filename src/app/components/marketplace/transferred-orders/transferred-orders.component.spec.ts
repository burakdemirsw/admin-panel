import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferredOrdersComponent } from './transferred-orders.component';

describe('TransferredOrdersComponent', () => {
  let component: TransferredOrdersComponent;
  let fixture: ComponentFixture<TransferredOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferredOrdersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransferredOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
