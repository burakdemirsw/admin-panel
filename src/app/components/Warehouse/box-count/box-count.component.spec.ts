import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxCountComponent } from './box-count.component';

describe('BoxCountComponent', () => {
  let component: BoxCountComponent;
  let fixture: ComponentFixture<BoxCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxCountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
