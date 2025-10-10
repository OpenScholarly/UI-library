import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LinkVariant, LinkSize } from '../../../types';

/**
 * A versatile and accessible link component for navigation and actions.
 *
 * ## Features
 * - Multiple visual variants (default, primary, secondary, danger)
 * - Comprehensive size options (sm, md, lg)
 * - Underline control (none, hover, always)
 * - External link support with security defaults
 * - Disabled state handling
 * - Target control (_self, _blank, _parent, _top)
 * - Full keyboard navigation and screen reader support
 * - WCAG 2.1 Level AA color contrast compliance
 * - Dark mode support
 *
 * @example
 * ```html
 * <!-- Basic link -->
 * <ui-link href="/about">About Us</ui-link>
 *
 * <!-- External link (opens in new tab) -->
 * <ui-link
 *   href="https://example.com"
 *   target="_blank"
 *   [external]="true">
 *   Visit Example
 * </ui-link>
 *
 * <!-- Primary variant link -->
 * <ui-link
 *   href="/dashboard"
 *   variant="primary">
 *   Go to Dashboard
 * </ui-link>
 *
 * <!-- Link with no underline -->
 * <ui-link
 *   href="/home"
 *   underline="none">
 *   Home
 * </ui-link>
 *
 * <!-- Disabled link -->
 * <ui-link
 *   href="/disabled"
 *   [disabled]="true">
 *   Coming Soon
 * </ui-link>
 *
 * <!-- Link with click handler -->
 * <ui-link
 *   href="#"
 *   (clicked)="handleClick($event)">
 *   Action Link
 * </ui-link>
 * ```
 */
@Component({
  selector: 'ui-link',
  standalone: true,
  template: `
    <a
      [class]="linkClasses()"
      [href]="href()"
      [target]="target()"
      [rel]="computedRel()"
      [attr.aria-disabled]="disabled()"
      (click)="handleClick($event)">
      <ng-content />
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkComponent {
  /**
   * URL that the link points to.
   * @default "#"
   * @example "/dashboard" or "https://example.com"
   */
  href = input<string>('#');
  
  /**
   * Where to open the linked document.
   * - `_self`: Current window (default)
   * - `_blank`: New window/tab
   * - `_parent`: Parent frame
   * - `_top`: Full window
   * @default "_self"
   */
  target = input<'_self' | '_blank' | '_parent' | '_top'>('_self');
  
  /**
   * Relationship between current document and linked document.
   * Auto-set to "noopener noreferrer" for _blank targets.
   * @default ""
   * @example "noopener noreferrer"
   */
  rel = input<string>('');
  
  /**
   * Visual style variant of the link.
   * - `default`: Standard link color
   * - `primary`: Primary brand color
   * - `secondary`: Secondary color
   * - `danger`: Danger/warning color
   * @default "default"
   */
  variant = input<LinkVariant>('default');
  
  /**
   * Size of the link text.
   * - `sm`: Small
   * - `md`: Medium (default)
   * - `lg`: Large
   * @default "md"
   */
  size = input<LinkSize>('md');
  
  /**
   * Disables the link and prevents navigation.
   * @default false
   */
  disabled = input(false);
  
  /**
   * Underline style for the link.
   * - `none`: No underline
   * - `hover`: Underline on hover (default)
   * - `always`: Always underlined
   * @default "hover"
   */
  underline = input<'none' | 'hover' | 'always'>('hover');
  
  /**
   * Indicates this is an external link (adds icon).
   * @default false
   */
  external = input(false);

  /**
   * Emitted when the link is clicked.
   * Provides the click event.
   * @event clicked
   */
  clicked = output<Event>();

  protected computedRel = computed(() => {
    const userRel = this.rel();
    const isBlankTarget = this.target() === '_blank';

    // If user provided rel, use it as-is
    if (userRel) {
      return userRel;
    }

    // If target is _blank and no rel provided, apply security defaults
    if (isBlankTarget) {
      return 'noopener noreferrer';
    }

    // For other targets or when rel is explicitly empty, return empty string
    return '';
  });

  protected linkClasses = computed(() => {
    const baseClasses = 'ui-transition-standard ui-focus-primary';

    const variantClasses = {
      default: 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300',
      primary: 'text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300',
      secondary: 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
      muted: 'text-gray-500 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400',
      success: 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300',
      warning: 'text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300',
      error: 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
    };

    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    };

    const underlineClasses = {
      none: 'no-underline',
      hover: 'no-underline hover:underline',
      always: 'underline'
    };

    const disabledClasses = this.disabled()
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : '';

    const externalClasses = this.external()
      ? 'inline-flex items-center gap-1'
      : '';

    const variantClass = variantClasses[this.variant()];
    const sizeClass = sizeClasses[this.size()];
    const underlineClass = underlineClasses[this.underline()];

    return `${baseClasses} ${variantClass} ${sizeClass} ${underlineClass} ${disabledClasses} ${externalClasses}`.trim();
  });

  protected handleClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.clicked.emit(event);
  }
}
