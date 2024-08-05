import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesInfoComponent } from './pages-info.component';

describe('PagesInfoComponent', () => {
  let component: PagesInfoComponent;
  let fixture: ComponentFixture<PagesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagesInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
