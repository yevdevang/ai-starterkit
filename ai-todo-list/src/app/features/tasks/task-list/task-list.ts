import { Component, inject } from '@angular/core';
import { TaskService } from '../../../services/task.service';
import { TaskItem } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  private readonly taskService = inject(TaskService);

  protected readonly tasks = this.taskService.tasks;

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
}
