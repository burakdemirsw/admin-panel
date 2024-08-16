import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductToShelfListComponent } from './add-product-to-shelf-list.component';

describe('AddProductToShelfListComponent', () => {
  let component: AddProductToShelfListComponent;
  let fixture: ComponentFixture<AddProductToShelfListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductToShelfListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddProductToShelfListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
