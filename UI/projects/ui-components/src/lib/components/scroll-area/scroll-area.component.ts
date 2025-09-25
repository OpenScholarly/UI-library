import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ScrollAreaDirection = 'vertical' | 'horizontal' | 'both';
export type ScrollAreaSize = 'sm' | 'md' | 'lg' | 'full';

@Component({
  selector: 'ui-scroll-area',
  template: `
    <div [class]="containerClasses()">
      <div [class]="scrollClasses()">
        <ng-content />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollAreaComponent {
  direction = input<ScrollAreaDirection>('vertical');
  size = input<ScrollAreaSize>('md');
  maxHeight = input<string>('');
  maxWidth = input<string>('');
  showScrollbar = input(true);
  rounded = input(true);

  protected containerClasses = computed(() => {
    const baseClasses = 'relative';
    const roundedClass = this.rounded() ? 'rounded-md' : '';
    
    return `${baseClasses} ${roundedClass}`.trim();
  });

  protected scrollClasses = computed(() => {
    const baseClasses = 'scroll-smooth';
    
    const directionClasses = {
      vertical: 'overflow-y-auto overflow-x-hidden',
      horizontal: 'overflow-x-auto overflow-y-hidden',
      both: 'overflow-auto'
    };

    const sizeClasses = {
      sm: 'max-h-32',
      md: 'max-h-48',
      lg: 'max-h-64',
      full: 'h-full'
    };

    const scrollbarClasses = this.showScrollbar() 
      ? 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800' 
      : 'scrollbar-hide';

    const directionClass = directionClasses[this.direction()];
    const sizeClass = this.maxHeight() ? '' : sizeClasses[this.size()];
    
    // Apply custom max height/width if provided
    const customStyles = [];
    if (this.maxHeight()) {
      customStyles.push(`max-height: ${this.maxHeight()}`);
    }
    if (this.maxWidth()) {
      customStyles.push(`max-width: ${this.maxWidth()}`);
    }

    return `${baseClasses} ${directionClass} ${sizeClass} ${scrollbarClasses}`.trim();
  });
}