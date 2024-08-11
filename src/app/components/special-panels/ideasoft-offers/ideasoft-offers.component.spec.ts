import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeasoftOffersComponent } from './ideasoft-offers.component';

describe('IdeasoftOffersComponent', () => {
  let component: IdeasoftOffersComponent;
  let fixture: ComponentFixture<IdeasoftOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeasoftOffersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdeasoftOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
