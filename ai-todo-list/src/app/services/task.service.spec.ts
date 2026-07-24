import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
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
});
