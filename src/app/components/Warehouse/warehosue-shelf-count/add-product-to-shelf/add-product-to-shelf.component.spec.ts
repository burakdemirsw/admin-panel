import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductToShelfComponent } from './add-product-to-shelf.component';

describe('AddProductToShelfComponent', () => {
  let component: AddProductToShelfComponent;
  let fixture: ComponentFixture<AddProductToShelfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductToShelfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProductToShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
