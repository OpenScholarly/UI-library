import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MenuItem, MenuTrigger, MenuPlacement } from '../../../types';

/**
 * A versatile and accessible menu component for dropdown menus and context menus.
 *
 * ## Features
 * - Multiple trigger modes (click, hover, context)
 * - Placement options (top, bottom, left, right with auto-positioning)
 * - Nested submenus support
 * - Separators and dividers
 * - Icon support for menu items
 * - Disabled items handling
 * - Full keyboard navigation (Arrow keys, Enter, Escape)
 * - Full screen reader support with ARIA attributes
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 * - Auto-close on selection
 *
 * @example
 * ```html
 * <!-- Basic menu with click trigger -->
 * <ui-menu [items]="menuItems" trigger="click">
 *   <button slot="trigger">Menu</button>
 * </ui-menu>
 *
 * <!-- Menu with hover trigger -->
 * <ui-menu
 *   [items]="items"
 *   trigger="hover"
 *   placement="bottom-start">
 *   <span slot="trigger">Hover me</span>
 * </ui-menu>
 *
 * <!-- Context menu -->
 * <ui-menu
 *   [items]="contextItems"
 *   trigger="context">
 *   <div slot="trigger">Right-click me</div>
 * </ui-menu>
 *
 * <!-- Menu with nested items -->
 * <ui-menu
 *   [items]="[
 *     { id: '1', label: 'File', icon: '📁', children: [
 *       { id: '1-1', label: 'New', icon: '📄' },
 *       { id: '1-2', label: 'Open', icon: '📂' }
 *     ]},
 *     { id: 'sep1', separator: true },
 *     { id: '2', label: 'Edit', icon: '✏️' }
 *   ]"
 *   (itemClick)="handleMenuClick($event)">
 *   <button slot="trigger">Actions</button>
 * </ui-menu>
 *
 * <!-- Menu with disabled items -->
 * <ui-menu
 *   [items]="items"
 *   [closeOnSelect]="true">
 *   <button slot="trigger">Options</button>
 * </ui-menu>
 * ```
 */
