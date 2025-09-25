import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type GridCols = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
export type GridGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'ui-grid',
  template: `
    <div [class]="gridClasses()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent {
  cols = input<GridCols>('12');
  gap = input<GridGap>('md');
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
