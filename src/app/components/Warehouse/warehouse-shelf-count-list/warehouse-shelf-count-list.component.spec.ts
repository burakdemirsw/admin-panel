import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseShelfCountListComponent } from './warehouse-shelf-count-list.component';

describe('WarehouseShelfCountListComponent', () => {
  let component: WarehouseShelfCountListComponent;
  let fixture: ComponentFixture<WarehouseShelfCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarehouseShelfCountListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarehouseShelfCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
