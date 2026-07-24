import { Component, ElementRef, effect, input, output, signal, viewChild } from '@angular/core';
import { Task } from '../../../models/task.model';

/** Matches the CSS remove-transition duration in task-item.css. */
const REMOVE_ANIMATION_MS = 180;

@Component({
  selector: 'app-task-item',
  imports: [],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {
  readonly task = input.required<Task>();

  readonly toggle = output<void>();
  readonly remove = output<void>();
  readonly rename = output<string>();

  protected readonly editing = signal(false);
  protected readonly draftTitle = signal('');
  protected readonly removing = signal(false);

  private readonly editInput = viewChild<ElementRef<HTMLInputElement>>('editInput');

  constructor() {
    effect(() => {
      if (this.editing()) {
        const input = this.editInput()?.nativeElement;
        input?.focus();
        input?.select();
      }
    });
  }

  protected startEdit(): void {
    this.draftTitle.set(this.task().title);
    this.editing.set(true);
  }

  protected saveEdit(): void {
    if (!this.editing()) {
      return;
    }
    this.editing.set(false);
    const title = this.draftTitle().trim();
    if (title && title !== this.task().title) {
      this.rename.emit(title);
    }
  }

  protected cancelEdit(): void {
    this.editing.set(false);
  }

  protected startRemove(): void {
    if (this.removing()) {
      return;
    }
    this.removing.set(true);
    setTimeout(() => this.remove.emit(), REMOVE_ANIMATION_MS);
  }
}
