import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RowJustify, RowAlign, RowGap } from '../../../types';

/**
 * A flexible row layout component using flexbox.
 *
 * ## Features
 * - Flexbox row layout with justify and align controls
 * - Configurable gap spacing (none, xs, sm, md, lg, xl)
 * - Multiple justify options (start, center, end, between, around, evenly)
 * - Multiple align options (start, center, end, stretch, baseline)
 * - Optional flex-wrap support
 * - Content projection for row items
 * - Dark mode compatible
 *
 * @example
 * ```html
 * <!-- Centered row -->
 * <ui-row justify="center" align="center" gap="md">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </ui-row>
 *
 * <!-- Space-between row -->
 * <ui-row justify="between" align="start" gap="lg">
 *   <div>Left</div>
 *   <div>Right</div>
 * </ui-row>
 *
 * <!-- No wrap row -->
 * <ui-row [wrap]="false" gap="sm">
 *   @for (item of items; track item.id) {
 *     <div>{{ item.name }}</div>
 *   }
 * </ui-row>
 * ```
 */
@Component({
  selector: 'ui-row',
  standalone: true,
  template: `
    <div [class]="rowClasses()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowComponent {
  /**
   * Horizontal justification of row items.
   * - `start`: Items at the start
   * - `center`: Items centered
   * - `end`: Items at the end
   * - `between`: Space between items
   * - `around`: Space around items
   * - `evenly`: Even space distribution
   * @default "start"
   */
  justify = input<RowJustify>('start');
  
  /**
   * Vertical alignment of row items.
   * - `start`: Items at top
   * - `center`: Items centered
   * - `end`: Items at bottom
   * - `stretch`: Items stretch to fill
   * - `baseline`: Items aligned by baseline
   * @default "stretch"
   */
  align = input<RowAlign>('stretch');
  
  /**
   * Gap spacing between row items.
   * @default "md"
   */
  gap = input<RowGap>('md');
  
  /**
   * Whether items should wrap to the next line.
   * @default true
   */
  wrap = input(true);

  protected rowClasses = computed(() => {
    const baseClasses = 'flex';

    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly'
    };

    const alignClasses = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline'
    };

    const gapClasses = {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    };

    const justifyClass = justifyClasses[this.justify()];
    const alignClass = alignClasses[this.align()];
    const gapClass = gapClasses[this.gap()];
    const wrapClass = this.wrap() ? 'flex-wrap' : 'flex-nowrap';

    return `${baseClasses} ${justifyClass} ${alignClass} ${gapClass} ${wrapClass}`;
  });
}
