import { Injectable, InjectionToken, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ai-todo-list.theme';

export interface ThemeStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const THEME_STORAGE = new InjectionToken<ThemeStorage>('THEME_STORAGE', {
  providedIn: 'root',
  factory: () => localStorage,
});

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

function prefersDarkColorScheme(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(THEME_STORAGE);

  private readonly themeState = signal<Theme>(this.resolveInitialTheme());

  readonly theme = this.themeState.asReadonly();

  constructor() {
    this.applyTheme(this.themeState());
  }

  setTheme(theme: Theme): void {
    this.themeState.set(theme);
    this.applyTheme(theme);
    try {
      this.storage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage unavailable — the theme still applies for this session.
    }
  }

  toggleTheme(): void {
    this.setTheme(this.themeState() === 'dark' ? 'light' : 'dark');
  }

  private resolveInitialTheme(): Theme {
    let stored: string | null;
    try {
      stored = this.storage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    return isTheme(stored) ? stored : prefersDarkColorScheme() ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
