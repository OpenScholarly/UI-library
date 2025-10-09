import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { BadgeVariant, BadgeSize, BadgeShape } from '../../../types';

/**
 * A versatile and accessible badge component for labels and status indicators.
 *
 * ## Features
 * - Multiple visual variants (default, primary, secondary, success, warning, danger, info, outline)
 * - Comprehensive size options (xs, small, medium, large)
 * - Shape options (rounded, pill, square)
 * - Optional status dot indicator
 * - Dismissible badges with close button
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 * - Smooth hover and transition effects
 *
 * @example
 * ```html
 * <!-- Basic badge -->
 * <ui-badge>New</ui-badge>
 *
 * <!-- Badge with variant -->
 * <ui-badge variant="success">Active</ui-badge>
 * <ui-badge variant="danger">Error</ui-badge>
 * <ui-badge variant="warning">Warning</ui-badge>
 *
 * <!-- Badge with status dot -->
 * <ui-badge variant="success" [dot]="true">Online</ui-badge>
 *
 * <!-- Pill-shaped badge -->
 * <ui-badge shape="pill" variant="primary">Beta</ui-badge>
 *
 * <!-- Dismissible badge -->
 * <ui-badge
 *   variant="info"
 *   [dismissible]="true"
 *   (dismissed)="onBadgeDismissed()">
 *   Notification
 * </ui-badge>
 *
 * <!-- Different sizes -->
 * <ui-badge size="xs" variant="danger">99+</ui-badge>
 * <ui-badge size="sm">Small</ui-badge>
 * <ui-badge size="md">Medium</ui-badge>
 * <ui-badge size="lg">Large</ui-badge>
 *
 * <!-- Outline badge -->
 * <ui-badge variant="outline">Outlined</ui-badge>
 *
 * <!-- With ARIA label for accessibility -->
 * <ui-badge ariaLabel="3 new messages">3</ui-badge>
 * ```
 */
@Component({
  selector: 'ui-badge',
  standalone: true,
  template: `
    <span [class]="badgeClasses()" [attr.aria-label]="ariaLabel()">
      @if (dot()) {
        <span class="badge-dot" [class]="dotClasses()"></span>
      }
      <ng-content />
      @if (dismissible()) {
        <button
          type="button"
          class="badge-dismiss ml-1 hover:bg-black/10 rounded-full p-0.5 ui-transition-fast ui-focus-primary"
          (click)="onDismiss()"
          aria-label="Remove badge">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  /**
   * Visual style variant of the badge.
   * - `default`: Gray badge (default)
   * - `primary`: Primary color badge
   * - `secondary`: Gray secondary badge
   * - `success`: Green success badge
   * - `warning`: Yellow warning badge
   * - `danger`: Red danger/error badge
   * - `info`: Blue informational badge
   * - `outline`: Bordered badge with transparent background
   * @default "default"
   */
  variant = input<BadgeVariant>('default');
  
  /**
   * Size of the badge.
   * - `xs`: Extra small (minimal padding, 12px text)
   * - `sm`: Small (compact padding, 12px text)
   * - `md`: Medium (standard padding, 14px text) - default
   * - `lg`: Large (generous padding, 14px text)
   * @default "md"
   */
  size = input<BadgeSize>('md');
  
  /**
   * Shape style of the badge corners.
   * - `rounded`: Standard rounded corners
   * - `pill`: Fully rounded pill shape
   * - `square`: No rounding (square corners)
   * @default "rounded"
   */
  shape = input<BadgeShape>('rounded');
  
  /**
   * Shows a status dot indicator before the badge text.
   * Useful for online/offline status or connection indicators.
   * @default false
   */
  dot = input(false);
  
  /**
   * Makes the badge dismissible with a close button.
   * When clicked, emits the `dismissed` event.
   * @default false
   */
  dismissible = input(false);
  
  /**
   * Accessible label for screen readers.
   * Recommended when badge contains only icons or numbers.
   * @default ""
   * @example "3 new messages" or "Online status"
   */
  ariaLabel = input<string>('');

  /**
   * Emitted when the dismiss button is clicked.
   * Only emitted when `dismissible` is true.
   * @event dismissed
   */
  dismissed = output<void>();

  protected badgeClasses = computed(() => {
    const baseClasses = 'inline-flex items-center font-medium ui-transition-standard';

    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-sm'
    };

    const shapeClasses = {
      rounded: 'rounded',
      pill: 'rounded-full',
      square: 'rounded-none'
    };

    const variantClasses = {
      default: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600',
      primary: 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 hover:bg-primary-200 dark:hover:bg-primary-800',
      secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600',
      success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-800',
      warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 hover:bg-yellow-200 dark:hover:bg-yellow-800',
      danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800',
      info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800',
      outline: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
    };

    const dismissibleClasses = this.dismissible() ? 'pr-1' : '';

    return `${baseClasses} ${sizeClasses[this.size()]} ${shapeClasses[this.shape()]} ${variantClasses[this.variant()]} ${dismissibleClasses}`;
  });

  protected dotClasses = computed(() => {
    const baseClasses = 'inline-block rounded-full mr-1.5';

    const sizeClasses = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5'
    };

    const colorClasses = {
      default: 'bg-gray-400',
      primary: 'bg-primary-500',
      secondary: 'bg-gray-400',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      info: 'bg-blue-500',
      outline: 'bg-gray-400'
    };

    return `${baseClasses} ${sizeClasses[this.size()]} ${colorClasses[this.variant()]}`;
  });

  protected onDismiss(): void {
    this.dismissed.emit();
  }
}
