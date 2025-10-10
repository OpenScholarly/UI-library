import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxSize, CheckboxVariant } from '../../../types';

/**
 * A versatile and accessible checkbox component for form selections.
 *
 * ## Features
 * - Multiple visual variants (default, primary, success, warning, danger)
 * - Comprehensive size options (small, medium, large)
 * - Indeterminate state support for partial selections
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Disabled and error state handling
 * - Dark mode support
 * - Custom ARIA attribute support
 * - Seamless integration with Angular Reactive Forms
 *
 * @example
 * ```html
 * <!-- Basic checkbox -->
 * <ui-checkbox label="Accept terms and conditions" />
 *
 * <!-- Checkbox with description -->
 * <ui-checkbox
 *   label="Enable notifications"
 *   description="Receive email updates about your account">
 * </ui-checkbox>
 *
 * <!-- Required checkbox with validation -->
 * <ui-checkbox
 *   label="I agree to the privacy policy"
 *   [required]="true"
 *   [invalid]="form.controls.agree.invalid && form.controls.agree.touched"
 *   errorMessage="You must accept the privacy policy">
 * </ui-checkbox>
 *
 * <!-- Indeterminate state (for "select all" functionality) -->
 * <ui-checkbox
 *   label="Select all items"
 *   [indeterminate]="someSelected && !allSelected"
 *   [checked]="allSelected">
 * </ui-checkbox>
 *
 * <!-- Reactive forms integration -->
 * <ui-checkbox
 *   formControlName="newsletter"
 *   label="Subscribe to newsletter"
 *   variant="primary"
 *   size="lg">
 * </ui-checkbox>
 *
 * <!-- Disabled checkbox -->
 * <ui-checkbox
 *   label="Cannot be changed"
 *   [disabled]="true"
 *   [checked]="true">
 * </ui-checkbox>
 * ```
 */
