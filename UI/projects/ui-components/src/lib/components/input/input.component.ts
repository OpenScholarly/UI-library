import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal, viewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AriaHelpersService } from '../../utilities/aria-helpers.service';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'filled' | 'outlined';

@Component({
  selector: 'ui-input',
  template: `
    <div [class]="wrapperClasses()">
      @if (label()) {
        <label 
          [for]="inputId()"
          [class]="labelClasses()">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500 ml-1" aria-label="required">*</span>
          }
        </label>
      }
      
      <div [class]="inputContainerClasses()">
        @if (prefixIcon()) {
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span [class]="iconClasses()">{{ prefixIcon() }}</span>
          </div>
        }
        
        <input
          #inputElement
          [id]="inputId()"
          [type]="actualType()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="required()"
          [min]="min()"
          [max]="max()"
          [step]="step()"
          [maxLength]="maxlength()"
          [pattern]="pattern()"
          [autocomplete]="autocomplete()"
          [class]="inputClasses()"
          [attr.aria-invalid]="invalid()"
          [attr.aria-describedby]="getAriaDescribedBy()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          (keydown)="onKeyDown($event)"
        />
        
        @if (suffixIcon()) {
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span [class]="iconClasses()">{{ suffixIcon() }}</span>
          </div>
        }
        
        @if (type() === 'password' && showPasswordToggle()) {
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center ui-focus-primary rounded"
            (click)="togglePasswordVisibility()"
            [attr.aria-label]="passwordVisible() ? 'Hide password' : 'Show password'">
            <span [class]="iconClasses()">
              {{ passwordVisible() ? '👁️' : '🙈' }}
            </span>
          </button>
        }
      </div>
      
      @if (helperText() && !invalid()) {
        <p [id]="helperId()" [class]="helperTextClasses()">
          {{ helperText() }}
        </p>
      }
      
      @if (invalid() && errorMessage()) {
        <p [id]="errorId()" [class]="errorTextClasses()" role="alert">
          {{ errorMessage() }}
        </p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  // Input properties
  type = input<InputType>('text');
  size = input<InputSize>('md');
  variant = input<InputVariant>('default');
  label = input<string>('');
  placeholder = input<string>('');
  helperText = input<string>('');
  errorMessage = input<string>('');
  prefixIcon = input<string>('');
  suffixIcon = input<string>('');
  disabled = input(false);
  readonly = input(false);
  required = input(false);
  invalid = input(false);
  showPasswordToggle = input(true);
  fullWidth = input(true);
  
  // HTML input attributes
  min = input<string | number>('');
  max = input<string | number>('');
  step = input<string | number>('');
  maxlength = input<number>();
  pattern = input<string>('');
  autocomplete = input<string>('');

  // Outputs
  valueChange = output<string>();
  focused = output<void>();
  blurred = output<void>();
  keyPressed = output<KeyboardEvent>();

  // Internal state
  private inputValue = signal('');
  protected passwordVisible = signal(false);
  protected inputId = signal('');
  protected helperId = signal('');
  protected errorId = signal('');

  // ViewChild
  private inputElement = viewChild<ElementRef<HTMLInputElement>>('inputElement');

  // ControlValueAccessor
  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor(private ariaHelpers: AriaHelpersService) {
    this.inputId.set(this.ariaHelpers.generateId('input'));
    this.helperId.set(this.ariaHelpers.generateId('input-helper'));
    this.errorId.set(this.ariaHelpers.generateId('input-error'));
  }

  // Computed properties
  protected actualType = computed(() => {
    if (this.type() === 'password') {
      return this.passwordVisible() ? 'text' : 'password';
    }
    return this.type();
  });

  // Computed classes
  protected wrapperClasses = computed(() => {
    const baseClasses = 'ui-input-wrapper';
    const widthClasses = this.fullWidth() ? 'w-full' : '';
    return `${baseClasses} ${widthClasses}`.trim();
  });

  protected labelClasses = computed(() => {
    const baseClasses = 'block text-sm font-medium mb-1';
    const colorClasses = this.disabled() 
      ? 'text-text-disabled' 
      : 'text-text-primary';
    return `${baseClasses} ${colorClasses}`;
  });

  protected inputContainerClasses = computed(() => {
    return 'relative';
  });

  protected inputClasses = computed(() => {
    const baseClasses = 'ui-focus-primary ui-transition-standard w-full';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg'
    };

    const variantClasses = {
      default: 'border border-gray-300 rounded-md bg-white',
      filled: 'border-0 rounded-md bg-gray-100',
      outlined: 'border-2 border-gray-300 rounded-md bg-transparent'
    };

    const stateClasses = this.disabled()
      ? 'bg-gray-50 text-text-disabled cursor-not-allowed'
      : this.readonly()
      ? 'bg-gray-50 cursor-default'
      : 'text-text-primary';

    const invalidClasses = this.invalid()
      ? 'border-red-500 ui-focus-danger'
      : 'hover:border-gray-400';

    const paddingClasses = this.getPaddingClasses();

    return `${baseClasses} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]} ${stateClasses} ${invalidClasses} ${paddingClasses}`;
  });

  protected iconClasses = computed(() => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5', 
      lg: 'w-6 h-6'
    };
    
    const colorClasses = this.disabled() 
      ? 'text-text-disabled' 
      : 'text-text-secondary';
      
    return `${sizeClasses[this.size()]} ${colorClasses}`;
  });

  protected helperTextClasses = computed(() => {
    return 'mt-1 text-sm text-text-secondary';
  });

  protected errorTextClasses = computed(() => {
    return 'mt-1 text-sm text-red-600';
  });

  private getPaddingClasses(): string {
    const hasPrefix = !!this.prefixIcon();
    const hasSuffix = !!this.suffixIcon() || (this.type() === 'password' && this.showPasswordToggle());
    
    if (hasPrefix && hasSuffix) {
      return this.size() === 'sm' ? 'pl-9 pr-9' : this.size() === 'lg' ? 'pl-12 pr-12' : 'pl-10 pr-10';
    } else if (hasPrefix) {
      return this.size() === 'sm' ? 'pl-9' : this.size() === 'lg' ? 'pl-12' : 'pl-10';
    } else if (hasSuffix) {
      return this.size() === 'sm' ? 'pr-9' : this.size() === 'lg' ? 'pr-12' : 'pr-10';
    }
    return '';
  }

  protected getAriaDescribedBy(): string {
    const ids: string[] = [];
    if (this.helperText() && !this.invalid()) {
      ids.push(this.helperId());
    }
    if (this.invalid() && this.errorMessage()) {
      ids.push(this.errorId());
    }
    return ids.join(' ') || '';
  }

  // Event handlers
  protected onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.inputValue.set(value);
    this.valueChange.emit(value);
    this.onChange(value);
  }

  protected onBlur(): void {
    this.onTouched();
    this.blurred.emit();
  }

  protected onFocus(): void {
    this.focused.emit();
  }

  protected onKeyDown(event: KeyboardEvent): void {
    this.keyPressed.emit(event);
  }

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.inputValue.set(value || '');
    const inputEl = this.inputElement()?.nativeElement;
    if (inputEl) {
      inputEl.value = value || '';
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handled by the disabled input
  }

  // Public methods
  focus(): void {
    this.inputElement()?.nativeElement?.focus();
  }

  blur(): void {
    this.inputElement()?.nativeElement?.blur();
  }

  select(): void {
    this.inputElement()?.nativeElement?.select();
  }

  getValue(): string {
    return this.inputValue();
  }
}