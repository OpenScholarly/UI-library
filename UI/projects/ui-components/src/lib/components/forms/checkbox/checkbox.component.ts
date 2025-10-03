import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxSize, CheckboxVariant } from '../../../types';

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
  // Input properties
  label = input<string>('');
  description = input<string>('');
  errorMessage = input<string>('');
  size = input<CheckboxSize>('md');
  variant = input<CheckboxVariant>('default');
  disabled = input(false);
  required = input(false);
  invalid = input(false);
  indeterminate = input(false);

  // Outputs
  changed = output<boolean>();
  focused = output<void>();
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
      ? 'text-text-disabled'
      : 'text-text-primary';
    return `${baseClasses} ${colorClasses}`;
  });

  protected descriptionClasses = computed(() => {
    const baseClasses = 'text-xs mt-1 select-none';
    const colorClasses = this.disabled()
      ? 'text-text-disabled'
      : 'text-text-secondary';
    return `${baseClasses} ${colorClasses}`;
  });

  protected errorClasses = computed(() => {
    return 'mt-1 text-xs text-red-600';
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
    const baseClasses = 'bg-white border-2';
    const borderClasses = this.invalid()
      ? 'border-red-500'
      : 'border-gray-300 hover:border-gray-400';
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
