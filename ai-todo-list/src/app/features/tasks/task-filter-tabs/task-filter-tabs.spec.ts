import { TestBed } from '@angular/core/testing';
import { TaskFilterTabs } from './task-filter-tabs';

describe('TaskFilterTabs', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TaskFilterTabs] });
  });

  function setup(
    filter: 'all' | 'active' | 'completed' = 'all',
    sortOrder: 'newest' | 'oldest' = 'newest',
  ) {
    const fixture = TestBed.createComponent(TaskFilterTabs);
    fixture.componentRef.setInput('filter', filter);
    fixture.componentRef.setInput('sortOrder', sortOrder);
    fixture.detectChanges();
    return fixture;
  }

  it('renders all three filter tabs', () => {
    const fixture = setup();
    const tabs = fixture.nativeElement.querySelectorAll('.task-filter-tabs__tab');
    expect(tabs.length).toBe(3);
  });

  it('marks the current filter tab as active', () => {
    const fixture = setup('active');
    const activeTab = fixture.nativeElement.querySelector('.task-filter-tabs__tab--active');
    expect(activeTab.textContent.trim()).toBe('Active');
  });

  it('emits filterChange when a tab is clicked', () => {
    const fixture = setup('all');
    const emitted: string[] = [];
    fixture.componentInstance.filterChange.subscribe((filter: string) => emitted.push(filter));

    const tabs: HTMLButtonElement[] =
      fixture.nativeElement.querySelectorAll('.task-filter-tabs__tab');
    tabs[2].click();

    expect(emitted).toEqual(['completed']);
  });

  it('shows the current sort order and emits sortOrderChange when toggled', () => {
    const fixture = setup('all', 'newest');
    const emitted: string[] = [];
    fixture.componentInstance.sortOrderChange.subscribe((sortOrder: string) =>
      emitted.push(sortOrder),
    );

    const sortButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.task-filter-tabs__sort');
    expect(sortButton.textContent).toContain('Newest first');

    sortButton.click();

    expect(emitted).toEqual(['oldest']);
  });
});
