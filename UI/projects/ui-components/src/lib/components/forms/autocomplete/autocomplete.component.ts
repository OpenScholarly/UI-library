import { ChangeDetectionStrategy, Component, computed, input, output, signal, effect, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AutocompleteOption, AutocompleteSize } from '../../../types';

/**
 * A versatile and accessible autocomplete component for text input with suggestions.
 *
 * ## Features
 * - Real-time filtering of options as user types
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Loading state indicator
 * - Clear button
 * - Multiple size options (sm, md, lg)
 * - Disabled and readonly states
 * - Full screen reader support with ARIA attributes
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 * - Reactive forms support (ControlValueAccessor)
 *
 * @example
 * ```html
 * <!-- Basic autocomplete -->
 * <ui-autocomplete
 *   [options]="countries"
 *   placeholder="Select country"
 *   (selectionChange)="onCountrySelect($event)">
 * </ui-autocomplete>
 *
 * <!-- With loading state -->
 * <ui-autocomplete
 *   [options]="searchResults"
 *   [loading]="isSearching"
 *   placeholder="Search...">
 * </ui-autocomplete>
 *
 * <!-- With clearable option -->
 * <ui-autocomplete
 *   [options]="items"
 *   [clearable]="true"
 *   placeholder="Type to search">
 * </ui-autocomplete>
 *
 * <!-- Large size with readonly -->
 * <ui-autocomplete
 *   [options]="options"
 *   size="lg"
 *   [readonly]="true"
 *   placeholder="Read only">
 * </ui-autocomplete>
 *
 * <!-- With reactive forms -->
 * <ui-autocomplete
 *   [formControl]="countryControl"
 *   [options]="countries"
 *   placeholder="Select your country">
 * </ui-autocomplete>
 * ```
 */
