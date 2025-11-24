import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesPairs {
  private favoritesKey = 'favorites_pairs';

  favorites = signal<string[]>(this.loadFavorites());

  private loadFavorites(): string[] {
    return JSON.parse(localStorage.getItem(this.favoritesKey) || '[]');
  }

  toggleFavorites(symbol: string) {
    const favs = this.favorites();

    if (favs.includes(symbol)) {
      this.favorites.set(favs.filter((s) => s !== symbol));
    } else {
      this.favorites.set([...favs, symbol]);
    }

    localStorage.setItem(this.favoritesKey, JSON.stringify(this.favorites()));
  }

  isFavorite(symbol: string) {
    return this.favorites().includes(symbol);
  }
}
