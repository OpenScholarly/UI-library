import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ProgressType, ProgressSize, ProgressVariant } from '../../../types';

/**
 * A versatile and accessible progress indicator component for showing task completion.
 *
 * ## Features
 * - Two types: linear (bar) and circular
 * - Multiple visual variants (default, primary, success, warning, danger, info)
 * - Comprehensive size options (small, medium, large)
 * - Optional label and description
 * - Percentage display
 * - Animated progress bars
 * - Indeterminate state for unknown progress
 * - Full screen reader support with ARIA attributes
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 * - Smooth animations
 *
 * @example
 * ```html
 * <!-- Basic linear progress -->
 * <ui-progress [value]="75" label="Upload progress" />
 *
 * <!-- Circular progress -->
 * <ui-progress
 *   type="circular"
 *   [value]="60"
 *   variant="primary"
 *   size="lg">
 * </ui-progress>
 *
 * <!-- Progress with description -->
 * <ui-progress
 *   [value]="45"
 *   label="Installation"
 *   description="Installing dependencies..."
 *   variant="success">
 * </ui-progress>
 *
 * <!-- Animated progress -->
 * <ui-progress
 *   [value]="80"
 *   [animated]="true"
 *   variant="primary">
 * </ui-progress>
 *
 * <!-- Indeterminate progress -->
 * <ui-progress
 *   [indeterminate]="true"
 *   label="Loading..."
 *   variant="info">
 * </ui-progress>
 *
 * <!-- Progress without percentage -->
 * <ui-progress
 *   [value]="33"
 *   [showPercentage]="false"
 *   label="Step 1 of 3">
 * </ui-progress>
 *
 * <!-- Small circular progress -->
 * <ui-progress
 *   type="circular"
 *   size="sm"
 *   [value]="90"
 *   [showLabel]="false"
 *   variant="success">
 * </ui-progress>
 *
 * <!-- Danger state progress -->
 * <ui-progress
 *   [value]="15"
 *   label="Low battery"
 *   variant="danger">
 * </ui-progress>
 * ```
 */
