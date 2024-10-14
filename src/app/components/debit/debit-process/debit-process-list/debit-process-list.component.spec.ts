import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitProcessListComponent } from './debit-process-list.component';

describe('DebitProcessListComponent', () => {
  let component: DebitProcessListComponent;
  let fixture: ComponentFixture<DebitProcessListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebitProcessListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DebitProcessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
