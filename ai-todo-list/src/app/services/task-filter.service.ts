import { Injectable, signal } from '@angular/core';

export type TaskFilter = 'all' | 'active' | 'completed';
export type TaskSortOrder = 'newest' | 'oldest';

@Injectable({ providedIn: 'root' })
export class TaskFilterService {
  private readonly filterState = signal<TaskFilter>('all');
  private readonly sortOrderState = signal<TaskSortOrder>('newest');

  readonly filter = this.filterState.asReadonly();
  readonly sortOrder = this.sortOrderState.asReadonly();

  setFilter(filter: TaskFilter): void {
    this.filterState.set(filter);
  }

  setSortOrder(sortOrder: TaskSortOrder): void {
    this.sortOrderState.set(sortOrder);
  }
}
