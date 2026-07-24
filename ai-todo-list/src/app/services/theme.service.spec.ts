import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE, ThemeService, ThemeStorage } from './theme.service';

const KEY = 'ai-todo-list.theme';

class FakeStorage implements ThemeStorage {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

describe('ThemeService', () => {
  let fakeStorage: FakeStorage;

  function createService(): ThemeService {
    TestBed.configureTestingModule({
      providers: [{ provide: THEME_STORAGE, useValue: fakeStorage }],
    });
    return TestBed.inject(ThemeService);
  }

  beforeEach(() => {
    fakeStorage = new FakeStorage();
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('uses the persisted theme when one is stored', () => {
    fakeStorage.setItem(KEY, 'dark');
    const service = createService();
    expect(service.theme()).toBe('dark');
  });

  it('falls back to a light theme when nothing is stored and the system has no preference', () => {
    const service = createService();
    expect(service.theme()).toBe('light');
  });

  it('applies the initial theme to the document element', () => {
    fakeStorage.setItem(KEY, 'dark');
    createService();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('setTheme updates the signal, persists, and updates the document element', () => {
    const service = createService();

    service.setTheme('dark');

    expect(service.theme()).toBe('dark');
    expect(fakeStorage.getItem(KEY)).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('toggleTheme flips between light and dark', () => {
    const service = createService();
    expect(service.theme()).toBe('light');

    service.toggleTheme();
    expect(service.theme()).toBe('dark');

    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });

  it('falls back to the default theme when reading storage throws', () => {
    vi.spyOn(fakeStorage, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    expect(() => createService()).not.toThrow();
  });

  it('does not throw when writing to storage throws', () => {
    const service = createService();
    vi.spyOn(fakeStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    expect(() => service.setTheme('dark')).not.toThrow();
    expect(service.theme()).toBe('dark');
  });
});
