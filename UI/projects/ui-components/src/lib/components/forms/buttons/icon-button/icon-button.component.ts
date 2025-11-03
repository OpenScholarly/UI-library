import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconButtonVariant, IconButtonSize, IconButtonShape } from '../../../../types';

/**
 * A versatile and accessible icon button component for single-icon actions.
 *
 * ## Features
 * - Multiple visual variants (primary, secondary, outline, ghost, destructive, glass)
 * - Material Design 3 color styles (filled, tonal, outlined, standard)
 * - Flexible width options (narrow, default, wide) following Apple and Material guidelines
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
 * <!-- Tonal color style (Material Design 3) -->
 * <ui-icon-button
 *   variant="primary"
 *   color="tonal"
 *   ariaLabel="Add to favorites">
 *   ⭐
 * </ui-icon-button>
 *
 * <!-- Outlined style with wide width -->
 * <ui-icon-button
 *   variant="secondary"
 *   color="outlined"
 *   width="wide"
 *   ariaLabel="More options">
 *   ⋮
 * </ui-icon-button>
 *
 * <!-- Standard style (icon only) -->
 * <ui-icon-button
 *   variant="ghost"
 *   color="standard"
 *   width="narrow"
 *   shape="circle"
 *   ariaLabel="Close">
 *   ✕
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
   * Color style of the icon button.
   * - `filled`: Solid background (default)
   * - `tonal`: Slightly transparent background
   * - `outlined`: Transparent background with border
   * - `standard`: No background, just the icon
   * @default "filled"
   */
  color = input<'filled' | 'tonal' | 'outlined' | 'standard'>('filled');

  /**
   * Width style of the icon button.
   * - `default`: Default width (matches height: 32px, 40px, 48px)
   * - `narrow`: Reduced width (24px, 28px, 36px)
   * - `wide`: Increased width (44px, 56px, 64px)
   * @default "default"
   */
  width = input<'default' | 'narrow' | 'wide'>('default');

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
   * - `squared`: No rounding (default)
   * - `rounded`: Standard rounded corners
   * - `circular`: Fully circular
   * @default "squared"
   */
  shape = input<IconButtonShape>('squared');
  
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

    // Color styles based on Material Design 3 and Apple guidelines
    const colorStyles: Record<string, Record<IconButtonVariant, string>> = {
      filled: {
        primary: 'bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700 active:bg-primary-700 dark:active:bg-primary-800',
        secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 active:bg-gray-400 dark:active:bg-gray-500',
        outline: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-300 dark:active:bg-gray-600',
        ghost: 'bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700',
        destructive: 'bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 dark:hover:bg-red-800 active:bg-red-800 dark:active:bg-red-900 ui-focus-danger',
        glass: 'ui-glass text-white hover:bg-white/20 dark:hover:bg-white/10 active:bg-white/30 dark:active:bg-white/20 backdrop-blur-md'
      },
      tonal: {
        primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-900/50 active:bg-primary-300 dark:active:bg-primary-900/70',
        secondary: 'bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800/70 active:bg-gray-300 dark:active:bg-gray-800/90',
        outline: 'bg-gray-50 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900/50 active:bg-gray-200 dark:active:bg-gray-900/70',
        ghost: 'bg-gray-50/50 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 hover:bg-gray-100/70 dark:hover:bg-gray-900/40 active:bg-gray-200/80 dark:active:bg-gray-900/60',
        destructive: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 active:bg-red-300 dark:active:bg-red-900/70',
        glass: 'ui-glass text-white/90 hover:bg-white/10 dark:hover:bg-white/5 active:bg-white/20 dark:active:bg-white/10 backdrop-blur-md'
      },
      outlined: {
        primary: 'border border-primary-300 dark:border-primary-600 bg-transparent text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 active:bg-primary-100 dark:active:bg-primary-900/40',
        secondary: 'border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700',
        outline: 'border border-gray-200 dark:border-gray-700 bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 active:bg-gray-100 dark:active:bg-gray-700/50',
        ghost: 'border border-gray-200/50 dark:border-gray-700/50 bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 active:bg-gray-100/50 dark:active:bg-gray-700/30',
        destructive: 'border border-red-300 dark:border-red-600 bg-transparent text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/40',
        glass: 'border border-white/20 dark:border-white/10 ui-glass text-white/90 hover:bg-white/10 dark:hover:bg-white/5 active:bg-white/20 dark:active:bg-white/10 backdrop-blur-md'
      },
      standard: {
        primary: 'bg-transparent text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 active:bg-primary-100 dark:active:bg-primary-900/40',
        secondary: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700',
        outline: 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 active:bg-gray-100 dark:active:bg-gray-700/50',
        ghost: 'bg-transparent text-gray-500 dark:text-gray-500 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 active:bg-gray-100/50 dark:active:bg-gray-700/30',
        destructive: 'bg-transparent text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 dark:active:bg-red-900/40',
        glass: 'bg-transparent text-white/80 hover:bg-white/10 dark:hover:bg-white/5 active:bg-white/20 dark:active:bg-white/10'
      }
    };

    const sizeConfigs: Record<IconButtonSize, { height: string; baseWidth: string; text: string }> = {
      sm: { height: 'h-8', baseWidth: 'w-8', text: 'text-sm' },
      md: { height: 'h-10', baseWidth: 'w-10', text: 'text-base' },
      lg: { height: 'h-12', baseWidth: 'w-12', text: 'text-lg' }
    };

    const widthStyles: Record<string, Record<IconButtonSize, string>> = {
      narrow: {
        sm: 'w-6',   // Narrow: 24px width (75% of height)
        md: 'w-7',   // Narrow: 28px width (70% of height)  
        lg: 'w-9'    // Narrow: 36px width (75% of height)
      },
      default: {
        sm: 'w-8',   // Default: matches height (32px)
        md: 'w-10',  // Default: matches height (40px)
        lg: 'w-12'   // Default: matches height (48px)
      },
      wide: {
        sm: 'w-11',  // Wide: 44px width (137% of height)
        md: 'w-14',  // Wide: 56px width (140% of height)
        lg: 'w-16'   // Wide: 64px width (133% of height)
      }
    };

    const shapes: Record<IconButtonShape, string> = {
      squared: 'rounded-none',
      rounded: 'rounded-md',
      circular: 'rounded-full'
    };

    const colorClass = colorStyles[this.color()]?.[this.variant()] || colorStyles['filled'][this.variant()];
    const sizeConfig = sizeConfigs[this.size()];
    const heightClass = sizeConfig.height;
    const widthClass = widthStyles[this.width()]?.[this.size()] || sizeConfig.baseWidth;
    const textClass = sizeConfig.text;
    const shapeClass = shapes[this.shape()];
    const loadingClass = this.loading() ? 'cursor-wait' : '';

    return `${baseClasses} ${colorClass} ${heightClass} ${widthClass} ${textClass} ${shapeClass} ${loadingClass}`;
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
