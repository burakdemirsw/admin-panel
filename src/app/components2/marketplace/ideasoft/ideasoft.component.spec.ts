import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasoftComponent } from './ideasoft.component';

describe('IdeasoftComponent', () => {
  let component: IdeasoftComponent;
  let fixture: ComponentFixture<IdeasoftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdeasoftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdeasoftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
