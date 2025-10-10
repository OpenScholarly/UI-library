import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DividerOrientation, DividerVariant } from '../../../types';

/**
 * A versatile and accessible divider component for separating content.
 *
 * ## Features
 * - Horizontal and vertical orientation
 * - Multiple line styles (solid, dashed, dotted)
 * - Configurable thickness (thin, medium, thick)
 * - Color options (gray, primary, secondary)
 * - Spacing control (none, sm, md, lg)
 * - Optional label support
 * - Dark mode support
 * - WCAG 2.1 Level AA compliant
 *
 * @example
 * ```html
 * <!-- Basic horizontal divider -->
 * <ui-divider />
 *
 * <!-- Dashed divider -->
 * <ui-divider variant="dashed" />
 *
 * <!-- Thick primary colored divider -->
 * <ui-divider
 *   thickness="thick"
 *   color="primary">
 * </ui-divider>
 *
 * <!-- Vertical divider -->
 * <ui-divider orientation="vertical" />
 *
 * <!-- Divider with custom spacing -->
 * <ui-divider spacing="lg" />
 *
 * <!-- Dotted divider with no spacing -->
 * <ui-divider
 *   variant="dotted"
 *   spacing="none">
 * </ui-divider>
 * ```
 */
@Component({
  selector: 'ui-divider',
  standalone: true,
  template: `
    <div [class]="dividerClasses()" [attr.aria-orientation]="orientation()">
      <ng-content select="[slot=label]" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerComponent {
  /**
   * Orientation of the divider.
   * - `horizontal`: Horizontal divider (default)
   * - `vertical`: Vertical divider
   * @default "horizontal"
   */
  orientation = input<DividerOrientation>('horizontal');
  
  /**
   * Line style variant.
   * - `solid`: Solid line (default)
   * - `dashed`: Dashed line
   * - `dotted`: Dotted line
   * @default "solid"
   */
  variant = input<DividerVariant>('solid');
  
  /**
   * Thickness of the divider line.
   * - `thin`: 1px line (default)
   * - `medium`: 2px line
   * - `thick`: 4px line
   * @default "thin"
   */
  thickness = input<'thin' | 'medium' | 'thick'>('thin');
  
  /**
   * Color of the divider.
   * - `gray`: Gray color (default)
   * - `primary`: Primary color
   * - `secondary`: Secondary gray color
   * @default "gray"
   */
  color = input<'gray' | 'primary' | 'secondary'>('gray');
  
  /**
   * Spacing around the divider.
   * - `none`: No spacing
   * - `sm`: Small spacing (8px)
   * - `md`: Medium spacing (16px) - default
   * - `lg`: Large spacing (24px)
   * @default "md"
   */
  spacing = input<'none' | 'sm' | 'md' | 'lg'>('md');

  protected dividerClasses = computed(() => {
    const baseClasses = 'flex items-center';

    const orientationClasses = {
      horizontal: 'w-full',
      vertical: 'h-full flex-col'
    };

    const variantClasses = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted'
    };

    const thicknessClasses = {
      thin: this.orientation() === 'horizontal' ? 'border-t' : 'border-l',
      medium: this.orientation() === 'horizontal' ? 'border-t-2' : 'border-l-2',
      thick: this.orientation() === 'horizontal' ? 'border-t-4' : 'border-l-4'
    };

    const colorClasses = {
      gray: 'border-gray-300 dark:border-gray-600',
      primary: 'border-primary-500 dark:border-primary-400',
      secondary: 'border-gray-500 dark:border-gray-500'
    };

    const spacingClasses = {
      none: '',
      sm: this.orientation() === 'horizontal' ? 'my-2' : 'mx-2',
      md: this.orientation() === 'horizontal' ? 'my-4' : 'mx-4',
      lg: this.orientation() === 'horizontal' ? 'my-6' : 'mx-6'
    };

    const orientationClass = orientationClasses[this.orientation()];
    const variantClass = variantClasses[this.variant()];
    const thicknessClass = thicknessClasses[this.thickness()];
    const colorClass = colorClasses[this.color()];
    const spacingClass = spacingClasses[this.spacing()];

    return `${baseClasses} ${orientationClass} ${variantClass} ${thicknessClass} ${colorClass} ${spacingClass}`;
  });
}
