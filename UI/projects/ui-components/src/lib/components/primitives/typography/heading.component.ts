import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HeadingLevel, HeadingSize, HeadingWeight } from '../../../types';

/**
 * A versatile and accessible heading component (H1-H6) with design system integration.
 *
 * ## Features
 * - Semantic HTML heading levels (h1-h6)
 * - Multiple size options independent of semantic level
 * - Weight control (thin to black)
 * - Theme-aware color variants
 * - Custom class support for advanced styling
 * - Dark mode support
 * - Tight tracking for better readability
 * - WCAG 2.1 Level AA compliance
 *
 * @example
 * ```html
 * <!-- Page title (semantic h1, display size) -->
 * <ui-heading level="h1" size="3xl" weight="extrabold">
 *   Welcome to Our Site
 * </ui-heading>
 *
 * <!-- Section title (semantic h2, large size) -->
 * <ui-heading level="h2" size="2xl" weight="bold">
 *   Features
 * </ui-heading>
 *
 * <!-- Subsection (semantic h3, normal size) -->
 * <ui-heading level="h3" size="lg">
 *   Getting Started
 * </ui-heading>
 *
 * <!-- Colored heading -->
 * <ui-heading level="h2" color="primary" size="xl">
 *   Important Section
 * </ui-heading>
 *
 * <!-- Muted heading -->
 * <ui-heading level="h4" color="muted" weight="medium">
 *   Subtitle
 * </ui-heading>
 *
 * <!-- Custom styled -->
 * <ui-heading
 *   level="h2"
 *   size="2xl"
 *   customClasses="text-center mb-8">
 *   Centered Title
 * </ui-heading>
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
  /**
   * Semantic heading level (h1-h6).
   * Determines the HTML tag used.
   * @default "h1"
   * @example "h2"
   */
  level = input<HeadingLevel>('h1');
  
  /**
   * Visual size of the heading.
   * - `xs`: Extra small
   * - `sm`: Small
   * - `md`: Medium
   * - `lg`: Large (default)
   * - `xl`: Extra large
   * - `2xl`: 2x extra large
   * - `3xl`: 3x extra large
   * @default "lg"
   */
  size = input<HeadingSize>('lg');
  
  /**
   * Font weight of the heading.
   * - `thin`: 100
   * - `light`: 300
   * - `normal`: 400
   * - `medium`: 500
   * - `semibold`: 600
   * - `bold`: 700 (default)
   * - `extrabold`: 800
   * - `black`: 900
   * @default "bold"
   */
  weight = input<HeadingWeight>('bold');
  
  /**
   * Color variant of the heading.
   * - `default`: Standard text color
   * - `inherit`: Inherits from parent
   * - `primary`: Primary brand color
   * - `secondary`: Secondary color
   * - `muted`: Muted/dimmed text
   * @default "default"
   */
  color = input<'default' | 'inherit' | 'primary' | 'secondary' | 'muted'>('default');
  
  /**
   * Additional Tailwind CSS classes to apply.
   * @default ""
   * @example "text-center mb-4"
   */
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
