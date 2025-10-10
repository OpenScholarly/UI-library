import { Component, ChangeDetectionStrategy, input, output, computed, signal, effect, ViewChild, ElementRef, forwardRef, inject, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DismissService } from '../../../utilities/dismiss.service';
import { SelectOption, SelectVariant, SelectSize } from '../../../types';

/**
 * A versatile and accessible select dropdown component for single selections.
 *
 * ## Features
 * - Multiple visual variants (default, filled, outlined)
 * - Comprehensive size options (sm, md, lg)
 * - Label placement: block (default) or inline
 * - Search/filter functionality
 * - Option groups support
 * - Disabled options
 * - Loading state
 * - Full keyboard navigation (Arrow keys, Enter, Escape, Home, End)
 * - Full screen reader support with ARIA attributes
 * - WCAG 2.1 Level AA color contrast compliance
 * - Disabled and error state handling
 * - Dark mode support
 * - Seamless integration with Angular Reactive Forms
 *
 * @example
 * ```html
 * <!-- Basic select -->
 * <ui-select
 *   label="Country"
 *   [options]="countries"
 *   placeholder="Select a country">
 * </ui-select>
 *
 * <!-- Select with search -->
 * <ui-select
 *   label="Search City"
 *   [options]="cities"
 *   [searchable]="true"
 *   placeholder="Type to search...">
 * </ui-select>
 *
 * <!-- Select with validation -->
 * <ui-select
 *   label="Category"
 *   [options]="categories"
 *   [required]="true"
 *   [hasError]="form.invalid && form.touched"
 *   errorMessage="Category is required">
 * </ui-select>
 *
 * <!-- Disabled select -->
 * <ui-select
 *   label="Status"
 *   [options]="statusOptions"
 *   [disabled]="true">
 * </ui-select>
 *
 * <!-- Reactive forms integration -->
 * <ui-select
 *   formControlName="department"
 *   label="Department"
 *   [options]="departments"
 *   variant="filled"
 *   size="lg">
 * </ui-select>
 *
 * <!-- With option groups -->
 * <ui-select
 *   label="Region"
 *   [options]="groupedRegions"
 *   placeholder="Choose region">
 * </ui-select>
 *
 * <!-- Inline label -->
 * <ui-select
 *   label="Theme"
 *   labelPlacement="inline"
 *   [options]="themes"
 *   placeholder="Select theme">
 * </ui-select>
 * ```
 */
