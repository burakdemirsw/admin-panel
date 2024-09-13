import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UntransferredOrdersComponent } from './untransferred-orders.component';

describe('UntransferredOrdersComponent', () => {
  let component: UntransferredOrdersComponent;
  let fixture: ComponentFixture<UntransferredOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UntransferredOrdersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UntransferredOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
