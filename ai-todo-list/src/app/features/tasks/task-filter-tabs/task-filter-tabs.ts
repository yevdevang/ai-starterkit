import { Component, input, output } from '@angular/core';
import { TaskFilter, TaskSortOrder } from '../../../services/task-filter.service';

@Component({
  selector: 'app-task-filter-tabs',
  imports: [],
  templateUrl: './task-filter-tabs.html',
  styleUrl: './task-filter-tabs.css',
})
export class TaskFilterTabs {
  readonly filter = input.required<TaskFilter>();
  readonly sortOrder = input.required<TaskSortOrder>();

  readonly filterChange = output<TaskFilter>();
  readonly sortOrderChange = output<TaskSortOrder>();

  protected toggleSortOrder(): void {
    this.sortOrderChange.emit(this.sortOrder() === 'newest' ? 'oldest' : 'newest');
  }
}
