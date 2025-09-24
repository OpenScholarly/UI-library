import { ChangeDetectionStrategy, Component, computed, input, output, signal, effect } from '@angular/core';
import { AriaHelpersService } from '../../utilities/aria-helpers.service';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  disabled?: boolean;
  expanded?: boolean;
}

@Component({
  selector: 'ui-accordion',
  template: `
    <div [class]="accordionClasses()" role="tablist">
      @for (item of items(); track item.id) {
        <div class="ui-accordion-item border-b border-gray-200 last:border-b-0">
          <h3>
            <button
              [id]="'accordion-button-' + item.id"
              [attr.aria-expanded]="isExpanded(item.id)"
              [attr.aria-controls]="'accordion-panel-' + item.id"
              [disabled]="item.disabled"
              (click)="toggle(item.id)"
              [class]="getButtonClasses(item)"
              type="button"
              role="tab">
              <span class="flex-1 text-left">{{ item.title }}</span>
              <svg 
                [class]="getIconClasses(item.id)"
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true">
                <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </h3>
          <div
            [id]="'accordion-panel-' + item.id"
            [attr.aria-labelledby]="'accordion-button-' + item.id"
            [class]="getPanelClasses(item.id)"
            role="tabpanel">
            <div class="p-4 pt-0">
              {{ item.content }}
            </div>
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccordionComponent {
  items = input.required<AccordionItem[]>();
  allowMultiple = input(false);
  collapsible = input(true);
  variant = input<'default' | 'bordered' | 'separated'>('default');

  itemToggled = output<{ id: string; expanded: boolean }>();

  private expandedItems = signal<Set<string>>(new Set());

  constructor(private ariaHelpers: AriaHelpersService) {
    // Initialize expanded items from props when items change
    effect(() => {
      const initialExpanded = this.items().filter(item => item.expanded).map(item => item.id);
      this.expandedItems.set(new Set(initialExpanded));
    });
  }

  protected accordionClasses = computed(() => {
    const baseClasses = 'ui-accordion border border-gray-200 rounded-md overflow-hidden';
    
    const variants = {
      default: '',
      bordered: 'border-2',
      separated: 'space-y-2 border-0 bg-transparent'
    };

    return `${baseClasses} ${variants[this.variant()]}`;
  });

  protected getButtonClasses(item: AccordionItem): string {
    const baseClasses = 'w-full flex items-center justify-between p-4 text-left font-medium ui-transition-standard ui-focus-primary hover:bg-gray-50';
    const disabledClasses = item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    return `${baseClasses} ${disabledClasses}`;
  }

  protected getPanelClasses(itemId: string): string {
    const isOpen = this.isExpanded(itemId);
    const baseClasses = 'overflow-hidden ui-transition-slow';
    const heightClasses = isOpen ? 'max-h-none opacity-100' : 'max-h-0 opacity-0';
    
    return `${baseClasses} ${heightClasses}`;
  }

  protected getIconClasses(itemId: string): string {
    const isOpen = this.isExpanded(itemId);
    const baseClasses = 'transform ui-transition-fast';
    const rotationClasses = isOpen ? 'rotate-180' : 'rotate-0';
    
    return `${baseClasses} ${rotationClasses}`;
  }

  protected isExpanded(itemId: string): boolean {
    return this.expandedItems().has(itemId);
  }

  protected toggle(itemId: string): void {
    const item = this.items().find(i => i.id === itemId);
    if (!item || item.disabled) {
      return;
    }

    const currentExpanded = new Set(this.expandedItems());
    const isCurrentlyExpanded = currentExpanded.has(itemId);

    if (!this.allowMultiple()) {
      // Single mode: close all others
      currentExpanded.clear();
    }

    if (isCurrentlyExpanded) {
      // Collapse if collapsible is true
      if (this.collapsible()) {
        currentExpanded.delete(itemId);
      }
    } else {
      // Expand
      currentExpanded.add(itemId);
    }

    this.expandedItems.set(currentExpanded);
    this.itemToggled.emit({ id: itemId, expanded: !isCurrentlyExpanded });

    // Announce to screen readers
    const newState = currentExpanded.has(itemId) ? 'expanded' : 'collapsed';
    this.ariaHelpers.announce(`${item.title} ${newState}`, 'polite');
  }

  /**
   * Programmatically expand an item
   */
  expand(itemId: string): void {
    const currentExpanded = new Set(this.expandedItems());
    
    if (!this.allowMultiple()) {
      currentExpanded.clear();
    }
    
    currentExpanded.add(itemId);
    this.expandedItems.set(currentExpanded);
  }

  /**
   * Programmatically collapse an item
   */
  collapse(itemId: string): void {
    const currentExpanded = new Set(this.expandedItems());
    currentExpanded.delete(itemId);
    this.expandedItems.set(currentExpanded);
  }

  /**
   * Expand all items (only works when allowMultiple is true)
   */
  expandAll(): void {
    if (!this.allowMultiple()) {
      return;
    }

    const allItemIds = this.items().filter(item => !item.disabled).map(item => item.id);
    this.expandedItems.set(new Set(allItemIds));
  }

  /**
   * Collapse all items
   */
  collapseAll(): void {
    this.expandedItems.set(new Set());
  }
}