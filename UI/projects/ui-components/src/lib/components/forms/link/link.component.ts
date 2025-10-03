import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LinkVariant, LinkSize } from '../../../types';

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
  href = input<string>('#');
  target = input<'_self' | '_blank' | '_parent' | '_top'>('_self');
  rel = input<string>('');
  variant = input<LinkVariant>('default');
  size = input<LinkSize>('md');
  disabled = input(false);
  underline = input<'none' | 'hover' | 'always'>('hover');
  external = input(false);

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
