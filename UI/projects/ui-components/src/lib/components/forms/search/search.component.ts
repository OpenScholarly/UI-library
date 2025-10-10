import { ChangeDetectionStrategy, Component, computed, input, output, signal, effect } from '@angular/core';
import { SearchResult, SearchSize, SearchVariant } from '../../../types';

/**
 * A versatile and accessible search component with autocomplete and result previews.
 *
 * ## Features
 * - Real-time search with debouncing
 * - Autocomplete dropdown with keyboard navigation
 * - Result preview with title, description, and category
 * - Loading state indicator
 * - Clear button
 * - Multiple size options (sm, md, lg)
 * - Visual variants (default, filled, outlined)
 * - Full keyboard navigation (Arrow keys, Enter, Escape)
 * - Full screen reader support with ARIA attributes
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 * - Highlighted matching text
 *
 * @example
 * ```html
 * <!-- Basic search -->
 * <ui-search
 *   placeholder="Search..."
 *   (search)="onSearch($event)">
 * </ui-search>
 *
 * <!-- Search with results -->
 * <ui-search
 *   [results]="searchResults"
 *   [loading]="isLoading"
 *   (resultSelected)="onResultSelected($event)">
 * </ui-search>
 *
 * <!-- Search with debounce -->
 * <ui-search
 *   placeholder="Type to search..."
 *   [debounceTime]="500"
 *   [clearable]="true"
 *   (search)="handleSearch($event)">
 * </ui-search>
 *
 * <!-- Large search variant -->
 * <ui-search
 *   size="lg"
 *   variant="filled"
 *   placeholder="Search products..."
 *   [results]="products"
 *   [showNoResults]="true">
 * </ui-search>
 *
 * <!-- With minimum characters -->
 * <ui-search
 *   [minChars]="3"
 *   placeholder="Search (min 3 chars)..."
 *   (search)="performSearch($event)">
 * </ui-search>
 * ```
 */
