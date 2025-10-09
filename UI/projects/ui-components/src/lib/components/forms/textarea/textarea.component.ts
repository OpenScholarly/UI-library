import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal, viewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextareaSize, TextareaVariant, TextareaResize } from '../../../types';

/**
 * A versatile and accessible textarea component for multi-line text input.
 *
 * ## Features
 * - Multiple input sizes (small, medium, large)
 * - Visual variants (default, filled, outlined)
 * - Configurable resize behavior (none, vertical, horizontal, both)
 * - Character count display with limit
 * - Auto-resize option
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Disabled, readonly, and error state handling
 * - Dark mode support
 * - Custom ARIA attribute support
 * - Seamless integration with Angular Reactive Forms
 *
 * @example
 * ```html
 * <!-- Basic textarea -->
 * <ui-textarea
 *   label="Comments"
 *   placeholder="Enter your comments">
 * </ui-textarea>
 *
 * <!-- Textarea with character limit -->
 * <ui-textarea
 *   label="Description"
 *   [maxlength]="500"
 *   [showCharacterCount]="true"
 *   helperText="Brief description of the item">
 * </ui-textarea>
 *
 * <!-- Textarea with validation -->
 * <ui-textarea
 *   label="Message"
 *   [required]="true"
 *   [invalid]="form.controls.message.invalid && form.controls.message.touched"
 *   errorMessage="Message is required"
 *   [rows]="5">
 * </ui-textarea>
 *
 * <!-- Filled variant with auto-resize -->
 * <ui-textarea
 *   label="Notes"
 *   variant="filled"
 *   [autoResize]="true"
 *   placeholder="Type your notes...">
 * </ui-textarea>
 *
 * <!-- Readonly textarea -->
 * <ui-textarea
 *   label="Terms and Conditions"
 *   [readonly]="true"
 *   [rows]="10"
 *   resize="none">
 * </ui-textarea>
 *
 * <!-- Reactive forms integration -->
 * <ui-textarea
 *   formControlName="feedback"
 *   label="Feedback"
 *   size="lg"
 *   [maxlength]="1000"
 *   [showCharacterCount]="true">
 * </ui-textarea>
 * ```
 */
