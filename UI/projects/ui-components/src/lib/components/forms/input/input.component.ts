import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal, viewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AriaHelpersService } from '../../../utilities/aria-helpers.service';
import { InputType, InputSize, InputVariant } from '../../../types';

/**
 * A versatile and accessible text input component for form data entry.
 *
 * ## Features
 * - Multiple input types (text, email, password, number, tel, url, search, date, time, etc.)
 * - Comprehensive size options (small, medium, large)
 * - Visual variants (default, filled, outlined)
 * - Prefix and suffix icon support
 * - Password visibility toggle
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Disabled, readonly, and error state handling
 * - Dark mode support
 * - Custom ARIA attribute support
 * - Seamless integration with Angular Reactive Forms
 *
 * @example
 * ```html
 * <!-- Basic text input -->
 * <ui-input
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email">
 * </ui-input>
 *
 * <!-- Input with validation and error -->
 * <ui-input
 *   label="Username"
 *   [required]="true"
 *   [invalid]="form.controls.username.invalid && form.controls.username.touched"
 *   errorMessage="Username must be at least 3 characters"
 *   helperText="Choose a unique username">
 * </ui-input>
 *
 * <!-- Password input with toggle -->
 * <ui-input
 *   label="Password"
 *   type="password"
 *   [showPasswordToggle]="true"
 *   placeholder="Enter secure password">
 * </ui-input>
 *
 * <!-- Input with prefix icon -->
 * <ui-input
 *   label="Search"
 *   type="search"
 *   prefixIcon="🔍"
 *   placeholder="Search items...">
 * </ui-input>
 *
 * <!-- Number input with min/max -->
 * <ui-input
 *   label="Quantity"
 *   type="number"
 *   [min]="1"
 *   [max]="100"
 *   [step]="1">
 * </ui-input>
 *
 * <!-- Reactive forms integration -->
 * <ui-input
 *   formControlName="email"
 *   label="Email"
 *   type="email"
 *   variant="filled"
 *   size="lg">
 * </ui-input>
 *
 * <!-- Readonly input -->
 * <ui-input
 *   label="Account ID"
 *   [readonly]="true"
 *   [value]="accountId">
 * </ui-input>
 * ```
 */
