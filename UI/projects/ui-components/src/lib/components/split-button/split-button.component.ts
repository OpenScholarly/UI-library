import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

export interface SplitButtonAction {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
}

export type SplitButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type SplitButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-split-button',
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
  mainLabel = input.required<string>();
  mainIcon = input<string>('');
  actions = input.required<SplitButtonAction[]>();
  variant = input<SplitButtonVariant>('primary');
  size = input<SplitButtonSize>('md');
  disabled = input(false);

  mainAction = output<void>();
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