import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

@Component({
  selector: 'ui-container',
  template: `
    <div [class]="containerClasses()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContainerComponent {
  size = input<ContainerSize>('lg');
  padding = input<'none' | 'sm' | 'md' | 'lg'>('md');
  centerContent = input(true);

  protected containerClasses = computed(() => {
    const baseClasses = 'w-full';

    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-md', 
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      '2xl': 'max-w-7xl',
      full: 'max-w-full'
    };

    const paddings = {
      none: '',
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8'
    };

    const centerClass = this.centerContent() ? 'mx-auto' : '';
    const sizeClass = sizes[this.size()];
    const paddingClass = paddings[this.padding()];

    return `${baseClasses} ${sizeClass} ${paddingClass} ${centerClass}`.trim();
  });
}