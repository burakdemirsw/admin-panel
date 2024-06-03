import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchShelfComponent } from './search-shelf.component';

describe('SearchShelfComponent', () => {
  let component: SearchShelfComponent;
  let fixture: ComponentFixture<SearchShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchShelfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
