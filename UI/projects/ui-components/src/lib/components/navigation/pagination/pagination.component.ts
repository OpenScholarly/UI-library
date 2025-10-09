import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationVariant, PaginationSize } from '../../../types';

/**
 * A versatile and accessible pagination component for navigating through pages.
 *
 * ## Features
 * - Multiple visual variants (default, simple, minimal, rounded)
 * - Comprehensive size options (sm, md, lg)
 * - Page numbers with ellipsis for large page counts
 * - First/last page navigation
 * - Previous/next buttons
 * - Results info display
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 * - Customizable page range display
 *
 * @example
 * ```html
 * <!-- Basic pagination -->
 * <ui-pagination
 *   [totalItems]="100"
 *   [pageSize]="10"
 *   [currentPage]="1"
 *   (pageChange)="onPageChange($event)">
 * </ui-pagination>
 *
 * <!-- Simple variant -->
 * <ui-pagination
 *   [totalItems]="500"
 *   [pageSize]="20"
 *   [currentPage]="currentPage"
 *   variant="simple"
 *   (pageChange)="loadPage($event)">
 * </ui-pagination>
 *
 * <!-- With results info -->
 * <ui-pagination
 *   [totalItems]="1000"
 *   [pageSize]="25"
 *   [currentPage]="page"
 *   [showInfo]="true">
 * </ui-pagination>
 *
 * <!-- Minimal variant -->
 * <ui-pagination
 *   [totalItems]="200"
 *   [pageSize]="10"
 *   variant="minimal">
 * </ui-pagination>
 *
 * <!-- Rounded variant -->
 * <ui-pagination
 *   [totalItems]="150"
 *   [pageSize]="15"
 *   variant="rounded"
 *   size="lg">
 * </ui-pagination>
 *
 * <!-- Without first/last buttons -->
 * <ui-pagination
 *   [totalItems]="100"
 *   [pageSize]="10"
 *   [showFirstLast]="false">
 * </ui-pagination>
 * ```
 */
