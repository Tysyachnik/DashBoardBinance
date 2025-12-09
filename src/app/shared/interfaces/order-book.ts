import { DepthLevel } from './depth-level';

export interface OrderBook {
  lastUpdateId?: number;
  bids: DepthLevel[];
  asks: DepthLevel[];
}
