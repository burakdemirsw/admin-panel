import { TestBed } from '@angular/core/testing';

import { DirectRequestService } from './direct-request.service';

describe('DirectRequestService', () => {
  let service: DirectRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DirectRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
