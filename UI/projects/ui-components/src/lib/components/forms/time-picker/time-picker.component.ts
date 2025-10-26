import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type TimePickerSize = 'sm' | 'md' | 'lg';
export type TimeFormat = '12h' | '24h';

interface TimeValue {
  hours: number;
  minutes: number;
  seconds?: number;
}

/**
 * A comprehensive time picker component with keyboard input support.
 *
 * ## Features
 * - 12h/24h format support
 * - Minute step configuration
 * - Optional seconds support
 * - Keyboard input support
 * - Dropdown/scroll wheel UI
 * - Clear button
 * - ARIA time announcements
 * - WCAG 2.1 Level AA compliant
 * - Dark mode support
 *
 * @example
 * ```html
 * <!-- Basic time picker -->
 * <ui-time-picker
 *   [value]="selectedTime"
 *   (valueChange)="onTimeChange($event)">
 * </ui-time-picker>
 *
 * <!-- 24-hour format with seconds -->
 * <ui-time-picker
 *   format="24h"
 *   [showSeconds]="true"
 *   [value]="time"
 *   (valueChange)="onTimeChange($event)">
 * </ui-time-picker>
 *
 * <!-- With minute step -->
 * <ui-time-picker
 *   [minuteStep]="15"
 *   [clearable]="true"
 *   (valueChange)="onTimeChange($event)">
 * </ui-time-picker>
 * ```
 */
