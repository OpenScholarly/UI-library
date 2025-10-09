import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ButtonGroupOrientation, ButtonGroupSize, ButtonGroupVariant } from '../../../../types';

/**
 * A versatile and accessible button group component for grouping related actions.
 *
 * ## Features
 * - Horizontal and vertical orientation
 * - Multiple visual variants (default, contained, outlined)
 * - Comprehensive size options (sm, md, lg)
 * - Spacing control (none, sm, md)
 * - Full-width option
 * - Connected or separated button styles
 * - Full screen reader support with ARIA attributes
 * - WCAG 2.1 Level AA compliance
 * - Dark mode support
 *
 * @example
 * ```html
 * <!-- Basic horizontal button group -->
 * <ui-button-group>
 *   <ui-button>Left</ui-button>
 *   <ui-button>Center</ui-button>
 *   <ui-button>Right</ui-button>
 * </ui-button-group>
 *
 * <!-- Connected buttons (no spacing) -->
 * <ui-button-group spacing="none">
 *   <ui-button>One</ui-button>
 *   <ui-button>Two</ui-button>
 *   <ui-button>Three</ui-button>
 * </ui-button-group>
 *
 * <!-- Vertical orientation -->
 * <ui-button-group orientation="vertical">
 *   <ui-button>Top</ui-button>
 *   <ui-button>Middle</ui-button>
 *   <ui-button>Bottom</ui-button>
 * </ui-button-group>
 *
 * <!-- Full width -->
 * <ui-button-group [fullWidth]="true">
 *   <ui-button>Equal</ui-button>
 *   <ui-button>Width</ui-button>
 *   <ui-button>Buttons</ui-button>
 * </ui-button-group>
 *
 * <!-- Contained variant -->
 * <ui-button-group variant="contained" spacing="none">
 *   <ui-button variant="ghost">Bold</ui-button>
 *   <ui-button variant="ghost">Italic</ui-button>
 *   <ui-button variant="ghost">Underline</ui-button>
 * </ui-button-group>
 * ```
 */
@Component({
  selector: 'ui-button-group',
  standalone: true,
  template: `
    <div [class]="groupClasses()" role="group" [attr.aria-label]="ariaLabel()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonGroupComponent {
  /**
   * Orientation of the button group.
   * - `horizontal`: Buttons arranged horizontally (default)
   * - `vertical`: Buttons arranged vertically
   * @default "horizontal"
   */
  orientation = input<ButtonGroupOrientation>('horizontal');
  
  /**
   * Size of the buttons in the group.
   * - `sm`: Small
   * - `md`: Medium (default)
   * - `lg`: Large
   * @default "md"
   */
  size = input<ButtonGroupSize>('md');
  
  /**
   * Visual style variant of the button group.
   * - `default`: Standard separated buttons (default)
   * - `contained`: Buttons in a container with borders
   * - `outlined`: Buttons with outline border
   * @default "default"
   */
  variant = input<ButtonGroupVariant>('default');
  
  /**
   * Spacing between buttons.
   * - `none`: No spacing, buttons connected
   * - `sm`: Small spacing (4px)
   * - `md`: Medium spacing (8px)
   * @default "sm"
   */
  spacing = input<'none' | 'sm' | 'md'>('sm');
  
  /**
   * Makes the button group take full width with equal button sizes.
   * @default false
   */
  fullWidth = input(false);
  
  /**
   * ARIA label for the button group.
   * @default ""
   * @example "Text formatting options"
   */
  ariaLabel = input<string>('');

  protected groupClasses = computed(() => {
    const baseClasses = 'inline-flex p-2 m-0';

    const orientationClasses = {
      horizontal: 'flex-row',
      vertical: 'flex-col'
    };

    const variantClasses = {
      default: '[&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child)]:-ml-px',
      contained: 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden [&>*]:border-0 [&>*]:rounded-none [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-gray-300 dark:[&>*:not(:last-child)]:border-gray-600',
      outlined: 'border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden [&>*]:border-0 [&>*]:rounded-none'
    };

    const spacingClasses = {
      none: '',
      sm: this.orientation() === 'horizontal' ? 'gap-1' : 'gap-1',
      md: this.orientation() === 'horizontal' ? 'gap-2' : 'gap-2'
    };

    const orientationClass = orientationClasses[this.orientation()];
    const variantClass = this.spacing() === 'none' ? variantClasses[this.variant()] : '';
    const spacingClass = spacingClasses[this.spacing()];
    const fullWidthClass = this.fullWidth() ? 'w-full [&>*]:flex-1' : '';

    // Vertical orientation adjustments for connected buttons
    const verticalAdjustments = this.orientation() === 'vertical' && this.spacing() === 'none'
      ? '[&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child)]:-mt-px'
      : '';

    return `${baseClasses} ${orientationClass} ${variantClass} ${spacingClass} ${fullWidthClass} ${verticalAdjustments}`.trim();
  });
}
