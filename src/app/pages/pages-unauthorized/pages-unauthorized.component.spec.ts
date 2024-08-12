import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesUnauthorizedComponent } from './pages-unauthorized.component';

describe('PagesUnauthorizedComponent', () => {
  let component: PagesUnauthorizedComponent;
  let fixture: ComponentFixture<PagesUnauthorizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagesUnauthorizedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagesUnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
