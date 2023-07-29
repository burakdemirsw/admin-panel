import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectedPackageDetailComponent } from './collected-package-detail.component';

describe('CollectedPackageDetailComponent', () => {
  let component: CollectedPackageDetailComponent;
  let fixture: ComponentFixture<CollectedPackageDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectedPackageDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectedPackageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
