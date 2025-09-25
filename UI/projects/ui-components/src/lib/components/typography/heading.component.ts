import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
export type HeadingWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';

@Component({
  selector: 'ui-heading',
  standalone: true,
  imports: [NgSwitch, NgSwitchCase],
  template: `
    <ng-container [ngSwitch]="level()">
      <h1 *ngSwitchCase="'h1'" [class]="headingClasses()"><ng-content /></h1>
      <h2 *ngSwitchCase="'h2'" [class]="headingClasses()"><ng-content /></h2>
      <h3 *ngSwitchCase="'h3'" [class]="headingClasses()"><ng-content /></h3>
      <h4 *ngSwitchCase="'h4'" [class]="headingClasses()"><ng-content /></h4>
      <h5 *ngSwitchCase="'h5'" [class]="headingClasses()"><ng-content /></h5>
      <h6 *ngSwitchCase="'h6'" [class]="headingClasses()"><ng-content /></h6>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadingComponent {
  level = input<HeadingLevel>('h1');
  size = input<HeadingSize>('lg');
  weight = input<HeadingWeight>('bold');
  color = input<'inherit' | 'primary' | 'secondary' | 'muted'>('inherit');

  protected headingClasses = computed(() => {
    const baseClasses = 'tracking-tight';

    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl'
    };

    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold'
    };

    const colorClasses = {
      inherit: 'text-inherit',
      primary: 'text-gray-900 dark:text-white',
      secondary: 'text-gray-700 dark:text-gray-300',
      muted: 'text-gray-500 dark:text-gray-400'
    };

    const sizeClass = sizeClasses[this.size()];
    const weightClass = weightClasses[this.weight()];
    const colorClass = colorClasses[this.color()];

    return `${baseClasses} ${sizeClass} ${weightClass} ${colorClass}`;
  });
}
