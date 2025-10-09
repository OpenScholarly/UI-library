import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HeadingLevel, HeadingSize, HeadingWeight } from '../../../types';

/**
 * Semantic heading component (H1–H6) with design-system sizes and weights.
 *
 * Features
 * - Level-driven semantic tag: h1–h6 via level input
 * - Theme-aware colors and tracking-tight typography
 * - Size and weight presets aligned with the design system
 * - Custom class merging for advanced layout control
 *
 * Examples
 * ```html
 * <ui-heading level="h2" size="3xl" weight="extrabold">Section Title</ui-heading>
 * <ui-heading level="h4" color="secondary">Subsection</ui-heading>
 * ```
 */
@Component({
  selector: 'ui-heading',
  standalone: true,
  template: `
    @switch (level()) {
      @case ('h1') { <h1 [class]="headingClasses()"><ng-content /></h1> }
      @case ('h2') { <h2 [class]="headingClasses()"><ng-content /></h2> }
      @case ('h3') { <h3 [class]="headingClasses()"><ng-content /></h3> }
      @case ('h4') { <h4 [class]="headingClasses()"><ng-content /></h4> }
      @case ('h5') { <h5 [class]="headingClasses()"><ng-content /></h5> }
      @case ('h6') { <h6 [class]="headingClasses()"><ng-content /></h6> }
      @default { <h1 [class]="headingClasses()"><ng-content /></h1> }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadingComponent {
  /** Semantic heading level. */
  level = input<HeadingLevel>('h1');
  /** Heading size preset. */
  size = input<HeadingSize>('lg');
  /** Heading weight preset. */
  weight = input<HeadingWeight>('bold');
  /** Theme-aware color token. */
  color = input<'default' | 'inherit' | 'primary' | 'secondary' | 'muted'>('default');
  /** Additional Tailwind classes to merge. */
  customClasses = input<string>('');

  protected headingClasses = computed(() => {
    const baseClasses = 'tracking-tight font-sans';

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
      default: 'text-gray-900 dark:text-white',
      inherit: 'text-inherit dark:text-inherit',
      primary: 'text-text-primary dark:text-text-primary',
      secondary: 'text-text-secondary dark:text-text-secondary',
      muted: 'text-text-disabled dark:text-text-disabled'
    };

    const sizeClass = sizeClasses[this.size()];
    const weightClass = weightClasses[this.weight()];
    const colorClass = colorClasses[this.color()];

    return [baseClasses, sizeClass, weightClass, colorClass, this.customClasses()].filter(Boolean).join(' ');
  });
}
