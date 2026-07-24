import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.model';

function createSeedTasks(): Task[] {
  return [
    {
      id: crypto.randomUUID(),
      title: 'Welcome to your to-do list',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'Check off a task to mark it done',
      completed: false,
      createdAt: new Date(),
    },
    {
      id: crypto.randomUUID(),
      title: 'This one is already complete',
      completed: true,
      createdAt: new Date(),
    },
  ];
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly tasksState = signal<Task[]>(createSeedTasks());

  readonly tasks = this.tasksState.asReadonly();

  addTask(title: string): void {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };
    this.tasksState.update((tasks) => [...tasks, task]);
  }

  updateTask(id: string, changes: Partial<Omit<Task, 'id'>>): void {
    this.tasksState.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, ...changes } : task))
    );
  }

  toggleTask(id: string): void {
    this.tasksState.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  }

  removeTask(id: string): void {
    this.tasksState.update((tasks) => tasks.filter((task) => task.id !== id));
  }
}
