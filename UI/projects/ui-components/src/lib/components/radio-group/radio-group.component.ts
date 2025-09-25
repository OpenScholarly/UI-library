import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface RadioOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}

export type RadioSize = 'sm' | 'md' | 'lg';
export type RadioVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
export type RadioOrientation = 'horizontal' | 'vertical';

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
  // Input properties
  options = input.required<RadioOption[]>();
  legend = input<string>('');
  description = input<string>('');
  errorMessage = input<string>('');
  size = input<RadioSize>('md');
  variant = input<RadioVariant>('default');
  orientation = input<RadioOrientation>('vertical');
  disabled = input(false);
  required = input(false);
  invalid = input(false);

  // Outputs
  valueChanged = output<string | number>();
  focused = output<string | number>();
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
    return 'text-sm font-medium text-text-primary mb-2';
  });

  protected descriptionClasses = computed(() => {
    return 'text-xs text-text-secondary mb-3';
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
      ? 'text-text-disabled'
      : 'text-text-primary';
    return `${baseClasses} ${colorClasses}`;
  }

  protected getOptionDescriptionClasses(option: RadioOption): string {
    const baseClasses = 'text-xs mt-1 select-none';
    const colorClasses = (this.disabled() || option.disabled)
      ? 'text-text-disabled'
      : 'text-text-secondary';
    return `${baseClasses} ${colorClasses}`;
  }

  protected errorClasses = computed(() => {
    return 'mt-1 text-xs text-red-600';
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
    const baseClasses = 'bg-white';
    const borderClasses = this.invalid()
      ? 'border-red-500'
      : 'border-gray-300 hover:border-gray-400';
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
    this.valueChanged.emit(value);
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
      this.valueChanged.emit(null as any);
      this.onChange(null as any);
    }
  }

  getSelectedOption(): RadioOption | undefined {
    const selectedValue = this.selectedValue();
    return this.options().find(option => option.value === selectedValue);
  }
}
