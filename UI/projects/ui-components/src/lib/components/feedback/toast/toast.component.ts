import { Component, ChangeDetectionStrategy, input, output, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastVariant, ToastPosition, ToastData } from '../../../types';

@Component({
  selector: 'ui-toast',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ui-toast block',
    '[class]': 'toastClasses()',
    '[attr.data-variant]': 'variant()',
    '[attr.role]': '"alert"',
    '[attr.aria-live]': '"assertive"',
    '[attr.aria-atomic]': '"true"'
  },
  template: `
    <div class="ui-toast__container flex items-start space-x-3 p-4 rounded-lg shadow-lg border" [class]="getContainerClasses()">
      <!-- Icon -->
      <div class="ui-toast__icon flex-shrink-0" [class]="getIconClasses()">
        @switch (variant()) {
          @case ('success') {
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          }
          @case ('warning') {
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          }
          @case ('danger') {
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          }
          @case ('info') {
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          }
          @default {
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          }
        }
      </div>

      <!-- Content -->
      <div class="ui-toast__content flex-1 min-w-0">
        @if (title()) {
          <p class="ui-toast__title font-medium text-gray-900 dark:text-white">
            {{ title() }}
          </p>
        }
        <p class="ui-toast__message text-sm" [class]="getMessageClasses()">
          {{ message() }}
        </p>

        <!-- Action -->
        @if (action()) {
          <div class="ui-toast__action mt-2">
            <button
              type="button"
              class="text-sm font-medium underline transition-colors duration-200"
              [class]="getActionClasses()"
              (click)="onActionClick()">
              {{ action()?.label }}
            </button>
          </div>
        }
      </div>

      <!-- Dismiss Button -->
      @if (!persistent()) {
        <div class="ui-toast__dismiss flex-shrink-0">
          <button
            type="button"
            class="inline-flex rounded-md p-1.5 transition-colors duration-200"
            [class]="getDismissClasses()"
            [attr.aria-label]="'Dismiss notification'"
            (click)="onDismiss()">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      }

      <!-- Progress Bar -->
      @if (!persistent() && showProgress()) {
        <div class="ui-toast__progress absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10">
          <div
            class="ui-toast__progress-bar h-full transition-all duration-100 ease-linear"
            [class]="getProgressBarClasses()"
            [style.width.%]="progressPercentage()">
          </div>
        </div>
      }
    </div>
  `
})
export class ToastComponent implements OnInit, OnDestroy {
  // Inputs
  title = input<string>('');
  message = input.required<string>();
  variant = input<ToastVariant>('default');
  duration = input<number>(5000);
  persistent = input<boolean>(false);
  showProgress = input<boolean>(false);
  action = input<{ label: string; handler: () => void } | null>(null);

  // Outputs
  dismiss = output<void>();
  actionClick = output<void>();

  // State
  private timeoutId: number | null = null;
  private startTime: number = 0;
  private progressInterval: number | null = null;
  progressPercentage = signal<number>(100);

  // Computed properties
  toastClasses = computed(() => {
    const classes = [
      'ui-toast',
      'relative',
      'max-w-sm',
      'w-full',
      'transform',
      'transition-all',
      'duration-300',
      'ease-in-out'
    ];

    return classes.join(' ');
  });

  ngOnInit(): void {
    if (!this.persistent() && this.duration() > 0) {
      this.startDismissTimer();
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  // Methods
  onDismiss(): void {
    this.clearTimers();
    this.dismiss.emit();
  }

  onActionClick(): void {
    const actionHandler = this.action();
    if (actionHandler) {
      actionHandler.handler();
      this.actionClick.emit();
    }
  }

  private startDismissTimer(): void {
    this.startTime = Date.now();

    if (this.showProgress()) {
      this.startProgressTimer();
    }

    this.timeoutId = window.setTimeout(() => {
      this.onDismiss();
    }, this.duration());
  }

  private startProgressTimer(): void {
    const duration = this.duration();

    this.progressInterval = window.setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      const percentage = Math.max(0, 100 - (elapsed / duration) * 100);
      this.progressPercentage.set(percentage);

      if (percentage <= 0) {
        this.clearProgressTimer();
      }
    }, 100);
  }

  private clearTimers(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.clearProgressTimer();
  }

