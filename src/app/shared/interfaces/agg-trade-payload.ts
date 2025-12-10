export interface AggTradePayload {
  e: string; // event type
  E: number; // event time
  a: number; // agg trade id
  s: string; // symbol
  p: string; // price STRING
  q: string; // quantity STRING
  f: number; // firstTradeId
  l: number; //lastTradeId
  T: number; // trade time
  m: boolean; // maker
  M: boolean; // ignore
}
