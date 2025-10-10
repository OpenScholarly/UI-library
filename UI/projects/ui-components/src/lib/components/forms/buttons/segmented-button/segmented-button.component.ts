import { ChangeDetectionStrategy, Component, computed, input, output, signal, OnInit, effect } from '@angular/core';
import { SegmentedButtonOption, SegmentedButtonSize, SegmentedButtonVariant } from '../../../../types';

/**
 * A versatile and accessible segmented button component for single-choice selection.
 *
 * ## Features
 * - Single selection from multiple options
 * - Multiple visual variants (default, filled, outlined)
 * - Comprehensive size options (sm, md, lg)
 * - Icon support for each option
 * - Disabled option handling
 * - Allow empty selection option
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 * - Smooth selection animations
 *
 * @example
 * ```html
 * <!-- Basic segmented button -->
 * <ui-segmented-button
 *   [options]="viewOptions"
 *   (valueChange)="onViewChange($event)">
 * </ui-segmented-button>
 *
 * <!-- With icons -->
 * <ui-segmented-button
 *   [options]="[
 *     { value: 'list', label: 'List', icon: '☰' },
 *     { value: 'grid', label: 'Grid', icon: '⊞' },
 *     { value: 'card', label: 'Card', icon: '▭' }
 *   ]"
 *   value="list">
 * </ui-segmented-button>
 *
 * <!-- Filled variant -->
 * <ui-segmented-button
 *   [options]="alignOptions"
 *   variant="filled"
 *   size="lg">
 * </ui-segmented-button>
 *
 * <!-- With disabled options -->
 * <ui-segmented-button
 *   [options]="[
 *     { value: 'edit', label: 'Edit' },
 *     { value: 'delete', label: 'Delete', disabled: true }
 *   ]">
 * </ui-segmented-button>
 *
 * <!-- Allow deselection -->
 * <ui-segmented-button
 *   [options]="filterOptions"
 *   [allowEmpty]="true">
 * </ui-segmented-button>
 * ```
 */
@Component({
  selector: 'ui-segmented-button',
  standalone: true,
  template: `
    <div [class]="containerClasses()" role="group" [attr.aria-label]="ariaLabel()">
      @for (option of options(); track option.value) {
        <button
          [class]="buttonClasses(option)"
          [disabled]="option.disabled || disabled()"
          [attr.aria-pressed]="isSelected(option.value)"
          (click)="selectOption(option.value)"
          type="button">
          @if (option.icon) {
            <span class="mr-2">{{ option.icon }}</span>
          }
          {{ option.label }}
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SegmentedButtonComponent implements OnInit {
  /**
   * Array of options to display as segments.
   * @required
   * @example [{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }]
   */
  options = input.required<SegmentedButtonOption[]>();
  
  /**
   * Currently selected value.
   * @default ""
   * @example "left"
   */
  value = input<string>('');
  
  /**
   * Size of the segmented button.
   * - `sm`: Small
   * - `md`: Medium (default)
   * - `lg`: Large
   * @default "md"
   */
  size = input<SegmentedButtonSize>('md');
  
  /**
   * Visual style variant of the segmented button.
   * - `default`: Standard with borders
   * - `filled`: Filled background for selected
   * - `outlined`: Prominent outlined style
   * @default "default"
   */
  variant = input<SegmentedButtonVariant>('default');
  
  /**
   * Disables the entire segmented button.
   * @default false
   */
  disabled = input(false);
  
  /**
   * Allows deselecting the current option by clicking it again.
   * @default false
   */
  allowEmpty = input(false);
  
  /**
   * ARIA label for the button group.
   * @default ""
   * @example "View mode selection"
   */
  ariaLabel = input<string>('');

  /**
   * Emitted when the selected value changes.
   * Provides the selected value string.
   * @event valueChange
   */
  valueChange = output<string>();
  
  /**
   * Emitted when the selection changes.
   * Provides the selected option object or null.
   * @event selectionChange
   */
  selectionChange = output<SegmentedButtonOption | null>();

  private selectedValue = signal('');

  constructor() {
    // Sync internal state when input value changes
    effect(() => {
      this.selectedValue.set(this.value());
    });
  }

  protected containerClasses = computed(() => {
    const baseClasses = 'inline-flex rounded-md';

    const variantClasses = {
      default: 'bg-gray-100 dark:bg-gray-800 p-1',
      filled: 'border border-gray-300 dark:border-gray-600 overflow-hidden rounded-md',
      outlined: 'border border-gray-300 dark:border-gray-600 overflow-hidden rounded-md'
    };

    const variantClass = variantClasses[this.variant()];
    return `${baseClasses} ${variantClass}`;
  });

  protected buttonClasses = (option: SegmentedButtonOption) => {
    const baseClasses = 'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1';

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-sm',
      md: 'px-4 py-2 text-sm rounded-md',
      lg: 'px-6 py-3 text-base rounded-lg'
    };

    const isSelected = this.isSelected(option.value);
    const isDisabled = option.disabled || this.disabled();

    let variantClasses = '';
    if (this.variant() === 'default') {
      variantClasses = isSelected
        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
        : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';
    } else if (this.variant() === 'filled') {
      variantClasses = isSelected
        ? 'bg-primary-600 text-white'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700';
    } else { // outlined
      variantClasses = isSelected
        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-700'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700';
    }

    const disabledClasses = isDisabled
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer';

    const sizeClass = sizeClasses[this.size()];

    return `${baseClasses} ${sizeClass} ${variantClasses} ${disabledClasses}`;
  };

  protected isSelected(value: string): boolean {
    return this.selectedValue() === value;
  }

  protected selectOption(value: string): void {
    if (this.disabled()) return;

    const currentValue = this.selectedValue();
    const newValue = currentValue === value && this.allowEmpty() ? '' : value;

    this.selectedValue.set(newValue);

    const selectedOption = this.options().find(opt => opt.value === newValue) || null;

    this.valueChange.emit(newValue);
    this.selectionChange.emit(selectedOption);
  }

  ngOnInit() {
    this.selectedValue.set(this.value());
  }
}
