import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LoaderType, LoaderSize, LoaderVariant } from '../../../types';

/**
 * A versatile and accessible loader component for indicating loading states.
 *
 * ## Features
 * - Multiple loader types (spinner, dots, pulse, bars, ring)
 * - Comprehensive size options (xs, small, medium, large, xl)
 * - Visual variants (default, primary, secondary, success, warning, danger, info)
 * - Optional text label
 * - Center alignment option
 * - Full screen reader support with ARIA attributes
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 * - Smooth animations
 *
 * @example
 * ```html
 * <!-- Basic spinner loader -->
 * <ui-loader />
 *
 * <!-- Loader with label -->
 * <ui-loader
 *   label="Loading data..."
 *   variant="primary">
 * </ui-loader>
 *
 * <!-- Dots loader -->
 * <ui-loader
 *   type="dots"
 *   size="lg">
 * </ui-loader>
 *
 * <!-- Pulse loader -->
 * <ui-loader
 *   type="pulse"
 *   variant="success">
 * </ui-loader>
 *
 * <!-- Bars loader -->
 * <ui-loader
 *   type="bars"
 *   variant="info"
 *   size="sm">
 * </ui-loader>
 *
 * <!-- Ring loader centered -->
 * <ui-loader
 *   type="ring"
 *   [center]="true"
 *   variant="primary">
 * </ui-loader>
 *
 * <!-- Different sizes -->
 * <ui-loader size="xs" />
 * <ui-loader size="sm" />
 * <ui-loader size="md" />
 * <ui-loader size="lg" />
 * <ui-loader size="xl" />
 *
 * <!-- With custom screen reader text -->
 * <ui-loader
 *   screenReaderText="Processing your request..."
 *   ariaLabel="Processing">
 * </ui-loader>
 * ```
 */
