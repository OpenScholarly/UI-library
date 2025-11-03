import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconSize, IconVariant } from '../../../types';

/**
 * A versatile and accessible icon component for SVG icons.
 *
 * ## Features
 * - Multiple size options (xs, sm, md, lg, xl, 2xl)
 * - Multiple color variants
 * - Customizable SVG attributes (viewBox, fill, stroke)
 * - Full ARIA support for accessibility
 * - Dark mode support
 * - Current color inheritance
 *
 * @example
 * ```html
 * <!-- Basic icon -->
 * <ui-icon>
 *   <path d="M12 4v16m8-8H4"/>
 * </ui-icon>
 *
 * <!-- Large primary icon -->
 * <ui-icon size="lg" variant="primary">
 *   <path d="M5 13l4 4L19 7"/>
 * </ui-icon>
 *
 * <!-- Custom viewBox -->
 * <ui-icon viewBox="0 0 16 16" size="md">
 *   <circle cx="8" cy="8" r="7"/>
 * </ui-icon>
 *
 * <!-- Filled icon -->
 * <ui-icon fill="currentColor" stroke="none">
 *   <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
 * </ui-icon>
 *
 * <!-- With accessibility role -->
 * <ui-icon [ariaHidden]="false" role="img">
 *   <path d="M12 14l9-5-9-5-9 5 9 5z"/>
 *   <title>Dashboard icon</title>
 * </ui-icon>
 * ```
 */
@Component({
  selector: 'ui-icon',
  standalone: true,
  template: `
    <svg
      [class]="iconClasses()"
      [attr.width]="sizeValue()"
      [attr.height]="sizeValue()"
      [attr.viewBox]="viewBox()"
      [attr.fill]="fill()"
      [attr.stroke]="stroke()"
      [attr.stroke-width]="strokeWidth()"
      [attr.aria-hidden]="ariaHidden()"
      [attr.role]="role()">
      <ng-content />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  /**
   * Icon name for identification (not rendered).
   * @default ""
   * @example "check" or "close"
   */
  name = input<string>('');
  
  /**
   * Size of the icon.
   * - `xs`: 12px
   * - `sm`: 16px
   * - `md`: 20px (default)
   * - `lg`: 24px
   * - `xl`: 32px
   * - `2xl`: 48px
   * @default "md"
   */
  size = input<IconSize>('md');
  
  /**
   * Color variant of the icon.
   * - `default`: Gray (default)
   * - `primary`: Primary brand color
   * - `secondary`: Secondary color
   * - `success`: Success green
   * - `warning`: Warning yellow
   * - `danger`: Danger red
   * - `muted`: Muted gray
   * @default "default"
   */
  variant = input<IconVariant>('default');

  /**
   * SVG viewBox attribute.
   * @default "0 0 24 24"
   */
  viewBox = input('0 0 24 24');
  
  /**
   * SVG fill attribute.
   * @default "none"
   */
  fill = input('none');
  
  /**
   * SVG stroke attribute.
   * @default "currentColor"
   */
  stroke = input('currentColor');
  
  /**
   * SVG stroke-width attribute.
   * @default "2"
   */
  strokeWidth = input('2');
  
  /**
   * Whether to hide from screen readers.
   * @default true
   */
  ariaHidden = input(true);
  
  /**
   * ARIA role for the icon.
   * @default null
   * @example "img"
   */
  role = input<string | null>(null);



  protected sizeValue = computed(() => {
    const sizes = {
      xs: '12',
      sm: '16',
      md: '20',
      lg: '24',
      xl: '32',
      '2xl': '48'
    };
    return sizes[this.size()];
  });

  protected iconClasses = computed(() => {
    const baseClasses = 'inline-block';

    const variantClasses = {
      default: 'text-gray-600 dark:text-gray-400',
      primary: 'text-primary-600 dark:text-primary-400',
      secondary: 'text-gray-500 dark:text-gray-500',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400'
    };

    const variantClass = variantClasses[this.variant()];

    return `${baseClasses} ${variantClass}`;
  });
}
