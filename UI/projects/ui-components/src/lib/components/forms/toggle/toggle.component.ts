import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToggleSize, ToggleVariant } from '../../../types';

/**
 * A versatile and accessible toggle switch component for binary selections.
 *
 * ## Features
 * - Multiple visual variants (default, primary, success, warning, danger)
 * - Comprehensive size options (small, medium, large)
 * - Optional icons in thumb to indicate state
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Disabled and error state handling
 * - Dark mode support
 * - Smooth animations and transitions
 * - Seamless integration with Angular Reactive Forms
 *
 * @example
 * ```html
 * <!-- Basic toggle -->
 * <ui-toggle label="Enable notifications" />
 *
 * <!-- Toggle with description -->
 * <ui-toggle
 *   label="Dark mode"
 *   description="Switch between light and dark themes">
 * </ui-toggle>
 *
 * <!-- Toggle with icons -->
 * <ui-toggle
 *   label="Auto-save"
 *   [showIcons]="true"
 *   variant="primary">
 * </ui-toggle>
 *
 * <!-- Required toggle with validation -->
 * <ui-toggle
 *   label="Accept terms"
 *   [required]="true"
 *   [invalid]="!termsAccepted && submitted"
 *   errorMessage="You must accept the terms">
 * </ui-toggle>
 *
 * <!-- Reactive forms integration -->
 * <ui-toggle
 *   formControlName="notifications"
 *   label="Email notifications"
 *   variant="success"
 *   size="lg">
 * </ui-toggle>
 *
 * <!-- Disabled toggle -->
 * <ui-toggle
 *   label="Premium feature"
 *   [disabled]="true"
 *   description="Upgrade to enable this feature">
 * </ui-toggle>
 * ```
 */