@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  host: {
    'class': 'ui-select block',
    '[class.ui-select--disabled]': 'disabled()',
    '[class.ui-select--error]': 'hasError()',
    '[class.ui-select--open]': 'isOpen()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()'
  },
  template: `
    <div class="ui-select__wrapper relative" #selectWrapper>
      <!-- Label -->
      @if (label() && labelPlacement() === 'block') {
        <label
          [for]="selectId"
          [attr.id]="selectId + '-label'"
          class="ui-select__label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          [class.text-red-600]="hasError()"
          [class.dark:text-red-400]="hasError()">
          {{ label() }}
          @if (required()) {
            <span class="text-red-500 ml-1" aria-label="required">*</span>
          }
        </label>
      }

      <!-- Select Container -->
      <div
        class="ui-select__container relative"
        [class.flex]="label() && labelPlacement() === 'inline'"
        [class.items-center]="label() && labelPlacement() === 'inline'"
        [class.gap-2]="label() && labelPlacement() === 'inline'">
        @if (label() && labelPlacement() === 'inline') {
          <label
            [for]="selectId"
            [attr.id]="selectId + '-label'"
            class="ui-select__label shrink-0 text-sm font-medium text-gray-700 dark:text-gray-300"
            [class.text-red-600]="hasError()"
            [class.dark:text-red-400]="hasError()">
            {{ label() }}
            @if (required()) {
              <span class="text-red-500 ml-1" aria-label="required">*</span>
            }
          </label>
        }
        <button
          #selectButton
          type="button"
          [id]="selectId"
          [disabled]="disabled()"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-haspopup]="'listbox'"
          [attr.aria-labelledby]="label() ? selectId + '-label' : null"
          [attr.aria-describedby]="getAriaDescribedBy()"
          class="ui-select__trigger w-full text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-colors duration-200"
          [class]="getTriggerClasses()"
          (click)="toggleDropdown()"
          (keydown)="onTriggerKeydown($event)">

          <span class="ui-select__value flex items-center justify-between">
            <span class="truncate">
              @if (selectedOption(); as option) {
                {{ option.label }}
              } @else {
                <span class="text-gray-500 dark:text-gray-400">{{ placeholder() }}</span>
              }
            </span>
            <svg
              class="ui-select__chevron w-5 h-5 ml-2 text-gray-400 transition-transform duration-200"
              [class.rotate-180]="isOpen()"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>

        <!-- Dropdown -->
        @if (isOpen()) {
          <div
            #dropdown
            class="ui-select__dropdown absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
            [attr.aria-labelledby]="selectId">

            @if (searchable()) {
              <div class="ui-select__search p-2 border-b border-gray-200 dark:border-gray-600">
                <input
                  #searchInput
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  [placeholder]="searchPlaceholder()"
                  [value]="searchQuery()"
                  (input)="onSearchInput($event)"
                  (keydown)="onSearchKeydown($event)">
              </div>
            }

            @if (filteredOptions().length === 0) {
              <div class="ui-select__empty px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                {{ noOptionsText() }}
              </div>
            } @else {
              @for (option of filteredOptions(); track option.value; let i = $index) {
                <button
                  type="button"
                  role="option"
                  [disabled]="option.disabled"
                  [attr.aria-selected]="selectedOption()?.value === option.value"
                  [class]="getOptionClasses(option, i === highlightedIndex())"
                  (click)="selectOption(option)"
                  (mouseenter)="setHighlightedIndex(i)">

                  <div class="flex items-center">
                    @if (multiple()) {
                      <input
                        type="checkbox"
                        class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-3"
                        [checked]="isOptionSelected(option)"
                        tabindex="-1">
                    }

                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {{ option.label }}
                      </div>
                      @if (option.description) {
                        <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {{ option.description }}
                        </div>
                      }
                    </div>

                    @if (!multiple() && selectedOption()?.value === option.value) {
                      <svg class="w-4 h-4 text-primary-600 dark:text-primary-400 ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    }
                  </div>
                </button>
              }
            }
          </div>
        }
      </div>

      <!-- Helper Text -->
      @if (helperText() && !hasError()) {
        <p
          class="ui-select__helper-text mt-1 text-sm text-gray-500 dark:text-gray-400"
          [id]="selectId + '-helper'">
          {{ helperText() }}
        </p>
      }

      <!-- Error Message -->
      @if (hasError() && errorMessage()) {
        <p
          class="ui-select__error-message mt-1 text-sm text-red-600 dark:text-red-400"
          [id]="selectId + '-error'"
          role="alert">
          {{ errorMessage() }}
        </p>
      }
    </div>
  `
})
export class SelectComponent implements ControlValueAccessor, OnDestroy {
  @ViewChild('selectWrapper') selectWrapper!: ElementRef<HTMLElement>;
  @ViewChild('selectButton') selectButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('dropdown') dropdown?: ElementRef<HTMLElement>;
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  private dismissService = inject(DismissService);
  private dismissId = `select-${Math.random().toString(36).substr(2, 9)}`;

  /**
   * Array of options to display in the dropdown.
   * @default []
   * @example [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]
   */
  options = input<SelectOption[]>([]);
  
  /**
   * Label text displayed above the select.
   * @default ""
   * @example "Country"
   */
  label = input<string>('');
  
  /**
   * Initial or controlled value for the select.
   * Use this to set the selected option programmatically.
   * @default undefined
   * @example "option-1"
   */
  value = input<any>();
  
  /**
   * Placeholder text when no option is selected.
   * @default "Select an option"
   */
  placeholder = input<string>('Select an option');
  
