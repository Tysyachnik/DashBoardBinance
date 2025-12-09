import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BinanceApi {
  private apiUrl: string = 'https://fapi.binance.com/fapi/v1';

  constructor(private http: HttpClient) {}

  getPairs(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/exchangeInfo`).pipe(map((pair) => pair.symbols));
  }

  getDayStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ticker/24hr`);
  }

  getKLines(symbol: string, interval: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/klines`, {
      params: { symbol, interval, limit: 500 },
    });
  }

  getOrderBook(symbol: string, limit = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/depth`, {
      params: { symbol, limit },
    });
  }
}
