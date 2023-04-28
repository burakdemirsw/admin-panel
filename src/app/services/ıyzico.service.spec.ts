import { TestBed } from '@angular/core/testing';

import { IyzicoService } from './ıyzico.service';

describe('IyzicoService', () => {
  let service: IyzicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IyzicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
