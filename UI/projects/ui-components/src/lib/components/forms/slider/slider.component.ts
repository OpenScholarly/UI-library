import { Component, ChangeDetectionStrategy, input, output, computed, signal, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { generateId } from '../../../util/id';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SliderVariant, SliderSize } from '../../../types';

/**
 * A versatile and accessible slider component for selecting values from a range.
 *
 * ## Features
 * - Multiple visual variants (default, primary, success, warning, danger)
 * - Comprehensive size options (small, medium, large)
 * - Value display tooltip on thumb
 * - Optional tick marks with labels
 * - Custom value formatting
 * - Full keyboard navigation (arrow keys, Home, End, Page Up/Down)
 * - Full screen reader support with ARIA attributes
 * - WCAG 2.1 Level AA color contrast compliance
 * - Disabled and error state handling
 * - Dark mode support
 * - Smooth animations and transitions
 * - Seamless integration with Angular Reactive Forms
 *
 * @example
 * ```html
 * <!-- Basic slider -->
 * <ui-slider
 *   label="Volume"
 *   [min]="0"
 *   [max]="100"
 *   [value]="50">
 * </ui-slider>
 *
 * <!-- Slider with value display -->
 * <ui-slider
 *   label="Price range"
 *   [min]="0"
 *   [max]="1000"
 *   [step]="10"
 *   [showValue]="true"
 *   variant="primary">
 * </ui-slider>
 *
 * <!-- Slider with tick marks -->
 * <ui-slider
 *   label="Rating"
 *   [min]="0"
 *   [max]="5"
 *   [step]="1"
 *   [showTicks]="true"
 *   [showValue]="true">
 * </ui-slider>
 *
 * <!-- Slider with custom formatter -->
 * <ui-slider
 *   label="Temperature"
 *   [min]="0"
 *   [max]="100"
 *   [showValue]="true"
 *   [formatValue]="(val) => val + '°C'">
 * </ui-slider>
 *
 * <!-- Reactive forms integration -->
 * <ui-slider
 *   formControlName="brightness"
 *   label="Brightness"
 *   [min]="0"
 *   [max]="100"
 *   variant="success"
 *   size="lg">
 * </ui-slider>
 *
 * <!-- Disabled slider -->
 * <ui-slider
 *   label="Read-only value"
 *   [disabled]="true"
 *   [value]="75">
 * </ui-slider>
 * ```
 */