@Component({
  selector: 'ui-autocomplete',
  standalone: true,
  template: `
    <div [class]="containerClasses()">
      <!-- Input Field -->
      <div class="relative">
        <input
          [class]="inputClasses()"
          [value]="displayValue()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-haspopup]="'listbox'"
          [attr.aria-autocomplete]="'list'"
          (input)="handleInput($event)"
          (focus)="handleFocus()"
          (blur)="handleBlur()"
          (keydown)="handleKeydown($event)"
          type="text"
        />

        @if (loading()) {
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
          </div>
        } @else if (clearable() && displayValue()) {
          <button
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            (click)="clearValue()"
            type="button">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        }
      </div>

      <!-- Dropdown List -->
      @if (isOpen() && filteredOptions().length > 0) {
        <div [class]="dropdownClasses()">
          <ul class="max-h-60 overflow-y-auto py-1" role="listbox">
            @for (option of filteredOptions(); track option.value; let i = $index) {
              <li
                [class]="optionClasses(option, i)"
                [attr.aria-selected]="selectedValue() === option.value"
                [attr.data-highlighted]="highlightedIndex() === i"
                (click)="selectOption(option)"
                (mouseenter)="highlightedIndex.set(i)"
                role="option">
                {{ option.label }}
              </li>
            }
          </ul>
        </div>
      }

      @if (isOpen() && filteredOptions().length === 0 && searchTerm()) {
        <div [class]="dropdownClasses()">
          <div class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
            {{ noResultsText() }}
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ],
  host: {
    '(document:click)': 'handleDocumentClick($event)'
  }
})
export class AutocompleteComponent implements ControlValueAccessor {
  /**
   * Array of options to display and filter.
   * @required
   * @example [{ value: 'us', label: 'United States' }]
   */
  options = input.required<AutocompleteOption[]>();
  
  /**
   * Placeholder text displayed when input is empty.
   * @default "Search..."
   */
  placeholder = input<string>('Search...');
  
  /**
   * Size of the autocomplete input.
   * - `sm`: Small
   * - `md`: Medium (default)
   * - `lg`: Large
   * @default "md"
   */
  size = input<AutocompleteSize>('md');
  
  /**
   * Disables the autocomplete and prevents interaction.
   * @default false
   */
  disabled = input(false);
  
  /**
   * Makes the autocomplete read-only.
   * @default false
   */
  readonly = input(false);
  
  /**
   * Shows loading spinner.
   * @default false
   */
  loading = input(false);
  
  /**
   * Shows clear button when there's a selection.
   * @default true
   */
  clearable = input(true);
  
  /**
   * Text displayed when no options match the search.
   * @default "No results found"
   */
  noResultsText = input('No results found');
  
  /**
   * Minimum number of characters before showing options.
   * @default 0
   */
  minSearchLength = input(0);

  /**
   * Emitted when the selected value changes.
   * Provides the selected value string.
   * @event valueChange
   */
  valueChange = output<string>();
  
  /**
   * Emitted when an option is selected.
   * Provides the selected option object.
   * @event selectionChange
   */
  selectionChange = output<AutocompleteOption | null>();
  
  /**
   * Emitted when the search term changes.
   * Provides the search string.
   * @event searchChange
   */
  searchChange = output<string>();

  protected selectedValue = signal<string>('');
  protected searchTerm = signal<string>('');
  protected isOpen = signal(false);
  protected highlightedIndex = signal(-1);

  // ControlValueAccessor
  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor() {
    // Update search when input changes
    effect(() => {
      const term = this.searchTerm();
      this.searchChange.emit(term);

      if (term.length >= this.minSearchLength()) {
        this.isOpen.set(true);
        this.highlightedIndex.set(0);
      } else {
        this.isOpen.set(false);
      }
    });
  }

  protected displayValue = computed(() => {
    const selected = this.options().find(opt => opt.value === this.selectedValue());
    return selected ? selected.label : this.searchTerm();
  });

  protected filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term || term.length < this.minSearchLength()) return [];

    return this.options().filter(option =>
      option.label.toLowerCase().includes(term) && !option.disabled
    );
  });

  protected containerClasses = computed(() => {
    return 'relative w-full';
  });

  protected inputClasses = computed(() => {
    const baseClasses = 'w-full border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors';

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-sm',
      lg: 'px-4 py-3 text-base'
    };

    const disabledClasses = this.disabled() ? 'opacity-50 cursor-not-allowed' : '';
    const sizeClass = sizeClasses[this.size()];

    return `${baseClasses} ${sizeClass} ${disabledClasses}`;
  });

  protected dropdownClasses = computed(() => {
    return 'absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg';
  });

  protected optionClasses = (option: AutocompleteOption, index: number) => {
    const baseClasses = 'px-4 py-2 text-sm cursor-pointer select-none';
    const highlightedClasses = this.highlightedIndex() === index ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700';
    const selectedClasses = this.selectedValue() === option.value ? 'bg-primary-100 dark:bg-primary-900/30' : '';

    return `${baseClasses} ${highlightedClasses} ${selectedClasses}`;
  };

  protected handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.searchTerm.set(value);

    // Clear selection if input doesn't match any option
    const matchingOption = this.options().find(opt => opt.label === value);
    if (!matchingOption) {
      this.selectedValue.set('');
      this.onChange('');
      this.valueChange.emit('');
      this.selectionChange.emit(null);
    }
  }

  protected handleFocus(): void {
    if (this.searchTerm().length >= this.minSearchLength()) {
      this.isOpen.set(true);
    }
  }

  protected handleBlur(): void {
    this.onTouched();
    // Delay closing to allow for option selection
    setTimeout(() => this.isOpen.set(false), 150);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    const filteredOpts = this.filteredOptions();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.isOpen.set(true);
        } else {
          this.highlightedIndex.update(i =>
            i < filteredOpts.length - 1 ? i + 1 : 0
          );
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.update(i =>
          i > 0 ? i - 1 : filteredOpts.length - 1
        );
        break;

      case 'Enter':
        event.preventDefault();
        const highlighted = filteredOpts[this.highlightedIndex()];
        if (highlighted && this.isOpen()) {
          this.selectOption(highlighted);
        }
        break;

      case 'Escape':
        this.isOpen.set(false);
        this.highlightedIndex.set(-1);
        break;
    }
  }

  protected selectOption(option: AutocompleteOption): void {
    if (option.disabled) return;

    this.selectedValue.set(option.value);
    this.searchTerm.set(option.label);
    this.isOpen.set(false);
    this.highlightedIndex.set(-1);

    this.onChange(option.value);
    this.valueChange.emit(option.value);
    this.selectionChange.emit(option);
  }

  protected clearValue(): void {
    this.selectedValue.set('');
    this.searchTerm.set('');
    this.isOpen.set(false);

    this.onChange('');
    this.valueChange.emit('');
    this.selectionChange.emit(null);
  }

  protected handleDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const component = event.currentTarget as HTMLElement;

    if (!component.contains(target)) {
      this.isOpen.set(false);
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.selectedValue.set(value || '');
    const option = this.options().find(opt => opt.value === value);
    this.searchTerm.set(option ? option.label : '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
}
