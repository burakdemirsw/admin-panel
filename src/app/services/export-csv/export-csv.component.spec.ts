import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCsvComponent } from './export-csv.component';

describe('ExportCsvComponent', () => {
  let component: ExportCsvComponent;
  let fixture: ComponentFixture<ExportCsvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExportCsvComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExportCsvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
