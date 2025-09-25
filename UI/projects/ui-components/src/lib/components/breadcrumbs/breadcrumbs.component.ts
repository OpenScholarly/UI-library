import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  disabled?: boolean;
  icon?: string;
}

export type BreadcrumbVariant = 'default' | 'simple' | 'solid';
export type BreadcrumbSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-breadcrumbs',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ui-breadcrumbs',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    'role': 'navigation',
    '[attr.aria-label]': 'ariaLabel()'
  },
  template: `
    <ol class="ui-breadcrumbs__list flex items-center space-x-1" [class]="getListClasses()">
      @for (item of visibleItems(); track item.label; let i = $index, isLast = $last) {
        <li class="ui-breadcrumbs__item flex items-center" [class]="getItemClasses(item, isLast)">
          @if (!isLast && separator() === 'slash' && i > 0) {
            <svg
              class="ui-breadcrumbs__separator w-4 h-4 text-gray-400 dark:text-gray-500 mx-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          }

          @if (!isLast && separator() === 'chevron' && i > 0) {
            <svg
              class="ui-breadcrumbs__separator w-3 h-3 text-gray-400 dark:text-gray-500 mx-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          }

          @if (!isLast && separator() === 'dot' && i > 0) {
            <span class="ui-breadcrumbs__separator text-gray-400 dark:text-gray-500 mx-2" aria-hidden="true">•</span>
          }

          @if (item.href && !item.disabled && !isLast) {
            <a
              [href]="item.href"
              class="ui-breadcrumbs__link inline-flex items-center transition-colors duration-200"
              [class]="getLinkClasses(item, isLast)"
              [attr.aria-current]="isLast ? 'page' : null"
              (click)="onItemClick(item, $event)">

              @if (item.icon) {
                <span class="ui-breadcrumbs__icon mr-2" [innerHTML]="item.icon"></span>
              }

              @if (showHome() && i === 0) {
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
              }

              {{ item.label }}
            </a>
          } @else {
            <span
              class="ui-breadcrumbs__text inline-flex items-center"
              [class]="getTextClasses(item, isLast)"
              [attr.aria-current]="isLast ? 'page' : null">

              @if (item.icon) {
                <span class="ui-breadcrumbs__icon mr-2" [innerHTML]="item.icon"></span>
              }

              @if (showHome() && i === 0) {
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
              }

              {{ item.label }}
            </span>
          }
        </li>
      }
    </ol>
  `
})
export class BreadcrumbsComponent {
  // Inputs
  items = input<BreadcrumbItem[]>([]);
  variant = input<BreadcrumbVariant>('default');
  size = input<BreadcrumbSize>('md');
  separator = input<'slash' | 'chevron' | 'dot'>('slash');
  showHome = input<boolean>(false);
  maxItems = input<number | null>(null);
  ariaLabel = input<string>('Breadcrumb navigation');

  // Outputs
  itemClick = output<{ item: BreadcrumbItem; event: Event }>();

  // Computed properties
  visibleItems = computed(() => {
    const allItems = this.items();
    const max = this.maxItems();

    if (!max || allItems.length <= max) {
      return allItems;
    }

    // Show first item, ellipsis, and last (max-2) items
    const firstItem = allItems[0];
    const lastItems = allItems.slice(-(max - 2));

    return [
      firstItem,
      { label: '...', disabled: true },
      ...lastItems
    ];
  });

  // Methods
  onItemClick(item: BreadcrumbItem, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    this.itemClick.emit({ item, event });
  }

  getListClasses(): string {
    const classes: string[] = [];

    switch (this.size()) {
      case 'sm':
        classes.push('text-xs');
        break;
      case 'lg':
        classes.push('text-base');
        break;
      default:
        classes.push('text-sm');
    }

    switch (this.variant()) {
      case 'solid':
        classes.push('bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-md');
        break;
      case 'simple':
        classes.push('space-x-2');
        break;
    }

    return classes.join(' ');
  }

  getItemClasses(item: BreadcrumbItem, isLast: boolean): string {
    const classes: string[] = [];

    if (item.disabled) {
      classes.push('opacity-50');
    }

    if (isLast) {
      classes.push('font-medium');
    }

    return classes.join(' ');
  }

  getLinkClasses(item: BreadcrumbItem, isLast: boolean): string {
    const classes: string[] = [];

    if (this.variant() === 'simple') {
      classes.push('text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200');
    } else {
      classes.push('text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200');
    }

    if (isLast) {
      classes.push('font-medium text-gray-900 dark:text-white pointer-events-none');
    } else {
      classes.push('hover:underline focus:outline-none focus:underline');
    }

    if (item.disabled) {
      classes.push('opacity-50 pointer-events-none');
    }

    return classes.join(' ');
  }

  getTextClasses(item: BreadcrumbItem, isLast: boolean): string {
    const classes: string[] = [];

    if (isLast) {
      classes.push('font-medium text-gray-900 dark:text-white');
    } else {
      classes.push('text-gray-500 dark:text-gray-400');
    }

    if (item.disabled) {
      classes.push('opacity-50');
    }

    return classes.join(' ');
  }
}
