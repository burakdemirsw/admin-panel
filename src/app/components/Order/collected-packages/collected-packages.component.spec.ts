import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectedPackagesComponent } from './collected-packages.component';

describe('CollectedPackagesComponent', () => {
  let component: CollectedPackagesComponent;
  let fixture: ComponentFixture<CollectedPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectedPackagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectedPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
