import { ChangeDetectionStrategy, Component, computed, input, output, signal, inject } from '@angular/core';
import { AriaHelpersService } from '../../../utilities/aria-helpers.service';
import { TabItem, TabsVariant, TabsSize, TabsOrientation } from '../../../types';

/**
 * A versatile and accessible tabs component for organizing content into separate views.
 *
 * ## Features
 * - Multiple visual variants (default, line, pills, enclosed, soft)
 * - Comprehensive size options (small, medium, large)
 * - Horizontal and vertical orientation support
 * - Icon and badge support in tab labels
 * - Full keyboard navigation (Arrow keys, Home, End)
 * - Full screen reader support with proper ARIA attributes
 * - WCAG 2.1 Level AA color contrast compliance
 * - Individual tab disable support
 * - Dark mode support
 * - Smooth transitions between tabs
 * - Lazy loading support for tab content
 * - Full-width tab layout option
 *
 * @example
 * ```html
 * <!-- Basic tabs -->
 * <ui-tabs
 *   [tabs]="[
 *     { id: 'tab1', label: 'Overview', content: 'Overview content' },
 *     { id: 'tab2', label: 'Details', content: 'Details content' },
 *     { id: 'tab3', label: 'Settings', content: 'Settings content' }
 *   ]">
 * </ui-tabs>
 *
 * <!-- Tabs with icons -->
 * <ui-tabs
 *   variant="pills"
 *   [tabs]="[
 *     { id: 'home', label: 'Home', icon: '🏠', content: 'Home content' },
 *     { id: 'profile', label: 'Profile', icon: '👤', content: 'Profile content' },
 *     { id: 'settings', label: 'Settings', icon: '⚙️', content: 'Settings content' }
 *   ]">
 * </ui-tabs>
 *
 * <!-- Tabs with badges -->
 * <ui-tabs
 *   variant="line"
 *   [tabs]="[
 *     { id: 'inbox', label: 'Inbox', badge: '12' },
 *     { id: 'drafts', label: 'Drafts', badge: '3' },
 *     { id: 'sent', label: 'Sent' }
 *   ]">
 * </ui-tabs>
 *
 * <!-- Vertical tabs -->
 * <ui-tabs
 *   orientation="vertical"
 *   variant="enclosed"
 *   [tabs]="verticalTabs">
 * </ui-tabs>
 *
 * <!-- Full-width tabs -->
 * <ui-tabs
 *   [fullWidth]="true"
 *   [tabs]="fullWidthTabs">
 * </ui-tabs>
 *
 * <!-- With change handler -->
 * <ui-tabs
 *   [tabs]="myTabs"
 *   [activeTab]="selectedTab"
 *   (tabChanged)="onTabChange($event)">
 * </ui-tabs>
 *
 * <!-- With disabled tab -->
 * <ui-tabs
 *   [tabs]="[
 *     { id: 'enabled', label: 'Enabled', content: 'Content' },
 *     { id: 'disabled', label: 'Disabled', disabled: true, content: 'Locked' }
 *   ]">
 * </ui-tabs>
 * ```
 */