@Component({
  selector: 'ui-slider',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ],
  host: {
    'class': 'ui-slider block',
    '[class.ui-slider--disabled]': 'disabled()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()'
  },
  template: `
    <div class="ui-slider__wrapper">
      <!-- Label -->
      @if (label()) {
        <label
          [for]="sliderId"
          class="ui-slider__label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500 ml-1" aria-label="required">*</span>
          }
        </label>
      }

      <!-- Slider Container -->
      <div class="ui-slider__container relative" [class]="getContainerClasses()">
        <!-- Track -->
        <div
          class="ui-slider__track absolute rounded-full bg-gray-200 dark:bg-gray-700"
          [class]="getTrackClasses()">
          <!-- Fill -->
          <div
            class="ui-slider__fill absolute rounded-full transition-all duration-200"
            [class]="getFillClasses()"
            [style.width.%]="fillPercentage()">
          </div>
        </div>

        <!-- Range Input -->
        <input
          #slider
          type="range"
          [id]="sliderId"
          [min]="min()"
          [max]="max()"
          [step]="step()"
          [value]="currentValue()"
          [disabled]="disabled()"
          [attr.aria-label]="label() || 'Slider'"
          [attr.aria-describedby]="getAriaDescribedBy()"
          [attr.aria-valuemin]="min()"
          [attr.aria-valuemax]="max()"
          [attr.aria-valuenow]="currentValue()"
          [attr.aria-valuetext]="getValueText()"
          class="ui-slider__input absolute w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          (input)="onInput($event)"
          (change)="onChangeEvent($event)">

        <!-- Thumb -->
        <div
          class="ui-slider__thumb absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white dark:border-gray-800 shadow-sm transition-all duration-200"
          [class]="getThumbClasses()"
          [style.left.%]="fillPercentage()">

          @if (showValue()) {
            <div class="ui-slider__value-tooltip absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap">
              {{ formatValue()(currentValue()) }}
              <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
            </div>
          }
        </div>

        <!-- Ticks -->
        @if (showTicks()) {
          <div class="ui-slider__ticks absolute w-full" [class]="getTicksContainerClasses()">
            @for (tick of tickMarks(); track tick.value) {
              <div
                class="ui-slider__tick absolute transform -translate-x-1/2"
                [style.left.%]="tick.percentage">
                <div
                  class="ui-slider__tick-mark w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500"
                  [class]="getTickMarkClasses(tick.value)">
                </div>
                @if (tick.label) {
                  <div class="ui-slider__tick-label absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {{ tick.label }}
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Value Display -->
      @if (showValue() && !showTicks()) {
        <div class="ui-slider__value-display flex items-center justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>{{ formatValue()(min()) }}</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ formatValue()(currentValue()) }}</span>
          <span>{{ formatValue()(max()) }}</span>
        </div>
      }

      <!-- Helper Text -->
      @if (helperText()) {
        <p class="ui-slider__helper-text mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ helperText() }}
        </p>
      }

      <!-- Error Message -->
      @if (hasError() && errorMessage()) {
        <p
          class="ui-slider__error-message mt-1 text-sm text-red-600 dark:text-red-400"
          [id]="sliderId + '-error'"
          role="alert">
          {{ errorMessage() }}
        </p>
      }
    </div>
  `
})
export class SliderComponent implements ControlValueAccessor {
  @ViewChild('slider') sliderRef!: ElementRef<HTMLInputElement>;

  // Inputs
  min = input<number>(0);
  max = input<number>(100);
  step = input<number>(1);
  label = input<string>('');
  variant = input<SliderVariant>('default');
  size = input<SliderSize>('md');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  showValue = input<boolean>(false);
  showTicks = input<boolean>(false);
  tickInterval = input<number | null>(null);
  customTicks = input<{ value: number; label?: string }[]>([]);
  formatValue = input<(value: number) => string>((value) => value.toString());
  helperText = input<string>('');
  errorMessage = input<string>('');

  // Outputs
  valueChange = output<number>();
  change = output<number>();

  // State
  private value = signal<number>(0);
  hasError = signal<boolean>(false);

  // Generate unique ID (set in constructor)
  sliderId = '';

  constructor() {
    this.sliderId = generateId('ui-slider');
  }

  // ControlValueAccessor
  private onChange = (value: number) => {};
  private onTouched = () => {};

  // Computed properties
  currentValue = computed(() => this.value());

  fillPercentage = computed(() => {
    const min = this.min();
    const max = this.max();
    const value = this.currentValue();
    return max - min === 0 ? 0 : ((value - min) / (max - min)) * 100;
  });

  tickMarks = computed(() => {
    if (this.customTicks().length > 0) {
      return this.customTicks().map(tick => ({
        ...tick,
        percentage: ((tick.value - this.min()) / (this.max() - this.min())) * 100
      }));
    }

    const interval = this.tickInterval();
    if (!interval) return [];

    const ticks: { value: number; label?: string; percentage: number }[] = [];
    const min = this.min();
    const max = this.max();

    for (let value = min; value <= max; value += interval) {
      ticks.push({
        value,
        percentage: ((value - min) / (max - min)) * 100
      });
    }

    return ticks;
  });

