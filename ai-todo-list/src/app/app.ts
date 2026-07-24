import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskList } from './features/tasks/task-list/task-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TaskList],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