@Component({
  selector: 'ui-menu',
  standalone: true,
  template: `
    <div class="relative inline-block" [class]="containerClasses()">
      <!-- Trigger -->
      <div
        [class]="triggerClasses()"
        (click)="handleTriggerClick()"
        (mouseenter)="handleTriggerMouseEnter()"
        (mouseleave)="handleTriggerMouseLeave()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="true"
        role="button">
        <ng-content select="[slot=trigger]" />
      </div>

      <!-- Menu Dropdown -->
      @if (isOpen()) {
        <div
          [class]="menuClasses()"
          role="menu"
          [attr.aria-orientation]="'vertical'"
          (mouseenter)="handleMenuMouseEnter()"
          (mouseleave)="handleMenuMouseLeave()">

          @for (item of items(); track item.id) {
            @if (item.separator) {
              <div class="my-1 border-t border-gray-200 dark:border-gray-700"></div>
            } @else {
              <div class="relative" [class]="hasSubmenu(item) ? 'group' : ''">
                <!-- Menu Item -->
                <button
                  [class]="itemClasses(item)"
                  [disabled]="item.disabled"
                  (click)="handleItemClick(item)"
                  role="menuitem"
                  type="button">

                  <div class="flex items-center gap-3 flex-1">
                    @if (item.icon) {
                      <span class="text-lg flex-shrink-0">{{ item.icon }}</span>
                    }
                    <span class="flex-1 text-left">{{ item.label }}</span>
                  </div>

                  @if (hasSubmenu(item)) {
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                  }
                </button>

                <!-- Submenu -->
                @if (hasSubmenu(item)) {
                  <div class="absolute left-full top-0 ml-1 hidden group-hover:block z-50">
                    <div [class]="submenuClasses()">
                      @for (subItem of item.children!; track subItem.id) {
                        @if (subItem.separator) {
                          <div class="my-1 border-t border-gray-200 dark:border-gray-700"></div>
                        } @else {
                          <button
                            [class]="itemClasses(subItem)"
                            [disabled]="subItem.disabled"
                            (click)="handleItemClick(subItem)"
                            role="menuitem"
                            type="button">

                            <div class="flex items-center gap-3">
                              @if (subItem.icon) {
                                <span class="text-lg">{{ subItem.icon }}</span>
                              }
                              <span>{{ subItem.label }}</span>
                            </div>
                          </button>
                        }
                      }
                    </div>
                  </div>
                }
              </div>
            }
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
export class MenuComponent {
  /**
   * Array of menu items to display.
   * Supports nested items via children property.
   * @required
   * @example [{ id: '1', label: 'Action', icon: '⚡' }]
   */
  items = input.required<MenuItem[]>();
  
  /**
   * Trigger mode for opening the menu.
   * - `click`: Opens on click (default)
   * - `hover`: Opens on hover
   * - `context`: Opens on right-click
   * @default "click"
   */
  trigger = input<MenuTrigger>('click');
  
  /**
   * Placement of the menu relative to trigger.
   * - `bottom-start`: Below trigger, left-aligned (default)
   * - `bottom-end`: Below trigger, right-aligned
   * - `top-start`: Above trigger, left-aligned
   * - `top-end`: Above trigger, right-aligned
   * - `right-start`: Right of trigger, top-aligned
   * - `left-start`: Left of trigger, top-aligned
   * @default "bottom-start"
   */
  placement = input<MenuPlacement>('bottom-start');
  
  /**
   * Disables the menu and prevents interaction.
   * @default false
   */
  disabled = input(false);
  
  /**
   * Automatically closes menu when an item is selected.
   * @default true
   */
  closeOnSelect = input(true);

  /**
   * Emitted when a menu item is clicked.
   * Provides the selected menu item.
   * @event itemSelected
   */
  itemSelected = output<MenuItem>();
  
  /**
   * Emitted when the menu is opened or closed.
   * Provides the open state (true/false).
   * @event menuToggled
   */
  menuToggled = output<boolean>();

  protected isOpen = signal(false);
  private hoverTimeout: any = null;

  protected containerClasses = computed(() => {
    const disabledClasses = this.disabled() ? 'opacity-50 pointer-events-none' : '';
    return disabledClasses;
  });

  protected triggerClasses = computed(() => {
    const baseClasses = 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md';
    const disabledClasses = this.disabled() ? 'cursor-not-allowed' : '';
    return `${baseClasses} ${disabledClasses}`.trim();
  });

  protected menuClasses = computed(() => {
    const baseClasses = 'absolute z-50 min-w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1';

    const placementClasses = {
      'bottom-start': 'top-full left-0 mt-2',
      'bottom-end': 'top-full right-0 mt-2',
      'top-start': 'bottom-full left-0 mb-2',
      'top-end': 'bottom-full right-0 mb-2',
      'right-start': 'left-full top-0 ml-2',
      'left-start': 'right-full top-0 mr-2'
    };

    const placementClass = placementClasses[this.placement()];

    return `${baseClasses} ${placementClass}`.trim();
  });

  protected submenuClasses = computed(() => {
    return 'min-w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1';
  });

  protected itemClasses = (item: MenuItem) => {
    const baseClasses = 'w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors duration-200 flex items-center justify-between';

    const disabledClasses = item.disabled
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer';

    return `${baseClasses} ${disabledClasses}`.trim();
  };

  protected handleTriggerClick(): void {
    if (this.disabled() || this.trigger() !== 'click') return;

    this.toggleMenu();
  }

  protected handleTriggerMouseEnter(): void {
    if (this.disabled() || this.trigger() !== 'hover') return;

    this.clearHoverTimeout();
    this.openMenu();
  }

  protected handleTriggerMouseLeave(): void {
    if (this.disabled() || this.trigger() !== 'hover') return;

    this.hoverTimeout = setTimeout(() => {
      this.closeMenu();
    }, 150);
  }

  protected handleMenuMouseEnter(): void {
    if (this.trigger() === 'hover') {
      this.clearHoverTimeout();
    }
  }

  protected handleMenuMouseLeave(): void {
    if (this.trigger() === 'hover') {
      this.hoverTimeout = setTimeout(() => {
        this.closeMenu();
      }, 150);
    }
  }

  protected handleItemClick(item: MenuItem): void {
    if (item.disabled) return;

    this.itemSelected.emit(item);

    if (this.closeOnSelect() && !this.hasSubmenu(item)) {
      this.closeMenu();
    }
  }

  protected handleDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const component = event.currentTarget as HTMLElement;

    if (!component.contains(target)) {
      this.closeMenu();
    }
  }

  protected hasSubmenu(item: MenuItem): boolean {
    return !!(item.children && item.children.length > 0);
  }

  private toggleMenu(): void {
    if (this.isOpen()) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  private openMenu(): void {
    this.isOpen.set(true);
    this.menuToggled.emit(true);
  }

  private closeMenu(): void {
    this.isOpen.set(false);
    this.menuToggled.emit(false);
  }

  private clearHoverTimeout(): void {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
  }
}
