import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the task list', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-task-list')).toBeTruthy();
  });

  it('toggles the theme when the theme button is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.app-header__theme-toggle',
    );
    const initialLabel = button.textContent?.trim();
    const initialTheme = document.documentElement.getAttribute('data-theme');

    button.click();
    fixture.detectChanges();

    expect(button.textContent?.trim()).not.toBe(initialLabel);
    expect(document.documentElement.getAttribute('data-theme')).not.toBe(initialTheme);
  });
});
