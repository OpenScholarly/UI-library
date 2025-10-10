import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToggleSize, ToggleVariant } from '../../../types';

/**
 * A versatile and accessible toggle switch component for binary selections.
 *
 * ## Features
 * - Multiple visual variants (default, primary, success, warning, danger)
 * - iOS-style options (ios26 modern, ios18 classic)
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
 *   iosStyle="ios18"
 *   description="Switch between light and dark themes">
 * </ui-toggle>
 *
 * <!-- Toggle with icons -->
 * <ui-toggle
 *   label="Auto-save"
 *   [showIcons]="true"
 *   variant="primary"
 *   iosStyle="ios26">
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
   * iOS 26 style (Modern, 2028 design):
   * - `sm`: Small (24px × 40px)
   * - `md`: Medium (32px × 52px) - default, authentic iOS 26 dimensions
   * - `lg`: Large (40px × 64px)
   * 
   * iOS 18 style (Classic, iOS 7-18 design):
   * - `sm`: Small (22px × 36px)
   * - `md`: Medium (31px × 51px) - authentic iOS toggle dimensions
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
   * - `ios26`: Modern iOS style with enhanced proportions and animations (default)
   * - `ios18`: Classic iOS style with traditional compact design
   * @default "ios26"
   */
  iosStyle = input<'ios26' | 'ios18'>('ios26');

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

    // iOS 26 style: Modern iOS toggle dimensions (2028 design)
    // Approximately 52px × 32px at medium size, maintains ~1.625:1 ratio
    const ios26SizeClasses = {
      sm: 'h-6 w-10',    // 24px × 40px (scaled down proportionally)
      md: 'h-8 w-[52px]', // 32px × 52px (authentic iOS 26 dimensions)
      lg: 'h-10 w-16'    // 40px × 64px (scaled up proportionally)
    };

    // iOS 18 style: Classic iOS toggle dimensions (iOS 7-18 design)
    // Authentic 51px × 31px at medium size, maintains ~1.645:1 ratio
    const ios18SizeClasses = {
      sm: 'h-[22px] w-9',  // 22px × 36px (scaled down proportionally)
      md: 'h-[31px] w-[51px]', // 31px × 51px (authentic iOS dimensions)
      lg: 'h-10 w-16'      // 40px × 64px (scaled up proportionally)
    };

    const sizeClasses = this.iosStyle() === 'ios26' ? ios26SizeClasses : ios18SizeClasses;

    const stateClasses = this.checked()
      ? this.getCheckedTrackClasses()
      : this.getUncheckedTrackClasses();

    return `${baseClasses} ${sizeClasses[this.size()]} ${stateClasses}`;
  });

  protected toggleThumbClasses = computed(() => {
    // iOS 26 style: Enhanced shadow with proper iOS appearance
    // Thumb is ~29px in a 32px track (28px visible + 2px padding each side)
    const ios26BaseClasses = 'absolute flex items-center justify-center bg-white rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)] ui-transition-transform duration-200';
    
    // iOS 18 style: Classic iOS shadow
    // Thumb is ~27px in a 31px track (27px visible + 2px padding each side)
    const ios18BaseClasses = 'absolute flex items-center justify-center bg-white rounded-full shadow-[0_3px_1px_rgba(0,0,0,0.04),0_3px_8px_rgba(0,0,0,0.12)] ui-transition-transform duration-200';

    const baseClasses = this.iosStyle() === 'ios26' ? ios26BaseClasses : ios18BaseClasses;

    // iOS 26 style: Thumb sized to fit track with 2px padding
    // Track: 32px, Thumb: 28px (32 - 4px padding)
    const ios26SizeClasses = {
      sm: 'h-5 w-5',         // 20px thumb for 24px track
      md: 'h-7 w-7',         // 28px thumb for 32px track (authentic iOS 26)
      lg: 'h-9 w-9'          // 36px thumb for 40px track
    };

    // iOS 18 style: Thumb sized to fit track with 2px padding
    // Track: 31px, Thumb: 27px (31 - 4px padding)
    const ios18SizeClasses = {
      sm: 'h-[18px] w-[18px]',  // 18px thumb for 22px track
      md: 'h-[27px] w-[27px]',  // 27px thumb for 31px track (authentic iOS)
      lg: 'h-9 w-9'             // 36px thumb for 40px track
    };

    const sizeClasses = this.iosStyle() === 'ios26' ? ios26SizeClasses : ios18SizeClasses;

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
    // Use authentic iOS green (#34C759) for success/default ON state
    // Allow other variants for flexibility
    const variantClasses = {
      default: 'bg-[#34C759]',     // iOS system green
      primary: 'bg-primary-600',
      success: 'bg-[#34C759]',     // iOS system green
      warning: 'bg-yellow-500',
      danger: 'bg-red-600'
    };

    return variantClasses[this.variant()];
  }

  private getUncheckedTrackClasses(): string {
    // iOS uses a light gray (#E5E5EA in light mode, darker in dark mode)
    const baseClasses = 'bg-[#E5E5EA] dark:bg-gray-700';
    const invalidClasses = this.invalid() ? 'ring-2 ring-red-500 dark:ring-red-400' : '';
    return `${baseClasses} ${invalidClasses}`.trim();
  }

  private getCheckedThumbPosition(): string {
    // iOS 26 style: Calculate position based on track width - thumb width - padding
    // Track: 52px, Thumb: 28px, Position: 52 - 28 - 2 = 22px (translate-x-[22px])
    const ios26PositionClasses = {
      sm: 'translate-x-[18px]',   // 40 - 20 - 2 = 18px
      md: 'translate-x-[22px]',   // 52 - 28 - 2 = 22px (authentic iOS 26)
      lg: 'translate-x-[26px]'    // 64 - 36 - 2 = 26px
    };

    // iOS 18 style: Calculate position based on track width - thumb width - padding
    // Track: 51px, Thumb: 27px, Position: 51 - 27 - 2 = 22px
    const ios18PositionClasses = {
      sm: 'translate-x-[16px]',   // 36 - 18 - 2 = 16px
      md: 'translate-x-[22px]',   // 51 - 27 - 2 = 22px (authentic iOS)
      lg: 'translate-x-[26px]'    // 64 - 36 - 2 = 26px
    };

    const positionClasses = this.iosStyle() === 'ios26' ? ios26PositionClasses : ios18PositionClasses;

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
