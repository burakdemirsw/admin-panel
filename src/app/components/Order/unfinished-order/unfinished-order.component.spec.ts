import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfinishedOrderComponent } from './unfinished-order.component';

describe('UnfinishedOrderComponent', () => {
  let component: UnfinishedOrderComponent;
  let fixture: ComponentFixture<UnfinishedOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnfinishedOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnfinishedOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
