import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioOption, RadioSize, RadioVariant, RadioOrientation } from '../../../types';

/**
 * A versatile and accessible radio button group component for single selections.
 *
 * ## Features
 * - Multiple visual variants (default, primary, success, warning, danger)
 * - Comprehensive size options (small, medium, large)
 * - Vertical and horizontal orientation support
 * - Option descriptions for additional context
 * - Arrow key navigation between options
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Disabled and error state handling
 * - Dark mode support
 * - Individual option disable support
 * - Seamless integration with Angular Reactive Forms
 *
 * @example
 * ```html
 * <!-- Basic radio group -->
 * <ui-radio-group
 *   legend="Select your plan"
 *   [options]="[
 *     { value: 'free', label: 'Free' },
 *     { value: 'pro', label: 'Pro' },
 *     { value: 'enterprise', label: 'Enterprise' }
 *   ]">
 * </ui-radio-group>
 *
 * <!-- Radio group with descriptions -->
 * <ui-radio-group
 *   legend="Choose shipping method"
 *   [options]="[
 *     { value: 'standard', label: 'Standard', description: '5-7 business days' },
 *     { value: 'express', label: 'Express', description: '2-3 business days' },
 *     { value: 'overnight', label: 'Overnight', description: 'Next day delivery' }
 *   ]">
 * </ui-radio-group>
 *
 * <!-- Horizontal orientation -->
 * <ui-radio-group
 *   legend="Select size"
 *   orientation="horizontal"
 *   [options]="sizes"
 *   variant="primary"
 *   size="lg">
 * </ui-radio-group>
 *
 * <!-- With validation -->
 * <ui-radio-group
 *   legend="Select payment method"
 *   [required]="true"
 *   [invalid]="!paymentMethod && submitted"
 *   errorMessage="Please select a payment method"
 *   [options]="paymentMethods">
 * </ui-radio-group>
 *
 * <!-- Reactive forms integration -->
 * <ui-radio-group
 *   formControlName="subscription"
 *   legend="Subscription plan"
 *   description="Choose the plan that works best for you"
 *   [options]="subscriptionOptions">
 * </ui-radio-group>
 *
 * <!-- With disabled options -->
 * <ui-radio-group
 *   legend="Select feature"
 *   [options]="[
 *     { value: 'basic', label: 'Basic features' },
 *     { value: 'premium', label: 'Premium features', disabled: true, description: 'Upgrade to unlock' }
 *   ]">
 * </ui-radio-group>
 * ```
 */
