import { Component, input, output, computed, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavbarItem } from '../../../types';

@Component({
  selector: 'ui-navbar',
  imports: [NgClass],
  template: `
    <nav [class]="containerClasses()">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Left section - Brand and navigation -->
          <div class="flex items-center">
            <!-- Brand/Logo -->
            @if (brandText() || brandIcon()) {
              <div class="flex-shrink-0 flex items-center">
                @if (brandIcon()) {
                  <span class="text-2xl mr-2">{{ brandIcon() }}</span>
                }
                @if (brandText()) {
                  <span [class]="brandClasses()">{{ brandText() }}</span>
                }
              </div>
            }

            <!-- Desktop Navigation -->
            @if (items().length > 0) {
              <div class="hidden md:ml-6 md:flex md:space-x-8">
                @for (item of items(); track item.id) {
                  <div class="relative">
                    @if (!item.children || item.children.length === 0) {
                      <!-- Simple nav item -->
                      <button
                        type="button"
                        [class]="navItemClasses(item)"
                        [disabled]="item.disabled"
                        (click)="itemClick.emit(item)"
                      >
                        @if (item.icon) {
                          <span class="mr-2">{{ item.icon }}</span>
                        }
                        {{ item.label }}
                        @if (item.badge) {
                          <span class="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                            {{ item.badge }}
                          </span>
                        }
                      </button>
                    } @else {
                      <!-- Dropdown nav item -->
                      <div class="relative">
                        <button
                          type="button"
                          [class]="navItemClasses(item)"
                          [disabled]="item.disabled"
                          (click)="toggleDropdown(item.id)"
                        >
                          @if (item.icon) {
                            <span class="mr-2">{{ item.icon }}</span>
                          }
                          {{ item.label }}
                          <span class="ml-1 text-sm">{{ isDropdownOpen(item.id) ? '▲' : '▼' }}</span>
                        </button>

                        @if (isDropdownOpen(item.id)) {
                          <div class="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50">
                            @for (child of item.children; track child.id) {
                              <button
                                type="button"
                                class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                [class.bg-gray-100]="child.active"
                                [class.dark:bg-gray-700]="child.active"
                                [disabled]="child.disabled"
                                (click)="itemClick.emit(child)"
                              >
                                @if (child.icon) {
                                  <span class="mr-2">{{ child.icon }}</span>
                                }
                                {{ child.label }}
                                @if (child.badge) {
                                  <span class="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                                    {{ child.badge }}
                                  </span>
                                }
                              </button>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>

          <!-- Right section - Actions -->
          <div class="flex items-center gap-4">
            <ng-content select="[slot=actions]"></ng-content>

            <!-- Mobile menu button -->
            @if (items().length > 0) {
              <button
                type="button"
                class="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                (click)="toggleMobileMenu()"
                [attr.aria-label]="'Toggle mobile menu'"
              >
                <span class="text-xl">{{ mobileMenuOpen() ? '✕' : '☰' }}</span>
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      @if (mobileMenuOpen() && items().length > 0) {
        <div class="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div class="px-2 pt-2 pb-3 space-y-1">
            @for (item of items(); track item.id) {
              @if (!item.children || item.children.length === 0) {
                <button
                  type="button"
                  class="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  [class.bg-gray-100]="item.active"
                  [class.dark:bg-gray-700]="item.active"
                  [disabled]="item.disabled"
                  (click)="itemClick.emit(item)"
                >
                  @if (item.icon) {
                    <span class="mr-2">{{ item.icon }}</span>
                  }
                  {{ item.label }}
                  @if (item.badge) {
                    <span class="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {{ item.badge }}
                    </span>
                  }
                </button>
              } @else {
                <div>
                  <button
                    type="button"
                    class="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    (click)="toggleMobileDropdown(item.id)"
                  >
                    @if (item.icon) {
                      <span class="mr-2">{{ item.icon }}</span>
                    }
                    {{ item.label }}
                    <span class="ml-1 text-sm">{{ isMobileDropdownOpen(item.id) ? '▲' : '▼' }}</span>
                  </button>

                  @if (isMobileDropdownOpen(item.id)) {
                    <div class="ml-4 mt-1 space-y-1">
                      @for (child of item.children; track child.id) {
                        <button
                          type="button"
                          class="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          [class.bg-gray-100]="child.active"
                          [class.dark:bg-gray-700]="child.active"
                          [disabled]="child.disabled"
                          (click)="itemClick.emit(child)"
                        >
                          @if (child.icon) {
                            <span class="mr-2">{{ child.icon }}</span>
                          }
                          {{ child.label }}
                          @if (child.badge) {
                            <span class="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                              {{ child.badge }}
                            </span>
                          }
                        </button>
                      }
                    </div>
                  }
                </div>
              }
            }
          </div>
        </div>
      }
    </nav>
  `,
  host: {
    'class': 'ui-navbar block'
  }
})
export class NavbarComponent {
  brandText = input<string>();
  brandIcon = input<string>();
  items = input<NavbarItem[]>([]);
  variant = input<'default' | 'glass' | 'solid'>('default');
  sticky = input<boolean>(false);

  itemClick = output<NavbarItem>();
  brandClick = output<void>();

  mobileMenuOpen = signal(false);
  openDropdowns = signal<Set<string>>(new Set());
  openMobileDropdowns = signal<Set<string>>(new Set());

  containerClasses = computed(() => [
    'w-full border-b border-gray-200 dark:border-gray-700 transition-colors',
    {
      'bg-white dark:bg-gray-900': this.variant() === 'default',
      'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm': this.variant() === 'glass',
      'bg-gray-50 dark:bg-gray-800': this.variant() === 'solid',
      'sticky top-0 z-50': this.sticky()
    }
  ]);

  brandClasses = computed(() => [
    'text-xl font-bold text-gray-900 dark:text-white'
  ]);

  navItemClasses = (item: NavbarItem) => [
    'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors',
    {
      'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400': item.active,
      'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600': !item.active && !item.disabled,
      'text-gray-400 dark:text-gray-600 cursor-not-allowed': item.disabled
    }
  ];

  toggleMobileMenu() {
    this.mobileMenuOpen.update(open => !open);
  }

  toggleDropdown(itemId: string) {
    this.openDropdowns.update(dropdowns => {
      const newDropdowns = new Set(dropdowns);
      if (newDropdowns.has(itemId)) {
        newDropdowns.delete(itemId);
      } else {
        newDropdowns.add(itemId);
      }
      return newDropdowns;
    });
  }

  toggleMobileDropdown(itemId: string) {
    this.openMobileDropdowns.update(dropdowns => {
      const newDropdowns = new Set(dropdowns);
      if (newDropdowns.has(itemId)) {
        newDropdowns.delete(itemId);
      } else {
        newDropdowns.add(itemId);
      }
      return newDropdowns;
    });
  }

  isDropdownOpen(itemId: string): boolean {
    return this.openDropdowns().has(itemId);
  }

  isMobileDropdownOpen(itemId: string): boolean {
    return this.openMobileDropdowns().has(itemId);
  }
}
