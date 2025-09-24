import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type ToggleSize = 'sm' | 'md' | 'lg';
export type ToggleVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'ui-toggle',
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
  // Input properties
  label = input<string>('');
  description = input<string>('');
  errorMessage = input<string>('');
  size = input<ToggleSize>('md');
  variant = input<ToggleVariant>('default');
  disabled = input(false);
  required = input(false);
  invalid = input(false);
  showIcons = input(false);
  
  // Outputs
  toggled = output<boolean>();
  focused = output<void>();
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
    const baseClasses = 'absolute flex items-center justify-center bg-white rounded-full shadow-sm ui-transition-transform';
    
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
      ? 'text-white' 
      : 'text-gray-400';
    
    return `${sizeClasses[this.size()]} ${colorClasses}`;
  });

  protected labelClasses = computed(() => {
    const baseClasses = 'text-sm font-medium select-none';
    const colorClasses = this.disabled() 
      ? 'text-text-disabled' 
      : 'text-text-primary';
    return `${baseClasses} ${colorClasses}`;
  });

  protected descriptionClasses = computed(() => {
    const baseClasses = 'text-xs text-text-secondary ml-14';
    return baseClasses;
  });

  protected errorClasses = computed(() => {
    return 'text-xs text-red-600 ml-14';
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
    const baseClasses = 'bg-gray-200';
    const invalidClasses = this.invalid() ? 'ring-2 ring-red-500' : '';
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