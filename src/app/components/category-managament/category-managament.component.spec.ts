import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryManagamentComponent } from './category-managament.component';

describe('CategoryManagamentComponent', () => {
  let component: CategoryManagamentComponent;
  let fixture: ComponentFixture<CategoryManagamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryManagamentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryManagamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
