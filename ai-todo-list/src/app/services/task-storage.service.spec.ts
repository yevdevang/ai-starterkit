import { TestBed } from '@angular/core/testing';
import { TASK_STORAGE, TaskStorage, TaskStorageService } from './task-storage.service';
import { Task } from '../models/task.model';

const KEY = 'ai-todo-list.tasks';

class FakeStorage implements TaskStorage {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

describe('TaskStorageService', () => {
  let service: TaskStorageService;
  let fakeStorage: FakeStorage;

  beforeEach(() => {
    fakeStorage = new FakeStorage();
    TestBed.configureTestingModule({
      providers: [{ provide: TASK_STORAGE, useValue: fakeStorage }],
    });
    service = TestBed.inject(TaskStorageService);
  });

  it('returns null when nothing is stored', () => {
    expect(service.load()).toBeNull();
  });

  it('saves and reloads tasks, reviving createdAt as a Date', () => {
    const tasks: Task[] = [
      { id: '1', title: 'Buy milk', completed: false, createdAt: new Date('2026-01-01') },
    ];

    service.save(tasks);
    const loaded = service.load();

    expect(loaded).not.toBeNull();
    expect(loaded?.[0].title).toBe('Buy milk');
    expect(loaded?.[0].createdAt).toBeInstanceOf(Date);
    expect(loaded?.[0].createdAt.getTime()).toBe(tasks[0].createdAt.getTime());
  });

  it('falls back to an empty list when the stored value is not valid JSON', () => {
    fakeStorage.setItem(KEY, 'not valid json{{{');
    expect(service.load()).toEqual([]);
  });

  it('falls back to an empty list when the stored value is not an array', () => {
    fakeStorage.setItem(KEY, JSON.stringify({ not: 'an array' }));
    expect(service.load()).toEqual([]);
  });

  it('falls back to an empty list when a stored task is missing required fields', () => {
    fakeStorage.setItem(KEY, JSON.stringify([{ id: '1', title: 'Missing completed/createdAt' }]));
    expect(service.load()).toEqual([]);
  });

  it('falls back to an empty list when reading throws', () => {
    vi.spyOn(fakeStorage, 'getItem').mockImplementation(() => {
      throw new Error('storage unavailable');
    });

    expect(service.load()).toEqual([]);
  });

  it('does not throw when writing throws', () => {
    vi.spyOn(fakeStorage, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });

    expect(() => service.save([])).not.toThrow();
  });
});
