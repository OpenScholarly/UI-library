import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glass';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled()"
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
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  disabled = input(false);
  fullWidth = input(false);

  clicked = output<void>();

  protected buttonClasses = computed(() => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium ui-transition-standard ui-focus-primary disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary: 'bg-primary-500 text-text-on-primary hover:bg-primary-600 active:bg-primary-700',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
      outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100',
      ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
      destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 ui-focus-danger',
      glass: 'ui-glass text-white hover:bg-white/20 active:bg-white/30 backdrop-blur-md'
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm gap-1.5',
      md: 'h-10 px-4 py-2 gap-2',
      lg: 'h-11 px-8 text-base gap-2.5'
    };

    const variantClass = variants[this.variant()];
    const sizeClass = sizes[this.size()];

    return `${baseClasses} ${variantClass} ${sizeClass}`;
  });

  protected hostClasses = computed(() =>
    this.fullWidth() ? 'w-full' : ''
  );

  protected handleClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
