import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  effect,
  inject,
  DestroyRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ActionSheetAction {
  id: string;
  label: string;
  icon?: string;
  destructive?: boolean;
  disabled?: boolean;
}

/**
 * An iOS-style action sheet for presenting a list of actions.
 *
 * ## Features
 * - List of actions
 * - Destructive action styling (red)
 * - Cancel button
 * - Slide-up animation
 * - Backdrop support
 * - Touch-friendly 48x48px minimum targets
 * - Keyboard dismissal
 * - ARIA modal semantics
 * - WCAG 2.1 Level AA compliant
 * - Dark mode support
 *
 * @example
 * ```html
 * <!-- Basic action sheet -->
 * <ui-action-sheet
 *   [open]="isOpen"
 *   title="Choose an action"
 *   [actions]="actions"
 *   (actionClick)="onActionClick($event)"
 *   (cancel)="onCancel()">
 * </ui-action-sheet>
 *
 * <!-- With destructive action -->
 * <ui-action-sheet
 *   [open]="isOpen"
 *   [actions]="[
 *     { id: 'edit', label: 'Edit', icon: '✏️' },
 *     { id: 'delete', label: 'Delete', icon: '🗑️', destructive: true }
 *   ]"
 *   (actionClick)="handleAction($event)">
 * </ui-action-sheet>
 *
 * <!-- With message -->
 * <ui-action-sheet
 *   [open]="isOpen"
 *   title="Delete Item"
 *   message="This action cannot be undone. Are you sure?"
 *   [actions]="deleteActions"
 *   (actionClick)="onAction($event)">
 * </ui-action-sheet>
 * ```
 */
@Component({
  selector: 'ui-action-sheet',
  imports: [CommonModule],
  template: `
    @if (open()) {
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-out z-40"
        [attr.aria-hidden]="true"
        (click)="onBackdropClick()">
      </div>

      <!-- Action Sheet -->
      <div
        class="fixed bottom-0 left-0 right-0 z-50 animate-slide-up"
        role="dialog"
        [attr.aria-modal]="'true'"
        [attr.aria-labelledby]="titleId">
        
        <!-- Actions Container -->
        <div class="bg-white dark:bg-gray-800 rounded-t-2xl mx-2 mb-2 overflow-hidden shadow-2xl">
          <!-- Title and Message -->
          @if (title() || message()) {
            <div class="px-6 py-4 text-center border-b border-gray-200 dark:border-gray-700">
              @if (title()) {
                <h2
                  [id]="titleId"
                  class="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {{ title() }}
                </h2>
              }
              @if (message()) {
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ message() }}
                </p>
              }
            </div>
          }

          <!-- Action Buttons -->
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            @for (action of actions(); track action.id) {
              <button
                type="button"
                [class]="getActionClasses(action)"
                [disabled]="action.disabled"
                (click)="onActionClick(action)"
                [attr.aria-label]="action.label">
                @if (action.icon) {
                  <span class="text-xl mr-2">{{ action.icon }}</span>
                }
                <span>{{ action.label }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Cancel Button -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl mx-2 mb-4 overflow-hidden shadow-xl">
          <button
            type="button"
            class="w-full min-h-[48px] px-6 py-3 text-base font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            (click)="onCancelClick()"
            [attr.aria-label]="cancelLabel()">
            {{ cancelLabel() }}
          </button>
        </div>
      </div>
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    @keyframes slide-up {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .animate-slide-up {
      animation: slide-up 300ms ease-out;
    }
  `],
})
export class ActionSheetComponent {
  /**
   * Whether the action sheet is open.
   */
  open = input<boolean>(false);

  /**
   * Title text for the action sheet.
   */
  title = input<string>('');

  /**
   * Message/description text.
   */
  message = input<string>('');

  /**
   * List of actions to display.
   */
  actions = input.required<ActionSheetAction[]>();

  /**
   * Label for the cancel button.
   * @default "Cancel"
   */
  cancelLabel = input<string>('Cancel');

  /**
   * Whether clicking the backdrop closes the sheet.
   * @default true
   */
  closeOnBackdrop = input<boolean>(true);

  /**
   * Whether pressing Escape closes the sheet.
   * @default true
   */
  closeOnEscape = input<boolean>(true);

  /**
   * Emitted when an action is clicked.
   */
  actionClick = output<ActionSheetAction>();

  /**
   * Emitted when the cancel button is clicked.
   */
  cancel = output<void>();

  private destroyRef = inject(DestroyRef);

  readonly titleId = `action-sheet-title-${Math.random().toString(36).substr(2, 9)}`;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.setupDismissHandlers();
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  getActionClasses(action: ActionSheetAction): string {
    const base =
      'w-full min-h-[48px] px-6 py-3 text-base font-medium flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-inset';

    if (action.disabled) {
      return `${base} text-gray-400 dark:text-gray-600 cursor-not-allowed`;
    }

    if (action.destructive) {
      return `${base} text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500`;
    }

    return `${base} text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-blue-500`;
  }

  onActionClick(action: ActionSheetAction): void {
    if (action.disabled) return;
    this.actionClick.emit(action);
  }

  onCancelClick(): void {
    this.cancel.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.cancel.emit();
    }
  }

  private setupDismissHandlers(): void {
    if (this.closeOnEscape()) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          this.cancel.emit();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      this.destroyRef.onDestroy(() => document.removeEventListener('keydown', handleKeyDown));
    }
  }
}
