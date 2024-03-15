import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesLoginv2Component } from './pages-loginv2.component';

describe('PagesLoginv2Component', () => {
  let component: PagesLoginv2Component;
  let fixture: ComponentFixture<PagesLoginv2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagesLoginv2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagesLoginv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
