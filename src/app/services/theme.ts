import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  theme = signal<'light' | 'dark'>(this.loadTheme());

  private loadTheme() {
    return localStorage.getItem('theme') as 'light' | 'dark';
  }

  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(newTheme);
    localStorage.setItem('theme', newTheme);

    document.body.className = newTheme;
  }
}
