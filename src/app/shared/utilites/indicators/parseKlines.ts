import { Candle } from '../../interfaces/candle';
import { KlineRaw } from '../../types/klines.type';

export function parseKlines(raw: KlineRaw[]): Candle[] {
  return raw.map((r) => ({
    time: Number(r[0]),
    open: Number(r[1]),
    high: Number(r[2]),
    low: Number(r[3]),
    close: Number(r[4]),
    volume: Number(r[5]),
  }));
}
