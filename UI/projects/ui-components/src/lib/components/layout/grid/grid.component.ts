import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { GridCols, GridGap } from '../../../types';

/**
 * A flexible grid layout component for responsive layouts.
 *
 * ## Features
 * - 12-column grid system (1-12 columns)
 * - Configurable gap spacing (none, xs, sm, md, lg, xl)
 * - Responsive breakpoints (mobile, tablet, desktop)
 * - Content projection for grid items
 * - Auto-responsive or fixed column layouts
 * - Dark mode compatible
 *
 * @example
 * ```html
 * <!-- Responsive 4-column grid -->
 * <ui-grid cols="4" gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 *   <div>Item 4</div>
 * </ui-grid>
 *
 * <!-- Fixed 3-column grid with large gaps -->
 * <ui-grid cols="3" gap="lg" [responsive]="false">
 *   <ui-card>Card 1</ui-card>
 *   <ui-card>Card 2</ui-card>
 *   <ui-card>Card 3</ui-card>
 * </ui-grid>
 *
 * <!-- Responsive grid (1 col mobile, 2 col tablet, N col desktop) -->
 * <ui-grid cols="6" gap="md" [responsive]="true">
 *   @for (item of items; track item.id) {
 *     <div>{{ item.name }}</div>
 *   }
 * </ui-grid>
 * ```
 */
@Component({
  selector: 'ui-grid',
  standalone: true,
  template: `
    <div [class]="gridClasses()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
  /**
   * Number of columns in the grid (1-12).
   * @default "12"
   * @example "4", "6", "12"
   */
  cols = input<GridCols>('12');
  
  /**
   * Gap spacing between grid items.
   * - `none`: No gap (gap-0)
   * - `xs`: 0.25rem (gap-1)
   * - `sm`: 0.5rem (gap-2)
   * - `md`: 1rem (gap-4)
   * - `lg`: 1.5rem (gap-6)
   * - `xl`: 2rem (gap-8)
   * @default "md"
   */
  gap = input<GridGap>('md');
  
  /**
   * Whether the grid should be responsive.
   * When true: 1 column on mobile, 2 on tablet, N on desktop.
   * When false: Fixed N columns at all breakpoints.
   * @default true
   */
  responsive = input(true);

  protected gridClasses = computed(() => {
    const baseClasses = 'grid';

    const colsClasses = {
      '1': 'grid-cols-1',
      '2': 'grid-cols-2',
      '3': 'grid-cols-3',
      '4': 'grid-cols-4',
      '5': 'grid-cols-5',
      '6': 'grid-cols-6',
      '7': 'grid-cols-7',
      '8': 'grid-cols-8',
      '9': 'grid-cols-9',
      '10': 'grid-cols-10',
      '11': 'grid-cols-11',
      '12': 'grid-cols-12'
    };

    const gapClasses = {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    };

    const colsClass = colsClasses[this.cols()];
    const gapClass = gapClasses[this.gap()];
    const responsiveClass = this.responsive() ? `grid-cols-1 sm:grid-cols-2 lg:${colsClasses[this.cols()]}` : colsClass;

    return `${baseClasses} ${this.responsive() ? responsiveClass : colsClass} ${gapClass}`;
  });
}
