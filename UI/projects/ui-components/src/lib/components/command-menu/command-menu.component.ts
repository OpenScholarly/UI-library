import { Component, input, output, computed, signal, effect, ElementRef, inject } from '@angular/core';
import { NgClass } from '@angular/common';

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  group?: string;
  disabled?: boolean;
  action?: () => void;
}

@Component({
  selector: 'ui-command-menu',
  imports: [NgClass],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm"
          (click)="requestClose()"
        ></div>

        <!-- Command menu -->
        <div [class]="menuClasses()" role="dialog" [attr.aria-label]="'Command menu'">
          <!-- Search input -->
          <div class="border-b border-gray-200 dark:border-gray-700">
            <div class="flex items-center px-4 py-3">
              <span class="text-gray-400 dark:text-gray-500 mr-3 text-lg">🔍</span>
              <input
                #searchInput
                type="text"
                placeholder="Search commands..."
                class="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-0 outline-none"
                [value]="searchQuery()"
                (input)="onSearchInput($event)"
                (keydown)="onKeyDown($event)"
              >
              @if (searchQuery()) {
                <button
                  type="button"
                  class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  (click)="clearSearch()"
                >
                  <span class="text-lg">✕</span>
                </button>
              }
            </div>
          </div>

          <!-- Results -->
          <div class="max-h-80 overflow-y-auto">
            @if (groupedResults().length > 0) {
              @for (group of groupedResults(); track group.name) {
                <div class="py-2">
                  @if (group.name) {
                    <div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {{ group.name }}
                    </div>
                  }
                  @for (item of group.items; track item.id; let index = $index) {
                    <button
                      type="button"
                      [class]="itemClasses(index === selectedIndex())"
                      [disabled]="item.disabled"
                      (click)="selectItem(item)"
                      (mouseenter)="setSelectedIndex(index)"
                    >
                      <div class="flex items-center flex-1 min-w-0">
                        @if (item.icon) {
                          <span class="mr-3 text-lg">{{ item.icon }}</span>
                        }
                        <div class="flex-1 min-w-0 text-left">
                          <div class="font-medium text-gray-900 dark:text-white">
                            {{ item.label }}
                          </div>
                          @if (item.description) {
                            <div class="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {{ item.description }}
                            </div>
                          }
                        </div>
                      </div>
                      @if (item.shortcut) {
                        <div class="ml-3 flex items-center gap-1">
                          @for (key of parseShortcut(item.shortcut); track key) {
                            <kbd class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded border">
                              {{ key }}
                            </kbd>
                          }
                        </div>
                      }
                    </button>
                  }
                </div>
              }
            } @else if (searchQuery()) {
              <div class="px-4 py-8 text-center">
                <div class="text-4xl mb-2">🔍</div>
                <div class="text-gray-500 dark:text-gray-400">
                  No results found for "{{ searchQuery() }}"
                </div>
              </div>
            } @else {
              <div class="px-4 py-8 text-center">
                <div class="text-4xl mb-2">⌘</div>
                <div class="text-gray-500 dark:text-gray-400">
                  Type to search commands
                </div>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1">
                  <kbd class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↑↓</kbd>
                  Navigate
                </span>
                <span class="flex items-center gap-1">
                  <kbd class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">↵</kbd>
                  Select
                </span>
              </div>
              <span class="flex items-center gap-1">
                <kbd class="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  host: {
    'class': 'ui-command-menu'
  }
})
export class CommandMenuComponent {
  private elementRef = inject(ElementRef);

  items = input<CommandItem[]>([]);
  isOpen = input<boolean>(false);
  placeholder = input<string>('Search commands...');

  select = output<CommandItem>();
  close = output<void>();

  searchQuery = signal('');
  selectedIndex = signal(0);

  constructor() {
    // Focus search input when opened
    effect(() => {
      if (this.isOpen()) {
        setTimeout(() => {
          const input = this.elementRef.nativeElement.querySelector('input');
          if (input) input.focus();
        });
      }
    });

    // Reset when opened/closed
    effect(() => {
      if (this.isOpen()) {
        this.searchQuery.set('');
        this.selectedIndex.set(0);
      }
    });
  }

  menuClasses = computed(() => [
    'relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-w-2xl w-full mx-auto'
  ]);

  itemClasses = (isSelected: boolean) => [
    'w-full flex items-center px-4 py-3 text-left transition-colors',
    {
      'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100': isSelected,
      'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white': !isSelected
    }
  ];

  filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.items();

    return this.items().filter(item =>
      item.label.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.group?.toLowerCase().includes(query)
    );
  });

  groupedResults = computed(() => {
    const filtered = this.filteredItems();
    const groups = new Map<string, CommandItem[]>();

    filtered.forEach(item => {
      const groupName = item.group || '';
      if (!groups.has(groupName)) {
        groups.set(groupName, []);
      }
      groups.get(groupName)!.push(item);
    });

    return Array.from(groups.entries()).map(([name, items]) => ({
      name,
      items
    }));
  });

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.selectedIndex.set(0);
  }

  onKeyDown(event: KeyboardEvent) {
    const results = this.groupedResults().flatMap(g => g.items);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.selectedIndex.set(Math.min(this.selectedIndex() + 1, results.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.selectedIndex.set(Math.max(this.selectedIndex() - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        const selectedItem = results[this.selectedIndex()];
        if (selectedItem && !selectedItem.disabled) {
          this.selectItem(selectedItem);
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.requestClose();
        break;
    }
  }

  selectItem(item: CommandItem) {
    if (item.disabled) return;

    if (item.action) {
      item.action();
    }
    this.select.emit(item);
    this.requestClose();
  }

  setSelectedIndex(index: number) {
    this.selectedIndex.set(index);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.selectedIndex.set(0);
  }

  parseShortcut(shortcut: string): string[] {
    return shortcut.split('+').map(key => key.trim());
  }

  requestClose() {
    this.close.emit();
  }
}
