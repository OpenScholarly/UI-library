import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

@Component({
  selector: 'ui-skeleton',
  template: `
    <div [class]="skeletonClasses()" [style]="skeletonStyles()"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonComponent {
  variant = input<SkeletonVariant>('text');
  width = input<string>('');
  height = input<string>('');
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