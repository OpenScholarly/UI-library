import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RowJustify, RowAlign, RowGap } from '../../../types';

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
  justify = input<RowJustify>('start');
  align = input<RowAlign>('stretch');
  gap = input<RowGap>('md');
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
