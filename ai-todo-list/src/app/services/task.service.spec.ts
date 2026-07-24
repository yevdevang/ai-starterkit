import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { TASK_STORAGE, TaskStorage } from './task-storage.service';
import { Task } from '../models/task.model';

class FakeStorage implements TaskStorage {
  private readonly store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

describe('TaskService', () => {
  let service: TaskService;
  let fakeStorage: FakeStorage;

  beforeEach(() => {
    fakeStorage = new FakeStorage();
    TestBed.configureTestingModule({
      providers: [{ provide: TASK_STORAGE, useValue: fakeStorage }],
    });
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('seeds a handful of example tasks', () => {
    expect(service.tasks().length).toBeGreaterThan(0);
  });

  it('adds a new task', () => {
    const initialCount = service.tasks().length;
    service.addTask('Buy milk');
    const tasks = service.tasks();
    expect(tasks.length).toBe(initialCount + 1);
    expect(tasks[tasks.length - 1].title).toBe('Buy milk');
    expect(tasks[tasks.length - 1].completed).toBe(false);
  });

  it('updates an existing task', () => {
    service.addTask('Original title');
    const tasks = service.tasks();
    const target = tasks[tasks.length - 1];
    service.updateTask(target.id, { title: 'Updated title' });
    const updated = service.tasks().find((task) => task.id === target.id);
    expect(updated?.title).toBe('Updated title');
  });

  it('toggles a task completed state', () => {
    service.addTask('Toggle me');
    const tasks = service.tasks();
    const target = tasks[tasks.length - 1];
    expect(target.completed).toBe(false);

    service.toggleTask(target.id);
    expect(service.tasks().find((task) => task.id === target.id)?.completed).toBe(true);

    service.toggleTask(target.id);
    expect(service.tasks().find((task) => task.id === target.id)?.completed).toBe(false);
  });

  it('removes a task', () => {
    service.addTask('Remove me');
    const tasks = service.tasks();
    const target = tasks[tasks.length - 1];
    const countBefore = service.tasks().length;

    service.removeTask(target.id);

    expect(service.tasks().length).toBe(countBefore - 1);
    expect(service.tasks().find((task) => task.id === target.id)).toBeUndefined();
  });

  it('does nothing when updating/removing a non-existent id', () => {
    const before = service.tasks();
    service.updateTask('non-existent-id', { title: 'nope' });
    service.removeTask('non-existent-id');
    expect(service.tasks()).toEqual(before);
  });

  it('persists every mutation to storage', () => {
    service.addTask('Persisted task');
    const stored = JSON.parse(fakeStorage.getItem('ai-todo-list.tasks')!);
    expect(stored.some((task: { title: string }) => task.title === 'Persisted task')).toBe(true);
  });

  it('loads persisted tasks instead of the seed data when storage already has tasks', () => {
    const persisted: Task[] = [
      { id: 'p1', title: 'From storage', completed: false, createdAt: new Date('2026-02-01') },
    ];
    fakeStorage.setItem('ai-todo-list.tasks', JSON.stringify(persisted));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: TASK_STORAGE, useValue: fakeStorage }],
    });
    const restarted = TestBed.inject(TaskService);

    expect(restarted.tasks().length).toBe(1);
    expect(restarted.tasks()[0].title).toBe('From storage');
  });

  it('falls back to an empty list, not the seed data, when storage is corrupted', () => {
    fakeStorage.setItem('ai-todo-list.tasks', 'not valid json{{{');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: TASK_STORAGE, useValue: fakeStorage }],
    });
    const restarted = TestBed.inject(TaskService);

    expect(restarted.tasks()).toEqual([]);
  });
});
