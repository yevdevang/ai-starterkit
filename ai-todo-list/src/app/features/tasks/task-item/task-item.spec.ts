import { TestBed } from '@angular/core/testing';
import { TaskItem } from './task-item';
import { Task } from '../../../models/task.model';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    title: 'Buy milk',
    completed: false,
    createdAt: new Date(),
    ...overrides,
  };
}

describe('TaskItem', () => {
  function setup(task: Task = makeTask()) {
    const fixture = TestBed.createComponent(TaskItem);
    fixture.componentRef.setInput('task', task);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TaskItem] });
  });

  it('renders the task title', () => {
    const fixture = setup();
    const title = fixture.nativeElement.querySelector('.task-item__title');
    expect(title.textContent).toContain('Buy milk');
  });

  it('emits toggle when the checkbox changes', () => {
    const fixture = setup();
    const emitted: void[] = [];
    fixture.componentInstance.toggle.subscribe(() => emitted.push(undefined));

    const checkbox: HTMLInputElement = fixture.nativeElement.querySelector(
      '.task-item__checkbox-input',
    );
    checkbox.dispatchEvent(new Event('change'));

    expect(emitted.length).toBe(1);
  });

  it('emits remove after the delete button is clicked and the remove animation finishes', () => {
    vi.useFakeTimers();
    const fixture = setup();
    const emitted: void[] = [];
    fixture.componentInstance.remove.subscribe(() => emitted.push(undefined));

    const deleteButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.task-item__delete');
    deleteButton.click();
    fixture.detectChanges();

    expect(emitted.length).toBe(0);
    expect(fixture.nativeElement.querySelector('.task-item').classList).toContain(
      'task-item--removing',
    );

    vi.runAllTimers();

    expect(emitted.length).toBe(1);
    vi.useRealTimers();
  });

  it('enters edit mode on double-click and shows the current title in an input', () => {
    const fixture = setup(makeTask({ title: 'Walk the dog' }));
    const title: HTMLElement = fixture.nativeElement.querySelector('.task-item__title');
    title.dispatchEvent(new Event('dblclick'));
    fixture.detectChanges();

    const editInput: HTMLInputElement =
      fixture.nativeElement.querySelector('.task-item__edit-input');
    expect(editInput.value).toBe('Walk the dog');
  });

  it('saves the trimmed title on Enter', () => {
    const fixture = setup(makeTask({ title: 'Old title' }));
    const renamed: string[] = [];
    fixture.componentInstance.rename.subscribe((title) => renamed.push(title));

    fixture.nativeElement.querySelector('.task-item__title').dispatchEvent(new Event('dblclick'));
    fixture.detectChanges();

    const editInput: HTMLInputElement =
      fixture.nativeElement.querySelector('.task-item__edit-input');
    editInput.value = '  New title  ';
    editInput.dispatchEvent(new Event('input'));
    editInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(renamed).toEqual(['New title']);
    expect(fixture.nativeElement.querySelector('.task-item__edit-input')).toBeNull();
  });

  it('cancels editing on Escape without emitting rename', () => {
    const fixture = setup(makeTask({ title: 'Old title' }));
    const renamed: string[] = [];
    fixture.componentInstance.rename.subscribe((title) => renamed.push(title));

    fixture.nativeElement.querySelector('.task-item__title').dispatchEvent(new Event('dblclick'));
    fixture.detectChanges();

    const editInput: HTMLInputElement =
      fixture.nativeElement.querySelector('.task-item__edit-input');
    editInput.value = 'Discarded edit';
    editInput.dispatchEvent(new Event('input'));
    editInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(renamed).toEqual([]);
    expect(fixture.nativeElement.querySelector('.task-item__title').textContent).toContain(
      'Old title',
    );
  });

  it('does not emit rename when the title is unchanged or blank', () => {
    const fixture = setup(makeTask({ title: 'Same title' }));
    const renamed: string[] = [];
    fixture.componentInstance.rename.subscribe((title) => renamed.push(title));

    fixture.nativeElement.querySelector('.task-item__title').dispatchEvent(new Event('dblclick'));
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.task-item__edit-input').dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(renamed).toEqual([]);
  });
});