@Component({
  selector: 'ui-pagination',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ui-pagination',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    'role': 'navigation',
    '[attr.aria-label]': 'ariaLabel()'
  },
  template: `
    <div class="ui-pagination__container flex items-center justify-between">
      <!-- Results Info -->
      @if (showInfo()) {
        <div class="ui-pagination__info text-sm text-gray-700 dark:text-gray-300">
          <span>
            Showing {{ startItem() }} to {{ endItem() }} of {{ totalItems() }} results
          </span>
        </div>
      }

      <!-- Pagination Controls -->
      <div class="ui-pagination__controls" [class]="getControlsClasses()">
        @if (variant() === 'simple') {
          <!-- Simple Pagination -->
          <div class="flex items-center space-x-2">
            <button
              type="button"
              [disabled]="currentPage() <= 1"
              [class]="getButtonClasses('prev')"
              (click)="goToPage(currentPage() - 1)"
              [attr.aria-label]="'Go to previous page'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span class="ml-1">Previous</span>
            </button>

            <span class="text-sm text-gray-700 dark:text-gray-300 px-4">
              Page {{ currentPage() }} of {{ totalPages() }}
            </span>

            <button
              type="button"
              [disabled]="currentPage() >= totalPages()"
              [class]="getButtonClasses('next')"
              (click)="goToPage(currentPage() + 1)"
              [attr.aria-label]="'Go to next page'">
              <span class="mr-1">Next</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        } @else if (variant() === 'minimal') {
          <!-- Minimal Pagination -->
          <div class="flex items-center space-x-1">
            <button
              type="button"
              [disabled]="currentPage() <= 1"
              [class]="getIconButtonClasses()"
              (click)="goToPage(currentPage() - 1)"
              [attr.aria-label]="'Go to previous page'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span class="text-sm text-gray-700 dark:text-gray-300 px-4">
              {{ currentPage() }} / {{ totalPages() }}
            </span>

            <button
              type="button"
              [disabled]="currentPage() >= totalPages()"
              [class]="getIconButtonClasses()"
              (click)="goToPage(currentPage() + 1)"
              [attr.aria-label]="'Go to next page'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        } @else {
          <!-- Default Full Pagination -->
          <div class="flex items-center space-x-1">
            <!-- First Page -->
            @if (showFirstLast()) {
              <button
                type="button"
                [disabled]="currentPage() <= 1"
                [class]="getIconButtonClasses()"
                (click)="goToPage(1)"
                [attr.aria-label]="'Go to first page'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            }

            <!-- Previous Page -->
            <button
              type="button"
              [disabled]="currentPage() <= 1"
              [class]="getIconButtonClasses()"
              (click)="goToPage(currentPage() - 1)"
              [attr.aria-label]="'Go to previous page'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Page Numbers -->
            @for (page of visiblePages(); track page) {
              @if (page === '...') {
                <span class="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
              } @else {
                <button
                  type="button"
                  [class]="getPageButtonClasses(page)"
                  (click)="goToPage(page)"
                  [attr.aria-label]="'Go to page ' + page"
                  [attr.aria-current]="page === currentPage() ? 'page' : null">
                  {{ page }}
                </button>
              }
            }

            <!-- Next Page -->
            <button
              type="button"
              [disabled]="currentPage() >= totalPages()"
              [class]="getIconButtonClasses()"
              (click)="goToPage(currentPage() + 1)"
              [attr.aria-label]="'Go to next page'">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Last Page -->
            @if (showFirstLast()) {
              <button
                type="button"
                [disabled]="currentPage() >= totalPages()"
                [class]="getIconButtonClasses()"
                (click)="goToPage(totalPages())"
                [attr.aria-label]="'Go to last page'">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            }
          </div>
        }
      </div>

      <!-- Page Size Selector -->
      @if (showPageSize()) {
        <div class="ui-pagination__page-size flex items-center space-x-2 text-sm">
          <label for="page-size-select" class="text-gray-700 dark:text-gray-300">
            Items per page:
          </label>
          <select
            id="page-size-select"
            [value]="pageSize()"
            (change)="onPageSizeChange($event)"
            class="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
            @for (size of pageSizeOptions(); track size) {
              <option [value]="size">{{ size }}</option>
            }
          </select>
        </div>
      }
    </div>
  `
})
export class PaginationComponent {
  /**
   * Current active page number.
   * @default 1
   */
  currentPage = input<number>(1);
  
  /**
   * Total number of items across all pages.
   * @default 0
   * @example 150
   */
  totalItems = input<number>(0);
  
  /**
   * Number of items per page.
   * @default 10
   */
  pageSize = input<number>(10);
  
  /**
   * Visual style variant of the pagination.
   * - `default`: Standard pagination with numbers (default)
   * - `simple`: Simple prev/next with text
   * - `minimal`: Minimal icon-only buttons
   * - `rounded`: Rounded button style
   * @default "default"
   */
  variant = input<PaginationVariant>('default');
  
  /**
   * Size of the pagination buttons.
   * - `sm`: Small
   * - `md`: Medium (default)
   * - `lg`: Large
   * @default "md"
   */
  size = input<PaginationSize>('md');
  
  /**
   * Maximum number of page buttons to display.
   * Excess pages shown with ellipsis.
   * @default 7
   */
  maxVisiblePages = input<number>(7);
  
  /**
   * Shows results information text.
   * @default true
   */
  showInfo = input<boolean>(true);
  
  /**
   * Shows first and last page buttons.
   * @default true
   */
  showFirstLast = input<boolean>(true);
  
  /**
   * Shows page size selector dropdown.
   * @default false
   */
  showPageSize = input<boolean>(false);
  
  /**
   * Available page size options for the selector.
   * @default [10, 25, 50, 100]
   */
  pageSizeOptions = input<number[]>([10, 25, 50, 100]);
  
