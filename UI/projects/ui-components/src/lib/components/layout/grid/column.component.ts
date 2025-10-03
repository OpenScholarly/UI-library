import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ColumnSpan = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | 'auto' | 'full';

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
  span = input<ColumnSpan>('auto');
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
