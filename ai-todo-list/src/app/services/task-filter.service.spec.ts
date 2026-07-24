import { TestBed } from '@angular/core/testing';
import { TaskFilterService } from './task-filter.service';

describe('TaskFilterService', () => {
  let service: TaskFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskFilterService);
  });

  it('defaults to "all" filter and "newest" sort order', () => {
    expect(service.filter()).toBe('all');
    expect(service.sortOrder()).toBe('newest');
  });

  it('updates the filter', () => {
    service.setFilter('active');
    expect(service.filter()).toBe('active');

    service.setFilter('completed');
    expect(service.filter()).toBe('completed');
  });

  it('updates the sort order', () => {
    service.setSortOrder('oldest');
    expect(service.sortOrder()).toBe('oldest');
  });
});
