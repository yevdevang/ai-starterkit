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

  it('filters the visible tasks via the filter tabs', () => {
    fakeService.seed([
      { id: '1', title: 'Buy milk', completed: false, createdAt: new Date() },
      { id: '2', title: 'Walk the dog', completed: true, createdAt: new Date() },
    ]);
    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();

    const tabs: HTMLButtonElement[] =
      fixture.nativeElement.querySelectorAll('.task-filter-tabs__tab');
    tabs[1].click(); // Active
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-task-item').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.task-item__title').textContent).toContain(
      'Buy milk',
    );

    tabs[2].click(); // Completed
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-task-item').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.task-item__title').textContent).toContain(
      'Walk the dog',
    );
  });

  it('shows a filter-specific empty message when the filter excludes all tasks', () => {
    fakeService.seed([{ id: '1', title: 'Buy milk', completed: false, createdAt: new Date() }]);
    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();

    const tabs: HTMLButtonElement[] =
      fixture.nativeElement.querySelectorAll('.task-filter-tabs__tab');
    tabs[2].click(); // Completed — none match
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.task-list__empty').textContent).toContain(
      'No tasks match this filter.',
    );
  });

  it('shows the remaining active-task count in the footer', () => {
    fakeService.seed([
      { id: '1', title: 'Buy milk', completed: false, createdAt: new Date() },
      { id: '2', title: 'Walk the dog', completed: false, createdAt: new Date() },
      { id: '3', title: 'Done already', completed: true, createdAt: new Date() },
    ]);
    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.task-footer__count').textContent).toContain(
      '2 items left',
    );
  });

  it('clears every completed task in one step without touching active tasks', () => {
    fakeService.seed([
      { id: '1', title: 'Buy milk', completed: false, createdAt: new Date() },
      { id: '2', title: 'Walk the dog', completed: true, createdAt: new Date() },
      { id: '3', title: 'Done already', completed: true, createdAt: new Date() },
    ]);
    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.task-footer__clear').click();
    fixture.detectChanges();

    expect(fakeService.tasks().length).toBe(1);
    expect(fakeService.tasks()[0].title).toBe('Buy milk');
  });

  it('sorts visible tasks by createdAt according to the sort toggle', () => {
    const older = new Date('2026-01-01');
    const newer = new Date('2026-06-01');
    fakeService.seed([
      { id: '1', title: 'Older task', completed: false, createdAt: older },
      { id: '2', title: 'Newer task', completed: false, createdAt: newer },
    ]);
    const fixture = TestBed.createComponent(TaskList);
    fixture.detectChanges();

    let titles = Array.from(fixture.nativeElement.querySelectorAll('.task-item__title')).map((el) =>
      (el as HTMLElement).textContent?.trim(),
    );
    expect(titles).toEqual(['Newer task', 'Older task']);

    fixture.nativeElement.querySelector('.task-filter-tabs__sort').click();
    fixture.detectChanges();

    titles = Array.from(fixture.nativeElement.querySelectorAll('.task-item__title')).map((el) =>
      (el as HTMLElement).textContent?.trim(),
    );
    expect(titles).toEqual(['Older task', 'Newer task']);
  });
});
