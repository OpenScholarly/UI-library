import { ChangeDetectionStrategy, Component, computed, input, output, signal, inject } from '@angular/core';
import { AriaHelpersService } from '../../utilities/aria-helpers.service';

export interface TabItem {
  id: string;
  label: string;
  content?: string;
  disabled?: boolean;
  badge?: string | number;
  icon?: string;
}

export type TabsVariant = 'default' | 'pills' | 'underline' | 'card';
export type TabsSize = 'sm' | 'md' | 'lg';
export type TabsOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'ui-tabs',
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
  tabs = input.required<TabItem[]>();
  activeTab = input<string>('');
  variant = input<TabsVariant>('default');
  size = input<TabsSize>('md');
  orientation = input<TabsOrientation>('horizontal');
  fullWidth = input(false);
  lazy = input(false);

  tabChanged = output<string>();
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
      default: 'border-b border-gray-200',
      pills: '',
      underline: 'border-b border-gray-200',
      card: 'bg-gray-100 p-1 rounded-lg'
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
        ? 'text-primary-600 border-b-2 border-primary-600 -mb-px'
        : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300',
      pills: isActive
        ? 'bg-primary-100 text-primary-700 rounded-md'
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md',
      underline: isActive
        ? 'text-primary-600 border-b-2 border-primary-600'
        : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300',
      card: isActive
        ? 'bg-white text-gray-900 shadow-sm rounded-md'
        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-md'
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
    return 'bg-gray-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-0';
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