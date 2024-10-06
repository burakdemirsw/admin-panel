import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectProcessComponent } from './collect-process.component';

describe('CollectProcessComponent', () => {
  let component: CollectProcessComponent;
  let fixture: ComponentFixture<CollectProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CollectProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
