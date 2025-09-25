import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type FabSize = 'sm' | 'md' | 'lg';
export type FabVariant = 'primary' | 'secondary' | 'extended';
export type FabPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'static';

@Component({
  selector: 'ui-fab',
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      [attr.title]="tooltip()"
      (click)="handleClick()"
      type="button">
      <ng-content select="[slot=icon]" />
      @if (variant() === 'extended' && label()) {
        <span class="ml-2">{{ label() }}</span>
      }
      <ng-content select="[slot=label]" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()'
  }
})
export class FabComponent {
  variant = input<FabVariant>('primary');
  size = input<FabSize>('md');
  position = input<FabPosition>('bottom-right');
  disabled = input(false);
  ariaLabel = input<string>('');
  tooltip = input<string>('');
  label = input<string>('');
  elevation = input<'none' | 'sm' | 'md' | 'lg'>('md');

  clicked = output<void>();

  protected buttonClasses = computed(() => {
    const baseClasses = 'inline-flex items-center justify-center rounded-full ui-transition-standard ui-focus-primary disabled:pointer-events-none disabled:opacity-50 font-medium';

    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
      secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
      extended: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 rounded-full'
    };

    const sizes = {
      sm: this.variant() === 'extended' ? 'h-10 px-4 gap-2' : 'h-10 w-10',
      md: this.variant() === 'extended' ? 'h-12 px-6 gap-3' : 'h-12 w-12',
      lg: this.variant() === 'extended' ? 'h-14 px-8 gap-4' : 'h-14 w-14'
    };

    const elevations = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg'
    };

    const variantClass = variants[this.variant()];
    const sizeClass = sizes[this.size()];
    const elevationClass = elevations[this.elevation()];

    return `${baseClasses} ${variantClass} ${sizeClass} ${elevationClass}`;
  });

  protected hostClasses = computed(() => {
    const positions = {
      'bottom-right': 'fixed bottom-4 right-4 z-50',
      'bottom-left': 'fixed bottom-4 left-4 z-50',
      'top-right': 'fixed top-4 right-4 z-50',
      'top-left': 'fixed top-4 left-4 z-50',
      'static': ''
    };

    return positions[this.position()];
  });

  protected handleClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}