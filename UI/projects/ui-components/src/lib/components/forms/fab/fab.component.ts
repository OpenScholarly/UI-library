import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FabSize, FabVariant, FabPosition } from '../../../types';

/**
 * A versatile and accessible Floating Action Button (FAB) component for primary actions.
 *
 * ## Features
 * - Multiple visual variants (primary, secondary, extended)
 * - Comprehensive size options (sm, md, lg)
 * - Position control (fixed positioning in corners)
 * - Extended FAB with icon and label
 * - Elevation levels (none, sm, md, lg)
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 * - Smooth animations
 *
 * @example
 * ```html
 * <!-- Basic FAB -->
 * <ui-fab ariaLabel="Add item">
 *   <span slot="icon">+</span>
 * </ui-fab>
 *
 * <!-- Extended FAB with label -->
 * <ui-fab
 *   variant="extended"
 *   label="Create New"
 *   ariaLabel="Create new item">
 *   <span slot="icon">✨</span>
 * </ui-fab>
 *
 * <!-- Fixed position FAB -->
 * <ui-fab
 *   position="bottom-right"
 *   ariaLabel="Compose">
 *   <span slot="icon">✏️</span>
 * </ui-fab>
 *
 * <!-- Large FAB with elevation -->
 * <ui-fab
 *   size="lg"
 *   elevation="lg"
 *   (clicked)="handleAction()">
 *   <span slot="icon">🚀</span>
 * </ui-fab>
 *
 * <!-- Secondary variant -->
 * <ui-fab
 *   variant="secondary"
 *   ariaLabel="Settings">
 *   <span slot="icon">⚙️</span>
 * </ui-fab>
 * ```
 */
@Component({
  selector: 'ui-fab',
  standalone: true,
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      [attr.title]="tooltip()"
      (click)="handleClick()"
      type="button">
      <ng-content select="[slot=icon]" />
      @if (variant() === 'extended' && label()) {
        <span class="ml-2">{{ label() }}</span>
      }
      <ng-content select="[slot=label]" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()'
  }
})
export class FabComponent {
  /**
   * Visual style variant of the FAB.
   * - `primary`: Primary color FAB (default)
   * - `secondary`: Secondary white FAB with border
   * - `extended`: Extended FAB with icon and label
   * @default "primary"
   */
  variant = input<FabVariant>('primary');
  
  /**
   * Size of the FAB.
   * - `sm`: Small (40px)
   * - `md`: Medium (48px) - default
   * - `lg`: Large (56px)
   * @default "md"
   */
  size = input<FabSize>('md');
  
  /**
   * Fixed position of the FAB on the screen.
   * - `bottom-right`: Bottom right corner (default)
   * - `bottom-left`: Bottom left corner
   * - `top-right`: Top right corner
   * - `top-left`: Top left corner
   * - `none`: No fixed positioning
   * @default "bottom-right"
   */
  position = input<FabPosition>('bottom-right');
  
  /**
   * Disables the FAB and prevents interaction.
   * @default false
   */
  disabled = input(false);
  
  /**
   * ARIA label for screen readers.
   * Required for accessibility when button contains only an icon.
   * @default ""
   * @example "Add new item"
   */
  ariaLabel = input<string>('');
  
  /**
   * Tooltip text shown on hover.
   * @default ""
   * @example "Create new document"
   */
  tooltip = input<string>('');
  
  /**
   * Label text for extended FAB variant.
   * @default ""
   * @example "Create New"
   */
  label = input<string>('');
  
  /**
   * Shadow elevation level.
   * - `none`: No shadow
   * - `sm`: Small shadow
   * - `md`: Medium shadow (default)
   * - `lg`: Large shadow
   * @default "md"
   */
  elevation = input<'none' | 'sm' | 'md' | 'lg'>('md');

  /**
   * Emitted when the FAB is clicked.
   * @event clicked
   */
  clicked = output<void>();

  protected buttonClasses = computed(() => {
    const baseClasses = 'inline-flex items-center justify-center rounded-full ui-transition-standard ui-focus-primary disabled:pointer-events-none disabled:opacity-50 font-medium';

    const variants = {
      primary: 'bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700 active:bg-primary-700 dark:active:bg-primary-800',
      secondary: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600',
      extended: 'bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-700 active:bg-primary-700 dark:active:bg-primary-800 rounded-full'
    };

    const sizes = {
      sm: this.variant() === 'extended' ? 'h-10 px-4 gap-2' : 'h-10 w-10',
      md: this.variant() === 'extended' ? 'h-12 px-6 gap-3' : 'h-12 w-12',
      lg: this.variant() === 'extended' ? 'h-14 px-8 gap-4' : 'h-14 w-14'
    };

    const elevations = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg'
    };

    const variantClass = variants[this.variant()];
    const sizeClass = sizes[this.size()];
    const elevationClass = elevations[this.elevation()];

    return `${baseClasses} ${variantClass} ${sizeClass} ${elevationClass}`;
  });

  protected hostClasses = computed(() => {
    const positions = {
      'bottom-right': 'fixed bottom-4 right-4 z-50',
      'bottom-left': 'fixed bottom-4 left-4 z-50',
      'top-right': 'fixed top-4 right-4 z-50',
      'top-left': 'fixed top-4 left-4 z-50',
      'static': ''
    };

    return positions[this.position()];
  });

  protected handleClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