  private clearProgressTimer(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  getContainerClasses(): string {
    const classes: string[] = [];

    switch (this.variant()) {
      case 'success':
        classes.push(
          'bg-green-50',
          'dark:bg-green-900/20',
          'border-green-200',
          'dark:border-green-800'
        );
        break;
      case 'warning':
        classes.push(
          'bg-yellow-50',
          'dark:bg-yellow-900/20',
          'border-yellow-200',
          'dark:border-yellow-800'
        );
        break;
      case 'danger':
        classes.push(
          'bg-red-50',
          'dark:bg-red-900/20',
          'border-red-200',
          'dark:border-red-800'
        );
        break;
      case 'info':
        classes.push(
          'bg-blue-50',
          'dark:bg-blue-900/20',
          'border-blue-200',
          'dark:border-blue-800'
        );
        break;
      default:
        classes.push(
          'bg-white',
          'dark:bg-gray-800',
          'border-gray-200',
          'dark:border-gray-700'
        );
    }

    return classes.join(' ');
  }

  getIconClasses(): string {
    const classes: string[] = [];

    switch (this.variant()) {
      case 'success':
        classes.push('text-green-400', 'dark:text-green-300');
        break;
      case 'warning':
        classes.push('text-yellow-400', 'dark:text-yellow-300');
        break;
      case 'danger':
        classes.push('text-red-400', 'dark:text-red-300');
        break;
      case 'info':
        classes.push('text-blue-400', 'dark:text-blue-300');
        break;
      default:
        classes.push('text-gray-400', 'dark:text-gray-300');
    }

    return classes.join(' ');
  }

  getMessageClasses(): string {
    const classes = ['text-gray-500', 'dark:text-gray-400'];

    if (!this.title()) {
      classes.push('text-gray-900', 'dark:text-white');
    }

    return classes.join(' ');
  }

  getActionClasses(): string {
    const classes: string[] = [];

    switch (this.variant()) {
      case 'success':
        classes.push('text-green-600', 'dark:text-green-400', 'hover:text-green-500');
        break;
      case 'warning':
        classes.push('text-yellow-600', 'dark:text-yellow-400', 'hover:text-yellow-500');
        break;
      case 'danger':
        classes.push('text-red-600', 'dark:text-red-400', 'hover:text-red-500');
        break;
      case 'info':
        classes.push('text-blue-600', 'dark:text-blue-400', 'hover:text-blue-500');
        break;
      default:
        classes.push('text-gray-600', 'dark:text-gray-400', 'hover:text-gray-500');
    }

    return classes.join(' ');
  }

  getDismissClasses(): string {
    const classes: string[] = [];

    switch (this.variant()) {
      case 'success':
        classes.push(
          'text-green-400',
          'hover:bg-green-100',
          'hover:text-green-500',
          'dark:text-green-300',
          'dark:hover:bg-green-900/30',
          'dark:hover:text-green-200'
        );
        break;
      case 'warning':
        classes.push(
          'text-yellow-400',
          'hover:bg-yellow-100',
          'hover:text-yellow-500',
          'dark:text-yellow-300',
          'dark:hover:bg-yellow-900/30',
          'dark:hover:text-yellow-200'
        );
        break;
      case 'danger':
        classes.push(
          'text-red-400',
          'hover:bg-red-100',
          'hover:text-red-500',
          'dark:text-red-300',
          'dark:hover:bg-red-900/30',
          'dark:hover:text-red-200'
        );
        break;
      case 'info':
        classes.push(
          'text-blue-400',
          'hover:bg-blue-100',
          'hover:text-blue-500',
          'dark:text-blue-300',
          'dark:hover:bg-blue-900/30',
          'dark:hover:text-blue-200'
        );
        break;
      default:
        classes.push(
          'text-gray-400',
          'hover:bg-gray-100',
          'hover:text-gray-500',
          'dark:text-gray-300',
          'dark:hover:bg-gray-700',
          'dark:hover:text-gray-200'
        );
    }

    return classes.join(' ');
  }

  getProgressBarClasses(): string {
    const classes: string[] = [];

    switch (this.variant()) {
      case 'success':
        classes.push('bg-green-400', 'dark:bg-green-300');
        break;
      case 'warning':
        classes.push('bg-yellow-400', 'dark:bg-yellow-300');
        break;
      case 'danger':
        classes.push('bg-red-400', 'dark:bg-red-300');
        break;
      case 'info':
        classes.push('bg-blue-400', 'dark:bg-blue-300');
        break;
      default:
        classes.push('bg-gray-400', 'dark:bg-gray-300');
    }

    return classes.join(' ');
  }
}