@Component({
  selector: 'ui-progress',
  standalone: true,
  template: `
    @if (type() === 'linear') {
      <div [class]="linearWrapperClasses()">
        @if (showLabel() && label()) {
          <div [class]="labelRowClasses()">
            <span [class]="labelClasses()">{{ label() }}</span>
            @if (showPercentage()) {
              <span [class]="percentageClasses()">{{ Math.round(value()) }}%</span>
            }
          </div>
        }

        <div [class]="linearTrackClasses()" [attr.role]="'progressbar'" [attr.aria-valuenow]="value()" [attr.aria-valuemin]="0" [attr.aria-valuemax]="100" [attr.aria-label]="ariaLabel()">
          <div [class]="linearBarClasses()" [style.width.%]="value()">
            @if (animated()) {
              <div [class]="linearAnimationClasses()"></div>
            }
          </div>
        </div>

        @if (description()) {
          <p [class]="descriptionClasses()">{{ description() }}</p>
        }
      </div>
    } @else {
      <div [class]="circularWrapperClasses()">
        <div [class]="circularContainerClasses()">
          <svg [class]="circularSvgClasses()" viewBox="0 0 36 36">
            <!-- Background circle -->
            <path
              [class]="circularBackgroundClasses()"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <!-- Progress circle -->
            <path
              [class]="circularProgressClasses()"
              [style.stroke-dasharray]="getStrokeDasharray()"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          @if (showPercentage() || label()) {
            <div [class]="circularContentClasses()">
              @if (showPercentage()) {
                <span [class]="circularPercentageClasses()">{{ Math.round(value()) }}%</span>
              }
              @if (label()) {
                <span [class]="circularLabelClasses()">{{ label() }}</span>
              }
            </div>
          }
        </div>

        @if (description()) {
          <p [class]="descriptionClasses()">{{ description() }}</p>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressComponent {
  /**
   * Type of progress indicator.
   * - `linear`: Horizontal progress bar (default)
   * - `circular`: Circular progress ring
   * @default "linear"
   */
  type = input<ProgressType>('linear');
  
  /**
   * Current progress value (0-100).
   * @default 0
   * @example 75 for 75% complete
   */
  value = input<number>(0);
  
  /**
   * Size of the progress indicator.
   * - `sm`: Small
   * - `md`: Medium (default)
   * - `lg`: Large
   * @default "md"
   */
  size = input<ProgressSize>('md');
  
  /**
   * Visual style variant of the progress indicator.
   * - `default`: Gray progress (default)
   * - `primary`: Primary color progress
   * - `success`: Green success progress
   * - `warning`: Yellow warning progress
   * - `danger`: Red danger progress
   * - `info`: Blue info progress
   * @default "default"
   */
  variant = input<ProgressVariant>('default');
  
  /**
   * Label text displayed with the progress.
   * @default ""
   * @example "Uploading files"
   */
  label = input<string>('');
  
  /**
   * Description text displayed below the progress.
   * Provides additional context.
   * @default ""
   * @example "Please wait while we process your request"
   */
  description = input<string>('');
  
  /**
   * ARIA label for screen readers.
   * @default "Progress"
   * @example "File upload progress"
   */
  ariaLabel = input<string>('Progress');
  
  /**
   * Shows or hides the label.
   * @default true
   */
  showLabel = input(true);
  
  /**
   * Shows or hides the percentage value.
   * @default true
   */
  showPercentage = input(true);
  
  /**
   * Enables animated stripes on linear progress bar.
   * @default false
   */
  animated = input(false);
  
  /**
   * Shows indeterminate progress (unknown completion).
   * Useful for operations where progress cannot be calculated.
   * @default false
   */
  indeterminate = input(false);

  // Expose Math.round for template
  protected Math = Math;

  // Linear progress classes
  protected linearWrapperClasses = computed(() => {
    return 'w-full';
  });

  protected labelRowClasses = computed(() => {
    return 'flex justify-between items-center mb-1';
  });

  protected labelClasses = computed(() => {
    return 'text-sm font-medium text-gray-900 dark:text-gray-100';
  });

  protected percentageClasses = computed(() => {
    return 'text-sm font-medium text-gray-600 dark:text-gray-400';
  });

  protected linearTrackClasses = computed(() => {
    const baseClasses = 'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden';
    const sizeClasses = this.getLinearSizeClasses();
    return `${baseClasses} ${sizeClasses}`;
  });

  protected linearBarClasses = computed(() => {
    const baseClasses = 'h-full ui-transition-all';
    const colorClasses = this.getColorClasses();
    const animationClasses = this.indeterminate() ? 'animate-pulse' : '';
    return `${baseClasses} ${colorClasses} ${animationClasses}`;
  });

  protected linearAnimationClasses = computed(() => {
    return 'h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse';
  });

  // Circular progress classes
  protected circularWrapperClasses = computed(() => {
    return 'flex flex-col items-center';
  });

  protected circularContainerClasses = computed(() => {
    return 'relative inline-flex items-center justify-center';
  });

  protected circularSvgClasses = computed(() => {
    const sizeClasses = this.getCircularSizeClasses();
    const animationClasses = this.indeterminate() ? 'animate-spin' : '';
    return `${sizeClasses} ${animationClasses}`;
  });

  protected circularBackgroundClasses = computed(() => {
    return 'fill-none stroke-gray-200 dark:stroke-gray-700';
  });

  protected circularProgressClasses = computed(() => {
    const baseClasses = 'fill-none stroke-linecap-round ui-transition-all';
    const colorClasses = this.getStrokeColorClasses();
    const strokeWidth = this.getStrokeWidth();
    return `${baseClasses} ${colorClasses} ${strokeWidth}`;
  });

  protected circularContentClasses = computed(() => {
    return 'absolute inset-0 flex flex-col items-center justify-center';
  });

  protected circularPercentageClasses = computed(() => {
    const sizeClasses = this.getCircularTextSizeClasses();
    return `font-semibold text-gray-900 dark:text-gray-100 ${sizeClasses}`;
  });

  protected circularLabelClasses = computed(() => {
    const sizeClasses = this.getCircularLabelSizeClasses();
    return `text-gray-600 dark:text-gray-400 ${sizeClasses}`;
  });

  protected descriptionClasses = computed(() => {
    return 'mt-2 text-sm text-gray-600 dark:text-gray-400 text-center';
  });

  // Size utilities
  private getLinearSizeClasses(): string {
    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
      xl: 'h-4'
    };
    return sizeClasses[this.size()];
  }

  private getCircularSizeClasses(): string {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-24 h-24'
    };
    return sizeClasses[this.size()];
  }

  private getCircularTextSizeClasses(): string {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
      xl: 'text-lg'
    };
    return sizeClasses[this.size()];
  }

  private getCircularLabelSizeClasses(): string {
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-xs',
      lg: 'text-sm',
      xl: 'text-base'
    };
    return sizeClasses[this.size()];
  }

  private getStrokeWidth(): string {
    const strokeWidths = {
      sm: 'stroke-2',
      md: 'stroke-2',
      lg: 'stroke-3',
      xl: 'stroke-3'
    };
    return strokeWidths[this.size()];
  }

  // Color utilities
  private getColorClasses(): string {
    const colorClasses = {
      default: 'bg-gray-600',
      primary: 'bg-primary-600',
      secondary: 'bg-gray-500',
      success: 'bg-green-600',
      warning: 'bg-yellow-500',
      danger: 'bg-red-600',
      info: 'bg-blue-600'
    };
    return colorClasses[this.variant()];
  }

  private getStrokeColorClasses(): string {
    const colorClasses = {
      default: 'stroke-gray-600',
      primary: 'stroke-primary-600',
      secondary: 'stroke-gray-500',
      success: 'stroke-green-600',
      warning: 'stroke-yellow-500',
      danger: 'stroke-red-600',
      info: 'stroke-blue-600'
    };
    return colorClasses[this.variant()];
  }

  // Circular progress calculation
  protected getStrokeDasharray(): string {
    if (this.indeterminate()) {
      return '25 75'; // Animated indeterminate state
    }

    // Calculate stroke dash array for progress
    const circumference = 100; // This matches our SVG path
    const progress = Math.max(0, Math.min(100, this.value()));
    const dashArray = (progress / 100) * circumference;

    return `${dashArray} ${circumference}`;
  }

  // Public methods
  increment(amount: number = 1): void {
    const newValue = Math.min(100, this.value() + amount);
    // Note: This would need to be implemented with a signal update in a real component
    // For now, this is just the API design
  }

  decrement(amount: number = 1): void {
    const newValue = Math.max(0, this.value() - amount);
    // Note: This would need to be implemented with a signal update in a real component
  }

  reset(): void {
    // Reset to 0
    // Note: This would need to be implemented with a signal update in a real component
  }

  complete(): void {
    // Set to 100%
    // Note: This would need to be implemented with a signal update in a real component
  }
}
