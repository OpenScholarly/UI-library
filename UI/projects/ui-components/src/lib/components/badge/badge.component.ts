import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type BadgeShape = 'rounded' | 'pill' | 'square';

@Component({
  selector: 'ui-badge',
  template: `
    <span [class]="badgeClasses()" [attr.aria-label]="ariaLabel()">
      @if (dot()) {
        <span class="badge-dot" [class]="dotClasses()"></span>
      }
      <ng-content />
      @if (dismissible()) {
        <button
          type="button"
          class="badge-dismiss ml-1 hover:bg-black/10 rounded-full p-0.5 ui-transition-fast ui-focus-primary"
          (click)="onDismiss()"
          aria-label="Remove badge">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      }
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  variant = input<BadgeVariant>('default');
  size = input<BadgeSize>('md');
  shape = input<BadgeShape>('rounded');
  dot = input(false);
  dismissible = input(false);
  ariaLabel = input<string>('');

  dismissed = output<void>();

  protected badgeClasses = computed(() => {
    const baseClasses = 'inline-flex items-center font-medium ui-transition-standard';
    
    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-sm'
    };

    const shapeClasses = {
      rounded: 'rounded',
      pill: 'rounded-full',
      square: 'rounded-none'
    };

    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      primary: 'bg-primary-100 text-primary-800 hover:bg-primary-200',
      secondary: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
      success: 'bg-green-100 text-green-800 hover:bg-green-200',
      warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      danger: 'bg-red-100 text-red-800 hover:bg-red-200',
      info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
    };

    const dismissibleClasses = this.dismissible() ? 'pr-1' : '';

    return `${baseClasses} ${sizeClasses[this.size()]} ${shapeClasses[this.shape()]} ${variantClasses[this.variant()]} ${dismissibleClasses}`;
  });

  protected dotClasses = computed(() => {
    const baseClasses = 'inline-block rounded-full mr-1.5';
    
    const sizeClasses = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5'
    };

    const colorClasses = {
      default: 'bg-gray-400',
      primary: 'bg-primary-500',
      secondary: 'bg-gray-400',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      info: 'bg-blue-500',
      outline: 'bg-gray-400'
    };

    return `${baseClasses} ${sizeClasses[this.size()]} ${colorClasses[this.variant()]}`;
  });

  protected onDismiss(): void {
    this.dismissed.emit();
  }
}