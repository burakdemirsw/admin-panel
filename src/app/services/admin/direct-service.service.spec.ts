import { TestBed } from '@angular/core/testing';

import { DirectServiceService } from './direct-service.service';

describe('DirectServiceService', () => {
  let service: DirectServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
