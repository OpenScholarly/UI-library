import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HeadingLevel, HeadingSize, HeadingWeight } from '../../../types';
import { CommonModule } from '@angular/common';

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
 * ```
 */
@Component({
  selector: 'ui-heading',
  standalone: true,
  template: `
    <ng-template #projected><ng-content></ng-content></ng-template>
    @switch (level()) {
      @case ('h1') { <h1 [class]="headingClasses()"><ng-container *ngTemplateOutlet="projected"></ng-container></h1> }
      @case ('h2') { <h2 [class]="headingClasses()"><ng-container *ngTemplateOutlet="projected"></ng-container></h2> }
      @case ('h3') { <h3 [class]="headingClasses()"><ng-container *ngTemplateOutlet="projected"></ng-container></h3> }
      @case ('h4') { <h4 [class]="headingClasses()"><ng-container *ngTemplateOutlet="projected"></ng-container></h4> }
      @case ('h5') { <h5 [class]="headingClasses()"><ng-container *ngTemplateOutlet="projected"></ng-container></h5> }
      @case ('h6') { <h6 [class]="headingClasses()"><ng-container *ngTemplateOutlet="projected"></ng-container></h6> }
      @default { <h1 [class]="headingClasses()"><ng-container *ngTemplateOutlet="projected"></ng-container></h1> }
    }
  `,
  host: {
    class: 'ui-heading block'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class HeadingComponent {
  /**
   * Semantic heading level (h1-h6).
   * @default "h1"
   */
  level = input<HeadingLevel>('h1');

  /**
   * Visual size of the heading.
   * - `xs` | `sm` | `md` | `lg` | `xl` | `2xl` | `3xl` | `4xl`
   * @default "lg"
   */
  size = input<HeadingSize>('lg');

  /**
   * Font weight of the heading.
   * - `thin`(100) | `light`(300) | `normal`(400) | `medium`(500)
   * - `semibold`(600) | `bold`(700) | `extrabold`(800) | `black`(900)
   * @default "bold"
   */
  weight = input<HeadingWeight>('bold');

  /**
   * Color variant of the heading.
   * - `default`: Neutral text (black/white)
   * - `inherit`: Inherits from parent
   * - `primary` | `secondary` | `muted`
   * @default "default"
   */
  color = input<'default' | 'inherit' | 'primary' | 'secondary' | 'muted'>('default');

  /**
   * Additional Tailwind classes. Appended last (highest priority).
   * @default ""
   * @example "text-center mb-8"
   */
  customClasses = input<string>('');

  protected headingClasses = computed(() => {
    const baseClasses = 'tracking-tight font-sans';

    const sizeClasses: Record<string, string> = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl'
    };

    const weightClasses: Record<string, string> = {
      thin: 'font-thin',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black'
    };

    const colorClasses: Record<string, string> = {
      default: 'text-gray-900 dark:text-white',
      inherit: 'text-inherit dark:text-inherit',
      primary: 'text-text-primary dark:text-text-primary',
      secondary: 'text-text-secondary dark:text-text-secondary',
      muted: 'text-text-disabled dark:text-text-disabled'
    };

    const sizeClass = sizeClasses[this.size()] ?? sizeClasses["lg"];
    const weightClass = weightClasses[this.weight()] ?? weightClasses["bold"];
    const colorClass = colorClasses[this.color()] ?? colorClasses["default"];

    return [baseClasses, sizeClass, weightClass, colorClass, this.customClasses()]
      .filter(Boolean)
      .join(' ');
  });
}