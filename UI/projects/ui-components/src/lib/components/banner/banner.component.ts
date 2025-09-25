import { Component, input, output, computed } from '@angular/core';
import { NgClass } from '@angular/common';

export interface BannerAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  handler?: () => void;
}

@Component({
  selector: 'ui-banner',
  imports: [NgClass],
  template: `
    <div [class]="containerClasses()" role="banner" [attr.aria-live]="dismissible() ? 'polite' : 'off'">
      <div class="flex items-start gap-3">
        @if (icon()) {
          <div [class]="iconClasses()">
            <span class="text-lg">{{ icon() }}</span>
          </div>
        }
        
        <div class="flex-1 min-w-0">
          @if (title()) {
            <h3 [class]="titleClasses()">
              {{ title() }}
            </h3>
          }
          @if (message()) {
            <p [class]="messageClasses()">
              {{ message() }}
            </p>
          }
          
          @if (actions() && actions().length > 0) {
            <div class="flex items-center gap-3 mt-3">
              @for (action of actions(); track action.label) {
                <button
                  type="button"
                  [class]="actionClasses(action.variant || 'secondary')"
                  (click)="handleAction(action)"
                >
                  {{ action.label }}
                </button>
              }
            </div>
          }
        </div>
        
        @if (dismissible()) {
          <button
            type="button"
            class="flex-shrink-0 p-1 text-current hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
            (click)="onDismiss.emit()"
            [attr.aria-label]="dismissLabel() || 'Dismiss banner'"
          >
            <span class="text-lg">✕</span>
          </button>
        }
      </div>
    </div>
  `,
  host: {
    'class': 'ui-banner block'
  }
})
export class BannerComponent {
  title = input<string>();
  message = input<string>();
  icon = input<string>();
  variant = input<'info' | 'success' | 'warning' | 'error' | 'neutral'>('info');
  size = input<'sm' | 'md' | 'lg'>('md');
  dismissible = input<boolean>(false);
  dismissLabel = input<string>();
  actions = input<BannerAction[]>([]);
  
  onDismiss = output<void>();
  onAction = output<BannerAction>();

  containerClasses = computed(() => [
    'px-4 py-3 rounded-lg border transition-colors',
    {
      // Info variant
      'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200': this.variant() === 'info',
      // Success variant
      'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200': this.variant() === 'success',
      // Warning variant
      'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200': this.variant() === 'warning',
      // Error variant
      'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200': this.variant() === 'error',
      // Neutral variant
      'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200': this.variant() === 'neutral',
      // Sizes
      'px-3 py-2': this.size() === 'sm',
      'px-4 py-3': this.size() === 'md',
      'px-6 py-4': this.size() === 'lg'
    }
  ]);

  iconClasses = computed(() => [
    'flex-shrink-0 mt-0.5',
    {
      'mt-0': this.size() === 'sm',
      'mt-0.5': this.size() === 'md',
      'mt-1': this.size() === 'lg'
    }
  ]);

  titleClasses = computed(() => [
    'font-semibold text-current',
    {
      'text-sm': this.size() === 'sm',
      'text-base': this.size() === 'md',
      'text-lg': this.size() === 'lg'
    }
  ]);

  messageClasses = computed(() => [
    'text-current',
    {
      'text-xs': this.size() === 'sm',
      'text-sm': this.size() === 'md',
      'text-base': this.size() === 'lg',
      'mt-1': this.title()
    }
  ]);

  actionClasses = (actionVariant: string) => {
    const baseClasses = [
      'px-3 py-1.5 rounded font-medium text-sm transition-colors border',
      {
        'px-2 py-1 text-xs': this.size() === 'sm',
        'px-3 py-1.5 text-sm': this.size() === 'md',
        'px-4 py-2 text-base': this.size() === 'lg'
      }
    ];

    const variantClasses = {
      primary: this.getPrimaryActionClasses(),
      secondary: this.getSecondaryActionClasses(),
      ghost: this.getGhostActionClasses()
    };

    return [...baseClasses, variantClasses[actionVariant as keyof typeof variantClasses]];
  };

  private getPrimaryActionClasses() {
    switch (this.variant()) {
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white border-green-600';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600';
      case 'error':
        return 'bg-red-600 hover:bg-red-700 text-white border-red-600';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600';
    }
  }

  private getSecondaryActionClasses() {
    switch (this.variant()) {
      case 'info':
        return 'bg-blue-100 dark:bg-blue-800 hover:bg-blue-200 dark:hover:bg-blue-700 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600';
      case 'success':
        return 'bg-green-100 dark:bg-green-800 hover:bg-green-200 dark:hover:bg-green-700 text-green-800 dark:text-green-200 border-green-300 dark:border-green-600';
      case 'warning':
        return 'bg-amber-100 dark:bg-amber-800 hover:bg-amber-200 dark:hover:bg-amber-700 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-600';
      case 'error':
        return 'bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-200 border-red-300 dark:border-red-600';
      default:
        return 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600';
    }
  }

  private getGhostActionClasses() {
    return 'bg-transparent hover:bg-current hover:bg-opacity-10 text-current border-current';
  }

  handleAction(action: BannerAction) {
    if (action.handler) {
      action.handler();
    }
    this.onAction.emit(action);
  }
}