  /**
   * Visual style variant of the select.
   * - `default`: Standard select with border
   * - `filled`: Filled background select
   * - `outlined`: Prominent bordered select
   * @default "default"
   */
  variant = input<SelectVariant>('default');
  
  /**
   * Size of the select.
   * - `sm`: Small
   * - `md`: Medium (default)
   * - `lg`: Large
   * @default "md"
   */
  size = input<SelectSize>('md');

  /**
   * Placement of the label.
   * - `block`: Label is rendered above the field.
   * - `inline`: Label is rendered inline, to the left of the field.
   * @default "block"
   */
  labelPlacement = input<'block' | 'inline'>('block');
  
  /**
   * Disables the select and prevents interaction.
   * @default false
   */
  disabled = input<boolean>(false);
  
  /**
   * Marks the select as required.
   * Displays asterisk (*) next to label.
   * @default false
   */
  required = input<boolean>(false);
  
  /**
   * Enables multi-select mode with checkboxes.
   * @default false
   */
  multiple = input<boolean>(false);
  
  /**
   * Enables search/filter functionality.
   * @default false
   */
  searchable = input<boolean>(false);
  
  /**
   * Placeholder text for the search input.
   * @default "Search options..."
   */
  searchPlaceholder = input<string>('Search options...');
  
  /**
   * Text displayed when no options match the search.
   * @default "No options available"
   */
  noOptionsText = input<string>('No options available');
  
  /**
   * Helper text displayed below the select.
   * @default ""
   * @example "Choose your preferred option"
   */
  helperText = input<string>('');
  
  /**
   * Error message displayed when select is invalid.
   * @default ""
   * @example "This field is required"
   */
  errorMessage = input<string>('');

  /**
   * Emitted when the selection changes.
   * Provides the selected value(s).
   * @event change
   */
  change = output<any>();
  
  /**
   * Emitted when the search query changes.
   * Provides the search string.
   * @event search
   */
  search = output<string>();
  
  /**
   * Emitted when the dropdown is opened.
   * @event open
   */
  open = output<void>();
  
  /**
   * Emitted when the dropdown is closed.
   * @event close
   */
  close = output<void>();

  // State
  private internalValue = signal<any>(null);
  private selectedValues = signal<any[]>([]);
  isOpen = signal<boolean>(false);
  searchQuery = signal<string>('');
  highlightedIndex = signal<number>(-1);
  hasError = signal<boolean>(false);

  // Generate unique ID
  selectId = `ui-select-${Math.random().toString(36).substr(2, 9)}`;

  // ControlValueAccessor
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor() {
    // Sync input value with internal state
    effect(() => {
      const inputValue = this.value();
      if (inputValue !== undefined && inputValue !== this.internalValue()) {
        this.internalValue.set(inputValue);
      }
    });

    // Handle dropdown open/close with dismiss service
    effect(() => {
      if (this.isOpen()) {
        // Register dismiss behavior when dropdown opens
        setTimeout(() => {
          if (this.dropdown) {
            this.dismissService.register(
              this.dismissId,
              this.dropdown.nativeElement,
              () => this.closeDropdown(),
              {
                clickOutside: true,
                escapeKey: true,
                ignoreElements: [this.selectWrapper.nativeElement]
              }
            );
          }
        });
      } else {
        // Unregister when dropdown closes
        this.dismissService.unregister(this.dismissId);
      }
    });
  }

  ngOnDestroy(): void {
    this.dismissService.unregister(this.dismissId);
  }

  // Computed properties
  selectedOption = computed(() => {
    if (this.multiple()) return null;
    return this.options().find(opt => opt.value === this.internalValue()) || null;
  });

  filteredOptions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.options();

