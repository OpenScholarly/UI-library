import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ColumnSpan } from '../../../types';

/**
 * A flexible column component for use within grid layouts.
 *
 * ## Features
 * - Configurable column span (1-12, auto, full)
 * - Column offset support for positioning
 * - Works with ui-grid parent component
 * - Content projection for column content
 * - Responsive column sizing
 * - Dark mode compatible
 *
 * @example
 * ```html
 * <!-- Grid with columns -->
 * <ui-grid cols="12" gap="md">
 *   <ui-column span="6">Half width</ui-column>
 *   <ui-column span="6">Half width</ui-column>
 * </ui-grid>
 *
 * <!-- Column with offset -->
 * <ui-grid cols="12">
 *   <ui-column span="4" offset="2">
 *     Offset by 2 columns
 *   </ui-column>
 * </ui-grid>
 *
 * <!-- Full-width column -->
 * <ui-grid cols="4">
 *   <ui-column span="2">Item 1</ui-column>
 *   <ui-column span="full">Full width item</ui-column>
 * </ui-grid>
 * ```
 */
@Component({
  selector: 'ui-column',
  standalone: true,
  template: `
    <div [class]="columnClasses()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnComponent {
  /**
   * Number of columns to span (1-12, auto, or full).
   * - `1-12`: Specific column count
   * - `auto`: Automatic sizing
   * - `full`: Full grid width
   * @default "auto"
   * @example "6", "4", "full"
   */
  span = input<ColumnSpan>('auto');
  
  /**
   * Number of columns to offset from the start (1-12).
   * Creates empty space before the column.
   * @default "auto"
   * @example "2", "4"
   */
  offset = input<ColumnSpan>('auto');

  protected columnClasses = computed(() => {
    const spanClasses = {
      '1': 'col-span-1',
      '2': 'col-span-2',
      '3': 'col-span-3',
      '4': 'col-span-4',
      '5': 'col-span-5',
      '6': 'col-span-6',
      '7': 'col-span-7',
      '8': 'col-span-8',
      '9': 'col-span-9',
      '10': 'col-span-10',
      '11': 'col-span-11',
      '12': 'col-span-12',
      'auto': 'col-auto',
      'full': 'col-span-full'
    };

    const offsetClasses = {
      '1': 'col-start-2',
      '2': 'col-start-3',
      '3': 'col-start-4',
      '4': 'col-start-5',
      '5': 'col-start-6',
      '6': 'col-start-7',
      '7': 'col-start-8',
      '8': 'col-start-9',
      '9': 'col-start-10',
      '10': 'col-start-11',
      '11': 'col-start-12',
      '12': 'col-start-13',
      'auto': '',
      'full': ''
    };

    const spanClass = spanClasses[this.span()];
    const offsetClass = offsetClasses[this.offset()];

    return `${spanClass} ${offsetClass}`.trim();
  });
}