@Component({
  selector: 'ui-loader',
  standalone: true,
  template: `
    <div [class]="wrapperClasses()" [attr.aria-label]="ariaLabel()" role="status">
      @switch (type()) {
        @case ('spinner') {
          <svg [class]="spinnerClasses()" fill="none" viewBox="0 0 24 24">
            <circle
              [class]="spinnerCircleClasses()"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4">
            </circle>
            <path
              [class]="spinnerPathClasses()"
              fill="currentColor"
              d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z">
            </path>
          </svg>
        }

        @case ('dots') {
          <div [class]="dotsContainerClasses()">
            <div [class]="dotClasses()" style="animation-delay: 0ms"></div>
            <div [class]="dotClasses()" style="animation-delay: 150ms"></div>
            <div [class]="dotClasses()" style="animation-delay: 300ms"></div>
          </div>
        }

        @case ('pulse') {
          <div [class]="pulseClasses()"></div>
        }

        @case ('bars') {
          <div [class]="barsContainerClasses()">
            <div [class]="barClasses()" style="animation-delay: 0ms"></div>
            <div [class]="barClasses()" style="animation-delay: 150ms"></div>
            <div [class]="barClasses()" style="animation-delay: 300ms"></div>
            <div [class]="barClasses()" style="animation-delay: 450ms"></div>
          </div>
        }

        @case ('ring') {
          <div [class]="ringClasses()">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        }
      }

      @if (label()) {
        <span [class]="labelClasses()">{{ label() }}</span>
      }

      <span class="sr-only">{{ screenReaderText() }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  /**
   * Type of loader animation.
   * - `spinner`: Spinning circle (default)
   * - `dots`: Three bouncing dots
   * - `pulse`: Pulsing circle
   * - `bars`: Four animated bars
   * - `ring`: Rotating ring
   * @default "spinner"
   */
  type = input<LoaderType>('spinner');
  
  /**
   * Size of the loader.
   * - `xs`: Extra small
   * - `sm`: Small
   * - `md`: Medium (default)
   * - `lg`: Large
   * - `xl`: Extra large
   * @default "md"
   */
  size = input<LoaderSize>('md');
  
  /**
   * Visual style variant of the loader.
   * - `default`: Gray loader (default)
   * - `primary`: Primary color loader
   * - `secondary`: Secondary color loader
   * - `success`: Green success loader
   * - `warning`: Yellow warning loader
   * - `danger`: Red danger loader
   * - `info`: Blue info loader
   * @default "default"
   */
  variant = input<LoaderVariant>('default');
  
  /**
   * Optional text label displayed next to the loader.
   * @default ""
   * @example "Loading data..."
   */
  label = input<string>('');
  
  /**
   * ARIA label for screen readers.
   * @default "Loading"
   * @example "Processing request"
   */
  ariaLabel = input<string>('Loading');
  
  /**
   * Screen reader text for accessibility.
   * Provides additional context to assistive technologies.
   * @default "Loading, please wait..."
   * @example "Fetching your data, this may take a moment"
   */
  screenReaderText = input<string>('Loading, please wait...');
  
  /**
   * Centers the loader horizontally within its container.
   * @default false
   */
  center = input(false);

  protected wrapperClasses = computed(() => {
    const baseClasses = 'ui-loader inline-flex items-center gap-2';
    const centerClasses = this.center() ? 'justify-center w-full' : '';
    return `${baseClasses} ${centerClasses}`.trim();
  });

  // Spinner classes
  protected spinnerClasses = computed(() => {
    const baseClasses = 'animate-spin';
    const sizeClasses = this.getSizeClasses();
    const colorClasses = this.getColorClasses();
    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  });

  protected spinnerCircleClasses = computed(() => {
    return 'opacity-25';
  });

  protected spinnerPathClasses = computed(() => {
    return 'opacity-75';
  });

  // Dots classes
  protected dotsContainerClasses = computed(() => {
    const baseClasses = 'flex gap-1';
    return baseClasses;
  });

  protected dotClasses = computed(() => {
    const baseClasses = 'rounded-full animate-pulse';
    const sizeClasses = this.getDotSizeClasses();
    const colorClasses = this.getColorClasses();
    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  });

  // Pulse classes
  protected pulseClasses = computed(() => {
    const baseClasses = 'rounded-full animate-pulse';
    const sizeClasses = this.getPulseSizeClasses();
    const colorClasses = this.getColorClasses();
    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  });

  // Bars classes
  protected barsContainerClasses = computed(() => {
    const baseClasses = 'flex items-end gap-1';
    return baseClasses;
  });

  protected barClasses = computed(() => {
    const baseClasses = 'bg-current animate-pulse';
    const sizeClasses = this.getBarSizeClasses();
    const colorClasses = this.getColorClasses();
    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  });

  // Ring classes
  protected ringClasses = computed(() => {
    const baseClasses = 'relative';
    const sizeClasses = this.getRingSizeClasses();
    const colorClasses = this.getColorClasses();

    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  });

  // Label classes
  protected labelClasses = computed(() => {
    const baseClasses = 'text-sm font-medium';
    const colorClasses = this.getTextColorClasses();
    return `${baseClasses} ${colorClasses}`;
  });

  // Size utilities
  private getSizeClasses(): string {
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };
    return sizeClasses[this.size()];
  }

  private getDotSizeClasses(): string {
    const sizeClasses = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4'
    };
    return sizeClasses[this.size()];
  }

  private getPulseSizeClasses(): string {
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };
    return sizeClasses[this.size()];
  }

  private getBarSizeClasses(): string {
    const sizeClasses = {
      xs: 'w-0.5 h-3',
      sm: 'w-0.5 h-4',
      md: 'w-1 h-6',
      lg: 'w-1 h-8',
      xl: 'w-1.5 h-12'
    };
    return sizeClasses[this.size()];
  }

  private getRingSizeClasses(): string {
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };
    return sizeClasses[this.size()];
  }

  // Color utilities
  private getColorClasses(): string {
    const colorClasses = {
      default: 'text-gray-600 dark:text-gray-400',
      primary: 'text-primary-600 dark:text-primary-400',
      secondary: 'text-gray-500 dark:text-gray-500',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-500 dark:text-yellow-400',
      danger: 'text-red-600 dark:text-red-400',
      info: 'text-blue-600 dark:text-blue-400'
    };
    return colorClasses[this.variant()];
  }

  private getTextColorClasses(): string {
    const colorClasses = {
      default: 'text-gray-700 dark:text-gray-300',
      primary: 'text-primary-700 dark:text-primary-300',
      secondary: 'text-gray-600 dark:text-gray-400',
      success: 'text-green-700 dark:text-green-300',
      warning: 'text-yellow-600 dark:text-yellow-400',
      danger: 'text-red-700 dark:text-red-300',
      info: 'text-blue-700 dark:text-blue-300'
    };
    return colorClasses[this.variant()];
  }
}
