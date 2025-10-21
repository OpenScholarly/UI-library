import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export type RatingSize = 'sm' | 'md' | 'lg';

/**
 * An interactive star rating component for collecting or displaying ratings.
 * 
 * ## Features
 * - Interactive and read-only modes
 * - Half-star support for decimal ratings
 * - Customizable icons (stars, hearts, etc.)
 * - Three size variants (sm, md, lg)
 * - Hover preview for interactive ratings
 * - Full keyboard navigation support
 * - Optional rating label display
 * - ARIA announcements for accessibility
 * - WCAG 2.1 Level AA compliant
 * 
 * @example
 * ```html
 * <!-- Interactive rating -->
 * <ui-rating
 *   [value]="4.5"
 *   [allowHalf]="true"
 *   [showLabel]="true"
 *   size="lg"
 *   (valueChange)="handleRatingChange($event)">
 * </ui-rating>
 * 
 * <!-- Read-only rating display -->
 * <ui-rating
 *   [value]="4.2"
 *   [readonly]="true"
 *   [allowHalf]="true"
 *   customIcon="❤️">
 * </ui-rating>
 * ```
 */
@Component({
  selector: 'ui-rating',
  imports: [CommonModule],
  template: `
    <div
      [class]="containerClasses()"
      role="group"
      [attr.aria-label]="ariaLabel()">
      
      <!-- Rating stars -->
      <div class="flex items-center gap-1">
        @for (star of stars(); track star) {
          <button
            type="button"
            [class]="starButtonClasses()"
            [disabled]="readonly()"
            (click)="onStarClick(star)"
            (mouseenter)="onStarHover(star)"
            (mouseleave)="onMouseLeave()"
            [attr.aria-label]="getStarAriaLabel(star)"
            [attr.tabindex]="readonly() ? -1 : 0">
            <span [class]="starIconClasses(star)" [attr.aria-hidden]="true">
              {{ getStarIcon(star) }}
            </span>
          </button>
        }
      </div>

      <!-- Rating label -->
      @if (showLabel() && value() > 0) {
        <span class="text-sm text-gray-600 dark:text-gray-400 ml-2">
          {{ value() }} / {{ count() }}
        </span>
      }

      <!-- Screen reader announcement -->
      <span class="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {{ ariaAnnouncement() }}
      </span>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingComponent {
  /**
   * Current rating value.
   * @default 0
   */
  value = input<number>(0);

  /**
   * Total number of stars.
   * @default 5
   */
  count = input<number>(5);

  /**
   * Whether to allow half-star ratings.
   * @default false
   */
  allowHalf = input<boolean>(false);

  /**
   * Whether the rating is read-only.
   * @default false
   */
  readonly = input<boolean>(false);

  /**
   * Custom icon to use instead of stars.
   * @default "★"
   */
  customIcon = input<string>('★');

  /**
   * Size variant of the rating.
   * @default "md"
   */
  size = input<RatingSize>('md');

  /**
   * Whether to show the numeric rating label.
   * @default false
   */
  showLabel = input<boolean>(false);

  /**
   * ARIA label for the rating group.
   * @default "Rating"
   */
  ariaLabel = input<string>('Rating');

  /**
   * Emitted when the rating value changes.
   */
  valueChange = output<number>();

  private hoverValue = signal<number>(0);

  stars = computed(() => Array.from({ length: this.count() }, (_, i) => i + 1));

  containerClasses = computed(() => {
    return 'inline-flex items-center';
  });

  starButtonClasses = computed(() => {
    const base = 'transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded';
    const disabled = this.readonly() ? 'cursor-default' : 'cursor-pointer';
    return `${base} ${disabled}`;
  });

  starIconClasses(star: number): string {
    const sizes: Record<RatingSize, string> = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-3xl'
    };
    const size = sizes[this.size()];
    const displayValue = this.hoverValue() || this.value();
    const filled = star <= displayValue;
    const half = this.allowHalf() && star === Math.ceil(displayValue) && displayValue % 1 !== 0;
    
    let color = '';
    if (filled || half) {
      color = 'text-yellow-400';
    } else {
      color = 'text-gray-300 dark:text-gray-600';
    }
    
    return `${size} ${color} transition-colors`;
  }

  getStarIcon(star: number): string {
    const displayValue = this.hoverValue() || this.value();
    const filled = star <= displayValue;
    const half = this.allowHalf() && star === Math.ceil(displayValue) && displayValue % 1 !== 0;
    
    if (filled) {
      return this.customIcon();
    } else if (half) {
      // Use half-filled version if available, otherwise use empty
      return this.customIcon() === '★' ? '½' : this.customIcon();
    } else {
      // Empty star
      return this.customIcon() === '★' ? '☆' : this.customIcon();
    }
  }

  getStarAriaLabel(star: number): string {
    if (this.readonly()) {
      return `Star ${star}`;
    }
    return `Rate ${star} out of ${this.count()} stars`;
  }

  ariaAnnouncement = computed(() => {
    const val = this.value();
    if (val === 0) {
      return 'No rating';
    }
    return `Rating: ${val} out of ${this.count()} stars`;
  });

  onStarClick(star: number): void {
    if (this.readonly()) return;
    
    let newValue = star;
    
    // If clicking the same star, toggle half value
    if (this.allowHalf() && star === this.value()) {
      newValue = star - 0.5;
    }
    
    this.valueChange.emit(newValue);
  }

  onStarHover(star: number): void {
    if (this.readonly()) return;
    this.hoverValue.set(star);
  }

  onMouseLeave(): void {
    if (this.readonly()) return;
    this.hoverValue.set(0);
  }
}