@Component({
  selector: 'ui-input',
  standalone: true,
  template: `
    <div [class]="wrapperClasses()">
      @if(label()) {
        <label
          [for]="inputId()"
          [class]="labelClasses()">
          {{ label() }}
          @if(required()) {
            <span class="text-red-500 ml-1" aria-label="required">*</span>
          }
        </label>
      }

      <div [class]="inputContainerClasses()">
        @if(prefixIcon()) {
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span [class]="iconClasses()">{{ prefixIcon() }}</span>
          </div>
        }

        <input
          #inputElement
          [id]="inputId()"
          [type]="actualType()"
          [value]="inputValue()"
          [placeholder]="placeholder()"
          [disabled]="isDisabled()"
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

        @if(suffixIcon() && !showClear() && !showCopy()) {
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span [class]="iconClasses()">{{ suffixIcon() }}</span>
          </div>
        }

        @if(showClear()) {
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center ui-focus-primary rounded hover:text-red-600 dark:hover:text-red-400"
            (click)="clearInput()"
            [attr.aria-label]="'Clear input'">
            <span [class]="iconClasses()">✕</span>
          </button>
        }

        @if(showCopy()) {
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-3 flex items-center ui-focus-primary rounded hover:text-blue-600 dark:hover:text-blue-400"
            (click)="copyToClipboard()"
            [attr.aria-label]="'Copy to clipboard'">
            <span [class]="iconClasses()">📋</span>
          </button>
        }

        @if(type() === 'password' && showPasswordToggle() && !showClear() && !showCopy()) {
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

      @if(showPasswordStrength() && type() === 'password' && passwordStrength()) {
        <div class="mt-2 flex items-center gap-2" role="status" aria-live="polite">
          <div class="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              [class]=`h-full transition-all duration-300 ${passwordStrength()!.color}`
              [style.width]="passwordStrength()!.level === 'weak' ? '33%' : passwordStrength()!.level === 'medium' ? '66%' : '100%'">
            </div>
          </div>
          <span [class]="'text-xs font-medium ' + (passwordStrength()!.level === 'weak' ? 'text-red-600' : passwordStrength()!.level === 'medium' ? 'text-yellow-600' : 'text-green-600')">
            {{ passwordStrength()!.text }}
          </span>
        </div>
      }

      @if(showCharCount()) {
        <p class="mt-1 text-xs text-right" 
           [class]="characterCount() > maxlength() ? 'text-red-600' : 'text-gray-500'"
           role="status" 
           [attr.aria-live]="characterCount() > maxlength() ? 'assertive' : 'polite'">
          {{ characterCount() }} / {{ maxlength() }}
        </p>
      }

      @if(helperText() && !invalid()) {
        <p [id]="helperId()" [class]="helperTextClasses()">
          {{ helperText() }}
        </p>
      }

      @if(invalid() && errorMessage()) {
        <p [id]="errorId()" [class]="errorTextClasses()" role="alert">
          {{ errorMessage() }}
        </p>
      }

      <!-- Copy status announcement for screen readers -->
      @if(copyStatus() !== 'idle') {
        <div class="sr-only" role="status" aria-live="polite">
          @if(copyStatus() === 'success') {
            Copied to clipboard
          } @else {
            Failed to copy to clipboard
          }
        </div>
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
  /**
   * HTML input type attribute.
   * Supports all standard HTML5 input types.
   * @default "text"
   * @example "email", "password", "number", "tel", "url", "search", "date", "time"
   */
  type = input<InputType>('text');
  
  /**
   * Size of the input field.
   * - `sm`: Small (36px height)
   * - `md`: Medium (40px height) - default
   * - `lg`: Large (48px height)
   * @default "md"
   */
  size = input<InputSize>('md');
  
  /**
   * Visual style variant of the input.
   * - `default`: Standard border with white background
   * - `filled`: Filled background with subtle border
   * - `outlined`: Prominent border with transparent background
   * @default "default"
   */
  variant = input<InputVariant>('default');
  
  /**
   * Label text displayed above the input field.
   * @default ""
   * @example "Email Address"
   */
  label = input<string>('');
  
  /**
   * Placeholder text shown when input is empty.
   * @default ""
   * @example "Enter your email"
   */
  placeholder = input<string>('');

  /**
   * Helper text displayed below the input.
   * Provides additional context or instructions.
   * Hidden when error message is shown.
   * @default ""
   * @example "We'll never share your email"
   */
  helperText = input<string>('');
  
  /**
   * Error message displayed when input is invalid.
   * Only shown when `invalid` is true.
   * @default ""
   * @example "Please enter a valid email address"
   */
  errorMessage = input<string>('');
  
  /**
   * Icon or emoji displayed at the start of the input.
   * Accepts HTML string or emoji character.
   * @default ""
   * @example "📧" or "🔍"
   */
  prefixIcon = input<string>('');
  
  /**
   * Icon or emoji displayed at the end of the input.
   * Accepts HTML string or emoji character.
   * @default ""
   * @example "✓" or "❌"
   */
  suffixIcon = input<string>('');
  
  /**
   * Disables the input and prevents interaction.
   * Applies disabled styling and prevents value changes.
   * @default false
   */
  disabled = input(false);
  
  /**
   * Makes the input readonly.
   * Value can be read but not modified by user.
   * @default false
   */
  readonly = input(false);
  
  /**
   * Marks the input as required.
   * Displays asterisk (*) next to label.
   * @default false
   */
  required = input(false);
  
  /**
   * Marks the input as invalid.
   * Applies error styling and shows error message if provided.
   * Typically used with form validation.
   * @default false
   */
  invalid = input(false);
  
  /**
   * Shows/hides password visibility toggle for password inputs.
   * Only applies when type is "password".
   * @default true
   */
  showPasswordToggle = input(true);
  
  /**
   * Makes the input take full width of its container.
   * @default true
   */
  fullWidth = input(true);

  /**
   * Minimum value for number, date, and time inputs.
   * @default ""
   */
  min = input<string | number>('');
  
  /**
   * Maximum value for number, date, and time inputs.
   * @default ""
   */
  max = input<string | number>('');
  
  /**
   * Step value for number inputs.
   * @default ""
   */
  step = input<string | number>('');
  
  /**
   * Maximum length of input value.
   * @default 50
   */
  maxlength = input<number>(50);
  
  /**
   * Regular expression pattern for input validation.
   * @default ""
   * @example "[0-9]{3}-[0-9]{3}-[0-9]{4}" for phone number
   */
  pattern = input<string>('');
  
  /**
   * Autocomplete attribute for browser autofill.
   * @default ""
   * @example "email", "username", "new-password", "current-password"
   */
  autocomplete = input<string>('');

  /**
   * Shows character counter below the input.
   * Displays current length / maxlength.
   * @default false
   */
  showCharacterCounter = input(false);

  /**
   * Shows clear button (X) to empty the input.
   * Only shown when input has value and is not disabled/readonly.
   * @default false
   */
  showClearButton = input(false);

  /**
   * Shows copy-to-clipboard button for readonly inputs.
   * Allows easy copying of non-editable values.
   * @default false
   */
  showCopyButton = input(false);

  /**
   * Shows password strength meter for password inputs.
   * Displays weak/medium/strong indicator with color coding.
   * Only applies when type is "password".
   * @default false
   */
  showPasswordStrength = input(false);

  /**
   * Emitted when the input value changes.
   * Provides the new input value.
   * @event valueChange
   */
  valueChange = output<string>();
  
  /**
   * Emitted when the input receives focus.
   * @event focused
   */
  focused = output<void>();
  
  /**
   * Emitted when the input loses focus.
   * @event blurred
   */
  blurred = output<void>();

  /**
   * Emitted when copy to clipboard succeeds.
   * @event copySuccess
   */
  copySuccess = output<string>();

  /**
   * Emitted when copy to clipboard fails.
   * @event copyError
   */
  copyError = output<Error>();
  
  /**
   * Emitted when a key is pressed in the input.
   * Provides the keyboard event.
   * @event keyPressed
   */
  keyPressed = output<KeyboardEvent>();

  // Internal state
  protected inputValue = signal('');
  protected passwordVisible = signal(false);
  protected inputId = signal('');
  protected helperId = signal('');
  protected errorId = signal('');
  private formDisabled = signal(false);
  protected isDisabled = computed(() => this.disabled() || this.formDisabled());
  protected copyStatus = signal<'idle' | 'success' | 'error'>('idle');

  // P2 Enhancements - computed properties
  protected characterCount = computed(() => this.inputValue().length);
  protected showCharCount = computed(() => this.showCharacterCounter() && this.maxlength() > 0);
  protected showClear = computed(() => 
    this.showClearButton() && this.inputValue().length > 0 && !this.isDisabled() && !this.readonly()
  );
  protected showCopy = computed(() => 
    this.showCopyButton() && this.inputValue().length > 0
  );
  
  protected passwordStrength = computed(() => {
    if (this.type() !== 'password' || !this.showPasswordStrength()) {
      return null;
    }
    const password = this.inputValue();
    if (password.length === 0) return null;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { level: 'weak', color: 'bg-red-500', text: 'Weak' };
    if (strength <= 3) return { level: 'medium', color: 'bg-yellow-500', text: 'Medium' };
    return { level: 'strong', color: 'bg-green-500', text: 'Strong' };
  });

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
    if(this.type() === 'password') {
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
    const colorClasses = this.isDisabled() ? 'text-text-disabled' : 'text-text-primary';
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
      default: 'border border-gray-300 dark:border-gray-600 rounded-md bg-surface',
      filled: 'border-0 rounded-md bg-gray-100 dark:bg-gray-700',
      outlined: 'border-2 border-gray-300 dark:border-gray-600 rounded-md bg-transparent'
    };

    const stateClasses = this.isDisabled()
      ? 'bg-gray-50 dark:bg-gray-900 text-text-disabled cursor-not-allowed'
      : this.readonly()
      ? 'bg-gray-50 dark:bg-gray-900 cursor-default'
      : 'text-text-primary';

    const invalidClasses = this.invalid()
      ? 'border-red-500 dark:border-red-400 ui-focus-danger'
      : 'hover:border-gray-400 dark:hover:border-gray-500';

    const paddingClasses = this.getPaddingClasses();

    return `${baseClasses} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]} ${stateClasses} ${invalidClasses} ${paddingClasses}`;
  });

  protected iconClasses = computed(() => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const colorClasses = this.isDisabled() ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400';

    return `${sizeClasses[this.size()]} ${colorClasses}`;
  });

  protected helperTextClasses = computed(() => {
    return 'mt-1 text-sm text-gray-600 dark:text-gray-400';
  });

  protected errorTextClasses = computed(() => {
    return 'mt-1 text-sm text-red-600 dark:text-red-400';
  });

  private getPaddingClasses(): string {
    const hasPrefix = !!this.prefixIcon();
    const hasSuffix = !!this.suffixIcon() || (this.type() === 'password' && this.showPasswordToggle());

    if(hasPrefix && hasSuffix) {
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
    if(this.helperText() && !this.invalid()) {
      ids.push(this.helperId());
    }
    if(this.invalid() && this.errorMessage()) {
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
    if(inputEl) {
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
    this.formDisabled.set(!!isDisabled);
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

  // P2 Enhancement methods
  protected clearInput(): void {
    this.inputValue.set('');
    this.onChange('');
    this.valueChange.emit('');
    this.inputElement()?.nativeElement?.focus();
  }

  protected async copyToClipboard(): Promise<void> {
    const value = this.inputValue();
    if (!value) return;
    
    try {
      await navigator.clipboard.writeText(value);
      this.copyStatus.set('success');
      this.copySuccess.emit(value);
      // Reset status after 2 seconds
      setTimeout(() => this.copyStatus.set('idle'), 2000);
    } catch (err) {
      if (typeof ngDevMode !== 'undefined' && ngDevMode) {
        console.error('Failed to copy:', err);
      }
      this.copyStatus.set('error');
      this.copyError.emit(err as Error);
      // Reset status after 2 seconds
      setTimeout(() => this.copyStatus.set('idle'), 2000);
    }
  }
}