  /**
   * ARIA label for the pagination navigation.
   * @default "Pagination navigation"
   */
  ariaLabel = input<string>('Pagination navigation');

  /**
   * Emitted when the page changes.
   * Provides the new page number.
   * @event pageChange
   */
  pageChange = output<number>();
  
  /**
   * Emitted when the page size changes.
   * Provides the new page size.
   * @event pageSizeChange
   */
  pageSizeChange = output<number>();

  // Computed properties
  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  startItem = computed(() => {
    if (this.totalItems() === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  endItem = computed(() => {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalItems());
  });

  visiblePages = computed(() => {
    const current = this.currentPage();
    const total = this.totalPages();
    const maxVisible = this.maxVisiblePages();

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisible / 2);

    let start = Math.max(1, current - halfVisible);
    let end = Math.min(total, current + halfVisible);

    // Adjust if we're near the beginning or end
    if (current <= halfVisible) {
      end = maxVisible - 1;
    } else if (current >= total - halfVisible) {
      start = total - maxVisible + 2;
    }

    // Always show first page
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Always show last page
    if (end < total) {
      if (end < total - 1) {
        pages.push('...');
      }
      pages.push(total);
    }

    return pages;
  });

  // Methods
  goToPage(page: number | string): void {
    const pageNum = typeof page === 'string' ? parseInt(page) : page;
    if (pageNum < 1 || pageNum > this.totalPages() || pageNum === this.currentPage()) {
      return;
    }

    this.pageChange.emit(pageNum);
  }

  onPageSizeChange(event: Event): void {
    const newSize = parseInt((event.target as HTMLSelectElement).value);
    this.pageSizeChange.emit(newSize);
  }

  getControlsClasses(): string {
    const classes: string[] = [];

    if (this.variant() === 'simple' || this.variant() === 'minimal') {
      classes.push('flex-1 flex justify-center');
    } else {
      classes.push('flex justify-center');
    }

    return classes.join(' ');
  }

  getButtonClasses(type: 'prev' | 'next'): string {
    const baseClasses = [
      'inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200',
      'border border-gray-300 dark:border-gray-600',
      'bg-white dark:bg-gray-800',
      'text-gray-700 dark:text-gray-300',
      'hover:bg-gray-50 dark:hover:bg-gray-700',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800'
    ];

    switch (this.size()) {
      case 'sm':
        baseClasses.push('px-3 py-1 text-xs');
        break;
      case 'lg':
        baseClasses.push('px-6 py-3 text-base');
        break;
    }

    return baseClasses.join(' ');
  }

  getIconButtonClasses(): string {
    const baseClasses = [
      'inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md transition-colors duration-200',
      'border border-gray-300 dark:border-gray-600',
      'bg-white dark:bg-gray-800',
      'text-gray-700 dark:text-gray-300',
      'hover:bg-gray-50 dark:hover:bg-gray-700',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-800'
    ];

    switch (this.size()) {
      case 'sm':
        baseClasses.push('w-6 h-6');
        break;
      case 'lg':
        baseClasses.push('w-10 h-10');
        break;
    }

    return baseClasses.join(' ');
  }

  getPageButtonClasses(page: number | string): string {
    const baseClasses = [
      'inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary-500'
    ];

    switch (this.size()) {
      case 'sm':
        baseClasses.push('w-6 h-6 text-xs');
        break;
      case 'lg':
        baseClasses.push('w-10 h-10 text-base');
        break;
    }

    if (page === this.currentPage()) {
      baseClasses.push(
        'bg-primary-600 dark:bg-primary-500',
        'text-white',
        'border border-primary-600 dark:border-primary-500'
      );
    } else {
      baseClasses.push(
        'border border-gray-300 dark:border-gray-600',
        'bg-white dark:bg-gray-800',
        'text-gray-700 dark:text-gray-300',
        'hover:bg-gray-50 dark:hover:bg-gray-700'
      );
    }

    return baseClasses.join(' ');
  }
}
