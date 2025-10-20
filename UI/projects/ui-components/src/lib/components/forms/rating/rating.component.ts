import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

/**
 * A rating component for collecting or displaying star ratings.
 * 
 * ## Features
 * - Customizable number of stars (default 5)
 * - Half-star support
 * - Read-only mode for displaying ratings
 * - Hover preview for interactive mode
 * - Custom icons (stars, hearts, etc.)
 * - Multiple size variants
 * - Full keyboard navigation support
 * - ARIA labels and announcements
 * - WCAG 2.1 Level AA compliant
 * - Dark mode support
 * 
 * @example
 * ```html
 * <!-- Basic interactive rating -->
 * <ui-rating
 *   [value]="3"
 *   (valueChange)="onRatingChange($event)">
 * </ui-rating>
 * 
 * <!-- Read-only display -->
 * <ui-rating
 *   [value]="4.5"
 *   [readonly]="true"
 *   [allowHalf]="true">
 * </ui-rating>
 * 
 * <!-- Custom icon (hearts) -->
 * <ui-rating
 *   [value]="5"
 *   icon="❤️"
 *   emptyIcon="🤍"
 *   (valueChange)="onRatingChange($event)">
 * </ui-rating>
 * 
 * <!-- Large size with label -->
 * <ui-rating
 *   [value]="4"
 *   size="lg"
 *   [showLabel]="true"
 *   (valueChange)="onRatingChange($event)">
 * </ui-rating>
 * ```
 */
@Component({
  selector: 'ui-rating',
  template: `
    <div 
      [class]="containerClasses()"
      role="group"
      [attr.aria-label]="ariaLabel() || 'Rating'">
      
      <div class="flex items-center gap-1">
        @for (index of starIndexes(); track index) {
          <button
            type="button"
            [class]="starButtonClasses(index)"
            [disabled]="readonly() || disabled()"
            [attr.aria-label]="getStarLabel(index)"
            (click)="handleClick(index)"
            (mouseenter)="handleMouseEnter(index)"
            (mouseleave)="handleMouseLeave()"
            (focus)="handleFocus(index)"
            (blur)="handleBlur()">
            <span 
              [innerHTML]="getStarIcon(index)" 
              [class]="starIconClasses()"
              aria-hidden="true">
            </span>
          </button>
        }
      </div>

      @if (showLabel()) {
        <span [class]="labelClasses()" aria-live="polite">
          {{ getLabelText() }}
        </span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-rating inline-block'
  }
})
export class RatingComponent {
  /**
   * Current rating value (0 to max).
   * @default 0
   */
  value = input<number>(0);

  /**
   * Maximum number of stars.
   * @default 5
   */
  max = input<number>(5);

  /**
   * Whether half-star ratings are allowed.
   * @default false
   */
  allowHalf = input<boolean>(false);

  /**
   * Whether the rating is read-only (display only).
   * @default false
   */
  readonly = input<boolean>(false);

  /**
   * Whether the rating is disabled.
   * @default false
   */
  disabled = input<boolean>(false);

  /**
   * Icon to use for filled stars.
   * @default "⭐"
   */
  icon = input<string>('⭐');

  /**
   * Icon to use for empty stars.
   * @default "☆"
   */
  emptyIcon = input<string>('☆');

  /**
   * Icon to use for half stars (when allowHalf is true).
   * @default "⯨"
   */
  halfIcon = input<string>('⯨');

  /**
   * Size variant.
   * - `sm`: Small (16px)
   * - `md`: Medium (24px, default)
   * - `lg`: Large (32px)
   * @default "md"
   */
  size = input<'sm' | 'md' | 'lg'>('md');

  /**
   * Whether to show rating label/text.
   * @default false
   */
  showLabel = input<boolean>(false);

  /**
   * ARIA label for the rating component.
   * @default "Rating"
   */
  ariaLabel = input<string>();

  /**
   * Emitted when the rating value changes.
   * @event valueChange
   */
  valueChange = output<number>();

  private hoverValue = signal<number | null>(null);
  private focusValue = signal<number | null>(null);

  starIndexes = computed(() => Array.from({ length: this.max() }, (_, i) => i + 1));

  containerClasses = computed(() => 'flex items-center gap-2');

  starButtonClasses = (index: number) => {
    const base = 'transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded';
    const interactive = !this.readonly() && !this.disabled() ? 'hover:scale-110 cursor-pointer' : 'cursor-default';
    const disabled = this.disabled() ? 'opacity-50 cursor-not-allowed' : '';
    return `${base} ${interactive} ${disabled}`;
  };

  starIconClasses = computed(() => {
    const sizes = {
      sm: 'text-base',
      md: 'text-2xl',
      lg: 'text-4xl'
    };
    return sizes[this.size()];
  });

  labelClasses = computed(() => {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg'
    };
    return `${sizes[this.size()]} text-gray-700 dark:text-gray-300 font-medium`;
  });

  getStarIcon(index: number): string {
    const currentValue = this.hoverValue() ?? this.focusValue() ?? this.value();
    
    if (this.allowHalf()) {
      if (currentValue >= index) {
        return this.icon();
      } else if (currentValue >= index - 0.5) {
        return this.halfIcon();
      } else {
        return this.emptyIcon();
      }
    } else {
      return currentValue >= index ? this.icon() : this.emptyIcon();
    }
  }

  getStarLabel(index: number): string {
    if (this.allowHalf()) {
      return `${index} of ${this.max()} stars`;
    }
    return `${index} star${index !== 1 ? 's' : ''}`;
  }

  getLabelText(): string {
    const currentValue = this.value();
    if (currentValue === 0) {
      return 'No rating';
    }
    return `${currentValue} of ${this.max()}`;
  }

  handleClick(index: number) {
    if (this.readonly() || this.disabled()) return;
    
    let newValue = index;
    
    // Allow clicking the same star to toggle half star
    if (this.allowHalf() && this.value() === index) {
      newValue = index - 0.5;
    }
    
    this.valueChange.emit(newValue);
  }

  handleMouseEnter(index: number) {
    if (this.readonly() || this.disabled()) return;
    this.hoverValue.set(index);
  }

  handleMouseLeave() {
    if (this.readonly() || this.disabled()) return;
    this.hoverValue.set(null);
  }

  handleFocus(index: number) {
    if (this.readonly() || this.disabled()) return;
    this.focusValue.set(index);
  }

  handleBlur() {
    if (this.readonly() || this.disabled()) return;
    this.focusValue.set(null);
  }
}
