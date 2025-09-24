import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChipVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
export type ChipSize = 'xs' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-chip',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'ui-chip inline-flex items-center',
    '[class]': 'chipClasses()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[attr.role]': 'clickable() ? "button" : null',
    '[attr.tabindex]': 'clickable() && !disabled() ? "0" : null',
    '[attr.aria-disabled]': 'disabled()',
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeydown($event)'
  },
  template: `
    <!-- Leading Icon/Avatar -->
    @if (leadingIcon() || avatar()) {
      <span class="ui-chip__leading flex-shrink-0" [class]="getLeadingClasses()">
        @if (avatar()) {
          <img 
            [src]="avatar()" 
            [alt]="avatarAlt()"
            class="ui-chip__avatar rounded-full object-cover"
            [class]="getAvatarClasses()">
        } @else if (leadingIcon()) {
          <span class="ui-chip__icon" [innerHTML]="leadingIcon()"></span>
        }
      </span>
    }

    <!-- Label -->
    <span class="ui-chip__label font-medium truncate" [class]="getLabelClasses()">
      {{ label() }}
    </span>

    <!-- Badge/Count -->
    @if (badge() !== null && badge() !== undefined) {
      <span class="ui-chip__badge ml-1 px-1.5 py-0.5 text-xs font-semibold rounded-full" [class]="getBadgeClasses()">
        {{ badge() }}
      </span>
    }

    <!-- Trailing Icon -->
    @if (trailingIcon()) {
      <span class="ui-chip__trailing flex-shrink-0" [class]="getTrailingClasses()">
        <span class="ui-chip__icon" [innerHTML]="trailingIcon()"></span>
      </span>
    }

    <!-- Dismiss Button -->
    @if (dismissible() && !disabled()) {
      <button
        type="button"
        class="ui-chip__dismiss flex-shrink-0 ml-1 p-0.5 rounded-full transition-colors duration-200"
        [class]="getDismissClasses()"
        [attr.aria-label]="'Remove ' + label()"
        (click)="onDismiss($event)">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    }
  `
})
export class ChipComponent {
  // Inputs
  label = input.required<string>();
  variant = input<ChipVariant>('default');
  size = input<ChipSize>('md');
  disabled = input<boolean>(false);
  clickable = input<boolean>(false);
  dismissible = input<boolean>(false);
  leadingIcon = input<string>('');
  trailingIcon = input<string>('');
  avatar = input<string>('');
  avatarAlt = input<string>('');
  badge = input<number | string | null>(null);

  // Outputs
  click = output<Event>();
  dismiss = output<Event>();

  // Computed properties
  chipClasses = computed(() => {
    const classes: string[] = [
      'ui-chip',
      'inline-flex',
      'items-center',
      'font-medium',
      'transition-all',
      'duration-200'
    ];

    // Size classes
    switch (this.size()) {
      case 'xs':
        classes.push('px-2', 'py-0.5', 'text-xs', 'rounded');
        break;
      case 'sm':
        classes.push('px-2.5', 'py-0.5', 'text-xs', 'rounded-md');
        break;
      case 'lg':
        classes.push('px-3', 'py-1.5', 'text-sm', 'rounded-lg');
        break;
      default: // md
        classes.push('px-3', 'py-1', 'text-sm', 'rounded-md');
    }

    // Variant classes
    switch (this.variant()) {
      case 'primary':
        classes.push(
          'bg-primary-100',
          'text-primary-800',
          'dark:bg-primary-900/20',
          'dark:text-primary-300'
        );
        break;
      case 'secondary':
        classes.push(
          'bg-gray-100',
          'text-gray-800',
          'dark:bg-gray-800',
          'dark:text-gray-300'
        );
        break;
      case 'success':
        classes.push(
          'bg-green-100',
          'text-green-800',
          'dark:bg-green-900/20',
          'dark:text-green-300'
        );
        break;
      case 'warning':
        classes.push(
          'bg-yellow-100',
          'text-yellow-800',
          'dark:bg-yellow-900/20',
          'dark:text-yellow-300'
        );
        break;
      case 'danger':
        classes.push(
          'bg-red-100',
          'text-red-800',
          'dark:bg-red-900/20',
          'dark:text-red-300'
        );
        break;
      case 'info':
        classes.push(
          'bg-blue-100',
          'text-blue-800',
          'dark:bg-blue-900/20',
          'dark:text-blue-300'
        );
        break;
      case 'outline':
        classes.push(
          'bg-transparent',
          'text-gray-700',
          'dark:text-gray-300',
          'border',
          'border-gray-300',
          'dark:border-gray-600'
        );
        break;
      default: // default
        classes.push(
          'bg-gray-100',
          'text-gray-700',
          'dark:bg-gray-800',
          'dark:text-gray-300'
        );
    }

    // Interactive states
    if (this.clickable() && !this.disabled()) {
      classes.push('cursor-pointer');
      
      switch (this.variant()) {
        case 'primary':
          classes.push('hover:bg-primary-200', 'dark:hover:bg-primary-900/30');
          break;
        case 'secondary':
          classes.push('hover:bg-gray-200', 'dark:hover:bg-gray-700');
          break;
        case 'success':
          classes.push('hover:bg-green-200', 'dark:hover:bg-green-900/30');
          break;
        case 'warning':
          classes.push('hover:bg-yellow-200', 'dark:hover:bg-yellow-900/30');
          break;
        case 'danger':
          classes.push('hover:bg-red-200', 'dark:hover:bg-red-900/30');
          break;
        case 'info':
          classes.push('hover:bg-blue-200', 'dark:hover:bg-blue-900/30');
          break;
        case 'outline':
          classes.push('hover:bg-gray-50', 'dark:hover:bg-gray-800');
          break;
        default:
          classes.push('hover:bg-gray-200', 'dark:hover:bg-gray-700');
      }
    }

    // Disabled state
    if (this.disabled()) {
      classes.push('opacity-50', 'cursor-not-allowed');
    }

    // Focus ring
    if (this.clickable() && !this.disabled()) {
      classes.push(
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary-500',
        'focus:ring-offset-2',
        'dark:focus:ring-offset-gray-900'
      );
    }

    return classes.join(' ');
  });

