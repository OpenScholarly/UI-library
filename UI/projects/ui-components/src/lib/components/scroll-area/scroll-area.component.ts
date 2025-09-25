import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ScrollAreaDirection = 'vertical' | 'horizontal' | 'both';
export type ScrollAreaSize = 'sm' | 'md' | 'lg' | 'full';

/**
 * ScrollAreaComponent provides a customizable scrollable container.
 *
 * **Scrollbar Styling Requirements:**
 *
 * For enhanced scrollbar styling, install the Tailwind CSS Scrollbar plugin:
 * ```bash
 * npm install -D tailwind-scrollbar
 * ```
 *
 * Add to your tailwind.config.js:
 * ```js
 * module.exports = {
 *   plugins: [
 *     require('tailwind-scrollbar')({ nocompatible: true }),
 *   ],
 * }
 * ```
 *
 * **Alternative:** Use the `useNativeScrollbar` input to rely on browser default scrollbars.
 */
@Component({
  selector: 'ui-scroll-area',
  standalone: true,
  template: `
    <div [class]="containerClasses()">
      <div
        [class]="scrollClasses()"
        [style]="customStyles()">
        <ng-content />
      </div>
    </div>
  `,
  styles: [`
    .scroll-area-native::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .scroll-area-native::-webkit-scrollbar-track {
      background: rgb(243 244 246);
      border-radius: 4px;
    }
    .scroll-area-native::-webkit-scrollbar-thumb {
      background: rgb(156 163 175);
      border-radius: 4px;
    }
    .scroll-area-native::-webkit-scrollbar-thumb:hover {
      background: rgb(107 114 128);
    }
    .dark .scroll-area-native::-webkit-scrollbar-track {
      background: rgb(31 41 55);
    }
    .dark .scroll-area-native::-webkit-scrollbar-thumb {
      background: rgb(75 85 99);
    }
    .dark .scroll-area-native::-webkit-scrollbar-thumb:hover {
      background: rgb(107 114 128);
    }
    .scroll-area-hidden::-webkit-scrollbar {
      display: none;
    }
    .scroll-area-hidden {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollAreaComponent {
  direction = input<ScrollAreaDirection>('vertical');
  size = input<ScrollAreaSize>('md');
  maxHeight = input<string>('');
  maxWidth = input<string>('');
  showScrollbar = input(true);
  rounded = input(true);
  /** Use native CSS scrollbar styling instead of Tailwind plugin classes */
  useNativeScrollbar = input(false);

  protected containerClasses = computed(() => {
    const baseClasses = 'relative';
    const roundedClass = this.rounded() ? 'rounded-md' : '';

    return `${baseClasses} ${roundedClass}`.trim();
  });

  protected scrollClasses = computed(() => {
    const baseClasses = 'scroll-smooth';

    const directionClasses = {
      vertical: 'overflow-y-auto overflow-x-hidden',
      horizontal: 'overflow-x-auto overflow-y-hidden',
      both: 'overflow-auto'
    };

    const sizeClasses = {
      sm: 'max-h-32',
      md: 'max-h-48',
      lg: 'max-h-64',
      full: 'h-full'
    };

    const directionClass = directionClasses[this.direction()];
    const sizeClass = this.maxHeight() ? '' : sizeClasses[this.size()];

    // Scrollbar styling approach
    let scrollbarClasses = '';
    if (this.useNativeScrollbar()) {
      // Use component's native CSS styles
      scrollbarClasses = this.showScrollbar() ? 'scroll-area-native' : 'scroll-area-hidden';
    } else {
      // Use Tailwind scrollbar plugin classes (requires tailwind-scrollbar plugin)
      scrollbarClasses = this.showScrollbar()
        ? 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800'
        : 'scrollbar-hide';
    }

    return `${baseClasses} ${directionClass} ${sizeClass} ${scrollbarClasses}`.trim();
  });

  protected customStyles = computed(() => {
    const styles: Record<string, string> = {};

    if (this.maxHeight()) {
      styles['max-height'] = this.maxHeight();
    }
    if (this.maxWidth()) {
      styles['max-width'] = this.maxWidth();
    }

    return styles;
  });
}
