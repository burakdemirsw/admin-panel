import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchQrComponent } from './search-qr.component';

describe('SearchQrComponent', () => {
  let component: SearchQrComponent;
  let fixture: ComponentFixture<SearchQrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchQrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchQrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
