import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MarketState {
  selectedSymbol = signal<string | null>(null);
  selectedInterval = signal<string>('1m');

  setSymbol(symbol: string) {
    this.selectedSymbol.set(symbol);
  }

  setInterval(interval: string) {
    this.selectedInterval.set(interval);
  }
}
