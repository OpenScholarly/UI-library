import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'ui-card',
  template: `
    <div [class]="cardClasses()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  padding = input<'none' | 'sm' | 'md' | 'lg'>('md');
  shadow = input<'none' | 'sm' | 'md' | 'lg'>('md');
  rounded = input<'none' | 'sm' | 'md' | 'lg'>('md');

  protected cardClasses = computed(() => {
    const baseClasses = 'bg-white border border-gray-200';

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    const shadows = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg'
    };

    const roundedClasses = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-lg',
      lg: 'rounded-xl'
    };

    return `${baseClasses} ${paddings[this.padding()]} ${shadows[this.shadow()]} ${roundedClasses[this.rounded()]}`;
  });
}
