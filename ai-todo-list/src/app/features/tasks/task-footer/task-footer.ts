import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-task-footer',
  imports: [],
  templateUrl: './task-footer.html',
  styleUrl: './task-footer.css',
})
export class TaskFooter {
  readonly activeCount = input.required<number>();

  readonly clearCompleted = output<void>();
}
