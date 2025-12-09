import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Theme {
  theme = signal<'light' | 'dark'>(this.loadTheme());

  private loadTheme() {
    return (localStorage.getItem('theme') as 'light' | 'dark') ?? 'dark';
  }

  toggleTheme() {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(newTheme);
    localStorage.setItem('theme', newTheme);

    document.body.className = newTheme;

    window.dispatchEvent(new Event('theme-change'));
  }
}
