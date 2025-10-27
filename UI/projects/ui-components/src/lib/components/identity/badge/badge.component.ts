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
    @if (!shouldHide()) {
      <span [class]="badgeClasses()" [attr.aria-label]="ariaLabel()" [style]="positionStyles()">
        @if (dot()) {
          <span class="badge-dot" [class]="dotClasses()"></span>
        }
        @if (displayValue()) {
          {{ displayValue() }}
        } @else {
          <ng-content />
        }
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
    }
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
   * Animation style for the badge.
   * - `none`: No animation (default)
   * - `pulse`: Pulsing animation for attention
   * - `bounce`: Bouncing animation for notifications
   * @default "none"
   */
  animation = input<'none' | 'pulse' | 'bounce'>('none');

  /**
   * Position the badge relative to a parent element.
   * - `none`: No special positioning (default, inline)
   * - `top-right`: Top right corner of parent
   * - `top-left`: Top left corner of parent
   * - `bottom-right`: Bottom right corner of parent
   * - `bottom-left`: Bottom left corner of parent
   * @default "none"
   */
  position = input<'none' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'>('none');

  /**
   * Maximum value to display before showing "max+" format.
   * Useful for notification counts.
   * @default null (no max)
   * @example 99 will display "99+" for values > 99
   */
  maxValue = input<number | null>(null);

  /**
   * Hide the badge when the value/content is zero or empty.
   * Works with the `value` input to determine visibility.
   * @default false
   */
  hideWhenZero = input(false);

  /**
   * Numeric value for the badge. Used with maxValue and hideWhenZero.
   * @default null
   */
  value = input<number | null>(null);

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

    const animationClasses = {
      none: '',
      pulse: 'animate-pulse',
      bounce: 'animate-bounce'
    };

    const positionClasses = this.position() !== 'none' ? 'absolute' : '';
    const dismissibleClasses = this.dismissible() ? 'pr-1' : '';

    return `${baseClasses} ${sizeClasses[this.size()]} ${shapeClasses[this.shape()]} ${variantClasses[this.variant()]} ${animationClasses[this.animation()]} ${positionClasses} ${dismissibleClasses}`;
  });

  protected positionStyles = computed(() => {
    const position = this.position();
    const positionMap = {
      'none': {},
      'top-right': { top: '0', right: '0', transform: 'translate(50%, -50%)' },
      'top-left': { top: '0', left: '0', transform: 'translate(-50%, -50%)' },
      'bottom-right': { bottom: '0', right: '0', transform: 'translate(50%, 50%)' },
      'bottom-left': { bottom: '0', left: '0', transform: 'translate(-50%, 50%)' }
    };
    return positionMap[position] || {};
  });

  protected shouldHide = computed(() => {
    if (!this.hideWhenZero()) return false;
    const val = this.value();
    // Hide if value is explicitly 0, null, or undefined
    return val === 0 || val === null || val === undefined;
  });

  protected displayValue = computed(() => {
    const val = this.value();
    const max = this.maxValue();
    if (val === null || val === undefined) return null;
    if (max !== null && val > max) return `${max}+`;
    return val.toString();
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
