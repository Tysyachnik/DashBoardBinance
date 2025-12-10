import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BinanceApi } from '../../services/binance-api';
import { BinanceWebSocket } from '../../services/binance-web-socket';
import { Candle } from '../../shared/interfaces/candle';
import { OrderBook } from '../../shared/interfaces/order-book';
import { AggTrade } from '../../shared/interfaces/agg-trade';
import { DayStat } from '../../shared/interfaces/day-stat';
import { sma } from '../../shared/utilites/indicators/sma';
import { ema } from '../../shared/utilites/indicators/ema';
import { parseKlines } from '../../shared/utilites/indicators/parseKlines';
import { FormsModule } from '@angular/forms';
import { CandleStickChart } from '../candle-stick-chart/candle-stick-chart';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { DayStatistic } from '../day-statistic/day-statistic';
import { AggTradePayload } from '../../shared/interfaces/agg-trade-payload';

@Component({
  selector: 'app-pair-details',
  imports: [CommonModule, FormsModule, CandleStickChart, DayStatistic],
  standalone: true,
  templateUrl: './pair-details.html',
  styleUrl: './pair-details.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PairDetails {
  symbol = toSignal(inject(ActivatedRoute).paramMap.pipe(map((params) => params.get('symbol'))), {
    initialValue: null,
  });
  interval = signal<string>('1m');
  candles = signal<Candle[]>([]);
  smaValues = signal<(number | null)[]>([]);
  emaValues = signal<(number | null)[]>([]);
  orderBook = signal<OrderBook>({ bids: [], asks: [] });
  trades = signal<AggTrade[]>([]);
  dayStat = signal<DayStat | null>(null);
  smaPeriod = signal<number>(1);
  emaPeriod = signal<number>(1);
  timeTracker: string[] = ['1m', '5m', '15m', '1h', '4h', '1d'] as const;

  private destroyRef = inject(DestroyRef);
  private api = inject(BinanceApi);
  private ws = inject(BinanceWebSocket);
  private router = inject(Router);

  chartSeries = computed(() => {
    return this.candles().map((c) => ({
      time: new Date(c.time),
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: c.volume,
    }));
  });

  constructor() {
    effect(() => {
      const currSymbol = this.symbol();
      if (!currSymbol) return;
      this.loadInitial(currSymbol);
      this.connectWsStreams(currSymbol);
    });

    effect(() => {
      const closingPrice = this.candles().map((candle) => candle.close);
      this.smaValues.set(sma(closingPrice, this.smaPeriod()));
      this.emaValues.set(ema(closingPrice, this.emaPeriod()));
    });
  }

  async loadInitial(symbol: string) {
    this.api
      .getKLines(symbol, this.interval())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((raw) => {
        const parsed: Candle[] = parseKlines(raw);
        this.candles.set(parsed);
      });

    this.api
      .getDayStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((list) => {
        const st = (list as DayStat[]).find((s) => s.symbol === symbol) ?? null;
        this.dayStat.set(st);
      });

    this.api
      .getOrderBook(symbol, 20)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (data: { bids: [string, string][]; asks: [string, string][]; lastUpdateId?: number }) => {
          const to = {
            bids: data.bids.map(([price, qty]) => ({ price: Number(price), qty: Number(qty) })),
            asks: data.asks.map(([price, qty]) => ({ price: Number(price), qty: Number(qty) })),
            lastUpdateId: data.lastUpdateId,
          } as OrderBook;
          this.orderBook.set(to);
        }
      );
  }

  connectWsStreams(symbol: string) {
    const depthStream = `${symbol.toLowerCase()}@depth20@100ms`;
    const depth$ = this.ws.connect(depthStream);
    const depthSub = depth$.subscribe({
      next: (playload: { b?: [string, string][]; a?: [string, string][]; u?: number }) =>
        this.handleDepthUpdate(playload),
      error: (e) => console.log('depth ws err', e),
    });
    this.destroyRef.onDestroy(() => depthSub.unsubscribe());

    const tradeStream = `${symbol.toLowerCase()}@aggTrade`;
    const trades$ = this.ws.connect(tradeStream);
    const tradeSub = trades$.subscribe({
      next: (playload: AggTradePayload | { data: AggTradePayload }) =>
        this.handleAggTrade(playload),
      error: (e) => console.log('trades ws err', e),
    });
    this.destroyRef.onDestroy(() => tradeSub.unsubscribe());
  }

  selectInterval(value: string) {
    this.interval.set(value);
    if (!this.symbol()) return;

    this.api
      .getKLines(this.symbol()!, this.interval())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((raw) => {
        const parsed: Candle[] = parseKlines(raw);
        this.candles.set(parsed);
      });
  }

  trackPrice(_i: number, item: { price: number }) {
    return item.price;
  }

  trackTrade(_i: number, item: AggTrade) {
    return item.tradeTime + item.price;
  }

  calcDepthPercent(qty: number) {
    const max = Math.max(
      ...this.orderBook().bids.map((b) => b.qty),
      ...this.orderBook().asks.map((a) => a.qty),
      1
    );
    return (qty / max) * 100;
  }

  backToPairs() {
    this.router.navigate(['/']);
  }

  private handleDepthUpdate(payload: {
    b?: [string, string][];
    a?: [string, string][];
    u?: number;
  }) {
    const bids: OrderBook['bids'] = (payload.b || []).map(([price, qty]) => ({
      price: Number(price),
      qty: Number(qty),
    }));
    const asks: OrderBook['asks'] = (payload.b || []).map(([price, qty]) => ({
      price: Number(price),
      qty: Number(qty),
    }));
    this.orderBook.set({
      ...this.orderBook(),
      bids,
      asks,
      lastUpdateId: payload.u ?? this.orderBook().lastUpdateId,
    });
  }

  private handleAggTrade(payload: AggTradePayload | { data: AggTradePayload }) {
    const data: AggTradePayload = 'data' in payload ? payload.data : payload;
    const trade: AggTrade = {
      price: data.p,
      qty: data.q,
      maker: data.m,
      tradeTime: data.T,
    };
    const current = this.trades();
    this.trades.set([trade, ...current].slice(0, 50));
  }
}
