import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BinanceWebSocket implements OnDestroy {
  private webSocket?: WebSocket;

  connect(stream: string): Observable<any> {
    if (this.webSocket) this.webSocket.close();

    this.webSocket = new WebSocket(`wss://fstream.binance.com/ws/${stream}`);

    const subject = new Subject<any>();

    this.webSocket.onmessage = (message) => subject.next(JSON.parse(message.data));
    this.webSocket.onerror = (err) => subject.error(err);
    this.webSocket.onclose = () => subject.complete();

    return subject.asObservable();
  }

  ngOnDestroy(): void {
    this.webSocket?.close();
  }
}