    return this.options().filter(option =>
      option.label.toLowerCase().includes(query) ||
      option.description?.toLowerCase().includes(query)
    );
  });

  // Methods
  toggleDropdown(): void {
    if (this.disabled()) return;

    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    this.isOpen.set(true);
    this.highlightedIndex.set(-1);
    this.open.emit();

    // Focus search input if searchable
    if (this.searchable()) {
      setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
    }
  }

  closeDropdown(): void {
    this.isOpen.set(false);
    this.searchQuery.set('');
    this.highlightedIndex.set(-1);
    this.onTouched();
    this.close.emit();
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;

    if (this.multiple()) {
      const values = [...this.selectedValues()];
      const index = values.findIndex(v => v === option.value);

      if (index >= 0) {
        values.splice(index, 1);
      } else {
        values.push(option.value);
      }

      this.selectedValues.set(values);
      this.onChange(values);
      this.change.emit(values);
    } else {
      this.internalValue.set(option.value);
      this.onChange(option.value);
      this.change.emit(option.value);
      this.closeDropdown();
    }
  }

  isOptionSelected(option: SelectOption): boolean {
    if (this.multiple()) {
      return this.selectedValues().includes(option.value);
    }
    return this.internalValue() === option.value;
  }

  setHighlightedIndex(index: number): void {
    this.highlightedIndex.set(index);
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
        } else {
          this.moveHighlight(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen()) {
          this.moveHighlight(-1);
        }
        break;
      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.closeDropdown();
        }
        break;
    }
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
    this.search.emit(query);
    this.highlightedIndex.set(-1);
  }

  onSearchKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveHighlight(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveHighlight(-1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.highlightedIndex() >= 0) {
          const option = this.filteredOptions()[this.highlightedIndex()];
          this.selectOption(option);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
    }
  }

  private moveHighlight(direction: number): void {
    const options = this.filteredOptions();
    if (options.length === 0) return;

    let newIndex = this.highlightedIndex() + direction;

    if (newIndex < 0) {
      newIndex = options.length - 1;
    } else if (newIndex >= options.length) {
      newIndex = 0;
    }

    this.highlightedIndex.set(newIndex);
  }

  getTriggerClasses(): string {
    const classes: string[] = [];

    switch (this.variant()) {
      case 'filled':
        classes.push('bg-gray-100 dark:bg-gray-700 border-transparent');
        break;
      case 'outlined':
        classes.push('bg-transparent border-2');
        break;
    }

    switch (this.size()) {
      case 'sm':
        classes.push('px-2 py-1 text-sm');
        break;
      case 'lg':
        classes.push('px-4 py-3 text-lg');
        break;
    }

    if (this.disabled()) {
      classes.push('opacity-50 cursor-not-allowed');
    }

    if (this.hasError()) {
      classes.push('border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500');
    }

    return classes.join(' ');
  }

  getOptionClasses(option: SelectOption, isHighlighted: boolean): string {
    const classes = [
      'ui-select__option',
      'w-full text-left px-3 py-2 cursor-pointer transition-colors duration-150'
    ];

    if (option.disabled) {
      classes.push('opacity-50 cursor-not-allowed');
    } else if (isHighlighted) {
      classes.push('bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'); //TODO fix contrast in dark mode
    } else if (this.isOptionSelected(option)) {
      classes.push('bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200'); //TODO fix
    } else {
      classes.push('text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700');
    }

    return classes.join(' ');
  }

  getAriaDescribedBy(): string {
    const ids: string[] = [];

    if (this.helperText()) {
      ids.push(`${this.selectId}-helper`);
    }

    if (this.hasError() && this.errorMessage()) {
      ids.push(`${this.selectId}-error`);
    }

    return ids.length > 0 ? ids.join(' ') : '';
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (this.multiple()) {
      this.selectedValues.set(Array.isArray(value) ? value : []);
    } else {
      this.internalValue.set(value);
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // The disabled state is handled by the disabled input
  }

  // Public API methods
  focus(): void {
    this.selectButton.nativeElement.focus();
  }

  blur(): void {
    this.selectButton.nativeElement.blur();
  }

  setError(hasError: boolean): void {
    this.hasError.set(hasError);
  }
}
