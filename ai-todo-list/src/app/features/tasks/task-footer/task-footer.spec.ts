import { TestBed } from '@angular/core/testing';
import { TaskFooter } from './task-footer';

describe('TaskFooter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TaskFooter] });
  });

  function setup(activeCount: number) {
    const fixture = TestBed.createComponent(TaskFooter);
    fixture.componentRef.setInput('activeCount', activeCount);
    fixture.detectChanges();
    return fixture;
  }

  it('shows a pluralized count', () => {
    const fixture = setup(3);
    expect(fixture.nativeElement.querySelector('.task-footer__count').textContent).toContain(
      '3 items left',
    );
  });

  it('shows a singular count for one remaining task', () => {
    const fixture = setup(1);
    expect(fixture.nativeElement.querySelector('.task-footer__count').textContent).toContain(
      '1 item left',
    );
  });

  it('emits clearCompleted when the button is clicked', () => {
    const fixture = setup(2);
    const emitted: void[] = [];
    fixture.componentInstance.clearCompleted.subscribe(() => emitted.push(undefined));

    fixture.nativeElement.querySelector('.task-footer__clear').click();

    expect(emitted.length).toBe(1);
  });
});