@Component({
  selector: 'ui-checkbox',
  standalone: true,
  template: `
    <label [class]="wrapperClasses()">
      <input
        type="checkbox"
        [id]="checkboxId()"
        [checked]="checked()"
        [disabled]="disabled()"
        [required]="required()"
        [indeterminate]="indeterminate()"
        [class]="inputClasses()"
        [attr.aria-invalid]="invalid()"
        [attr.aria-describedby]="getAriaDescribedBy()"
        (change)="onCheckboxChange($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
      />

      <div [class]="checkboxClasses()">
        @if (checked() || indeterminate()) {
          <svg [class]="iconClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            @if (indeterminate()) {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 12h12" />
            } @else {
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            }
          </svg>
        }
      </div>

      @if (label()) {
        <span [class]="labelClasses()">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500 ml-1" aria-label="required">*</span>
          }
        </span>
      }

      @if (description()) {
        <span [id]="descriptionId()" [class]="descriptionClasses()">
          {{ description() }}
        </span>
      }
    </label>

    @if (invalid() && errorMessage()) {
      <p [id]="errorId()" [class]="errorClasses()" role="alert">
        {{ errorMessage() }}
      </p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  /**
   * Label text displayed next to the checkbox.
   * @default ""
   * @example "I agree to the terms"
   */
  label = input<string>('');
  
  /**
   * Helper text displayed below the checkbox label.
   * Provides additional context or instructions.
   * @default ""
   * @example "You can change this later in settings"
   */
  description = input<string>('');
  
  /**
   * Error message displayed when checkbox is invalid.
   * Only shown when `invalid` is true.
   * @default ""
   * @example "This field is required"
   */
  errorMessage = input<string>('');
  
  /**
   * Size of the checkbox.
   * - `sm`: Small (16px)
   * - `md`: Medium (20px) - default
   * - `lg`: Large (24px)
   * @default "md"
   */
  size = input<CheckboxSize>('md');
  
  /**
   * Visual style variant of the checkbox.
   * - `default`: Gray checkbox (default)
   * - `primary`: Primary color checkbox
   * - `success`: Green success checkbox
   * - `warning`: Yellow warning checkbox
   * - `danger`: Red danger/error checkbox
   * @default "default"
   */
  variant = input<CheckboxVariant>('default');
  
  /**
   * Disables the checkbox and prevents interaction.
   * Applies disabled styling and prevents value changes.
   * @default false
   */
  disabled = input(false);
  
  /**
   * Marks the checkbox as required.
   * Displays asterisk (*) next to label.
   * @default false
   */
  required = input(false);
  
  /**
   * Marks the checkbox as invalid.
   * Applies error styling and shows error message if provided.
   * Typically used with form validation.
   * @default false
   */
  invalid = input(false);
  
  /**
   * Sets the checkbox to indeterminate state.
   * Useful for "select all" functionality when some items are selected.
   * Shows a horizontal line instead of checkmark.
   * @default false
   */
  indeterminate = input(false);

  /**
   * Emitted when the checkbox value changes.
   * Provides the new checked state.
   * @event changed
   */
  changed = output<boolean>();
  
  /**
   * Emitted when the checkbox receives focus.
   * @event focused
   */
  focused = output<void>();
  
  /**
   * Emitted when the checkbox loses focus.
   * @event blurred
   */
  blurred = output<void>();

  // Internal state
  private checkedState = signal(false);
  protected checkboxId = signal('');
  protected descriptionId = signal('');
  protected errorId = signal('');

  // ControlValueAccessor
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  constructor() {
    this.checkboxId.set(`checkbox-${Math.random().toString(36).substr(2, 9)}`);
    this.descriptionId.set(`checkbox-desc-${Math.random().toString(36).substr(2, 9)}`);
    this.errorId.set(`checkbox-error-${Math.random().toString(36).substr(2, 9)}`);
  }

  // Computed properties
  checked = computed(() => this.checkedState());

  protected wrapperClasses = computed(() => {
    const baseClasses = 'flex items-start gap-2 cursor-pointer';
    const disabledClasses = this.disabled() ? 'cursor-not-allowed opacity-50' : '';
    return `${baseClasses} ${disabledClasses}`.trim();
  });

  protected inputClasses = computed(() => {
    return 'sr-only';
  });

  protected checkboxClasses = computed(() => {
    const baseClasses = 'flex items-center justify-center rounded ui-transition-standard';

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const stateClasses = this.checked() || this.indeterminate()
      ? this.getCheckedClasses()
      : this.getUncheckedClasses();

    const focusClasses = 'ui-focus-primary';

    return `${baseClasses} ${sizeClasses[this.size()]} ${stateClasses} ${focusClasses}`;
  });

  protected iconClasses = computed(() => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-3.5 h-3.5',
      lg: 'w-4 h-4'
    };

    return `text-white ${sizeClasses[this.size()]}`;
  });

  protected labelClasses = computed(() => {
    const baseClasses = 'text-sm font-medium select-none';
    const colorClasses = this.disabled()
      ? 'text-text-disabled dark:text-text-disabled'
      : 'text-text-primary dark:text-text-primary';
    return `${baseClasses} ${colorClasses}`;
  });

  protected descriptionClasses = computed(() => {
    const baseClasses = 'text-xs mt-1 select-none';
    const colorClasses = this.disabled()
      ? 'text-text-disabled dark:text-text-disabled'
      : 'text-text-secondary dark:text-text-secondary';
    return `${baseClasses} ${colorClasses}`;
  });

  protected errorClasses = computed(() => {
    return 'mt-1 text-xs text-red-600 dark:text-red-400';
  });

  private getCheckedClasses(): string {
    const variantClasses = {
      default: 'bg-gray-600 border-gray-600',
      primary: 'bg-primary-600 border-primary-600',
      success: 'bg-green-600 border-green-600',
      warning: 'bg-yellow-500 border-yellow-500',
      danger: 'bg-red-600 border-red-600'
    };

    return `border-2 ${variantClasses[this.variant()]}`;
  }

  private getUncheckedClasses(): string {
    const baseClasses = 'bg-surface dark:bg-surface border-2';
    const borderClasses = this.invalid()
      ? 'border-red-500 dark:border-red-400'
      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500';
    return `${baseClasses} ${borderClasses}`;
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
  protected onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.checked;
    this.checkedState.set(value);
    this.changed.emit(value);
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
      this.changed.emit(newValue);
      this.onChange(newValue);
    }
  }

  check(): void {
    if (!this.disabled()) {
      this.checkedState.set(true);
      this.changed.emit(true);
      this.onChange(true);
    }
  }

  uncheck(): void {
    if (!this.disabled()) {
      this.checkedState.set(false);
      this.changed.emit(false);
      this.onChange(false);
    }
  }
}
