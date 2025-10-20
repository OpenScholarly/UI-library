import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/**
 * An empty state component for displaying placeholder content when no data is available.
 * 
 * ## Features
 * - Customizable illustration/icon
 * - Title and description text
 * - Primary and secondary action buttons
 * - Multiple size variants
 * - Full ARIA support
 * - WCAG 2.1 Level AA compliant
 * - Dark mode support
 * 
 * @example
 * ```html
 * <!-- Basic empty state -->
 * <ui-empty-state
 *   icon="📭"
 *   title="No messages"
 *   description="You don't have any messages yet.">
 * </ui-empty-state>
 * 
 * <!-- Empty state with action -->
 * <ui-empty-state
 *   icon="📝"
 *   title="No posts yet"
 *   description="Get started by creating your first post."
 *   primaryActionLabel="Create Post"
 *   (primaryAction)="createPost()">
 * </ui-empty-state>
 * 
 * <!-- Empty state with both actions -->
 * <ui-empty-state
 *   icon="🔍"
 *   title="No results found"
 *   description="Try adjusting your search or filter criteria."
 *   primaryActionLabel="Clear Filters"
 *   secondaryActionLabel="Reset Search"
 *   (primaryAction)="clearFilters()"
 *   (secondaryAction)="resetSearch()">
 * </ui-empty-state>
 * 
 * <!-- Custom content with slot -->
 * <ui-empty-state
 *   title="No data available"
 *   description="Start by importing your data.">
 *   <div class="mt-4">
 *     <ui-button variant="primary">Import Data</ui-button>
 *   </div>
 * </ui-empty-state>
 * ```
 */
@Component({
  selector: 'ui-empty-state',
  template: `
    <div 
      [class]="containerClasses()"
      role="status"
      [attr.aria-label]="ariaLabel() || title() || 'Empty state'">
      
      @if (icon() || illustration()) {
        <div [class]="iconWrapperClasses()">
          @if (illustration()) {
            <div [innerHTML]="illustration()"></div>
          } @else if (icon()) {
            <span [class]="iconClasses()" [innerHTML]="icon()" aria-hidden="true"></span>
          }
        </div>
      }

      @if (title()) {
        <h3 [class]="titleClasses()">
          {{ title() }}
        </h3>
      }

      @if (description()) {
        <p [class]="descriptionClasses()">
          {{ description() }}
        </p>
      }

      @if (primaryActionLabel() || secondaryActionLabel()) {
        <div [class]="actionsWrapperClasses()">
          @if (primaryActionLabel()) {
            <button
              type="button"
              [class]="primaryButtonClasses()"
              (click)="primaryAction.emit()">
              {{ primaryActionLabel() }}
            </button>
          }
          @if (secondaryActionLabel()) {
            <button
              type="button"
              [class]="secondaryButtonClasses()"
              (click)="secondaryAction.emit()">
              {{ secondaryActionLabel() }}
            </button>
          }
        </div>
      }

      <div class="mt-4">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-empty-state block'
  }
})
export class EmptyStateComponent {
  /**
   * Emoji or simple icon to display.
   * @default undefined
   */
  icon = input<string>();

  /**
   * HTML content for custom illustration.
   * @default undefined
   */
  illustration = input<string>();

  /**
   * Title text.
   * @default undefined
   */
  title = input<string>();

  /**
   * Description text.
   * @default undefined
   */
  description = input<string>();

  /**
   * Label for primary action button.
   * @default undefined
   */
  primaryActionLabel = input<string>();

  /**
   * Label for secondary action button.
   * @default undefined
   */
  secondaryActionLabel = input<string>();

  /**
   * Size variant of the empty state.
   * - `sm`: Compact
   * - `md`: Standard (default)
   * - `lg`: Large
   * @default "md"
   */
  size = input<'sm' | 'md' | 'lg'>('md');

  /**
   * ARIA label for the container.
   * @default undefined
   */
  ariaLabel = input<string>();

  /**
   * Emitted when the primary action button is clicked.
   * @event primaryAction
   */
  primaryAction = output<void>();

  /**
   * Emitted when the secondary action button is clicked.
   * @event secondaryAction
   */
  secondaryAction = output<void>();

  containerClasses = computed(() => {
    const base = 'flex flex-col items-center justify-center text-center';
    const padding = {
      sm: 'py-8 px-4',
      md: 'py-12 px-6',
      lg: 'py-16 px-8'
    };
    return `${base} ${padding[this.size()]}`;
  });

  iconWrapperClasses = computed(() => {
    const size = {
      sm: 'mb-3',
      md: 'mb-4',
      lg: 'mb-6'
    };
    return size[this.size()];
  });

  iconClasses = computed(() => {
    const size = {
      sm: 'text-4xl',
      md: 'text-6xl',
      lg: 'text-8xl'
    };
    return `${size[this.size()]} opacity-60`;
  });

  titleClasses = computed(() => {
    const size = {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl'
    };
    const spacing = {
      sm: 'mb-1',
      md: 'mb-2',
      lg: 'mb-3'
    };
    return `${size[this.size()]} ${spacing[this.size()]} font-semibold text-gray-900 dark:text-gray-100`;
  });

  descriptionClasses = computed(() => {
    const size = {
      sm: 'text-sm max-w-xs',
      md: 'text-base max-w-sm',
      lg: 'text-lg max-w-md'
    };
    return `${size[this.size()]} text-gray-600 dark:text-gray-400`;
  });

  actionsWrapperClasses = computed(() => {
    const spacing = {
      sm: 'mt-4',
      md: 'mt-6',
      lg: 'mt-8'
    };
    return `${spacing[this.size()]} flex items-center gap-3`;
  });

  primaryButtonClasses = computed(() => {
    const size = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-2.5 text-lg'
    };
    return `${size[this.size()]} bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;
  });

  secondaryButtonClasses = computed(() => {
    const size = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-2.5 text-lg'
    };
    return `${size[this.size()]} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2`;
  });
}
