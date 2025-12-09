import { TestBed } from '@angular/core/testing';

import { BinanceWebSocket } from './binance-web-socket';

describe('BinanceWebSocket', () => {
  let service: BinanceWebSocket;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinanceWebSocket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
