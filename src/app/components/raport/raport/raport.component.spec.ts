import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaportComponent } from './raport.component';

describe('RaportComponent', () => {
  let component: RaportComponent;
  let fixture: ComponentFixture<RaportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RaportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
