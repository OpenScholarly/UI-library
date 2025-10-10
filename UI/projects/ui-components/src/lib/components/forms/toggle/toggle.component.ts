import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToggleSize, ToggleVariant } from '../../../types';

/**
 * A versatile and accessible toggle switch component for binary selections.
 *
 * ## Features
 * - Multiple visual variants (default, primary, success, warning, danger)
 * - iOS-style options (pill, modern, classic compact)
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
 * <!-- Basic toggle with modern iOS 26 style -->
 * <ui-toggle label="Enable notifications" />
 *
 * <!-- Toggle with classic iOS 18 style -->
 * <ui-toggle
 *   label="Dark mode"
 *   iosStyle="classic"
 *   description="Switch between light and dark themes">
 * </ui-toggle>
 *
 * <!-- Toggle with icons -->
 * <ui-toggle
 *   label="Auto-save"
 *   [showIcons]="true"
 *   variant="primary"
 *   iosStyle="pill">
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
            @if(showIcons()) {
              <svg [class]="iconClasses()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                @if(checked()) {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                } @else {
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                }
              </svg>
            }
          </div>
        </div>

        @if(label()) {
          <span [class]="labelClasses()">
            {{ label() }}
            @if(required()) {
              <span class="text-red-500 ml-1" aria-label="required">*</span>
            }
          </span>
        }
      </label>

      @if(description()) {
        <p [id]="descriptionId()" [class]="descriptionClasses()">
          {{ description() }}
        </p>
      }

      @if(invalid() && errorMessage()) {
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
   * Pill design:
   * - `sm`: Small (24px × 48px) - 2:1 ratio
   * - `md`: Medium (32px × 64px) - default, elongated pill shape
   * - `lg`: Large (40px × 80px) - 2:1 ratio
   * 
   * Classic design:
   * - `sm`: Small (22px × 36px)
   * - `md`: Medium (31px × 51px)
   * - `lg`: Large (40px × 64px)
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
   * Visual style of the toggle switch.
   * - `pill`: Pill shape toggle (Modern iOS style with enhanced proportions and animations)
   * - `classic`: Classic toggle design (iOS style with traditional compact design)
   * @default "pill"
   */
  design = input<'pill' | 'classic'>('pill');

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
    // 2.28 ratio
    const pillSizeClasses = {
      sm: 'h-[24px] w-[55px]',
      md: 'h-[30px] w-[68px]',
      lg: 'h-[40px] w-[91px]'
    };
    // 1.6 ratio
    const classicSizeClasses = {
      sm: 'h-[22px] w-9',      // 22px × 36px
      md: 'h-[31px] w-[51px]', // 31px × 51px
      lg: 'h-10 w-16'          // 40px × 64px
    };
    const sizeClasses = this.design() === 'pill' ? pillSizeClasses : classicSizeClasses;

    const stateClasses = this.checked() ? this.getCheckedTrackClasses() : this.getUncheckedTrackClasses();

    return `${baseClasses} ${sizeClasses[this.size()]} ${stateClasses}`;
  });

  protected toggleThumbClasses = computed(() => {
    const pillBaseClasses = 'absolute flex items-center justify-center bg-white dark:bg-gray-200 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)] ui-transition-transform duration-200';
    const classicBaseClasses = 'absolute flex items-center justify-center bg-white dark:bg-gray-200 rounded-full shadow-[0_3px_1px_rgba(0,0,0,0.04),0_3px_8px_rgba(0,0,0,0.12)] ui-transition-transform duration-200';
    const baseClasses = this.design() === 'pill' ? pillBaseClasses : classicBaseClasses;
    // * 0.843 from track size to thumb size in height and 0.566 from track size to thumb size in width
    const pillSizeClasses = {
      sm: 'h-[20.2px] w-[31px]',
      md: 'h-[25.3px] w-[38.5px]',
      lg: 'h-[33.7px] w-[51.5px]'
    };
    const classicSizeClasses = {
      sm: 'h-[18px] w-[18px]',
      md: 'h-[27px] w-[27px]',
      lg: 'h-9 w-9'
    };
    const sizeClasses = this.design() === 'pill' ? pillSizeClasses : classicSizeClasses;

    const positionClasses = this.checked() ? this.getCheckedThumbPosition() : 'translate-x-0.5';

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
      default: 'bg-[#34C759] dark:bg-[#32D74B]',     // iOS system green (light/dark)
      primary: 'bg-primary-600 dark:bg-primary-500', // Theme-aware primary color
      success: 'bg-green-600 dark:bg-green-500',     // Theme-aware green
      warning: 'bg-yellow-500 dark:bg-yellow-400',
      danger: 'bg-red-600 dark:bg-red-500'
    };

    return variantClasses[this.variant()];
  }

  private getUncheckedTrackClasses(): string {
    const baseClasses = 'bg-[#E5E5EA] dark:bg-gray-700';
    const invalidClasses = this.invalid() ? 'ring-2 ring-red-500 dark:ring-red-400' : '';
    return `${baseClasses} ${invalidClasses}`.trim();
  }

  private getCheckedThumbPosition(): string {
    const pillPositionClasses = {
      sm: 'translate-x-[23px]',   // 55 - 31 - 1 = 23px
      md: 'translate-x-[28.5px]', // 68 - 38.5 - 1 = 28.5px
      lg: 'translate-x-[38.5px]'  // 91 - 51.5 - 1 = 38.5px
    };
    const classicPositionClasses = {
      sm: 'translate-x-[16px]',   // 36 - 18 - 2 = 16px
      md: 'translate-x-[22px]',   // 51 - 27 - 2 = 22px
      lg: 'translate-x-[26px]'    // 64 - 36 - 2 = 26px
    };
    const positionClasses = this.design() === 'pill' ? pillPositionClasses : classicPositionClasses;

    return positionClasses[this.size()];
  }

  protected getAriaDescribedBy(): string {
    const ids: string[] = [];
    if(this.description()) {
      ids.push(this.descriptionId());
    }
    if(this.invalid() && this.errorMessage()) {
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
    if(!this.disabled()) {
      const newValue = !this.checked();
      this.checkedState.set(newValue);
      this.toggled.emit(newValue);
      this.onChange(newValue);
    }
  }

  turnOn(): void {
    if(!this.disabled()) {
      this.checkedState.set(true);
      this.toggled.emit(true);
      this.onChange(true);
    }
  }

  turnOff(): void {
    if(!this.disabled()) {
      this.checkedState.set(false);
      this.toggled.emit(false);
      this.onChange(false);
    }
  }
}
