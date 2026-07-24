import { Component, computed, inject } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import {
  TaskFilterService,
  TaskFilter,
  TaskSortOrder,
} from '../../../services/task-filter.service';
import { TaskItem } from '../task-item/task-item';
import { TaskFilterTabs } from '../task-filter-tabs/task-filter-tabs';
import { TaskFooter } from '../task-footer/task-footer';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem, TaskFilterTabs, TaskFooter],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  private readonly taskService = inject(TaskService);
  private readonly taskFilterService = inject(TaskFilterService);

  protected readonly filter = this.taskFilterService.filter;
  protected readonly sortOrder = this.taskFilterService.sortOrder;

  protected readonly visibleTasks = computed(() => {
    const tasks = this.taskService.tasks();
    const filter = this.taskFilterService.filter();
    const sortOrder = this.taskFilterService.sortOrder();

    const filtered = tasks.filter((task) => {
      if (filter === 'active') {
        return !task.completed;
      }
      if (filter === 'completed') {
        return task.completed;
      }
      return true;
    });

    return [...filtered].sort((a, b) =>
      sortOrder === 'newest'
        ? b.createdAt.getTime() - a.createdAt.getTime()
        : a.createdAt.getTime() - b.createdAt.getTime(),
    );
  });

  protected readonly activeCount = computed(
    () => this.taskService.tasks().filter((task) => !task.completed).length,
  );

  protected readonly emptyMessage = computed(() =>
    this.taskService.tasks().length === 0
      ? 'No tasks yet — add one above to get started.'
      : 'No tasks match this filter.',
  );

  protected onAddSubmit(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const title = input.value.trim();
    if (!title) {
      return;
    }
    this.taskService.addTask(title);
    input.value = '';
  }

  protected toggleTask(id: string): void {
    this.taskService.toggleTask(id);
  }

  protected removeTask(id: string): void {
    this.taskService.removeTask(id);
  }

  protected renameTask(id: string, title: string): void {
    this.taskService.updateTask(id, { title });
  }

  protected setFilter(filter: TaskFilter): void {
    this.taskFilterService.setFilter(filter);
  }

  protected setSortOrder(sortOrder: TaskSortOrder): void {
    this.taskFilterService.setSortOrder(sortOrder);
  }

  protected clearCompleted(): void {
    for (const task of this.taskService.tasks()) {
      if (task.completed) {
        this.taskService.removeTask(task.id);
      }
    }
  }
}
