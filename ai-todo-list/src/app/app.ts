import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskList } from './features/tasks/task-list/task-list';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly themeService = inject(ThemeService);

  protected readonly theme = this.themeService.theme;

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
