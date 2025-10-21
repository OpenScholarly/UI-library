import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

/**
 * A placeholder component for displaying when no data is available.
 * 
 * ## Features
 * - Custom illustration/icon support
 * - Title and description text
 * - Primary and secondary action buttons
 * - Three size variants (sm, md, lg)
 * - Accessible status role with proper ARIA labels
 * - WCAG 2.1 Level AA compliant
 * - Dark mode support
 * 
 * @example
 * ```html
 * <!-- Basic empty state -->
 * <ui-empty-state
 *   icon="📭"
 *   title="No messages yet"
 *   description="Get started by creating your first message."
 *   primaryActionLabel="Create Message"
 *   (primaryAction)="createMessage()">
 * </ui-empty-state>
 * 
 * <!-- Empty state with secondary action -->
 * <ui-empty-state
 *   icon="🔍"
 *   title="No results found"
 *   description="Try adjusting your search terms."
 *   primaryActionLabel="Clear Filters"
 *   secondaryActionLabel="View All"
 *   (primaryAction)="clearFilters()"
 *   (secondaryAction)="viewAll()">
 * </ui-empty-state>
 * ```
 */
@Component({
  selector: 'ui-empty-state',
  imports: [CommonModule],
  template: `
    <div
      [class]="containerClasses()"
      role="status"
      [attr.aria-label]="ariaLabel()">
      
      <!-- Icon/Illustration -->
      @if (icon()) {
        <div [class]="iconClasses()">
          {{ icon() }}
        </div>
      }

      <!-- Title -->
      @if (title()) {
        <h3 [class]="titleClasses()">{{ title() }}</h3>
      }

      <!-- Description -->
      @if (description()) {
        <p [class]="descriptionClasses()">{{ description() }}</p>
      }

      <!-- Content slot -->
      <ng-content />

      <!-- Actions -->
      @if (primaryActionLabel() || secondaryActionLabel()) {
        <div [class]="actionsClasses()">
          @if (primaryActionLabel()) {
            <button
              type="button"
              (click)="onPrimaryAction()"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              [attr.aria-label]="primaryActionLabel()">
              {{ primaryActionLabel() }}
            </button>
          }
          
          @if (secondaryActionLabel()) {
            <button
              type="button"
              (click)="onSecondaryAction()"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              [attr.aria-label]="secondaryActionLabel()">
              {{ secondaryActionLabel() }}
            </button>
          }
        </div>
      }
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  /**
   * Icon or illustration to display (emoji or custom content).
   */
  icon = input<string>();

  /**
   * Title text for the empty state.
   */
  title = input<string>();

  /**
   * Description text explaining the empty state.
   */
  description = input<string>();

  /**
   * Label for the primary action button.
   */
  primaryActionLabel = input<string>();

  /**
   * Label for the secondary action button.
   */
  secondaryActionLabel = input<string>();

  /**
   * Size variant of the empty state.
   * @default "md"
   */
  size = input<EmptyStateSize>('md');

  /**
   * ARIA label for accessibility.
   * @default "No content available"
   */
  ariaLabel = input<string>('No content available');

  /**
   * Emitted when the primary action button is clicked.
   */
  primaryAction = output<void>();

  /**
   * Emitted when the secondary action button is clicked.
   */
  secondaryAction = output<void>();

  containerClasses = computed(() => {
    const base = 'flex flex-col items-center justify-center text-center';
    const sizes: Record<EmptyStateSize, string> = {
      sm: 'py-8 px-4 gap-2',
      md: 'py-12 px-6 gap-3',
      lg: 'py-16 px-8 gap-4'
    };
    return `${base} ${sizes[this.size()]}`;
  });

  iconClasses = computed(() => {
    const base = 'flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800';
    const sizes: Record<EmptyStateSize, string> = {
      sm: 'w-12 h-12 text-2xl',
      md: 'w-16 h-16 text-4xl',
      lg: 'w-20 h-20 text-5xl'
    };
    return `${base} ${sizes[this.size()]}`;
  });

  titleClasses = computed(() => {
    const base = 'font-semibold text-gray-900 dark:text-gray-100';
    const sizes: Record<EmptyStateSize, string> = {
      sm: 'text-base',
      md: 'text-lg',
      lg: 'text-xl'
    };
    return `${base} ${sizes[this.size()]}`;
  });

  descriptionClasses = computed(() => {
    const base = 'text-gray-600 dark:text-gray-400 max-w-md';
    const sizes: Record<EmptyStateSize, string> = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    };
    return `${base} ${sizes[this.size()]}`;
  });

  actionsClasses = computed(() => {
    const base = 'flex flex-wrap items-center justify-center';
    const sizes: Record<EmptyStateSize, string> = {
      sm: 'gap-2 mt-4',
      md: 'gap-3 mt-6',
      lg: 'gap-4 mt-8'
    };
    return `${base} ${sizes[this.size()]}`;
  });

  onPrimaryAction(): void {
    this.primaryAction.emit();
  }

  onSecondaryAction(): void {
    this.secondaryAction.emit();
  }
}