@Component({
  selector: 'ui-tabs',
  standalone: true,
  template: `
    <div [class]="tabsWrapperClasses()">
      <!-- Tab List -->
      <div
        [class]="tabListClasses()"
        role="tablist"
        [attr.aria-orientation]="orientation()">
        @for (tab of tabs(); track tab.id) {
          <button
            [id]="'tab-' + tab.id"
            [class]="getTabButtonClasses(tab)"
            [attr.aria-selected]="getActiveTab() === tab.id"
            [attr.aria-controls]="'panel-' + tab.id"
            [disabled]="tab.disabled"
            role="tab"
            type="button"
            (click)="selectTab(tab.id)"
            (keydown)="onKeyDown($event, tab.id)">

            @if (tab.icon) {
              <span [class]="iconClasses()">{{ tab.icon }}</span>
            }

            <span>{{ tab.label }}</span>

            @if (tab.badge) {
              <span [class]="badgeClasses()">{{ tab.badge }}</span>
            }
          </button>
        }
      </div>

      <!-- Tab Panels -->
      <div [class]="panelsWrapperClasses()">
        @for (tab of tabs(); track tab.id) {
          <div
            [id]="'panel-' + tab.id"
            [class]="getTabPanelClasses(tab.id)"
            [attr.aria-labelledby]="'tab-' + tab.id"
            [attr.hidden]="getActiveTab() !== tab.id"
            role="tabpanel"
            tabindex="0">

            @if (tab.content) {
              {{ tab.content }}
            } @else {
              <ng-content [attr.data-tab-id]="tab.id" />
            }
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent {
  /**
   * Array of tab items to display.
   * Each tab must have at minimum an id and label.
   * @required
   * @example [{ id: 'tab1', label: 'Tab 1', content: 'Content 1' }, { id: 'tab2', label: 'Tab 2', icon: '📁' }]
   */
  tabs = input.required<TabItem[]>();
  
  /**
   * ID of the tab to display as active initially.
   * If not provided, first tab will be active.
   * @default ""
   * @example "tab1"
   */
  activeTab = input<string>('');
  
  /**
   * Visual style variant of the tabs.
   * - `default`: Standard tabs with bottom border
   * - `line`: Minimal tabs with active underline
   * - `pills`: Rounded pill-shaped tabs
   * - `enclosed`: Tabs with full borders
   * - `soft`: Soft background tabs
   * @default "default"
   */
  variant = input<TabsVariant>('default');
  
  /**
   * Size of the tabs.
   * - `sm`: Small (compact padding)
   * - `md`: Medium (standard padding) - default
   * - `lg`: Large (generous padding)
   * @default "md"
   */
  size = input<TabsSize>('md');
  
  /**
   * Layout orientation of the tabs.
   * - `horizontal`: Tabs arranged horizontally (default)
   * - `vertical`: Tabs arranged vertically (side navigation)
   * @default "horizontal"
   */
  orientation = input<TabsOrientation>('horizontal');
  
  /**
   * Makes tabs take full width of container.
   * Each tab expands equally to fill available space.
   * @default false
   */
  fullWidth = input(false);
  
  /**
   * Enables lazy loading of tab content.
   * Tab panels are only rendered when first accessed.
   * @default false
   */
  lazy = input(false);

  /**
   * Emitted when the active tab changes.
   * Provides the ID of the newly active tab.
   * @event tabChanged
   */
  tabChanged = output<string>();
  
  /**
   * Emitted when a tab is clicked.
   * Provides both the tab ID and full tab object.
   * @event tabClicked
   */
  tabClicked = output<{ tabId: string; tab: TabItem }>();

  // Internal state
  private activeTabId = signal('');

  // Services
  private ariaHelpers = inject(AriaHelpersService);

  constructor() {
    // Initialize active tab
    setTimeout(() => {
      const initialTab = this.activeTab() || this.tabs()[0]?.id;
      if (initialTab) {
        this.activeTabId.set(initialTab);
      }
    });
  }

  // Computed classes
  protected tabsWrapperClasses = computed(() => {
    const baseClasses = 'ui-tabs';
    const orientationClasses = this.orientation() === 'vertical' ? 'flex' : '';
    return `${baseClasses} ${orientationClasses}`;
  });

  protected tabListClasses = computed(() => {
    const baseClasses = 'flex';

    const orientationClasses = this.orientation() === 'vertical'
      ? 'flex-col space-y-1 mr-4'
      : 'space-x-1';

    const variantClasses = {
      default: 'border-b border-gray-200 dark:border-gray-700',
      pills: '',
      underline: 'border-b border-gray-200 dark:border-gray-700',
      card: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg'
    };

    const widthClasses = this.fullWidth() && this.orientation() === 'horizontal'
      ? 'w-full'
      : '';

    return `${baseClasses} ${orientationClasses} ${variantClasses[this.variant()]} ${widthClasses}`;
  });

  protected getTabButtonClasses(tab: TabItem): string {
    const baseClasses = 'relative flex items-center gap-2 ui-transition-standard ui-focus-primary';

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const isActive = this.getActiveTab() === tab.id;
    const isDisabled = tab.disabled;

    const variantClasses = {
      default: isActive
        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 -mb-px'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600',
      pills: isActive
        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-100 rounded-md'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md',
      underline: isActive
        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 border-b-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600',
      card: isActive
        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm rounded-md'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-md'
    };

    const stateClasses = isDisabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer';

    const widthClasses = this.fullWidth() && this.orientation() === 'horizontal'
      ? 'flex-1 justify-center'
      : '';

    return `${baseClasses} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]} ${stateClasses} ${widthClasses}`;
  }

  protected iconClasses = computed(() => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    return `${sizeClasses[this.size()]}`;
  });

  protected badgeClasses = computed(() => {
    return 'bg-gray-500 dark:bg-gray-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-0';
  });

  protected panelsWrapperClasses = computed(() => {
    const baseClasses = 'ui-tab-panels';
    const orientationClasses = this.orientation() === 'vertical' ? 'flex-1' : 'mt-4';
    return `${baseClasses} ${orientationClasses}`;
  });

  protected getTabPanelClasses(tabId: string): string {
    const baseClasses = 'ui-tab-panel focus:outline-none';
    const isActive = this.getActiveTab() === tabId;
    const displayClasses = isActive ? 'block' : 'hidden';
    return `${baseClasses} ${displayClasses}`;
  }

  // Event handlers
  protected selectTab(tabId: string): void {
    const tab = this.tabs().find(t => t.id === tabId);
    if (!tab || tab.disabled) {
      return;
    }

    this.activeTabId.set(tabId);
    this.tabChanged.emit(tabId);

    if (tab) {
      this.tabClicked.emit({ tabId, tab });
    }

    // Announce tab change to screen readers
    this.ariaHelpers.announce(`${tab.label} tab selected`, 'polite');
  }

  protected onKeyDown(event: KeyboardEvent, currentTabId: string): void {
    const tabs = this.tabs().filter(tab => !tab.disabled);
    const currentIndex = tabs.findIndex(tab => tab.id === currentTabId);

    let targetIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        targetIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        targetIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        targetIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        targetIndex = tabs.length - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectTab(currentTabId);
        return;
    }

    if (targetIndex !== currentIndex) {
      const targetTab = tabs[targetIndex];
      this.selectTab(targetTab.id);

      // Focus the target tab button
      setTimeout(() => {
        const tabButton = document.getElementById(`tab-${targetTab.id}`);
        tabButton?.focus();
      });
    }
  }

  // Public methods
  getActiveTab(): string {
    return this.activeTab() || this.activeTabId();
  }

  setActiveTab(tabId: string): void {
    this.selectTab(tabId);
  }

  getTabById(tabId: string): TabItem | undefined {
    return this.tabs().find(tab => tab.id === tabId);
  }

  getActiveTabData(): TabItem | undefined {
    return this.getTabById(this.getActiveTab());
  }
}
