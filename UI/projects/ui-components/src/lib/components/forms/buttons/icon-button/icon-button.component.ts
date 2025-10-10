import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconButtonVariant, IconButtonSize, IconButtonShape } from '../../../../types';

/**
 * A versatile and accessible icon button component for single-icon actions.
 *
 * ## Features
 * - Multiple visual variants (primary, secondary, outline, ghost, destructive, glass)
 * - Comprehensive size options (sm, md, lg)
 * - Shape options (square, rounded, circle)
 * - Loading states
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Disabled state handling
 * - Dark mode support
 * - Tooltip support
 *
 * @example
 * ```html
 * <!-- Basic icon button -->
 * <ui-icon-button ariaLabel="Delete">
 *   🗑️
 * </ui-icon-button>
 *
 * <!-- Primary variant with tooltip -->
 * <ui-icon-button
 *   variant="primary"
 *   ariaLabel="Save"
 *   tooltip="Save changes">
 *   💾
 * </ui-icon-button>
 *
 * <!-- Circle shape -->
 * <ui-icon-button
 *   shape="circle"
 *   variant="secondary"
 *   ariaLabel="More options">
 *   ⋮
 * </ui-icon-button>
 *
 * <!-- Destructive action -->
 * <ui-icon-button
 *   variant="destructive"
 *   ariaLabel="Delete permanently">
 *   🗑️
 * </ui-icon-button>
 *
 * <!-- Large size -->
 * <ui-icon-button
 *   size="lg"
 *   ariaLabel="Menu">
 *   ☰
 * </ui-icon-button>
 *
 * <!-- With click handler -->
 * <ui-icon-button
 *   (clicked)="handleAction()"
 *   ariaLabel="Refresh">
 *   🔄
 * </ui-icon-button>
 * ```
 */
@Component({
  selector: 'ui-icon-button',
  standalone: true,
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      [attr.title]="tooltip()"
      (click)="handleClick()"
      type="button">
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()'
  }
})
export class IconButtonComponent {
  /**
   * Visual style variant of the icon button.
   * - `primary`: Primary color button (default)
   * - `secondary`: Gray secondary button
   * - `outline`: Bordered button with transparent background
   * - `ghost`: Transparent button with hover effect
   * - `destructive`: Red destructive action button
   * - `glass`: Glass morphism effect button
   * @default "primary"
   */
  variant = input<IconButtonVariant>('primary');
  
  /**
   * Size of the icon button.
   * - `sm`: Small (32px)
   * - `md`: Medium (40px) - default
   * - `lg`: Large (48px)
   * @default "md"
   */
  size = input<IconButtonSize>('md');
  
  /**
   * Shape of the icon button.
   * - `square`: No rounding
   * - `rounded`: Standard rounded corners (default)
   * - `circle`: Fully circular
   * @default "rounded"
   */
  shape = input<IconButtonShape>('rounded');
  
  /**
   * Disables the button and prevents interaction.
   * @default false
   */
  disabled = input(false);
  
  /**
   * ARIA label for screen readers.
   * Required for accessibility when button contains only an icon.
   * @default ""
   * @example "Delete item"
   */
  ariaLabel = input<string>('');
  
  /**
   * Tooltip text shown on hover.
   * @default ""
   * @example "Delete this item"
   */
  tooltip = input<string>('');
  
  /**
   * Shows loading state.
   * @default false
   */
  loading = input(false);

  /**
   * Emitted when the button is clicked.
   * @event clicked
   */
  clicked = output<void>();

  protected buttonClasses = computed(() => {
    const baseClasses = 'inline-flex items-center justify-center ui-transition-standard ui-focus-primary disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary: 'bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700 active:bg-primary-700 dark:active:bg-primary-800',
      secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500',
      outline: 'border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700',
      ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700',
      destructive: 'bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800 active:bg-red-800 dark:active:bg-red-900 ui-focus-danger',
      glass: 'ui-glass text-white hover:bg-white/20 dark:hover:bg-white/10 active:bg-white/30 dark:active:bg-white/20 backdrop-blur-md'
    };

    const sizes = {
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg'
    };

    const shapes = {
      square: 'rounded-none',
      rounded: 'rounded-md',
      circle: 'rounded-full'
    };

    const variantClass = variants[this.variant()];
    const sizeClass = sizes[this.size()];
    const shapeClass = shapes[this.shape()];
    const loadingClass = this.loading() ? 'cursor-wait' : '';

    return `${baseClasses} ${variantClass} ${sizeClass} ${shapeClass} ${loadingClass}`;
  });

  protected hostClasses = computed(() => {
    return this.loading() ? 'relative' : '';
  });

  protected handleClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
