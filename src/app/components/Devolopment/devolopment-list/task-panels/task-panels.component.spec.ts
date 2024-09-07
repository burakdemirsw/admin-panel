import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPanelsComponent } from './task-panels.component';

describe('TaskPanelsComponent', () => {
  let component: TaskPanelsComponent;
  let fixture: ComponentFixture<TaskPanelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPanelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