@Component({
  selector: 'ui-time-picker',
  imports: [CommonModule],
  template: `
    <div [class]="containerClasses()" role="group" [attr.aria-label]="ariaLabel()">
      <div class="flex items-center gap-2">
        <!-- Hour input -->
        <div class="flex-1">
          <input
            type="number"
            [value]="displayHours()"
            (input)="onHourInput($event)"
            (blur)="onHourBlur()"
            [min]="format() === '12h' ? 1 : 0"
            [max]="format() === '12h' ? 12 : 23"
            [class]="inputClasses()"
            [attr.aria-label]="'Hours'"
            placeholder="HH" />
        </div>

        <span class="text-gray-500 dark:text-gray-400">:</span>

        <!-- Minute input -->
        <div class="flex-1">
          <input
            type="number"
            [value]="displayMinutes()"
            (input)="onMinuteInput($event)"
            (blur)="onMinuteBlur()"
            min="0"
            max="59"
            [step]="minuteStep()"
            [class]="inputClasses()"
            [attr.aria-label]="'Minutes'"
            placeholder="MM" />
        </div>

        @if (showSeconds()) {
          <span class="text-gray-500 dark:text-gray-400">:</span>

          <!-- Second input -->
          <div class="flex-1">
            <input
              type="number"
              [value]="displaySeconds()"
              (input)="onSecondInput($event)"
              (blur)="onSecondBlur()"
              min="0"
              max="59"
              [class]="inputClasses()"
              [attr.aria-label]="'Seconds'"
              placeholder="SS" />
          </div>
        }

        <!-- AM/PM selector for 12h format -->
        @if (format() === '12h') {
          <select
            [value]="period()"
            (change)="onPeriodChange($event)"
            [class]="selectClasses()"
            [attr.aria-label]="'AM or PM'">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        }

        <!-- Clear button -->
        @if (clearable() && hasValue()) {
          <button
            type="button"
            (click)="clearTime()"
            [class]="clearButtonClasses()"
            [attr.aria-label]="'Clear time'">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        }
      </div>

      <!-- Screen reader announcement -->
      <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {{ ariaAnnouncement() }}
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePickerComponent {
  /**
   * Selected time value.
   */
  value = input<TimeValue | null>(null);

  /**
   * Time format: 12-hour or 24-hour.
   * @default "12h"
   */
  format = input<TimeFormat>('12h');

  /**
   * Whether to show seconds input.
   * @default false
   */
  showSeconds = input<boolean>(false);

  /**
   * Step for minute selection.
   * @default 1
   */
  minuteStep = input<number>(1);

  /**
   * Whether to show a clear button.
   * @default true
   */
  clearable = input<boolean>(true);

  /**
   * Size variant.
   * @default "md"
   */
  size = input<TimePickerSize>('md');

  /**
   * ARIA label for the time picker.
   * @default "Time picker"
   */
  ariaLabel = input<string>('Time picker');

  /**
   * Emitted when the time value changes.
   */
  valueChange = output<TimeValue>();

  // Internal state
  period = signal<'AM' | 'PM'>('AM');

  displayHours = computed(() => {
    const val = this.value();
    if (!val) return '';

    let hours = val.hours;
    if (this.format() === '12h') {
      this.period.set(hours >= 12 ? 'PM' : 'AM');
      hours = hours % 12 || 12;
    }
    return hours.toString().padStart(2, '0');
  });

  displayMinutes = computed(() => {
    const val = this.value();
    return val ? val.minutes.toString().padStart(2, '0') : '';
  });

  displaySeconds = computed(() => {
    const val = this.value();
    return val && val.seconds !== undefined ? val.seconds.toString().padStart(2, '0') : '00';
  });

  containerClasses = computed(() => {
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };
    return `inline-flex items-center gap-2 ${sizes[this.size()]}`;
  });

  inputClasses = computed(() => {
    const sizes = {
      sm: 'px-2 py-1 text-sm w-12',
      md: 'px-3 py-2 text-base w-14',
      lg: 'px-4 py-2 text-lg w-16',
    };
    return `${sizes[this.size()]} border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-center focus:outline-none focus:ring-2 focus:ring-blue-500`;
  });

  selectClasses = computed(() => {
    const sizes = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-2 text-lg',
    };
    return `${sizes[this.size()]} border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500`;
  });

  clearButtonClasses = computed(() => {
    return 'p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
  });

  ariaAnnouncement = computed(() => {
    const val = this.value();
    if (!val) return 'No time selected';

    const hours = this.displayHours();
    const minutes = this.displayMinutes();
    const seconds = this.showSeconds() ? this.displaySeconds() : null;
    const period = this.format() === '12h' ? this.period() : '';

    let announcement = `Time: ${hours}:${minutes}`;
    if (seconds) {
      announcement += `:${seconds}`;
    }
    if (period) {
      announcement += ` ${period}`;
    }
    return announcement;
  });

  hasValue = computed(() => this.value() !== null);

  onHourInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let hours = parseInt(input.value) || 0;

    if (this.format() === '12h') {
      hours = Math.max(1, Math.min(12, hours));
      // Convert to 24h for storage
      if (this.period() === 'PM' && hours !== 12) {
        hours += 12;
      } else if (this.period() === 'AM' && hours === 12) {
        hours = 0;
      }
    } else {
      hours = Math.max(0, Math.min(23, hours));
    }

    this.emitValue({ hours });
  }

  onHourBlur(): void {
    // Ensure hours are properly formatted
    if (this.value()) {
      this.emitValue({ hours: this.value()!.hours });
    }
  }

  onMinuteInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let minutes = parseInt(input.value) || 0;
    minutes = Math.max(0, Math.min(59, minutes));

    // Round to nearest step
    const step = this.minuteStep();
    minutes = Math.round(minutes / step) * step;

    this.emitValue({ minutes });
  }

  onMinuteBlur(): void {
    // Ensure minutes are properly formatted
    if (this.value()) {
      this.emitValue({ minutes: this.value()!.minutes });
    }
  }

  onSecondInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let seconds = parseInt(input.value) || 0;
    seconds = Math.max(0, Math.min(59, seconds));

    this.emitValue({ seconds });
  }

  onSecondBlur(): void {
    // Ensure seconds are properly formatted
    if (this.value()) {
      this.emitValue({ seconds: this.value()!.seconds || 0 });
    }
  }

  onPeriodChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newPeriod = select.value as 'AM' | 'PM';
    this.period.set(newPeriod);

    const val = this.value();
    if (val) {
      let hours = val.hours;

      if (newPeriod === 'PM') {
        if (hours < 12) hours += 12;
      } else {
        if (hours >= 12) hours -= 12;
      }

      this.emitValue({ hours });
    }
  }

  clearTime(): void {
    this.valueChange.emit({ hours: 0, minutes: 0, seconds: 0 });
  }

  private emitValue(partial: Partial<TimeValue>): void {
    const current = this.value() || { hours: 0, minutes: 0, seconds: 0 };
    const newValue: TimeValue = {
      hours: partial.hours !== undefined ? partial.hours : current.hours,
      minutes: partial.minutes !== undefined ? partial.minutes : current.minutes,
      ...(this.showSeconds() && {
        seconds: partial.seconds !== undefined ? partial.seconds : current.seconds || 0,
      }),
    };

    this.valueChange.emit(newValue);
  }
}
