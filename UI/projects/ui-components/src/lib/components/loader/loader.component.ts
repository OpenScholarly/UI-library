import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type LoaderType = 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring';
export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type LoaderVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'ui-loader',
  template: `
    <div [class]="wrapperClasses()" [attr.aria-label]="ariaLabel()" role="status">
      @switch (type()) {
        @case ('spinner') {
          <svg [class]="spinnerClasses()" fill="none" viewBox="0 0 24 24">
            <circle 
              [class]="spinnerCircleClasses()" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              stroke-width="4">
            </circle>
            <path 
              [class]="spinnerPathClasses()" 
              fill="currentColor" 
              d="m12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6z">
            </path>
          </svg>
        }
        
        @case ('dots') {
          <div [class]="dotsContainerClasses()">
            <div [class]="dotClasses()" style="animation-delay: 0ms"></div>
            <div [class]="dotClasses()" style="animation-delay: 150ms"></div>
            <div [class]="dotClasses()" style="animation-delay: 300ms"></div>
          </div>
        }
        
        @case ('pulse') {
          <div [class]="pulseClasses()"></div>
        }
        
        @case ('bars') {
          <div [class]="barsContainerClasses()">
            <div [class]="barClasses()" style="animation-delay: 0ms"></div>
            <div [class]="barClasses()" style="animation-delay: 150ms"></div>
            <div [class]="barClasses()" style="animation-delay: 300ms"></div>
            <div [class]="barClasses()" style="animation-delay: 450ms"></div>
          </div>
        }
        
        @case ('ring') {
          <div [class]="ringClasses()">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        }
      }
      
      @if (label()) {
        <span [class]="labelClasses()">{{ label() }}</span>
      }
      
      <span class="sr-only">{{ screenReaderText() }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  type = input<LoaderType>('spinner');
  size = input<LoaderSize>('md');
  variant = input<LoaderVariant>('default');
  label = input<string>('');
  ariaLabel = input<string>('Loading');
  screenReaderText = input<string>('Loading, please wait...');
  center = input(false);

  protected wrapperClasses = computed(() => {
    const baseClasses = 'ui-loader inline-flex items-center gap-2';
    const centerClasses = this.center() ? 'justify-center w-full' : '';
    return `${baseClasses} ${centerClasses}`.trim();
  });

  // Spinner classes
  protected spinnerClasses = computed(() => {
    const baseClasses = 'animate-spin';
    const sizeClasses = this.getSizeClasses();
    const colorClasses = this.getColorClasses();
    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  });

  protected spinnerCircleClasses = computed(() => {
    return 'opacity-25';
  });

  protected spinnerPathClasses = computed(() => {
    return 'opacity-75';
  });

  // Dots classes
  protected dotsContainerClasses = computed(() => {
    const baseClasses = 'flex gap-1';
    return baseClasses;
  });

  protected dotClasses = computed(() => {
    const baseClasses = 'rounded-full animate-pulse';
    const sizeClasses = this.getDotSizeClasses();
    const colorClasses = this.getColorClasses();
    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  });

  // Pulse classes
  protected pulseClasses = computed(() => {
    const baseClasses = 'rounded-full animate-pulse';
    const sizeClasses = this.getPulseSizeClasses();
    const colorClasses = this.getColorClasses();
    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  });

  // Bars classes
  protected barsContainerClasses = computed(() => {
    const baseClasses = 'flex items-end gap-1';
    return baseClasses;
  });

  protected barClasses = computed(() => {
    const baseClasses = 'bg-current animate-pulse';
    const sizeClasses = this.getBarSizeClasses();
    const colorClasses = this.getColorClasses();
    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  });

  // Ring classes
  protected ringClasses = computed(() => {
    const baseClasses = 'relative';
    const sizeClasses = this.getRingSizeClasses();
    const colorClasses = this.getColorClasses();
    
    return `${baseClasses} ${sizeClasses} ${colorClasses}`;
  });

  // Label classes
  protected labelClasses = computed(() => {
    const baseClasses = 'text-sm font-medium';
    const colorClasses = this.getTextColorClasses();
    return `${baseClasses} ${colorClasses}`;
  });

  // Size utilities
  private getSizeClasses(): string {
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };
    return sizeClasses[this.size()];
  }

  private getDotSizeClasses(): string {
    const sizeClasses = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4'
    };
    return sizeClasses[this.size()];
  }

  private getPulseSizeClasses(): string {
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };
    return sizeClasses[this.size()];
  }

  private getBarSizeClasses(): string {
    const sizeClasses = {
      xs: 'w-0.5 h-3',
      sm: 'w-0.5 h-4',
      md: 'w-1 h-6',
      lg: 'w-1 h-8',
      xl: 'w-1.5 h-12'
    };
    return sizeClasses[this.size()];
  }

  private getRingSizeClasses(): string {
    const sizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12'
    };
    return sizeClasses[this.size()];
  }

  // Color utilities
  private getColorClasses(): string {
    const colorClasses = {
      default: 'text-gray-600',
      primary: 'text-primary-600',
      secondary: 'text-gray-500',
      success: 'text-green-600',
      warning: 'text-yellow-500',
      danger: 'text-red-600',
      info: 'text-blue-600'
    };
    return colorClasses[this.variant()];
  }

  private getTextColorClasses(): string {
    const colorClasses = {
      default: 'text-gray-700',
      primary: 'text-primary-700',
      secondary: 'text-gray-600',
      success: 'text-green-700',
      warning: 'text-yellow-600',
      danger: 'text-red-700',
      info: 'text-blue-700'
    };
    return colorClasses[this.variant()];
  }
}