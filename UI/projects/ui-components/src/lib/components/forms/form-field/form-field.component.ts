import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * A form field wrapper component providing consistent layout and styling for form controls.
 * 
 * ## Features
 * - Multiple label positioning options (top, left, floating)
 * - Helper text and validation messages
 * - Prefix/suffix icon support
 * - Required indicators with proper ARIA attributes
 * - Error state styling and announcements
 * - Success state styling
 * - Disabled state styling
 * - Full accessibility with WCAG 2.1 Level AA compliance
 * - Dark mode support
 * - Responsive layout
 * 
 * ## Important Notes
 * - **Floating labels**: Input must have `class="peer"` and `placeholder=" "` (single space)
 * - **Prefix/suffix icons**: Input must have appropriate padding classes:
 *   - `pl-10` for prefix icons (sm size: `pl-8`, lg size: `pl-12`)
 *   - `pr-10` for suffix icons (sm size: `pr-8`, lg size: `pr-12`)
 * - The form field wrapper provides positioning for icons but styling the input is the consumer's responsibility
 * 
 * @example
 * ```html
 * <!-- Basic form field with top label -->
 * <ui-form-field
 *   label="Email Address"
 *   [required]="true"
 *   helperText="We'll never share your email">
 *   <input type="email" class="...">
 * </ui-form-field>
 * 
 * <!-- Form field with left label -->
 * <ui-form-field
 *   label="Username"
 *   labelPosition="left"
 *   [required]="true">
 *   <input type="text">
 * </ui-form-field>
 * 
 * <!-- Form field with floating label -->
 * <!-- IMPORTANT: For floating labels to work properly, the input MUST have: -->
 * <!-- 1. class="peer" to enable Tailwind's peer selector -->
 * <!-- 2. A placeholder=" " (single space) to enable :placeholder-shown pseudo-class -->
 * <ui-form-field
 *   label="Password"
 *   labelPosition="floating"
 *   [required]="true">
 *   <input type="password" class="peer" placeholder=" ">
 * </ui-form-field>
 * 
 * <!-- Form field with error state -->
 * <ui-form-field
 *   label="Age"
 *   [required]="true"
 *   [error]="true"
 *   errorMessage="Age must be between 18 and 120">
 *   <input type="number">
 * </ui-form-field>
 * 
 * <!-- Form field with prefix icon -->
 * <!-- NOTE: When using prefix/suffix icons, add appropriate padding to your input -->
 * <ui-form-field
 *   label="Search"
 *   prefixIcon="🔍">
 *   <input type="search" class="pl-10 ...other-classes">
 * </ui-form-field>
 * 
 * <!-- Form field with suffix icon -->
 * <ui-form-field
 *   label="Amount"
 *   suffixIcon="💵">
 *   <input type="number" class="pr-10 ...other-classes">
 * </ui-form-field>
 * 
 * <!-- Form field with both prefix and suffix icons -->
 * <ui-form-field
 *   label="Amount"
 *   prefixIcon="💵"
 *   suffixIcon="✓">
 *   <input type="number" class="pl-10 pr-10 ...other-classes">
 * </ui-form-field>
 * 
 * <!-- Using the inputPaddingClasses helper in TypeScript -->
 * <!-- In your component: -->
 * <!-- @ViewChild(FormFieldComponent) formField!: FormFieldComponent; -->
 * <!-- Then access: formField.inputPaddingClasses().combined -->
 * 
 * <!-- Form field with error state -->
 * <ui-form-field
 *   label="Email"
 *   [success]="true"
 *   successMessage="Email verified successfully">
 *   <input type="email" value="user@example.com">
 * </ui-form-field>
 * 
 * <!-- Disabled form field -->
 * <ui-form-field
 *   label="Account Type"
 *   [disabled]="true">
 *   <input type="text" disabled value="Premium">
 * </ui-form-field>
 * ```
 */
