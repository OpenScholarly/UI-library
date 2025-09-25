import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type IconButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glass';
export type IconButtonSize = 'sm' | 'md' | 'lg';
export type IconButtonShape = 'square' | 'rounded' | 'circle';

@Component({
  selector: 'ui-icon-button',
  standalone: true,
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      [attr.title]="tooltip()"
      (click)="handleClick()"
      type="button">
      <ng-content />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()'
  }
})
export class IconButtonComponent {
  variant = input<IconButtonVariant>('primary');
  size = input<IconButtonSize>('md');
  shape = input<IconButtonShape>('rounded');
  disabled = input(false);
  ariaLabel = input<string>('');
  tooltip = input<string>('');
  loading = input(false);

  clicked = output<void>();

  protected buttonClasses = computed(() => {
    const baseClasses = 'inline-flex items-center justify-center ui-transition-standard ui-focus-primary disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary: 'bg-primary-500 text-text-on-primary hover:bg-primary-600 active:bg-primary-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
      outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100',
      ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
      destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 ui-focus-danger',
      glass: 'ui-glass text-white hover:bg-white/20 active:bg-white/30 backdrop-blur-md'
    };

    const sizes = {
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg'
    };

    const shapes = {
      square: 'rounded-none',
      rounded: 'rounded-md',
      circle: 'rounded-full'
    };

    const variantClass = variants[this.variant()];
    const sizeClass = sizes[this.size()];
    const shapeClass = shapes[this.shape()];
    const loadingClass = this.loading() ? 'cursor-wait' : '';

    return `${baseClasses} ${variantClass} ${sizeClass} ${shapeClass} ${loadingClass}`;
  });

  protected hostClasses = computed(() => {
    return this.loading() ? 'relative' : '';
  });

  protected handleClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.clicked.emit();
    }
  }
}
