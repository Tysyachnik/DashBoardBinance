import { TestBed } from '@angular/core/testing';

import { FavoritesPairs } from './favorites-pairs';

describe('FavoritesPairs', () => {
  let service: FavoritesPairs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesPairs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