@Component({
  selector: 'ui-form-field',
  template: `
    <div [class]="containerClasses()" [attr.data-label-position]="labelPosition()">
      @if (labelPosition() !== 'floating') {
        <div [class]="labelContainerClasses()">
          @if (label()) {
            <label
              [for]="fieldId()"
              [class]="labelClasses()"
              [attr.aria-label]="ariaLabel() || label()">
              {{ label() }}
              @if (required()) {
                <span 
                  class="text-red-500 dark:text-red-400 ml-0.5" 
                  aria-label="required field">*</span>
              }
            </label>
          }
          @if (helperText() && !error() && !success()) {
            <span 
              [id]="helperId()" 
              [class]="helperTextClasses()"
              role="note">
              {{ helperText() }}
            </span>
          }
        </div>
      }

      <div [class]="inputWrapperClasses()">
        @if (prefixIcon()) {
          <div [class]="prefixIconClasses()">
            <span [innerHTML]="prefixIcon()" aria-hidden="true"></span>
          </div>
        }

        <div [class]="inputContainerClasses()">
          @if (labelPosition() === 'floating') {
            <label
              [for]="fieldId()"
              [class]="floatingLabelClasses()"
              [attr.aria-label]="ariaLabel() || label()">
              {{ label() }}
              @if (required()) {
                <span 
                  class="text-red-500 dark:text-red-400 ml-0.5" 
                  aria-label="required field">*</span>
              }
            </label>
          }
          
          <ng-content />
        </div>

        @if (suffixIcon()) {
          <div [class]="suffixIconClasses()">
            <span [innerHTML]="suffixIcon()" aria-hidden="true"></span>
          </div>
        }
      </div>

      @if (error() && errorMessage()) {
        <div 
          [id]="errorId()" 
          [class]="errorMessageClasses()"
          role="alert"
          aria-live="polite">
          <span aria-hidden="true">⚠️</span>
          <span>{{ errorMessage() }}</span>
        </div>
      }

      @if (success() && successMessage()) {
        <div 
          [class]="successMessageClasses()"
          role="status"
          aria-live="polite">
          <span aria-hidden="true">✓</span>
          <span>{{ successMessage() }}</span>
        </div>
      }

      @if (helperText() && !error() && !success() && labelPosition() !== 'left') {
        <span 
          [id]="helperId()" 
          [class]="helperTextClasses()"
          role="note">
          {{ helperText() }}
        </span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-form-field block'
  }
})
export class FormFieldComponent {
  /**
   * Label text for the form field.
   * @default undefined
   */
  label = input<string>();

  /**
   * Position of the label relative to the input.
   * - `top`: Label above input (default)
   * - `left`: Label to the left of input
   * - `floating`: Label that floats above input when focused
   * @default "top"
   */
  labelPosition = input<'top' | 'left' | 'floating'>('top');

  /**
   * Helper text displayed below the input.
   * @default undefined
   */
  helperText = input<string>();

  /**
   * Whether the field is required.
   * @default false
   */
  required = input<boolean>(false);

  /**
   * Whether the field is disabled.
   * @default false
   */
  disabled = input<boolean>(false);

  /**
   * Whether the field has an error.
   * @default false
   */
  error = input<boolean>(false);

  /**
   * Error message to display when error is true.
   * @default undefined
   */
  errorMessage = input<string>();

  /**
   * Whether the field has a success state.
   * @default false
   */
  success = input<boolean>(false);

  /**
   * Success message to display when success is true.
   * @default undefined
   */
  successMessage = input<string>();

  /**
   * Icon to display before the input (prefix).
   * @default undefined
   */
  prefixIcon = input<string>();

  /**
   * Icon to display after the input (suffix).
   * @default undefined
   */
  suffixIcon = input<string>();

  /**
   * ID for the form field.
   * @default undefined
   */
  fieldId = input<string>(`form-field-${Math.random().toString(36).substring(2, 11)}`);

  /**
   * ARIA label for the field (overrides label).
   * @default undefined
   */
  ariaLabel = input<string>();

  /**
   * Size variant of the form field.
   * - `sm`: Small
   * - `md`: Medium (default)
   * - `lg`: Large
   * @default "md"
   */
  size = input<'sm' | 'md' | 'lg'>('md');

  helperId = computed(() => `${this.fieldId()}-helper`);
  errorId = computed(() => `${this.fieldId()}-error`);

  /**
   * Computed helper to get the recommended padding classes for the input element.
   * Consumers can use this in their input styling.
   * @returns Object with paddingLeft and paddingRight classes
   */
  inputPaddingClasses = computed(() => {
    const sizes = {
      sm: { left: 'pl-8', right: 'pr-8' },
      md: { left: 'pl-10', right: 'pr-10' },
      lg: { left: 'pl-12', right: 'pr-12' }
    };
    
    return {
      paddingLeft: this.prefixIcon() ? sizes[this.size()].left : '',
      paddingRight: this.suffixIcon() ? sizes[this.size()].right : '',
      combined: [
        this.prefixIcon() ? sizes[this.size()].left : '',
        this.suffixIcon() ? sizes[this.size()].right : ''
      ].filter(Boolean).join(' ')
    };
  });

  containerClasses = computed(() => {
    const base = 'flex w-full';
    const layout = {
      top: 'flex-col gap-1.5',
      left: 'flex-row items-start gap-4',
      floating: 'flex-col'
    };
    const state = {
      disabled: this.disabled() ? 'opacity-60 cursor-not-allowed' : '',
      error: this.error() ? 'form-field-error' : '',
      success: this.success() ? 'form-field-success' : ''
    };
    return `${base} ${layout[this.labelPosition()]} ${state.disabled} ${state.error} ${state.success}`;
  });

  labelContainerClasses = computed(() => {
    const base = '';
    const layout = this.labelPosition() === 'left' ? 'flex flex-col min-w-[120px] pt-2.5' : '';
    return `${base} ${layout}`;
  });

  labelClasses = computed(() => {
    const base = 'font-medium text-gray-900 dark:text-gray-100';
    const sizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
    const state = {
      error: this.error() ? 'text-red-700 dark:text-red-400' : '',
      success: this.success() ? 'text-green-700 dark:text-green-400' : ''
    };
    return `${base} ${sizes[this.size()]} ${state.error} ${state.success}`;
  });

  floatingLabelClasses = computed(() => {
    const base = 'absolute left-3 transition-all duration-200 pointer-events-none font-medium';
    const colors = 'text-gray-500 dark:text-gray-400 peer-focus:text-blue-600 dark:peer-focus:text-blue-400';
    // The label floats up when input is focused OR when it has content (not showing placeholder)
    const transform = 'top-2.5 peer-focus:-top-2.5 peer-[:not(:placeholder-shown)]:-top-2.5 peer-focus:text-xs peer-[:not(:placeholder-shown)]:text-xs peer-focus:bg-white dark:peer-focus:bg-gray-900 peer-[:not(:placeholder-shown)]:bg-white dark:peer-[:not(:placeholder-shown)]:bg-gray-900 peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1';
    const state = {
      error: this.error() ? 'text-red-700 dark:text-red-400 peer-focus:text-red-700 dark:peer-focus:text-red-400' : '',
      success: this.success() ? 'text-green-700 dark:text-green-400 peer-focus:text-green-700 dark:peer-focus:text-green-400' : ''
    };
    return `${base} ${colors} ${transform} ${state.error} ${state.success}`;
  });

  inputWrapperClasses = computed(() => {
    const base = 'relative flex items-center flex-1';
    const layout = this.labelPosition() === 'floating' ? 'mt-2' : '';
    return `${base} ${layout}`;
  });

  inputContainerClasses = computed(() => {
    return 'relative flex-1';
  });

  prefixIconClasses = computed(() => {
    const base = 'absolute left-0 top-0 h-full flex items-center justify-center';
    const sizes = {
      sm: 'w-8 text-sm',
      md: 'w-10 text-base',
      lg: 'w-12 text-lg'
    };
    const colors = 'text-gray-500 dark:text-gray-400';
    return `${base} ${sizes[this.size()]} ${colors}`;
  });

  suffixIconClasses = computed(() => {
    const base = 'absolute right-0 top-0 h-full flex items-center justify-center';
    const sizes = {
      sm: 'w-8 text-sm',
      md: 'w-10 text-base',
      lg: 'w-12 text-lg'
    };
    const colors = 'text-gray-500 dark:text-gray-400';
    return `${base} ${sizes[this.size()]} ${colors}`;
  });

  helperTextClasses = computed(() => {
    const base = 'text-gray-600 dark:text-gray-400';
    const sizes = {
      sm: 'text-xs',
      md: 'text-xs',
      lg: 'text-sm'
    };
    const spacing = this.labelPosition() === 'left' ? '' : 'mt-1';
    return `${base} ${sizes[this.size()]} ${spacing}`;
  });

  errorMessageClasses = computed(() => {
    const base = 'flex items-center gap-1.5 text-red-700 dark:text-red-400';
    const sizes = {
      sm: 'text-xs',
      md: 'text-xs',
      lg: 'text-sm'
    };
    return `${base} ${sizes[this.size()]} mt-1`;
  });

  successMessageClasses = computed(() => {
    const base = 'flex items-center gap-1.5 text-green-700 dark:text-green-400';
    const sizes = {
      sm: 'text-xs',
      md: 'text-xs',
      lg: 'text-sm'
    };
    return `${base} ${sizes[this.size()]} mt-1`;
  });
}
