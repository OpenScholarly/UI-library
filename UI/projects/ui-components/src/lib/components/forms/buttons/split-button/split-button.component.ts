import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { SplitButtonAction, SplitButtonVariant, SplitButtonSize } from '../../../../types';

/**
 * A versatile split button component combining a primary action with a dropdown menu.
 *
 * ## Features
 * - Primary action button with dropdown menu for secondary actions
 * - Multiple visual variants (primary, secondary, outline, ghost, destructive)
 * - Comprehensive size options (sm, md, lg)
 * - Icon support for main action and menu items
 * - Keyboard navigation and screen reader support
 * - Click-outside detection for dropdown dismissal
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 *
 * @example
 * ```html
 * <!-- Basic split button -->
 * <ui-split-button
 *   mainLabel="Save"
 *   [actions]="saveActions"
 *   (mainAction)="save()"
 *   (actionSelected)="handleSaveAction($event)">
 * </ui-split-button>
 *
 * <!-- With icon and variant -->
 * <ui-split-button
 *   mainLabel="Download"
 *   mainIcon="⬇️"
 *   variant="primary"
 *   size="md"
 *   [actions]="downloadFormats"
 *   (mainAction)="downloadDefault()"
 *   (actionSelected)="downloadAs($event)">
 * </ui-split-button>
 *
 * <!-- Destructive action with confirmation options -->
 * <ui-split-button
 *   mainLabel="Delete"
 *   variant="destructive"
 *   [actions]="deleteOptions"
 *   (mainAction)="deleteItem()"
 *   (actionSelected)="handleDeleteOption($event)">
 * </ui-split-button>
 *
 * <!-- With disabled state -->
 * <ui-split-button
 *   mainLabel="Export"
 *   [actions]="exportActions"
 *   [disabled]="!hasData"
 *   (mainAction)="exportData()"
 *   (actionSelected)="handleExport($event)">
 * </ui-split-button>
 * ```
 */
@Component({
  selector: 'ui-split-button',
  standalone: true,
  template: `
    <div [class]="containerClasses()">
      <!-- Main Action Button -->
      <button
        [class]="mainButtonClasses()"
        [disabled]="disabled()"
        (click)="handleMainAction()"
        type="button">
        @if (mainIcon()) {
          <span class="mr-2">{{ mainIcon() }}</span>
        }
        {{ mainLabel() }}
      </button>

      <!-- Dropdown Toggle Button -->
      <button
        [class]="dropdownButtonClasses()"
        [disabled]="disabled()"
        [attr.aria-expanded]="isOpen()"
        [attr.aria-haspopup]="true"
        (click)="toggleDropdown()"
        type="button">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Dropdown Menu -->
      @if (isOpen()) {
        <div [class]="dropdownMenuClasses()">
          @for (action of actions(); track action.value) {
            <button
              [class]="menuItemClasses(action)"
              [disabled]="action.disabled"
              (click)="handleActionClick(action)"
              type="button">
              @if (action.icon) {
                <span class="mr-2">{{ action.icon }}</span>
              }
              {{ action.label }}
            </button>
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
export class SplitButtonComponent {
  /**
   * Label text for the main action button.
   * @required
   * @example "Save", "Download", "Export"
   */
  mainLabel = input.required<string>();
  
  /**
   * Icon to display before the main label (emoji or icon class).
   * @default ""
   * @example "💾", "⬇️", "📤"
   */
  mainIcon = input<string>('');
  
  /**
   * Array of secondary actions to display in the dropdown menu.
   * Each action has label, value, optional icon, and disabled state.
   * @required
   * @example [{ label: 'Save as PDF', value: 'pdf', icon: '📄' }, { label: 'Save as Word', value: 'docx', icon: '📝' }]
   */
  actions = input.required<SplitButtonAction[]>();
  
  /**
   * Visual style variant of the button.
   * - `primary`: Primary brand-colored button
   * - `secondary`: Neutral gray button
   * - `outline`: Transparent with border
   * - `ghost`: Text-only button
   * - `destructive`: Red for destructive actions
   * @default "primary"
   */
  variant = input<SplitButtonVariant>('primary');
  
  /**
   * Size of the button affecting padding and text size.
   * - `sm`: Small (px-3 py-1.5)
   * - `md`: Medium (px-4 py-2)
   * - `lg`: Large (px-6 py-3)
   * @default "md"
   */
  size = input<SplitButtonSize>('md');
  
  /**
   * Disables both the main button and dropdown, preventing all interactions.
   * @default false
   */
  disabled = input(false);

  /**
   * Emitted when the main action button is clicked.
   * Use this for the primary action of the split button.
   * @event mainAction
   */
  mainAction = output<void>();
  
  /**
   * Emitted when a secondary action from the dropdown is selected.
   * Provides the selected action object.
   * @event actionSelected
   */
  actionSelected = output<SplitButtonAction>();

  protected isOpen = signal(false);

  protected containerClasses = computed(() => {
    return 'relative inline-flex rounded-md shadow-sm';
  });

  protected mainButtonClasses = computed(() => {
    const baseClasses = 'relative inline-flex items-center justify-center font-medium ui-transition-standard ui-focus-primary disabled:pointer-events-none disabled:opacity-50 rounded-l-md border-r-0';

    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 border border-primary-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 border border-gray-300',
      outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100',
      ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 border border-transparent',
      destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-600'
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const variantClass = variants[this.variant()];
    const sizeClass = sizes[this.size()];

    return `${baseClasses} ${variantClass} ${sizeClass}`;
  });

  protected dropdownButtonClasses = computed(() => {
    const baseClasses = 'relative inline-flex items-center justify-center ui-transition-standard ui-focus-primary disabled:pointer-events-none disabled:opacity-50 rounded-r-md border-l border-white/20';

    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 border border-primary-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400 border border-gray-300',
      outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100',
      ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 border border-transparent',
      destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border border-red-600'
    };

    const sizes = {
      sm: 'px-2 py-1.5',
      md: 'px-2 py-2',
      lg: 'px-3 py-3'
    };

    const variantClass = variants[this.variant()];
    const sizeClass = sizes[this.size()];

    return `${baseClasses} ${variantClass} ${sizeClass}`;
  });

  protected dropdownMenuClasses = computed(() => {
    return 'absolute right-0 top-full mt-1 min-w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 py-1';
  });

  protected menuItemClasses = (action: SplitButtonAction) => {
    const baseClasses = 'w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 transition-colors duration-200 flex items-center';
    const disabledClasses = action.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

    return `${baseClasses} ${disabledClasses}`;
  };

  protected handleMainAction(): void {
    if (!this.disabled()) {
      this.mainAction.emit();
    }
  }

  protected toggleDropdown(): void {
    if (!this.disabled()) {
      this.isOpen.update(open => !open);
    }
  }

  protected handleActionClick(action: SplitButtonAction): void {
    if (!action.disabled) {
      this.isOpen.set(false);
      this.actionSelected.emit(action);
    }
  }

  protected handleDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const component = (event.currentTarget as HTMLElement);

    if (!component.contains(target)) {
      this.isOpen.set(false);
    }
  }
}
