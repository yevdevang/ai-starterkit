import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TaskList } from './task-list';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

class FakeTaskService {
  private readonly state = signal<Task[]>([]);
  readonly tasks = this.state.asReadonly();

  seed(tasks: Task[]): void {
    this.state.set(tasks);
  }

  addTask(title: string): void {
    this.state.update((tasks) => [
      ...tasks,
      { id: String(tasks.length + 1), title, completed: false, createdAt: new Date() },
    ]);
  }

  toggleTask(id: string): void {
    this.state.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }

  removeTask(id: string): void {
    this.state.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  updateTask(id: string, changes: Partial<Task>): void {
    this.state.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, ...changes } : task)),
    );
  }
}

describe('TaskList', () => {
  let fakeService: FakeTaskService;

  beforeEach(() => {
    fakeService = new FakeTaskService();
    TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [{ provide: TaskService, useValue: fakeService }],
    });
  });

  it('shows the empty state when there are no tasks', () => {
    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.task-list__empty')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('app-task-item').length).toBe(0);
  });

  it('renders one app-task-item per task and hides the empty state', () => {
    fakeService.seed([
      { id: '1', title: 'Buy milk', completed: false, createdAt: new Date() },
      { id: '2', title: 'Walk the dog', completed: true, createdAt: new Date() },
    ]);
    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-task-item').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.task-list__empty')).toBeNull();
  });

  it('adds a task on form submit and clears the input', () => {
    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('.task-list__add-input');
    const form: HTMLFormElement = fixture.nativeElement.querySelector('.task-list__add');
    input.value = '  New task  ';
    input.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();

    expect(fakeService.tasks().length).toBe(1);
    expect(fakeService.tasks()[0].title).toBe('New task');
    expect(input.value).toBe('');
  });

  it('does not add a task when the input is blank', () => {
    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();

    const form: HTMLFormElement = fixture.nativeElement.querySelector('.task-list__add');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    fixture.detectChanges();

    expect(fakeService.tasks().length).toBe(0);
  });

  it('forwards toggle/remove/rename events from a task-item to the service', () => {
    fakeService.seed([{ id: '1', title: 'Buy milk', completed: false, createdAt: new Date() }]);
    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();

    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector('.task-item__checkbox');
    checkbox.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(fakeService.tasks()[0].completed).toBe(true);

    const title: HTMLElement = fixture.nativeElement.querySelector('.task-item__title');
    title.dispatchEvent(new Event('dblclick'));
    fixture.detectChanges();
    const editInput: HTMLInputElement =
      fixture.nativeElement.querySelector('.task-item__edit-input');
    editInput.value = 'Buy oat milk';
    editInput.dispatchEvent(new Event('input'));
    editInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();
    expect(fakeService.tasks()[0].title).toBe('Buy oat milk');

    const deleteButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.task-item__delete');
    deleteButton.click();
    fixture.detectChanges();
    expect(fakeService.tasks().length).toBe(0);
  });
});
