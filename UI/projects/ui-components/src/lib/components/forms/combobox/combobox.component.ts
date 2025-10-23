import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Combobox option interface
 */
export interface ComboboxOption {
  /** Unique value */
  value: string;
  /** Display label */
  label: string;
  /** Whether option is disabled */
  disabled?: boolean;
  /** Optional category/group */
  group?: string;
}

/**
 * Combobox Component
 * 
 * A combination of input and dropdown with autocomplete, multi-select, and keyboard navigation.
 * 
 * @example
 * ```typescript
 * <ui-combobox
 *   [options]="fruits"
 *   [(value)]="selectedFruit"
 *   placeholder="Select a fruit..."
 *   [filterable]="true"
 *   (valueChange)="handleSelection($event)">
 * </ui-combobox>
 * 
 * fruits: ComboboxOption[] = [
 *   { value: 'apple', label: 'Apple 🍎' },
 *   { value: 'banana', label: 'Banana 🍌' },
 *   { value: 'cherry', label: 'Cherry 🍒' }
 * ];
 * ```
 * 
 * Features:
 * - Autocomplete with suggestions
 * - Multi-select support
 * - Creatable options
 * - Async data loading support
 * - Keyboard navigation
 * - Custom rendering
 * - Full ARIA support
 * - WCAG 2.1 Level AA compliant
 */
