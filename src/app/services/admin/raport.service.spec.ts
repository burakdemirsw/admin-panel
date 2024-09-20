import { TestBed } from '@angular/core/testing';

import { RaportService } from './raport.service';

describe('RaportService', () => {
  let service: RaportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
