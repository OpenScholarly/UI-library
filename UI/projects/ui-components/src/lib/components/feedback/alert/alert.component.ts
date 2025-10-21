import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * An inline notification component for displaying contextual feedback messages.
 * 
 * ## Features
 * - Info, success, warning, and error variants
 * - Dismissible option with close button
 * - Action button support
 * - Custom icon support
 * - ARIA live regions for screen reader announcements
 * - WCAG 2.1 Level AA compliant
 * - Dark mode support
 * 
 * @example
 * ```html
 * <!-- Basic alert -->
 * <ui-alert
 *   variant="warning"
 *   title="Warning"
 *   [dismissible]="true"
 *   (dismissed)="handleDismiss()">
 *   Please review your settings before continuing.
 * </ui-alert>
 * 
 * <!-- Alert with action -->
 * <ui-alert
 *   variant="error"
 *   title="Error"
 *   actionLabel="Retry"
 *   (actionClicked)="handleRetry()">
 *   Failed to save changes. Please try again.
 * </ui-alert>
 * ```
 */
@Component({
  selector: 'ui-alert',
  imports: [CommonModule],
  template: `
    <div
      [class]="alertClasses()"
      role="alert"
      [attr.aria-live]="ariaLive()"
      [attr.aria-atomic]="true">
      
      <!-- Icon -->
      <div class="flex-shrink-0">
        @if (icon()) {
          <span class="text-xl" [attr.aria-hidden]="true">{{ icon() }}</span>
        } @else {
          <span class="text-xl" [attr.aria-hidden]="true">{{ defaultIcon() }}</span>
        }
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        @if (title()) {
          <h3 class="text-sm font-semibold mb-1">{{ title() }}</h3>
        }
        <div class="text-sm">
          <ng-content />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex-shrink-0 flex items-center gap-2">
        @if (actionLabel()) {
          <button
            type="button"
            (click)="onActionClick()"
            [class]="actionButtonClasses()"
            [attr.aria-label]="actionLabel()">
            {{ actionLabel() }}
          </button>
        }
        
        @if (dismissible()) {
          <button
            type="button"
            (click)="onDismiss()"
            [class]="closeButtonClasses()"
            aria-label="Dismiss alert">
            <span class="text-lg">✕</span>
          </button>
        }
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent {
  /**
   * The variant of the alert determining its color and icon.
   * @default "info"
   */
  variant = input<AlertVariant>('info');

  /**
   * Optional title for the alert.
   */
  title = input<string>();

  /**
   * Custom icon to display. If not provided, uses default icon for variant.
   */
  icon = input<string>();

  /**
   * Whether the alert can be dismissed.
   * @default true
   */
  dismissible = input<boolean>(true);

  /**
   * Label for the action button.
   */
  actionLabel = input<string>();

  /**
   * ARIA live region politeness level.
   * @default "polite"
   */
  ariaLive = input<'polite' | 'assertive'>('polite');

  /**
   * Emitted when the alert is dismissed.
   */
  dismissed = output<void>();

  /**
   * Emitted when the action button is clicked.
   */
  actionClicked = output<void>();

  defaultIcon = computed(() => {
    const icons: Record<AlertVariant, string> = {
      info: 'ℹ️',
      success: '✓',
      warning: '⚠️',
      error: '✕'
    };
    return icons[this.variant()];
  });

  alertClasses = computed(() => {
    const base = 'flex items-start gap-3 p-4 rounded-lg border transition-colors';
    const variants: Record<AlertVariant, string> = {
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
      success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
      error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100'
    };
    return `${base} ${variants[this.variant()]}`;
  });

  actionButtonClasses = computed(() => {
    const base = 'px-3 py-1.5 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants: Record<AlertVariant, string> = {
      info: 'text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 focus:ring-blue-500',
      success: 'text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800/50 focus:ring-green-500',
      warning: 'text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800/50 focus:ring-yellow-500',
      error: 'text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50 focus:ring-red-500'
    };
    return `${base} ${variants[this.variant()]}`;
  });

  closeButtonClasses = computed(() => {
    const base = 'p-1 rounded transition-colors hover:bg-black/10 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2';
    const variants: Record<AlertVariant, string> = {
      info: 'text-blue-600 dark:text-blue-400 focus:ring-blue-500',
      success: 'text-green-600 dark:text-green-400 focus:ring-green-500',
      warning: 'text-yellow-600 dark:text-yellow-400 focus:ring-yellow-500',
      error: 'text-red-600 dark:text-red-400 focus:ring-red-500'
    };
    return `${base} ${variants[this.variant()]}`;
  });

  onDismiss(): void {
    this.dismissed.emit();
  }

  onActionClick(): void {
    this.actionClicked.emit();
  }
}
