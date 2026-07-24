import { Injectable, InjectionToken, inject } from '@angular/core';
import { Task } from '../models/task.model';

const STORAGE_KEY = 'ai-todo-list.tasks';

export interface TaskStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const TASK_STORAGE = new InjectionToken<TaskStorage>('TASK_STORAGE', {
  providedIn: 'root',
  factory: () => localStorage,
});

function isValidStoredTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate['id'] === 'string' &&
    typeof candidate['title'] === 'string' &&
    typeof candidate['completed'] === 'boolean' &&
    typeof candidate['createdAt'] === 'string' &&
    !Number.isNaN(Date.parse(candidate['createdAt']))
  );
}

@Injectable({ providedIn: 'root' })
export class TaskStorageService {
  private readonly storage = inject(TASK_STORAGE);

  /** Returns null when storage is empty (no key set), [] when the stored value is corrupted. */
  load(): Task[] | null {
    let raw: string | null;
    try {
      raw = this.storage.getItem(STORAGE_KEY);
    } catch {
      return [];
    }

    if (raw === null) {
      return null;
    }

    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.every(isValidStoredTask)) {
        return [];
      }
      return parsed.map((task) => ({ ...task, createdAt: new Date(task.createdAt) }));
    } catch {
      return [];
    }
  }

  save(tasks: Task[]): void {
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // Storage unavailable or quota exceeded — the in-memory task list still works.
    }
  }
}