@Component({
  selector: 'ui-toggle',
  standalone: true,
  template: `
    <div [class]="wrapperClasses()">
      <label [class]="labelWrapperClasses()">
        <input
          type="checkbox"
          [id]="toggleId()"
          [checked]="checked()"
          [disabled]="disabled()"
          [required]="required()"
          [class]="inputClasses()"
          [attr.aria-describedby]="getAriaDescribedBy()"
          [attr.aria-invalid]="invalid()"
          (change)="onToggleChange($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
        />

        <div [class]="toggleTrackClasses()">
          <div [class]="toggleThumbClasses()">
            @if (showIcons()) {
              <svg [class]="iconClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if (checked()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                }
              </svg>
            }
          </div>
        </div>

        @if (label()) {
          <span [class]="labelClasses()">
            {{ label() }}
            @if (required()) {
              <span class="text-red-500 ml-1" aria-label="required">*</span>
            }
          </span>
        }
      </label>

      @if (description()) {
        <p [id]="descriptionId()" [class]="descriptionClasses()">
          {{ description() }}
        </p>
      }

      @if (invalid() && errorMessage()) {
        <p [id]="errorId()" [class]="errorClasses()" role="alert">
          {{ errorMessage() }}
        </p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleComponent),
      multi: true
    }
  ]
})
export class ToggleComponent implements ControlValueAccessor {
  /**
   * Label text displayed next to the toggle switch.
   * @default ""
   * @example "Enable notifications"
   */
  label = input<string>('');
  
  /**
   * Helper text displayed below the toggle.
   * Provides additional context or instructions.
   * @default ""
   * @example "Receive updates via email"
   */
  description = input<string>('');
  
  /**
   * Error message displayed when toggle is invalid.
   * Only shown when `invalid` is true.
   * @default ""
   * @example "This option is required"
   */
  errorMessage = input<string>('');
  
  /**
   * Size of the toggle switch.
   * - `sm`: Small (20px height, 36px width)
   * - `md`: Medium (24px height, 44px width) - default
   * - `lg`: Large (28px height, 48px width)
   * @default "md"
   */
  size = input<ToggleSize>('md');
  
  /**
   * Visual style variant of the toggle switch.
   * - `default`: Gray toggle (default)
   * - `primary`: Primary color toggle
   * - `success`: Green success toggle
   * - `warning`: Yellow warning toggle
   * - `danger`: Red danger toggle
   * @default "default"
   */
  variant = input<ToggleVariant>('default');
  
  /**
   * Disables the toggle and prevents interaction.
   * Applies disabled styling and prevents value changes.
   * @default false
   */
  disabled = input(false);
  
  /**
   * Marks the toggle as required.
   * Displays asterisk (*) next to label.
   * @default false
   */
  required = input(false);
  
  /**
   * Marks the toggle as invalid.
   * Applies error styling and shows error message if provided.
   * Typically used with form validation.
   * @default false
   */
  invalid = input(false);
  
  /**
   * Shows icons inside the toggle thumb.
   * Checkmark when on, X when off.
   * @default false
   */
  showIcons = input(false);

  /**
   * Emitted when the toggle value changes.
   * Provides the new checked state.
   * @event toggled
   */
  toggled = output<boolean>();
  
  /**
   * Emitted when the toggle receives focus.
   * @event focused
   */
  focused = output<void>();
  
  /**
   * Emitted when the toggle loses focus.
   * @event blurred
   */
  blurred = output<void>();

  // Internal state
  private checkedState = signal(false);
  protected toggleId = signal('');
  protected descriptionId = signal('');
  protected errorId = signal('');

  // ControlValueAccessor
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  constructor() {
    this.toggleId.set(`toggle-${Math.random().toString(36).substr(2, 9)}`);
    this.descriptionId.set(`toggle-desc-${Math.random().toString(36).substr(2, 9)}`);
    this.errorId.set(`toggle-error-${Math.random().toString(36).substr(2, 9)}`);
  }

  // Computed properties
  checked = computed(() => this.checkedState());

  protected wrapperClasses = computed(() => {
    return 'flex flex-col gap-1';
  });

  protected labelWrapperClasses = computed(() => {
    const baseClasses = 'flex items-center gap-3 cursor-pointer';
    const disabledClasses = this.disabled() ? 'cursor-not-allowed opacity-50' : '';
    return `${baseClasses} ${disabledClasses}`.trim();
  });

  protected inputClasses = computed(() => {
    return 'sr-only';
  });

  protected toggleTrackClasses = computed(() => {
    const baseClasses = 'relative inline-flex items-center rounded-full ui-transition-standard ui-focus-primary';

    const sizeClasses = {
      sm: 'h-5 w-9',
      md: 'h-6 w-11',
      lg: 'h-7 w-12'
    };

    const stateClasses = this.checked()
      ? this.getCheckedTrackClasses()
      : this.getUncheckedTrackClasses();

    return `${baseClasses} ${sizeClasses[this.size()]} ${stateClasses}`;
  });

  protected toggleThumbClasses = computed(() => {
    const baseClasses = 'absolute flex items-center justify-center bg-white dark:bg-gray-200 rounded-full shadow-sm ui-transition-transform';

    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };

    const positionClasses = this.checked()
      ? this.getCheckedThumbPosition()
      : 'translate-x-0.5';

    return `${baseClasses} ${sizeClasses[this.size()]} ${positionClasses}`;
  });

  protected iconClasses = computed(() => {
    const sizeClasses = {
      sm: 'w-2.5 h-2.5',
      md: 'w-3 h-3',
      lg: 'w-3.5 h-3.5'
    };

    const colorClasses = this.checked()
      ? 'text-primary-600 dark:text-primary-500'
      : 'text-gray-400 dark:text-gray-500';

    return `${sizeClasses[this.size()]} ${colorClasses}`;
  });

  protected labelClasses = computed(() => {
    const baseClasses = 'text-sm font-medium select-none';
    const colorClasses = this.disabled()
      ? 'text-text-disabled dark:text-text-disabled'
      : 'text-text-primary dark:text-text-primary';
    return `${baseClasses} ${colorClasses}`;
  });

  protected descriptionClasses = computed(() => {
    const baseClasses = 'text-xs ml-14';
    const colorClasses = 'text-text-secondary dark:text-text-secondary';
    return `${baseClasses} ${colorClasses}`;
  });

  protected errorClasses = computed(() => {
    return 'text-xs text-red-600 dark:text-red-400 ml-14';
  });

  private getCheckedTrackClasses(): string {
    const variantClasses = {
      default: 'bg-gray-600',
      primary: 'bg-primary-600',
      success: 'bg-green-600',
      warning: 'bg-yellow-500',
      danger: 'bg-red-600'
    };

    return variantClasses[this.variant()];
  }

  private getUncheckedTrackClasses(): string {
    const baseClasses = 'bg-gray-200 dark:bg-gray-700';
    const invalidClasses = this.invalid() ? 'ring-2 ring-red-500 dark:ring-red-400' : '';
    return `${baseClasses} ${invalidClasses}`.trim();
  }

  private getCheckedThumbPosition(): string {
    const positionClasses = {
      sm: 'translate-x-4',
      md: 'translate-x-5',
      lg: 'translate-x-5'
    };

    return positionClasses[this.size()];
  }

  protected getAriaDescribedBy(): string {
    const ids: string[] = [];
    if (this.description()) {
      ids.push(this.descriptionId());
    }
    if (this.invalid() && this.errorMessage()) {
      ids.push(this.errorId());
    }
    return ids.join(' ') || '';
  }

  // Event handlers
  protected onToggleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.checked;
    this.checkedState.set(value);
    this.toggled.emit(value);
    this.onChange(value);
  }

  protected onFocus(): void {
    this.focused.emit();
  }

  protected onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean): void {
    this.checkedState.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled by the disabled input
  }

  // Public methods
  toggle(): void {
    if (!this.disabled()) {
      const newValue = !this.checked();
      this.checkedState.set(newValue);
      this.toggled.emit(newValue);
      this.onChange(newValue);
    }
  }

  turnOn(): void {
    if (!this.disabled()) {
      this.checkedState.set(true);
      this.toggled.emit(true);
      this.onChange(true);
    }
  }

  turnOff(): void {
    if (!this.disabled()) {
      this.checkedState.set(false);
      this.toggled.emit(false);
      this.onChange(false);
    }
  }
}
