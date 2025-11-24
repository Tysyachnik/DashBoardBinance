import { Component, computed, OnInit, signal } from '@angular/core';
import { BinanceApi } from '../../services/binance-api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pairs-table',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './pairs-table.html',
  styleUrl: './pairs-table.less',
})
export class PairsTable implements OnInit {
  pairs = signal<any[]>([]);
  serchTerm = signal<string>('');
  statsMap = new Map<string, any>();
  filtered = computed(() =>
    !this.serchTerm()
      ? this.pairs()
      : this.pairs().filter((pair) =>
          pair.symbol.toLowerCase().includes(this.serchTerm().toLowerCase())
        )
  );

  constructor(private binanceApi: BinanceApi) {}

  ngOnInit(): void {
    this.loadPairs();
  }

  loadPairs() {
    this.binanceApi.getPairs().subscribe((pairsLoaded) => {
      this.pairs.set(pairsLoaded);
    });

    this.binanceApi.getDayStats().subscribe((statesLoaded) => {
      this.statsMap = new Map(statesLoaded.map((s) => [s.symbol, s]));
    });
  }
}