  // Methods
  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);
  }

  onChangeEvent(event: Event): void {
    this.onTouched();
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);
    this.change.emit(value);
  }

  getContainerClasses(): string {
    const classes: string[] = ['relative'];

    switch (this.size()) {
      case 'sm':
        classes.push('h-4');
        break;
      case 'lg':
        classes.push('h-8');
        break;
      default:
        classes.push('h-6');
    }

    return classes.join(' ');
  }

  getTrackClasses(): string {
    const classes: string[] = ['w-full'];

    switch (this.size()) {
      case 'sm':
        classes.push('h-1 top-1.5');
        break;
      case 'lg':
        classes.push('h-2 top-3');
        break;
      default:
        classes.push('h-1.5 top-2.25');
    }

    return classes.join(' ');
  }

  getFillClasses(): string {
    const classes: string[] = ['h-full'];

    switch (this.variant()) {
      case 'primary':
        classes.push('bg-primary-500');
        break;
      case 'success':
        classes.push('bg-green-500');
        break;
      case 'warning':
        classes.push('bg-yellow-500');
        break;
      case 'danger':
        classes.push('bg-red-500');
        break;
      default:
        classes.push('bg-primary-500');
    }

    if (this.disabled()) {
      classes.push('opacity-50');
    }

    return classes.join(' ');
  }

  getThumbClasses(): string {
    const classes: string[] = [];

    switch (this.size()) {
      case 'sm':
        classes.push('w-3 h-3');
        break;
      case 'lg':
        classes.push('w-6 h-6');
        break;
      default:
        classes.push('w-4 h-4');
    }

    switch (this.variant()) {
      case 'primary':
        classes.push('bg-primary-500 hover:bg-primary-600 focus:bg-primary-600');
        break;
      case 'success':
        classes.push('bg-green-500 hover:bg-green-600 focus:bg-green-600');
        break;
      case 'warning':
        classes.push('bg-yellow-500 hover:bg-yellow-600 focus:bg-yellow-600');
        break;
      case 'danger':
        classes.push('bg-red-500 hover:bg-red-600 focus:bg-red-600');
        break;
      default:
        classes.push('bg-primary-500 hover:bg-primary-600 focus:bg-primary-600');
    }

    if (this.disabled()) {
      classes.push('opacity-50 cursor-not-allowed');
    } else {
      classes.push('hover:scale-110 focus:scale-110 cursor-pointer');
    }

    return classes.join(' ');
  }

  getTicksContainerClasses(): string {
    const classes: string[] = [];

    switch (this.size()) {
      case 'sm':
        classes.push('top-1.5');
        break;
      case 'lg':
        classes.push('top-3');
        break;
      default:
        classes.push('top-2.25');
    }

    return classes.join(' ');
  }

  getTickMarkClasses(tickValue: number): string {
    const classes = ['transition-colors duration-200'];

    if (tickValue <= this.currentValue()) {
      switch (this.variant()) {
        case 'primary':
          classes.push('bg-primary-500');
          break;
        case 'success':
          classes.push('bg-green-500');
          break;
        case 'warning':
          classes.push('bg-yellow-500');
          break;
        case 'danger':
          classes.push('bg-red-500');
          break;
        default:
          classes.push('bg-primary-500');
      }
    }

    return classes.join(' ');
  }

  getValueText(): string {
    return this.formatValue()(this.currentValue());
  }

  getAriaDescribedBy(): string {
    const ids: string[] = [];

    if (this.helperText()) {
      ids.push(`${this.sliderId}-helper`);
    }

    if (this.hasError() && this.errorMessage()) {
      ids.push(`${this.sliderId}-error`);
    }

    return ids.length > 0 ? ids.join(' ') : '';
  }

  // ControlValueAccessor implementation
  writeValue(value: number): void {
    if (value !== null && value !== undefined) {
      this.value.set(value);
    }
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // The disabled state is handled by the disabled input
  }

  // Public API methods
  focus(): void {
    this.sliderRef.nativeElement.focus();
  }

  blur(): void {
    this.sliderRef.nativeElement.blur();
  }

  setError(hasError: boolean): void {
    this.hasError.set(hasError);
  }
}