  // Methods
  onClick(event: Event): void {
    if (this.disabled() || !this.clickable()) return;
    this.click.emit(event);
  }

  onDismiss(event: Event): void {
    event.stopPropagation(); // Prevent triggering click on chip
    if (this.disabled()) return;
    this.dismiss.emit(event);
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.clickable() || this.disabled()) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onClick(event);
    }
  }

  getLeadingClasses(): string {
    const classes: string[] = [];

    switch (this.size()) {
      case 'xs':
        classes.push('mr-1');
        break;
      case 'sm':
        classes.push('mr-1.5');
        break;
      case 'lg':
        classes.push('mr-2');
        break;
      default:
        classes.push('mr-1.5');
    }

    return classes.join(' ');
  }

  getTrailingClasses(): string {
    const classes: string[] = [];

    switch (this.size()) {
      case 'xs':
        classes.push('ml-1');
        break;
      case 'sm':
        classes.push('ml-1.5');
        break;
      case 'lg':
        classes.push('ml-2');
        break;
      default:
        classes.push('ml-1.5');
    }

    return classes.join(' ');
  }

  getAvatarClasses(): string {
    const classes: string[] = [];

    switch (this.size()) {
      case 'xs':
        classes.push('w-3', 'h-3');
        break;
      case 'sm':
        classes.push('w-4', 'h-4');
        break;
      case 'lg':
        classes.push('w-6', 'h-6');
        break;
      default:
        classes.push('w-5', 'h-5');
    }

    return classes.join(' ');
  }

  getLabelClasses(): string {
    const classes: string[] = [];

    // Add any label-specific styling if needed
    
    return classes.join(' ');
  }

  getBadgeClasses(): string {
    const classes: string[] = [];

    // Badge background based on variant
    switch (this.variant()) {
      case 'primary':
        classes.push('bg-primary-200', 'text-primary-900', 'dark:bg-primary-800', 'dark:text-primary-100');
        break;
      case 'secondary':
        classes.push('bg-gray-200', 'text-gray-900', 'dark:bg-gray-700', 'dark:text-gray-100');
        break;
      case 'success':
        classes.push('bg-green-200', 'text-green-900', 'dark:bg-green-800', 'dark:text-green-100');
        break;
      case 'warning':
        classes.push('bg-yellow-200', 'text-yellow-900', 'dark:bg-yellow-800', 'dark:text-yellow-100');
        break;
      case 'danger':
        classes.push('bg-red-200', 'text-red-900', 'dark:bg-red-800', 'dark:text-red-100');
        break;
      case 'info':
        classes.push('bg-blue-200', 'text-blue-900', 'dark:bg-blue-800', 'dark:text-blue-100');
        break;
      default:
        classes.push('bg-gray-200', 'text-gray-900', 'dark:bg-gray-700', 'dark:text-gray-100');
    }

    return classes.join(' ');
  }

  getDismissClasses(): string {
    const classes: string[] = [];

    switch (this.variant()) {
      case 'primary':
        classes.push('hover:bg-primary-200', 'dark:hover:bg-primary-800', 'text-primary-600', 'dark:text-primary-400');
        break;
      case 'secondary':
        classes.push('hover:bg-gray-200', 'dark:hover:bg-gray-700', 'text-gray-600', 'dark:text-gray-400');
        break;
      case 'success':
        classes.push('hover:bg-green-200', 'dark:hover:bg-green-800', 'text-green-600', 'dark:text-green-400');
        break;
      case 'warning':
        classes.push('hover:bg-yellow-200', 'dark:hover:bg-yellow-800', 'text-yellow-600', 'dark:text-yellow-400');
        break;
      case 'danger':
        classes.push('hover:bg-red-200', 'dark:hover:bg-red-800', 'text-red-600', 'dark:text-red-400');
        break;
      case 'info':
        classes.push('hover:bg-blue-200', 'dark:hover:bg-blue-800', 'text-blue-600', 'dark:text-blue-400');
        break;
      default:
        classes.push('hover:bg-gray-200', 'dark:hover:bg-gray-700', 'text-gray-600', 'dark:text-gray-400');
    }

    return classes.join(' ');
  }
}