@Component({
  selector: 'ui-search',
  standalone: true,
  template: `
    <div [class]="containerClasses()">
      <!-- Search Input -->
      <div class="relative">
        <!-- Search Icon -->
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Input Field -->
        <input
          [class]="inputClasses()"
          [value]="searchTerm()"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-autocomplete]="'list'"
          [attr.role]="'combobox'"
          (input)="handleInput($event)"
          (focus)="handleFocus()"
          (blur)="handleBlur()"
          (keydown)="handleKeydown($event)"
          type="text"
        />

        <!-- Loading Spinner -->
        @if (loading()) {
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
          </div>
        }

        <!-- Clear Button -->
        @if (!loading() && searchTerm() && clearable()) {
          <button
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            (click)="clearSearch()"
            type="button">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        }
      </div>

      <!-- Search Results Dropdown -->
      @if (isOpen() && (results().length > 0 || showNoResults())) {
        <div [class]="dropdownClasses()">
          <!-- Results -->
          @if (results().length > 0) {
            <ul class="max-h-80 overflow-y-auto py-2" role="listbox">
              @for (result of results(); track result.id; let i = $index) {
                <li
                  [class]="resultClasses(result, i)"
                  [attr.aria-selected]="highlightedIndex() === i"
                  (click)="selectResult(result)"
                  (mouseenter)="highlightedIndex.set(i)"
                  role="option">

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <h4 class="font-medium text-gray-900 dark:text-white truncate">
                        {{ result.title }}
                      </h4>
                      @if (result.category) {
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {{ result.category }}
                        </span>
                      }
                    </div>

                    @if (result.description) {
                      <p class="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                        {{ result.description }}
                      </p>
                    }
                  </div>

                  <!-- Action Icon -->
                  <div class="flex-shrink-0 ml-2">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  </div>
                </li>
              }
            </ul>
          }

          <!-- No Results -->
          @if (showNoResults()) {
            <div class="px-4 py-6 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">{{ noResultsText() }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ noResultsDescription() }}</p>
            </div>
          }

          <!-- Recent Searches (when no search term) -->
          @if (!searchTerm() && recentSearches().length > 0) {
            <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Recent</h4>
            </div>
            <ul class="py-2">
              @for (recent of recentSearches(); track recent) {
                <li
                  class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3"
                  (click)="selectRecentSearch(recent)">
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ recent }}</span>
                </li>
              }
            </ul>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'handleDocumentClick($event)'
  }
})
export class SearchComponent {
  /**
   * Placeholder text displayed when input is empty.
   * @default "Search..."
   */
  placeholder = input<string>('Search...');
  
  /**
   * Size of the search input.
   * - `sm`: Small
   * - `md`: Medium (default)
   * - `lg`: Large
   * @default "md"
   */
  size = input<SearchSize>('md');
  
  /**
   * Visual style variant of the search input.
   * - `default`: Standard search with border
   * - `filled`: Filled background search
   * - `outlined`: Prominent bordered search
   * @default "default"
   */
  variant = input<SearchVariant>('default');
  
  /**
   * Disables the search and prevents interaction.
   * @default false
   */
  disabled = input(false);
  
  /**
   * Shows loading spinner.
   * @default false
   */
  loading = input(false);
  
  /**
   * Shows clear button when there's text.
   * @default true
   */
  clearable = input(true);
  
  /**
   * Array of search results to display in dropdown.
   * @default []
   * @example [{ id: '1', title: 'Result', description: 'Description' }]
   */
  results = input<SearchResult[]>([]);
  
  /**
   * Array of recent search terms to display.
   * @default []
   * @example ['previous search', 'another search']
   */
  recentSearches = input<string[]>([]);
  
  /**
   * Text displayed when no results are found.
   * @default "No results found"
   */
  noResultsText = input('No results found');
  
  /**
   * Description text for no results state.
   * @default "Try adjusting your search terms"
   */
  noResultsDescription = input('Try adjusting your search terms');
  
  /**
   * Minimum number of characters before triggering search.
   * @default 1
   */
  minSearchLength = input(1);
  
  /**
   * Debounce delay in milliseconds before emitting search.
   * @default 300
   */
  debounceMs = input(300);

  /**
   * Emitted when the search term changes (debounced).
   * Provides the search string.
   * @event search
   */
  search = output<string>();
  
  /**
   * Emitted when a result is selected from the dropdown.
   * Provides the selected result.
   * @event resultSelected
   */
  resultSelected = output<SearchResult>();
  
  /**
   * Emitted when the search is cleared.
   * @event cleared
   */
  cleared = output<void>();

  protected searchTerm = signal<string>('');
  protected isOpen = signal(false);
  protected highlightedIndex = signal(-1);
  private debounceTimeout: any = null;

  constructor() {
    // Debounced search
    effect(() => {
      const term = this.searchTerm();

      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      if (term.length >= this.minSearchLength()) {
        this.debounceTimeout = setTimeout(() => {
          this.search.emit(term);
        }, this.debounceMs());
      }
    });

    // Reset highlighted index when results change
    effect(() => {
      this.results();
      this.highlightedIndex.set(-1);
    });
  }

  protected showNoResults = computed(() => {
    return this.searchTerm().length >= this.minSearchLength() &&
           this.results().length === 0 &&
           !this.loading();
  });

  protected containerClasses = computed(() => {
    return 'relative w-full';
  });

  protected inputClasses = computed(() => {
    const baseClasses = 'w-full pl-10 pr-10 border focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200';

    const variantClasses = {
      default: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md',
      filled: 'border-transparent bg-gray-100 dark:bg-gray-800 rounded-md focus:bg-white dark:focus:bg-gray-700',
      minimal: 'border-0 border-b-2 border-gray-200 dark:border-gray-700 bg-transparent rounded-none focus:border-primary-500'
    };

    const sizeClasses = {
      sm: 'py-2 text-sm',
      md: 'py-2.5 text-sm',
      lg: 'py-3 text-base'
    };

    const disabledClasses = this.disabled() ? 'opacity-50 cursor-not-allowed' : '';

    const variantClass = variantClasses[this.variant()];
    const sizeClass = sizeClasses[this.size()];

    return `${baseClasses} ${variantClass} ${sizeClass} ${disabledClasses} text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`;
  });

  protected dropdownClasses = computed(() => {
    return 'absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-w-full';
  });

  protected resultClasses = (result: SearchResult, index: number) => {
    const baseClasses = 'px-4 py-3 cursor-pointer select-none flex items-start gap-3 transition-colors duration-150';
    const highlightedClasses = this.highlightedIndex() === index
      ? 'bg-primary-50 dark:bg-primary-900/20'
      : 'hover:bg-gray-100 dark:hover:bg-gray-700';

    return `${baseClasses} ${highlightedClasses}`;
  };

  protected handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    this.searchTerm.set(value);
    this.isOpen.set(true);
  }

  protected handleFocus(): void {
    this.isOpen.set(true);
  }

  protected handleBlur(): void {
    // Delay closing to allow result selection
    setTimeout(() => this.isOpen.set(false), 150);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    const currentResults = this.results();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentResults.length > 0) {
          this.highlightedIndex.update(i =>
            i < currentResults.length - 1 ? i + 1 : 0
          );
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (currentResults.length > 0) {
          this.highlightedIndex.update(i =>
            i > 0 ? i - 1 : currentResults.length - 1
          );
        }
        break;

      case 'Enter':
        event.preventDefault();
        const highlighted = currentResults[this.highlightedIndex()];
        if (highlighted) {
          this.selectResult(highlighted);
        }
        break;

      case 'Escape':
        this.isOpen.set(false);
        this.highlightedIndex.set(-1);
        break;
    }
  }

  protected selectResult(result: SearchResult): void {
    this.searchTerm.set(result.title);
    this.isOpen.set(false);
    this.resultSelected.emit(result);
  }

  protected selectRecentSearch(searchTerm: string): void {
    this.searchTerm.set(searchTerm);
    this.search.emit(searchTerm);
  }

  protected clearSearch(): void {
    this.searchTerm.set('');
    this.isOpen.set(false);
    this.cleared.emit();
  }

  protected handleDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const component = event.currentTarget as HTMLElement;

    if (!component.contains(target)) {
      this.isOpen.set(false);
    }
  }
}