@Component({
  selector: 'ui-textarea',
  standalone: true,
  template: `
    <div [class]="wrapperClasses()">
      @if (label()) {
        <label
          [for]="textareaId()"
          [class]="labelClasses()">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500 ml-1" aria-label="required">*</span>
          }
        </label>
      }

      <div [class]="textareaContainerClasses()">
        <textarea
          #textareaElement
          [id]="textareaId()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="required()"
          [rows]="rows()"
          [cols]="cols()"
          [maxLength]="maxlength()"
          [minLength]="minlength()"
          [class]="textareaClasses()"
          [attr.aria-invalid]="invalid()"
          [attr.aria-describedby]="getAriaDescribedBy()"
          (input)="onInput($event)"
          (blur)="onBlur()"
          (focus)="onFocus()"
          (keydown)="onKeyDown($event)"
          (paste)="onPaste($event)"
        ></textarea>

        @if (showCharacterCount() && maxlength()) {
          <div [class]="characterCountClasses()">
            {{ currentLength() }}/{{ maxlength() }}
          </div>
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
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ]
})
export class TextareaComponent implements ControlValueAccessor {
  /**
   * Label text displayed above the textarea.
   * @default ""
   * @example "Description"
   */
  label = input<string>('');
  
  /**
   * Placeholder text shown when textarea is empty.
   * @default ""
   * @example "Enter detailed description..."
   */
  placeholder = input<string>('');
  
  /**
   * Helper text displayed below the textarea.
   * Provides additional context or instructions.
   * Hidden when error message is shown.
   * @default ""
   * @example "Maximum 500 characters"
   */
  helperText = input<string>('');
  
  /**
   * Error message displayed when textarea is invalid.
   * Only shown when `invalid` is true.
   * @default ""
   * @example "Description is required"
   */
  errorMessage = input<string>('');
  
  /**
   * Size of the textarea.
   * - `sm`: Small (compact padding)
   * - `md`: Medium (standard padding) - default
   * - `lg`: Large (generous padding)
   * @default "md"
   */
  size = input<TextareaSize>('md');
  
  /**
   * Visual style variant of the textarea.
   * - `default`: Standard border with white background
   * - `filled`: Filled background with subtle border
   * - `outlined`: Prominent border with transparent background
   * @default "default"
   */
  variant = input<TextareaVariant>('default');
  
  /**
   * Resize behavior of the textarea.
   * - `none`: Not resizable
   * - `vertical`: Vertically resizable (default)
   * - `horizontal`: Horizontally resizable
   * - `both`: Resizable in both directions
   * @default "vertical"
   */
  resize = input<TextareaResize>('vertical');
  
  /**
   * Disables the textarea and prevents interaction.
   * Applies disabled styling and prevents value changes.
   * @default false
   */
  disabled = input(false);
  
  /**
   * Makes the textarea readonly.
   * Value can be read but not modified by user.
   * @default false
   */
  readonly = input(false);
  
  /**
   * Marks the textarea as required.
   * Displays asterisk (*) next to label.
   * @default false
   */
  required = input(false);
  
  /**
   * Marks the textarea as invalid.
   * Applies error styling and shows error message if provided.
   * Typically used with form validation.
   * @default false
   */
  invalid = input(false);
  
  /**
   * Automatically adjusts textarea height to fit content.
   * @default false
   */
  autoResize = input(false);
  
  /**
   * Shows character count indicator.
   * Only visible when `maxlength` is set.
   * @default false
   */
  showCharacterCount = input(false);
  
  /**
   * Makes the textarea take full width of its container.
   * @default true
   */
  fullWidth = input(true);

  /**
   * Number of visible text rows.
   * @default 4
   */
  rows = input<number>(4);
  
  /**
   * Number of visible text columns.
   * @default undefined
   */
  cols = input<number>();
  
  /**
   * Maximum length of input value.
   * @default undefined
   */
  maxlength = input<number>();
  
  /**
   * Minimum length of input value.
   * @default undefined
   */
  minlength = input<number>();

  /**
   * Emitted when the textarea value changes.
   * Provides the new textarea value.
   * @event valueChanged
   */
  valueChanged = output<string>();
  
  /**
   * Emitted when the textarea receives focus.
   * @event focused
   */
  focused = output<void>();
  
  /**
   * Emitted when the textarea loses focus.
   * @event blurred
   */
  blurred = output<void>();
  
  /**
   * Emitted when a key is pressed in the textarea.
   * Provides the keyboard event.
   * @event keyPressed
   */
  keyPressed = output<KeyboardEvent>();
  
  /**
   * Emitted when content is pasted into the textarea.
   * Provides the clipboard event.
   * @event pasted
   */
  pasted = output<ClipboardEvent>();

  // Internal state
  private textareaValue = signal('');
  protected textareaId = signal('');
  protected helperId = signal('');
  protected errorId = signal('');

  // ViewChild
  private textareaElement = viewChild<ElementRef<HTMLTextAreaElement>>('textareaElement');

  // ControlValueAccessor
  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor() {
    this.textareaId.set(`textarea-${Math.random().toString(36).substr(2, 9)}`);
    this.helperId.set(`textarea-helper-${Math.random().toString(36).substr(2, 9)}`);
    this.errorId.set(`textarea-error-${Math.random().toString(36).substr(2, 9)}`);
  }

  // Computed properties
  currentLength = computed(() => this.textareaValue().length);

  protected wrapperClasses = computed(() => {
    const baseClasses = 'ui-textarea-wrapper';
    const widthClasses = this.fullWidth() ? 'w-full' : '';
    return `${baseClasses} ${widthClasses}`.trim();
  });

  protected labelClasses = computed(() => {
    const baseClasses = 'block text-sm font-medium mb-1';
    const colorClasses = this.disabled()
      ? 'text-gray-400 dark:text-gray-500'
      : 'text-gray-900 dark:text-gray-100';
    return `${baseClasses} ${colorClasses}`;
  });

  protected textareaContainerClasses = computed(() => {
    return 'relative';
  });

  protected textareaClasses = computed(() => {
    const baseClasses = 'ui-focus-primary ui-transition-standard w-full';

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-base',
      lg: 'px-4 py-3 text-lg'
    };

    const variantClasses = {
      default: 'border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800',
      filled: 'border-0 rounded-md bg-gray-100 dark:bg-gray-700',
      outlined: 'border-2 border-gray-300 dark:border-gray-600 rounded-md bg-transparent'
    };

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };

    const stateClasses = this.disabled()
      ? 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 cursor-not-allowed'
      : this.readonly()
      ? 'bg-gray-50 dark:bg-gray-900 cursor-default'
      : 'text-gray-900 dark:text-gray-100';

    const invalidClasses = this.invalid()
      ? 'border-red-500 dark:border-red-400 ui-focus-danger'
      : 'hover:border-gray-400 dark:hover:border-gray-500';

    return `${baseClasses} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]} ${resizeClasses[this.resize()]} ${stateClasses} ${invalidClasses}`;
  });

  protected characterCountClasses = computed(() => {
    const baseClasses = 'absolute bottom-2 right-2 text-xs pointer-events-none';
    const colorClasses = this.isAtMaxLength()
      ? 'text-red-500 dark:text-red-400'
      : 'text-gray-600 dark:text-gray-400';
    return `${baseClasses} ${colorClasses}`;
  });

  protected helperTextClasses = computed(() => {
    return 'mt-1 text-sm text-gray-600 dark:text-gray-400';
  });

  protected errorTextClasses = computed(() => {
    return 'mt-1 text-sm text-red-600 dark:text-red-400';
  });

  private isAtMaxLength(): boolean {
    return this.maxlength() ? this.currentLength() >= this.maxlength()! : false;
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
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    this.textareaValue.set(value);
    this.valueChanged.emit(value);
    this.onChange(value);

    if (this.autoResize()) {
      this.adjustHeight();
    }
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

    // Handle keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'a':
          // Allow Ctrl+A (select all)
          break;
        case 'Enter':
          // Submit form on Ctrl+Enter
          event.preventDefault();
          this.onSubmit();
          break;
      }
    }
  }

  protected onPaste(event: ClipboardEvent): void {
    this.pasted.emit(event);

    // Adjust height after paste if auto-resize is enabled
    if (this.autoResize()) {
      setTimeout(() => this.adjustHeight(), 0);
    }
  }

  private onSubmit(): void {
    // Dispatch a custom submit event that can be caught by parent forms
    const submitEvent = new CustomEvent('ui-textarea-submit', {
      detail: { value: this.textareaValue() },
      bubbles: true
    });
    this.textareaElement()?.nativeElement?.dispatchEvent(submitEvent);
  }

  private adjustHeight(): void {
    const textarea = this.textareaElement()?.nativeElement;
    if (!textarea) return;

    // Reset height to recalculate
    textarea.style.height = 'auto';

    // Set height to scroll height
    const newHeight = Math.max(textarea.scrollHeight, this.getMinHeight());
    textarea.style.height = `${newHeight}px`;
  }

  private getMinHeight(): number {
    const size = this.size();
    const baseSizes = {
      sm: 60,  // Approximately 3 rows
      md: 80,  // Approximately 4 rows
      lg: 100  // Approximately 5 rows
    };
    return baseSizes[size];
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.textareaValue.set(value || '');
    const textareaEl = this.textareaElement()?.nativeElement;
    if (textareaEl) {
      textareaEl.value = value || '';
      if (this.autoResize()) {
        setTimeout(() => this.adjustHeight(), 0);
      }
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
    this.textareaElement()?.nativeElement?.focus();
  }

  blur(): void {
    this.textareaElement()?.nativeElement?.blur();
  }

  select(): void {
    this.textareaElement()?.nativeElement?.select();
  }

  selectRange(start: number, end: number): void {
    const textarea = this.textareaElement()?.nativeElement;
    if (textarea) {
      textarea.setSelectionRange(start, end);
    }
  }

  insertAtCursor(text: string): void {
    const textarea = this.textareaElement()?.nativeElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = this.textareaValue();

    const newValue = currentValue.slice(0, start) + text + currentValue.slice(end);
    this.textareaValue.set(newValue);
    this.valueChanged.emit(newValue);
    this.onChange(newValue);

    // Update textarea value and cursor position
    textarea.value = newValue;
    textarea.setSelectionRange(start + text.length, start + text.length);

    if (this.autoResize()) {
      this.adjustHeight();
    }
  }

  getValue(): string {
    return this.textareaValue();
  }

  clear(): void {
    this.textareaValue.set('');
    this.valueChanged.emit('');
    this.onChange('');

    const textarea = this.textareaElement()?.nativeElement;
    if (textarea) {
      textarea.value = '';
      if (this.autoResize()) {
        this.adjustHeight();
      }
    }
  }
}
