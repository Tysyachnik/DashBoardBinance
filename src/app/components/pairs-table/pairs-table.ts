import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BinanceApi } from '../../services/binance-api';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FavoritesPairs } from '../../services/favorites-pairs';
import { Theme } from '../../services/theme';
import { Pair } from '../../shared/interfaces/pair';
import { PairStats } from '../../shared/interfaces/pair-stats';

@Component({
  selector: 'app-pairs-table',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './pairs-table.html',
  styleUrl: './pairs-table.less',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PairsTable implements OnInit {
  pairs = signal<Pair[]>([]);
  statsMap = signal<Map<string, any>>(new Map());
  serchTerm = signal<string>('');
  sortColumn = signal<string | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');
  showFavorites = signal<boolean>(false);
  favorites = inject(FavoritesPairs);
  private destroyRef = inject(DestroyRef);

  filteredSoartedPairs = computed(() => {
    const map = this.statsMap();
    const column = this.sortColumn();
    const direction = this.sortDirection();
    const favoritesList = this.favorites.favorites();
    const onlyFavorites = this.showFavorites();

    let result = this.pairs();

    if (onlyFavorites) {
      result = result.filter((pair) => favoritesList.includes(pair.symbol));
    }
    if (this.serchTerm()) {
      const term = this.serchTerm().toLowerCase();
      result = result.filter((pair) => pair.symbol.toLowerCase().includes(term));
    }
    if (!column) return result;

    const dir = direction === 'asc' ? 1 : -1;

    return [...result].sort((a, b) => {
      const statA = map.get(a.symbol);
      const statB = map.get(b.symbol);

      const valA = statA?.[column];
      const valB = statB?.[column];

      if (valA == null && valB == null) return 0;
      if (valA === null) return 1 * dir;
      if (valB === null) return -1 * dir;

      if (typeof valA === 'string' && typeof valB === 'string') {
        return valA.localeCompare(valB) * dir;
      }

      return (valA - valB) * dir;
    });
  });

  constructor(private binanceApi: BinanceApi, private router: Router, protected theme: Theme) {
    document.body.className = this.theme.theme();
  }

  ngOnInit(): void {
    this.loadPairs();
  }

  loadPairs() {
    this.binanceApi
      .getPairs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pairsLoaded) => {
        this.pairs.set(pairsLoaded);
      });

    this.binanceApi
      .getDayStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((statesLoaded) => {
        this.statsMap.set(new Map(statesLoaded.map((s) => [s.symbol, s])));
      });
  }

  sortBy(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  resetSort() {
    this.sortColumn.set(null);
    this.sortDirection.set('asc');
  }

  openDetails(symbol: string) {
    this.router.navigate(['/pair', symbol]);
  }
}
