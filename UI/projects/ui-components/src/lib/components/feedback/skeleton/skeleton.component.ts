import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SkeletonVariant } from '../../../types';

/**
 * A versatile and accessible skeleton component for loading placeholders.
 *
 * ## Features
 * - Multiple shape variants (text, circular, rectangular, rounded)
 * - Configurable width and height
 * - Optional pulse animation
 * - Dark mode support
 * - Screen reader friendly
 *
 * @example
 * ```html
 * <!-- Text skeleton -->
 * <ui-skeleton variant="text" />
 *
 * <!-- Circular skeleton (avatar) -->
 * <ui-skeleton variant="circular" width="40px" height="40px" />
 *
 * <!-- Rectangular skeleton (image) -->
 * <ui-skeleton variant="rectangular" width="100%" height="200px" />
 *
 * <!-- Rounded skeleton (card) -->
 * <ui-skeleton variant="rounded" height="120px" />
 *
 * <!-- Without animation -->
 * <ui-skeleton [animation]="false" />
 *
 * <!-- Custom dimensions -->
 * <ui-skeleton width="300px" height="24px" />
 * ```
 */
@Component({
  selector: 'ui-skeleton',
  standalone: true,
  template: `
    <div [class]="skeletonClasses()" [style]="skeletonStyles()"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonComponent {
  /**
   * Shape variant of the skeleton.
   * - `text`: Text line skeleton (default)
   * - `circular`: Circle skeleton (e.g., avatar)
   * - `rectangular`: Rectangle skeleton (e.g., image)
   * - `rounded`: Rounded rectangle skeleton (e.g., card)
   * @default "text"
   */
  variant = input<SkeletonVariant>('text');
  
  /**
   * Width of the skeleton.
   * Accepts CSS units (px, %, rem, etc.).
   * @default "" (uses variant default)
   * @example "200px" or "100%"
   */
  width = input<string>('');
  
  /**
   * Height of the skeleton.
   * Accepts CSS units (px, %, rem, etc.).
   * @default "" (uses variant default)
   * @example "40px" or "200px"
   */
  height = input<string>('');
  
  /**
   * Enables pulse animation.
   * @default true
   */
  animation = input(true);

  protected skeletonClasses = computed(() => {
    const baseClasses = 'bg-gray-300 dark:bg-gray-700';

    const variantClasses = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: '',
      rounded: 'rounded-lg'
    };

    const animationClasses = this.animation() ? 'animate-pulse' : '';
    const variantClass = variantClasses[this.variant()];

    return `${baseClasses} ${variantClass} ${animationClasses}`.trim();
  });

  protected skeletonStyles = computed(() => {
    const styles: { [key: string]: string } = {};

    if (this.width()) {
      styles['width'] = this.width();
    } else {
      // Default widths based on variant
      switch (this.variant()) {
        case 'text':
          styles['width'] = '100%';
          break;
        case 'circular':
          styles['width'] = '40px';
          break;
        case 'rectangular':
        case 'rounded':
          styles['width'] = '100%';
          break;
      }
    }

    if (this.height()) {
      styles['height'] = this.height();
    } else {
      // Default heights based on variant
      switch (this.variant()) {
        case 'text':
          styles['height'] = '1rem';
          break;
        case 'circular':
          styles['height'] = '40px';
          break;
        case 'rectangular':
        case 'rounded':
          styles['height'] = '120px';
          break;
      }
    }

    // Convert styles object to CSS string
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  });
}
