import { TestBed } from '@angular/core/testing';

import { RetailOrderService } from './retail-order.service';

describe('RetailOrderService', () => {
  let service: RetailOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RetailOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