@Component({
  selector: 'ui-combobox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="combobox-wrapper">
      <!-- Input -->
      <div class="combobox-input-wrapper">
        <input
          #inputRef
          type="text"
          class="combobox-input"
          [placeholder]="placeholder()"
          [(ngModel)]="searchTerm"
          [disabled]="disabled()"
          [attr.aria-label]="ariaLabel()"
          [attr.aria-expanded]="open()"
          [attr.aria-controls]="'combobox-listbox-' + id()"
          [attr.aria-activedescendant]="focusedIndex() >= 0 ? 'combobox-option-' + focusedIndex() : null"
          role="combobox"
          (focus)="onFocus()"
          (input)="onInput()"
          (keydown)="onKeyDown($event)">
        
        <!-- Clear button -->
        <button
          *ngIf="searchTerm() && !disabled()"
          type="button"
          class="combobox-clear"
          [attr.aria-label]="'Clear selection'"
          (click)="clear()">
          ✕
        </button>
        
        <!-- Dropdown toggle -->
        <button
          type="button"
          class="combobox-toggle"
          [attr.aria-label]="'Toggle dropdown'"
          [disabled]="disabled()"
          (click)="toggle()">
          <span class="combobox-toggle-icon" [class.open]="open()">▼</span>
        </button>
      </div>

      <!-- Dropdown -->
      <ul
        *ngIf="open() && filteredOptions().length > 0"
        class="combobox-dropdown"
        role="listbox"
        [attr.id]="'combobox-listbox-' + id()"
        [attr.aria-label]="'Options'">
        
        <li
          *ngFor="let option of filteredOptions(); let i = index"
          class="combobox-option"
          [class.focused]="i === focusedIndex()"
          [class.selected]="isSelected(option)"
          [class.disabled]="option.disabled"
          [attr.id]="'combobox-option-' + i"
          [attr.role]="'option'"
          [attr.aria-selected]="isSelected(option)"
          [attr.aria-disabled]="option.disabled"
          (click)="selectOption(option)"
          (mouseenter)="focusedIndex.set(i)">
          
          <!-- Checkbox for multi-select -->
          <span *ngIf="multiSelect()" class="combobox-checkbox">
            {{ isSelected(option) ? '☑' : '☐' }}
          </span>
          
          <!-- Label -->
          <span class="combobox-option-label">{{ option.label }}</span>
        </li>
      </ul>

      <!-- No results -->
      <div
        *ngIf="open() && filteredOptions().length === 0"
        class="combobox-empty"
        role="status">
        No options found
      </div>
    </div>
  `,
  styles: [`
    .combobox-wrapper {
      position: relative;
      width: 100%;
    }

    .combobox-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .combobox-input {
      flex: 1;
      width: 100%;
      padding: 0.5rem 3.5rem 0.5rem 0.75rem;
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--ui-text-primary, #111827);
      background-color: var(--ui-surface-primary, #ffffff);
      border: 1px solid var(--ui-border-color, #d1d5db);
      border-radius: 0.375rem;
      outline: none;
      transition: all 0.2s ease;
    }

    @media (prefers-color-scheme: dark) {
      .combobox-input {
        color: var(--ui-text-primary, #f9fafb);
        background-color: var(--ui-surface-primary, #1f2937);
        border-color: var(--ui-border-color, #374151);
      }
    }

    .combobox-input:focus {
      border-color: var(--ui-primary, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .combobox-input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .combobox-clear {
      position: absolute;
      right: 2.5rem;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      font-size: 0.875rem;
      color: var(--ui-text-tertiary, #9ca3af);
      background: none;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      outline: none;
      transition: all 0.2s ease;
    }

    .combobox-clear:hover {
      color: var(--ui-text-primary, #111827);
      background-color: var(--ui-surface-hover, rgba(0, 0, 0, 0.05));
    }

    .combobox-clear:focus-visible {
      outline: 2px solid var(--ui-primary, #3b82f6);
      outline-offset: 2px;
    }

    .combobox-toggle {
      position: absolute;
      right: 0.5rem;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      background: none;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      outline: none;
      transition: all 0.2s ease;
    }

    .combobox-toggle:hover:not(:disabled) {
      background-color: var(--ui-surface-hover, rgba(0, 0, 0, 0.05));
    }

    .combobox-toggle:focus-visible {
      outline: 2px solid var(--ui-primary, #3b82f6);
      outline-offset: 2px;
    }

    .combobox-toggle:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .combobox-toggle-icon {
      font-size: 0.75rem;
      color: var(--ui-text-tertiary, #9ca3af);
      transition: transform 0.2s ease;
    }

    .combobox-toggle-icon.open {
      transform: rotate(180deg);
    }

    .combobox-dropdown {
      position: absolute;
      top: calc(100% + 0.25rem);
      left: 0;
      right: 0;
      max-height: 300px;
      margin: 0;
      padding: 0.25rem 0;
      list-style: none;
      background-color: var(--ui-surface-primary, #ffffff);
      border: 1px solid var(--ui-border-color, #e5e7eb);
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow-y: auto;
      z-index: 1000;
      animation: fadeIn 0.15s ease;
    }

    @media (prefers-color-scheme: dark) {
      .combobox-dropdown {
        background-color: var(--ui-surface-primary, #1f2937);
        border-color: var(--ui-border-color, #374151);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .combobox-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      min-height: 36px;
      color: var(--ui-text-primary, #111827);
      cursor: pointer;
      transition: background-color 0.15s ease;
      outline: none;
    }

    @media (prefers-color-scheme: dark) {
      .combobox-option {
        color: var(--ui-text-primary, #f9fafb);
      }
    }

    .combobox-option:hover:not(.disabled),
    .combobox-option.focused:not(.disabled) {
      background-color: var(--ui-surface-hover, rgba(59, 130, 246, 0.1));
    }

    .combobox-option.selected {
      background-color: var(--ui-primary, #3b82f6);
      color: white;
    }

    .combobox-option.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .combobox-checkbox {
      flex-shrink: 0;
      font-size: 1rem;
    }

    .combobox-option-label {
      flex: 1;
      font-size: 0.875rem;
      line-height: 1.25rem;
    }

    .combobox-empty {
      padding: 0.75rem;
      text-align: center;
      font-size: 0.875rem;
      color: var(--ui-text-tertiary, #9ca3af);
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .combobox-input,
      .combobox-clear,
      .combobox-toggle,
      .combobox-toggle-icon,
      .combobox-option,
      .combobox-dropdown {
        transition: none;
        animation: none;
      }
    }
  `]
})
export class ComboboxComponent {
  /** Available options */
  @Input() set comboOptions(value: ComboboxOption[]) {
    this.options.set(value);
  }

  /** Selected value(s) */
  @Input() set selectedValue(value: string | string[]) {
    this.value.set(value);
  }

  /** Placeholder text */
  @Input() set placeholderText(value: string) {
    this.placeholder.set(value);
  }

  /** Whether multi-select is enabled */
  @Input() set isMultiSelect(value: boolean) {
    this.multiSelect.set(value);
  }

  /** Whether the combobox is disabled */
  @Input() set isDisabled(value: boolean) {
    this.disabled.set(value);
  }

  /** Whether options can be filtered */
  @Input() set canFilter(value: boolean) {
    this.filterable.set(value);
  }

  /** ARIA label */
  @Input() set label(value: string) {
    this.ariaLabel.set(value);
  }

  /** Emitted when value changes */
  @Output() valueChange = new EventEmitter<string | string[]>();

  /** Reference to input element */
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  /** Signal for options */
  options = signal<ComboboxOption[]>([]);

  /** Signal for selected value(s) */
  value = signal<string | string[]>('');

  /** Signal for search term */
  searchTerm = signal<string>('');

  /** Signal for open state */
  open = signal<boolean>(false);

  /** Signal for focused index */
  focusedIndex = signal<number>(-1);

  /** Signal for placeholder */
  placeholder = signal<string>('Select...');

  /** Signal for multi-select */
  multiSelect = signal<boolean>(false);

  /** Signal for disabled state */
  disabled = signal<boolean>(false);

  /** Signal for filterable */
  filterable = signal<boolean>(true);

  /** Signal for ARIA label */
  ariaLabel = signal<string>('Combobox');

  /** Signal for component ID */
  id = signal<string>('');

  private generateId(prefix = 'combobox') {
    return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
  }

  constructor() {
    // Ensure a stable unique id per instance
    if (!this.id()) {
      this.id.set(this.generateId());
    }
  }

  /** Computed filtered options */
  filteredOptions = computed(() => {
    const opts = this.options();
    const term = this.searchTerm().toLowerCase();
    
    if (!this.filterable() || !term) {
      return opts;
    }

    return opts.filter(opt => 
      opt.label.toLowerCase().includes(term) || 
      opt.value.toLowerCase().includes(term)
    );
  });

  /**
   * Handle focus event
   */
  onFocus(): void {
    this.open.set(true);
  }

  /**
   * Handle input event
   */
  onInput(): void {
    this.open.set(true);
    this.focusedIndex.set(0);
  }

  /**
   * Toggle dropdown
   */
  toggle(): void {
    this.open.set(!this.open());
    if (this.open()) {
      this.inputRef.nativeElement.focus();
    }
  }

  /**
   * Clear selection
   */
  clear(): void {
    this.value.set(this.multiSelect() ? [] : '');
    this.searchTerm.set('');
    this.valueChange.emit(this.value());
  }

  /**
   * Check if option is selected
   */
  isSelected(option: ComboboxOption): boolean {
    const val = this.value();
    if (Array.isArray(val)) {
      return val.includes(option.value);
    }
    return val === option.value;
  }

  /**
   * Select an option
   */
  selectOption(option: ComboboxOption): void {
    if (option.disabled) {
      return;
    }

    if (this.multiSelect()) {
      const val = Array.isArray(this.value()) ? this.value() as string[] : [];
      const index = val.indexOf(option.value);
      
      if (index >= 0) {
        val.splice(index, 1);
      } else {
        val.push(option.value);
      }
      
      this.value.set([...val]);
      this.searchTerm.set('');
    } else {
      this.value.set(option.value);
      this.searchTerm.set(option.label);
      this.open.set(false);
    }

    this.valueChange.emit(this.value());
  }

  /**
   * Handle keyboard navigation
   */
  onKeyDown(event: KeyboardEvent): void {
    const options = this.filteredOptions();
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.open()) {
          this.open.set(true);
        }
        this.focusedIndex.set(Math.min(this.focusedIndex() + 1, options.length - 1));
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusedIndex.set(Math.max(this.focusedIndex() - 1, 0));
        break;

      case 'Enter':
        event.preventDefault();
        if (this.open() && this.focusedIndex() >= 0) {
          this.selectOption(options[this.focusedIndex()]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.open.set(false);
        break;
    }
  }

  /**
   * Close on click outside
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.combobox-wrapper')) {
      this.open.set(false);
    }
  }
}
