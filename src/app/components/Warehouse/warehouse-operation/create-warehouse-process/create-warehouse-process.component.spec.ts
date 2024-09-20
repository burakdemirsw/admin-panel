import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWarehouseProcessComponent } from './create-warehouse-process.component';

describe('CreateWarehouseProcessComponent', () => {
  let component: CreateWarehouseProcessComponent;
  let fixture: ComponentFixture<CreateWarehouseProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWarehouseProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateWarehouseProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
