import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { NavigationItem, LayoutSidebarPosition, LayoutSidebarBehavior } from '../../../types';

@Component({
  selector: 'ui-layout',
  standalone: true,
  template: `
    <div [class]="layoutClasses()">
      <!-- Navbar -->
      @if (showNavbar()) {
        <nav [class]="navbarClasses()">
          <div class="flex items-center justify-between h-full px-4">
            <!-- Left side -->
            <div class="flex items-center gap-4">
              <!-- Sidebar Toggle (mobile) -->
              @if (showSidebar()) {
                <button
                  class="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  (click)="toggleSidebar()"
                  type="button">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </button>
              }

              <!-- Navbar Brand/Logo -->
              <ng-content select="[slot=navbar-brand]" />
            </div>

            <!-- Center -->
            <ng-content select="[slot=navbar-center]" />

            <!-- Right side -->
            <div class="flex items-center gap-2">
              <ng-content select="[slot=navbar-actions]" />
            </div>
          </div>
        </nav>
      }

      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        @if (showSidebar()) {
          <!-- Overlay for mobile -->
          @if (isSidebarOpen() && sidebarBehavior() === 'overlay') {
            <div
              class="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
              (click)="closeSidebar()">
            </div>
          }

          <aside [class]="sidebarClasses()">
            <div class="flex flex-col h-full">
              <!-- Sidebar Header -->
              @if (sidebarTitle()) {
                <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ sidebarTitle() }}</h2>
                  @if (sidebarBehavior() === 'overlay') {
                    <button
                      class="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      (click)="closeSidebar()"
                      type="button">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  }
                </div>
              }

              <!-- Custom Sidebar Header -->
              <ng-content select="[slot=sidebar-header]" />

              <!-- Sidebar Content -->
              <div class="flex-1 overflow-y-auto p-4">
                @if (navigationItems().length > 0) {
                  <nav class="space-y-2">
                    @for (item of navigationItems(); track item.id) {
                      <div>
                        <a
                          [class]="navItemClasses(item)"
                          [href]="item.href || '#'"
                          (click)="handleNavItemClick(item, $event)">

                          <div class="flex items-center gap-3">
                            @if (item.icon) {
                              <span class="text-lg">{{ item.icon }}</span>
                            }
                            <span class="flex-1">{{ item.label }}</span>
                            @if (item.badge) {
                              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-200">
                                {{ item.badge }}
                              </span>
                            }
                            @if (item.children && item.children.length > 0) {
                              <svg class="w-4 h-4 transition-transform" [class.rotate-90]="isNavItemExpanded(item.id)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                              </svg>
                            }
                          </div>
                        </a>

                        <!-- Sub-navigation -->
                        @if (item.children && item.children.length > 0 && isNavItemExpanded(item.id)) {
                          <div class="ml-6 mt-2 space-y-1">
                            @for (child of item.children; track child.id) {
                              <a
                                [class]="subNavItemClasses(child)"
                                [href]="child.href || '#'"
                                (click)="handleNavItemClick(child, $event)">
                                <div class="flex items-center justify-between">
                                  <span>{{ child.label }}</span>
                                  @if (child.badge) {
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                      {{ child.badge }}
                                    </span>
                                  }
                                </div>
                              </a>
                            }
                          </div>
                        }
                      </div>
                    }
                  </nav>
                }

                <!-- Custom Sidebar Content -->
                <ng-content select="[slot=sidebar-content]" />
              </div>

              <!-- Sidebar Footer -->
              <ng-content select="[slot=sidebar-footer]" />
            </div>
          </aside>
        }

        <!-- Main Content Area -->
        <main [class]="mainClasses()">
          <ng-content />
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopBarDrawerLayoutComponent {
  showNavbar = input(true);
  showSidebar = input(true);
  sidebarPosition = input<LayoutSidebarPosition>('left');
  sidebarBehavior = input<LayoutSidebarBehavior>('fixed');
  sidebarTitle = input<string>('');
  navigationItems = input<NavigationItem[]>([]);
  activeNavItemId = input<string>('');
  sidebarWidth = input('16rem');
  navbarHeight = input('4rem');

  navItemClicked = output<NavigationItem>();
  sidebarToggled = output<boolean>();

  protected isSidebarOpen = signal(true);
  private expandedNavItems = signal<Set<string>>(new Set());

  protected layoutClasses = computed(() => {
    return 'flex flex-col h-screen bg-gray-50 dark:bg-gray-900';
  });

  protected navbarClasses = computed(() => {
    const baseClasses = 'bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-30';
    return `${baseClasses} h-[${this.navbarHeight()}]`;
  });

  protected sidebarClasses = computed(() => {
    const baseClasses = 'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out';

    const positionClasses = {
      left: 'left-0',
      right: 'right-0'
    };

    const behaviorClasses = {
      fixed: 'relative',
      overlay: 'fixed top-0 z-30',
      push: 'relative'
    };

    const widthClass = `w-[${this.sidebarWidth()}]`;
    const positionClass = positionClasses[this.sidebarPosition()];
    const behaviorClass = behaviorClasses[this.sidebarBehavior()];

    // Handle mobile responsive behavior
    const mobileClasses = this.sidebarBehavior() === 'overlay'
      ? this.isSidebarOpen()
        ? 'translate-x-0'
        : this.sidebarPosition() === 'left'
          ? '-translate-x-full'
          : 'translate-x-full'
      : '';

    const heightClass = this.sidebarBehavior() === 'overlay'
      ? 'h-full'
      : this.showNavbar()
        ? `h-[calc(100vh-${this.navbarHeight()})]`
        : 'h-full';

    return `${baseClasses} ${behaviorClass} ${positionClass} ${widthClass} ${heightClass} ${mobileClasses} lg:translate-x-0`;
  });

  protected mainClasses = computed(() => {
    const baseClasses = 'flex-1 overflow-auto bg-gray-50 dark:bg-gray-900';

    // Add padding when sidebar is visible and not overlay
    const paddingClass = this.showSidebar() && this.sidebarBehavior() !== 'overlay'
      ? ''
      : '';

    return `${baseClasses} ${paddingClass}`;
  });

  protected navItemClasses = (item: NavigationItem) => {
    const baseClasses = 'flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500';

    const activeClasses = this.activeNavItemId() === item.id
      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';

    const disabledClasses = item.disabled
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : '';

    return `${baseClasses} ${activeClasses} ${disabledClasses}`;
  };

  protected subNavItemClasses = (item: NavigationItem) => {
    const baseClasses = 'flex items-center w-full px-3 py-1.5 text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500';

    const activeClasses = this.activeNavItemId() === item.id
      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/10 dark:text-primary-400'
      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800';

    const disabledClasses = item.disabled
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : '';

    return `${baseClasses} ${activeClasses} ${disabledClasses}`;
  };

  protected toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open);
    this.sidebarToggled.emit(this.isSidebarOpen());
  }

  protected closeSidebar(): void {
    this.isSidebarOpen.set(false);
    this.sidebarToggled.emit(false);
  }

  protected isNavItemExpanded(itemId: string): boolean {
    return this.expandedNavItems().has(itemId);
  }

  protected handleNavItemClick(item: NavigationItem, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    // Handle expansion for items with children
    if (item.children && item.children.length > 0) {
      event.preventDefault();

      this.expandedNavItems.update(expanded => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(item.id)) {
          newExpanded.delete(item.id);
        } else {
          newExpanded.add(item.id);
        }
        return newExpanded;
      });
    }

    this.navItemClicked.emit(item);

    // Close sidebar on mobile when item is clicked
    if (this.sidebarBehavior() === 'overlay' && window.innerWidth < 1024) {
      this.closeSidebar();
    }
  }
}
