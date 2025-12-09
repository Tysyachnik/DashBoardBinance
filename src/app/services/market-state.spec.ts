import { TestBed } from '@angular/core/testing';

import { MarketState } from './market-state';

describe('MarketState', () => {
  let service: MarketState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
