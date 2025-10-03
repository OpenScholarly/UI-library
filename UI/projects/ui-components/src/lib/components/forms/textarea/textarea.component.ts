import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal, viewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextareaSize, TextareaVariant, TextareaResize } from '../../../types';

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
  // Input properties
  label = input<string>('');
  placeholder = input<string>('');
  helperText = input<string>('');
  errorMessage = input<string>('');
  size = input<TextareaSize>('md');
  variant = input<TextareaVariant>('default');
  resize = input<TextareaResize>('vertical');
  disabled = input(false);
  readonly = input(false);
  required = input(false);
  invalid = input(false);
  autoResize = input(false);
  showCharacterCount = input(false);
  fullWidth = input(true);

  // HTML textarea attributes
  rows = input<number>(4);
  cols = input<number>();
  maxlength = input<number>();
  minlength = input<number>();

  // Outputs
  valueChanged = output<string>();
  focused = output<void>();
  blurred = output<void>();
  keyPressed = output<KeyboardEvent>();
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
      ? 'text-text-disabled'
      : 'text-text-primary';
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
      default: 'border border-gray-300 rounded-md bg-white',
      filled: 'border-0 rounded-md bg-gray-100',
      outlined: 'border-2 border-gray-300 rounded-md bg-transparent'
    };

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };

    const stateClasses = this.disabled()
      ? 'bg-gray-50 text-text-disabled cursor-not-allowed'
      : this.readonly()
      ? 'bg-gray-50 cursor-default'
      : 'text-text-primary';

    const invalidClasses = this.invalid()
      ? 'border-red-500 ui-focus-danger'
      : 'hover:border-gray-400';

    return `${baseClasses} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]} ${resizeClasses[this.resize()]} ${stateClasses} ${invalidClasses}`;
  });

  protected characterCountClasses = computed(() => {
    const baseClasses = 'absolute bottom-2 right-2 text-xs pointer-events-none';
    const colorClasses = this.isAtMaxLength()
      ? 'text-red-500'
      : 'text-text-secondary';
    return `${baseClasses} ${colorClasses}`;
  });

  protected helperTextClasses = computed(() => {
    return 'mt-1 text-sm text-text-secondary';
  });

  protected errorTextClasses = computed(() => {
    return 'mt-1 text-sm text-red-600';
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