@Component({
  selector: 'ui-radio-group',
  standalone: true,
  template: `
    <fieldset [class]="fieldsetClasses()">
      @if (legend()) {
        <legend [class]="legendClasses()">
          {{ legend() }}
          @if (required()) {
            <span class="text-red-500 ml-1" aria-label="required">*</span>
          }
        </legend>
      }

      @if (description()) {
        <p [id]="descriptionId()" [class]="descriptionClasses()">
          {{ description() }}
        </p>
      }

      <div [class]="radioGroupClasses()">
        @for (option of options(); track option.value) {
          <label [class]="getRadioWrapperClasses(option)">
            <input
              type="radio"
              [name]="groupName"
              [value]="option.value"
              [checked]="selectedValue() === option.value"
              [disabled]="disabled() || option.disabled"
              [class]="radioInputClasses()"
              [attr.aria-describedby]="getAriaDescribedBy(option)"
              (change)="onRadioChange(option.value)"
              (focus)="onFocus(option.value)"
              (blur)="onBlur()"
            />

            <div [class]="getRadioClasses(option)">
              @if (selectedValue() === option.value) {
                <div [class]="radioDotClasses()"></div>
              }
            </div>

            <div class="flex-1 min-w-0">
              <span [class]="getLabelClasses(option)">
                {{ option.label }}
              </span>

              @if (option.description) {
                <p [class]="getOptionDescriptionClasses(option)">
                  {{ option.description }}
                </p>
              }
            </div>
          </label>
        }
      </div>

      @if (invalid() && errorMessage()) {
        <p [id]="errorId()" [class]="errorClasses()" role="alert">
          {{ errorMessage() }}
        </p>
      }
    </fieldset>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ]
})
export class RadioGroupComponent implements ControlValueAccessor {
  /**
   * Array of radio button options to display.
   * Each option must have at minimum a value and label.
   * @required
   * @example [{ value: 'option1', label: 'Option 1' }, { value: 'option2', label: 'Option 2', description: 'Additional info' }]
   */
  options = input.required<RadioOption[]>();
  
  /**
   * Legend text for the radio group fieldset.
   * Acts as a label for the entire group.
   * @default ""
   * @example "Select your preference"
   */
  legend = input<string>('');
  
  /**
   * Helper text displayed below the legend.
   * Provides additional context or instructions for the group.
   * @default ""
   * @example "Choose one option from the list"
   */
  description = input<string>('');
  
  /**
   * Error message displayed when radio group is invalid.
   * Only shown when `invalid` is true.
   * @default ""
   * @example "Please select an option"
   */
  errorMessage = input<string>('');
  
  /**
   * Size of the radio buttons.
   * - `sm`: Small (16px)
   * - `md`: Medium (20px) - default
   * - `lg`: Large (24px)
   * @default "md"
   */
  size = input<RadioSize>('md');
  
  /**
   * Visual style variant of the radio buttons.
   * - `default`: Gray radio (default)
   * - `primary`: Primary color radio
   * - `success`: Green success radio
   * - `warning`: Yellow warning radio
   * - `danger`: Red danger radio
   * @default "default"
   */
  variant = input<RadioVariant>('default');
  
  /**
   * Layout orientation of the radio buttons.
   * - `vertical`: Stack buttons vertically (default)
   * - `horizontal`: Arrange buttons horizontally
   * @default "vertical"
   */
  orientation = input<RadioOrientation>('vertical');
  
  /**
   * Disables all radio buttons in the group.
   * Individual options can also be disabled via their `disabled` property.
   * @default false
   */
  disabled = input(false);
  
  /**
   * Marks the radio group as required.
   * Displays asterisk (*) next to legend.
   * @default false
   */
  required = input(false);
  
  /**
   * Marks the radio group as invalid.
   * Applies error styling and shows error message if provided.
   * Typically used with form validation.
   * @default false
   */
  invalid = input(false);

  /**
   * Emitted when a radio button is selected.
   * Provides the value of the selected option.
   * @event valueChange
   */
  valueChange = output<string | number>();
  
  /**
   * Emitted when a radio button receives focus.
   * Provides the value of the focused option.
   * @event focused
   */
  focused = output<string | number>();
  
  /**
   * Emitted when focus leaves the radio group.
   * @event blurred
   */
  blurred = output<void>();

  // Internal state
  private selectedValueState = signal<string | number | null>(null);
  protected descriptionId = signal('');
  protected errorId = signal('');
  protected groupName = `radio-group-${Math.random().toString(36).substr(2, 9)}`;

  // ControlValueAccessor
  private onChange = (value: string | number) => {};
  private onTouched = () => {};

  constructor() {
    this.descriptionId.set(`radio-desc-${Math.random().toString(36).substr(2, 9)}`);
    this.errorId.set(`radio-error-${Math.random().toString(36).substr(2, 9)}`);
  }

  // Computed properties
  selectedValue = computed(() => this.selectedValueState());

  protected fieldsetClasses = computed(() => {
    const baseClasses = 'border-0 p-0 m-0';
    const disabledClasses = this.disabled() ? 'opacity-50' : '';
    return `${baseClasses} ${disabledClasses}`.trim();
  });

  protected legendClasses = computed(() => {
    return 'text-sm font-medium text-gray-900 dark:text-gray-100 mb-2';
  });

  protected descriptionClasses = computed(() => {
    return 'text-xs text-gray-600 dark:text-gray-400 mb-3';
  });

  protected radioGroupClasses = computed(() => {
    const baseClasses = 'flex';
    const orientationClasses = this.orientation() === 'horizontal'
      ? 'flex-row space-x-4'
      : 'flex-col space-y-3';
    return `${baseClasses} ${orientationClasses}`;
  });

  protected getRadioWrapperClasses(option: RadioOption): string {
    const baseClasses = 'flex items-start gap-2 cursor-pointer';
    const disabledClasses = (this.disabled() || option.disabled)
      ? 'cursor-not-allowed opacity-50'
      : '';
    return `${baseClasses} ${disabledClasses}`.trim();
  }

  protected radioInputClasses = computed(() => {
    return 'sr-only';
  });

  protected getRadioClasses(option: RadioOption): string {
    const baseClasses = 'flex items-center justify-center rounded-full ui-transition-standard border-2';

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const isSelected = this.selectedValue() === option.value;
    const stateClasses = isSelected
      ? this.getSelectedClasses()
      : this.getUnselectedClasses();

    const focusClasses = 'ui-focus-primary';

    return `${baseClasses} ${sizeClasses[this.size()]} ${stateClasses} ${focusClasses}`;
  }

  protected radioDotClasses = computed(() => {
    const sizeClasses = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5'
    };

    return `bg-white rounded-full ${sizeClasses[this.size()]}`;
  });

  protected getLabelClasses(option: RadioOption): string {
    const baseClasses = 'text-sm font-medium select-none';
    const colorClasses = (this.disabled() || option.disabled)
      ? 'text-gray-400 dark:text-gray-500'
      : 'text-gray-900 dark:text-gray-100';
    return `${baseClasses} ${colorClasses}`;
  }

  protected getOptionDescriptionClasses(option: RadioOption): string {
    const baseClasses = 'text-xs mt-1 select-none';
    const colorClasses = (this.disabled() || option.disabled)
      ? 'text-gray-400 dark:text-gray-500'
      : 'text-gray-600 dark:text-gray-400';
    return `${baseClasses} ${colorClasses}`;
  }

  protected errorClasses = computed(() => {
    return 'mt-1 text-xs text-red-600 dark:text-red-400';
  });

  private getSelectedClasses(): string {
    const variantClasses = {
      default: 'bg-gray-600 border-gray-600',
      primary: 'bg-primary-600 border-primary-600',
      success: 'bg-green-600 border-green-600',
      warning: 'bg-yellow-500 border-yellow-500',
      danger: 'bg-red-600 border-red-600'
    };

    return variantClasses[this.variant()];
  }

  private getUnselectedClasses(): string {
    const baseClasses = 'bg-white dark:bg-gray-800';
    const borderClasses = this.invalid()
      ? 'border-red-500 dark:border-red-400'
      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500';
    return `${baseClasses} ${borderClasses}`;
  }

  protected getAriaDescribedBy(option: RadioOption): string {
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
  protected onRadioChange(value: string | number): void {
    if (this.disabled()) return;

    this.selectedValueState.set(value);
  this.valueChange.emit(value);
    this.onChange(value);
  }

  protected onFocus(value: string | number): void {
    this.focused.emit(value);
  }

  protected onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  // ControlValueAccessor implementation
  writeValue(value: string | number | null): void {
    this.selectedValueState.set(value);
  }

  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled by the disabled input
  }

  // Public methods
  selectOption(value: string | number): void {
    const option = this.options().find(opt => opt.value === value);
    if (option && !this.disabled() && !option.disabled) {
      this.onRadioChange(value);
    }
  }

  clearSelection(): void {
    if (!this.disabled()) {
      this.selectedValueState.set(null);
  this.valueChange.emit(null as any);
      this.onChange(null as any);
    }
  }

  getSelectedOption(): RadioOption | undefined {
    const selectedValue = this.selectedValue();
    return this.options().find(option => option.value === selectedValue);
  }
}
