import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';

@Component({
  selector: 'ui-card',
  standalone: true,
  template: `
    <div [class]="cardClasses()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  variant = input<CardVariant>('default');
  padding = input<'none' | 'sm' | 'md' | 'lg'>('md');
  rounded = input<'none' | 'sm' | 'md' | 'lg'>('md');

  protected cardClasses = computed(() => {
    const baseClasses = 'bg-surface transition-all duration-200';

    const variants = {
      default: 'border border-gray-200',
      elevated: 'shadow-2 border border-gray-100',
      outlined: 'border-2 border-gray-300',
      glass: 'ui-glass border border-white/20'
    };

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    };

    const roundedClasses = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg'
    };

    const variantClass = variants[this.variant()];
    const paddingClass = paddings[this.padding()];
    const roundedClass = roundedClasses[this.rounded()];

    return `${baseClasses} ${variantClass} ${paddingClass} ${roundedClass}`;
  });
}
