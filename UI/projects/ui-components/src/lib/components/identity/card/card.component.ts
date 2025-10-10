import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CardVariant } from '../../../types';

/**
 * A versatile and accessible card component for grouping related content.
 *
 * ## Features
 * - Multiple visual variants (default, elevated, outlined, glass)
 * - Flexible padding options (none, small, medium, large)
 * - Configurable border radius (none, small, medium, large)
 * - Dark mode support
 * - Smooth transitions
 * - Content projection support for flexible layouts
 *
 * @example
 * ```html
 * <!-- Basic card -->
 * <ui-card>
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </ui-card>
 *
 * <!-- Elevated card with shadow -->
 * <ui-card variant="elevated">
 *   <h3>Elevated Card</h3>
 *   <p>This card has a shadow effect</p>
 * </ui-card>
 *
 * <!-- Outlined card -->
 * <ui-card variant="outlined" padding="lg">
 *   <h3>Prominent Border</h3>
 *   <p>With large padding</p>
 * </ui-card>
 *
 * <!-- Glass effect card -->
 * <ui-card variant="glass" rounded="lg">
 *   <h3>Glass Morphism</h3>
 *   <p>Semi-transparent with blur effect</p>
 * </ui-card>
 *
 * <!-- Card with no padding -->
 * <ui-card padding="none">
 *   <img src="image.jpg" alt="Full width image" />
 *   <div class="p-4">
 *     <h3>Image Card</h3>
 *     <p>Content with custom padding</p>
 *   </div>
 * </ui-card>
 *
 * <!-- Card with small padding and small radius -->
 * <ui-card padding="sm" rounded="sm">
 *   <h4>Compact Card</h4>
 *   <p>Less padding and subtle corners</p>
 * </ui-card>
 * ```
 */
@Component({
  selector: 'ui-card',
  standalone: true,
  template: `
    <div [class]="cardClasses()" [style]="cardStyles()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  /**
   * Visual style variant of the card.
   * - `default`: Standard card with border
   * - `elevated`: Card with shadow effect
   * - `outlined`: Card with prominent border
   * - `glass`: Semi-transparent card with blur effect
   * @default "default"
   */
  variant = input<CardVariant>('default');
  
  /**
   * Padding size applied to card content.
   * - `none`: No padding (0)
   * - `sm`: Small padding (16px)
   * - `md`: Medium padding (24px) - default
   * - `lg`: Large padding (32px)
   * @default "md"
   */
  padding = input<'none' | 'sm' | 'md' | 'lg'>('md');
  
  /**
   * Border radius size of the card.
   * - `none`: Square corners
   * - `sm`: Small radius (4px)
   * - `md`: Medium radius (8px) - default
   * - `lg`: Large radius (12px)
   * @default "md"
   */
  rounded = input<'none' | 'sm' | 'md' | 'lg'>('md');


  /**
   * Background color variant of the card.
   * - `default`: Standard white/gray-800 background
   * - `primary`: Primary brand color background
   * - `secondary`: Secondary color background
   * - `accent`: Accent color background
   * - `surface`: Surface color variant
   * - `success`: Success green background
   * - `warning`: Warning yellow background
   * - `error`: Error red background
   * @default "default"
   */
  background = input<'default' | 'primary' | 'secondary' | 'accent' | 'surface' | 'success' | 'warning' | 'error'>('default');

  /**
   * Additional Tailwind CSS classes to apply.
   * @default ""
   * @example "shadow-xl border-blue-500"
   */
  customClasses = input<string>('');

  /**
   * URL for an image to be used as the card's background.
   * When provided, this will override the `background` color property.
   * The image will be displayed with `background-size: cover` and `background-position: center`.
   * @default null
   */
  imageUrl = input<string | null>(null);

  /**
   * Consumer-provided CSS classes via the `class` attribute on the component.
   * This allows using `<ui-card class="custom-class">` and have it merge correctly.
   */
  hostClasses = input<string>('', { alias: 'class' });

  protected cardStyles = computed(() => {
    const url = this.imageUrl();
    if (url) {
      return {
        'background-image': `url('${url}')`,
        'background-size': 'cover',
        'background-position': 'center'
      };
    }
    return {};
  });

  protected cardClasses = computed(() => {
    const baseClasses = 'transition-all duration-200';

    const backgrounds = {
      default: 'bg-white dark:bg-gray-800',
      primary: 'bg-primary-500 text-white',
      secondary: 'bg-secondary-500 text-white',
      accent: 'bg-accent-500 text-white',
      surface: 'bg-gray-100 dark:bg-gray-700',
      success: 'bg-success-500 text-white',
      warning: 'bg-warning-500 text-black',
      error: 'bg-error-500 text-white'
    };

    const variants = {
      default: 'border border-gray-200 dark:border-gray-700',
      elevated: 'shadow-lg border border-gray-100 dark:border-gray-800 dark:shadow-2xl',
      outlined: 'border-2 border-gray-300 dark:border-gray-600',
      glass: 'ui-glass border border-white/20 dark:border-white/10'
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

    // If an image URL is provided, don't apply a background color class
    const backgroundClass = this.imageUrl() ? '' : backgrounds[this.background()];
    const variantClass = variants[this.variant()];
    const paddingClass = paddings[this.padding()];
    const roundedClass = roundedClasses[this.rounded()];

    return [
      baseClasses,
      backgroundClass,
      variantClass,
      paddingClass,
      roundedClass,
      this.customClasses(),
      this.hostClasses()
    ].filter(Boolean).join(' ');
  });
}
