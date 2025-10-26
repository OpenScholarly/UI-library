import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavigationRailItem {
  id: string;
  icon: string;
  label: string;
  badge?: string | number;
  disabled?: boolean;
  tooltip?: string;
}

export type NavigationRailSize = 'sm' | 'md' | 'lg';

/**
 * A compact side navigation rail component with icon-only mode.
 *
 * ## Features
 * - Collapsible labels (icon-only compact mode)
 * - Active indicator
 * - Badge support
 * - Tooltip labels on hover
 * - FAB integration support
 * - Full keyboard navigation
 * - ARIA labels and accessibility
 * - WCAG 2.1 Level AA compliant
 * - Dark mode support
 *
 * @example
 * ```html
 * <!-- Basic navigation rail -->
 * <ui-navigation-rail
 *   [items]="navItems"
 *   [activeId]="activeItem"
 *   (itemClick)="onItemClick($event)">
 * </ui-navigation-rail>
 *
 * <!-- Compact mode with labels -->
 * <ui-navigation-rail
 *   [items]="navItems"
 *   [expanded]="false"
 *   [showLabels]="true"
 *   (itemClick)="onItemClick($event)">
 * </ui-navigation-rail>
 *
 * <!-- With FAB -->
 * <ui-navigation-rail
 *   [items]="navItems"
 *   [showFab]="true"
 *   fabIcon="+"
 *   fabLabel="Create"
 *   (fabClick)="onCreate()">
 * </ui-navigation-rail>
 * ```
 */
@Component({
  selector: 'ui-navigation-rail',
  imports: [CommonModule],
  template: `
    <nav [class]="containerClasses()" [attr.aria-label]="ariaLabel()">
      <!-- FAB (Floating Action Button) -->
      @if (showFab()) {
        <div class="mb-6 flex justify-center">
          <button
            type="button"
            [class]="fabClasses()"
            (click)="onFabClick()"
            [attr.aria-label]="fabLabel()">
            <span class="text-2xl">{{ fabIcon() }}</span>
          </button>
        </div>
      }

      <!-- Navigation Items -->
      <ul class="flex flex-col gap-2 flex-1">
        @for (item of items(); track item.id) {
          <li>
            <button
              type="button"
              [class]="getItemClasses(item)"
              [disabled]="item.disabled"
              (click)="onItemClick(item)"
              [attr.aria-label]="item.tooltip || item.label"
              [attr.aria-current]="isActive(item.id) ? 'page' : null"
              [attr.title]="!expanded() ? (item.tooltip || item.label) : null">
              <div class="flex items-center gap-3 w-full">
                <!-- Icon with badge -->
                <div class="relative flex-shrink-0">
                  <span [class]="iconClasses()">{{ item.icon }}</span>
                  @if (item.badge) {
                    <span [class]="badgeClasses()">
                      {{ formatBadge(item.badge) }}
                    </span>
                  }
                </div>

                <!-- Label (shown when expanded or always if showLabels is true) -->
                @if (expanded() || showLabels()) {
                  <span
                    [class]="labelClasses()"
                    [class.sr-only]="!expanded() && !showLabels()">
                    {{ item.label }}
                  </span>
                }
              </div>
            </button>
          </li>
        }
      </ul>

      <!-- Bottom slot for additional actions -->
      <div class="mt-auto">
        <ng-content select="[slot=bottom]"></ng-content>
      </div>

      <!-- Screen reader announcement -->
      <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {{ ariaAnnouncement() }}
      </div>
    </nav>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationRailComponent {
  /**
   * Navigation items to display.
   */
  items = input.required<NavigationRailItem[]>();

  /**
   * ID of the currently active item.
   */
  activeId = input<string>('');

  /**
   * Whether the rail is expanded to show labels.
   * @default false
   */
  expanded = input<boolean>(false);

  /**
   * Whether to always show labels (even in compact mode).
   * @default false
   */
  showLabels = input<boolean>(false);

  /**
   * Whether to show a FAB (Floating Action Button) at the top.
   * @default false
   */
  showFab = input<boolean>(false);

  /**
   * Icon for the FAB button.
   * @default "+"
   */
  fabIcon = input<string>('+');

  /**
   * Label for the FAB button (accessibility).
   * @default "Create"
   */
  fabLabel = input<string>('Create');

  /**
   * Size variant.
   * @default "md"
   */
  size = input<NavigationRailSize>('md');

  /**
   * ARIA label for the navigation.
   * @default "Main navigation"
   */
  ariaLabel = input<string>('Main navigation');

  /**
   * Emitted when a navigation item is clicked.
   */
  itemClick = output<NavigationRailItem>();

  /**
   * Emitted when the FAB is clicked.
   */
  fabClick = output<void>();

  private currentActiveId = signal<string>('');

  containerClasses = computed(() => {
    const widths = {
      sm: this.expanded() ? 'w-48' : 'w-16',
      md: this.expanded() ? 'w-56' : 'w-20',
      lg: this.expanded() ? 'w-64' : 'w-24',
    };
    return `flex flex-col ${widths[this.size()]} h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 transition-all duration-300`;
  });

  fabClasses = computed(() => {
    const sizes = {
      sm: 'w-12 h-12',
      md: 'w-14 h-14',
      lg: 'w-16 h-16',
    };
    return `${sizes[this.size()]} rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;
  });

  iconClasses = computed(() => {
    const sizes = {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
    };
    return `${sizes[this.size()]} flex items-center justify-center`;
  });

  labelClasses = computed(() => {
    const sizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };
    return `${sizes[this.size()]} font-medium truncate`;
  });

  badgeClasses = computed(() => {
    return 'absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center';
  });

  ariaAnnouncement = computed(() => {
    const activeId = this.currentActiveId();
    if (!activeId) return '';

    const activeItem = this.items().find((item) => item.id === activeId);
    return activeItem ? `Navigated to ${activeItem.label}` : '';
  });

  getItemClasses(item: NavigationRailItem): string {
    const base =
      'w-full flex items-center rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500';
    const padding = this.expanded() ? 'px-4 py-3' : 'px-3 py-3 justify-center';
    const active = this.isActive(item.id)
      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';
    const disabled = item.disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer';

    return `${base} ${padding} ${active} ${disabled}`;
  }

  isActive(id: string): boolean {
    return this.activeId() === id;
  }

  onItemClick(item: NavigationRailItem): void {
    if (item.disabled) return;
    this.currentActiveId.set(item.id);
    this.itemClick.emit(item);
  }

  onFabClick(): void {
    this.fabClick.emit();
  }

  formatBadge(badge: string | number): string {
    if (typeof badge === 'number') {
      return badge > 99 ? '99+' : badge.toString();
    }
    return badge;
  }
}
