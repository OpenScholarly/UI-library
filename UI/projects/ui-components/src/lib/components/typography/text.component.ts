import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextVariant = 'body' | 'caption' | 'overline' | 'code';

@Component({
  selector: 'ui-text',
  standalone: true,
  template: `
    <span [class]="textClasses()">
      <ng-content />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextComponent {
  size = input<TextSize>('md');
  weight = input<TextWeight>('normal');
  variant = input<TextVariant>('body');
  color = input<'inherit' | 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error'>('inherit');
  truncate = input(false);
  italic = input(false);
  underline = input(false);

  protected textClasses = computed(() => {
    const baseClasses = '';

    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    };

    const weightClasses = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    };

    const variantClasses = {
      body: '',
      caption: 'text-xs text-gray-600 dark:text-gray-400',
      overline: 'text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400',
      code: 'font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm'
    };

    const colorClasses = {
      inherit: 'text-inherit',
      primary: 'text-gray-900 dark:text-white',
      secondary: 'text-gray-700 dark:text-gray-300',
      muted: 'text-gray-500 dark:text-gray-400',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400'
    };

    const sizeClass = sizeClasses[this.size()];
    const weightClass = weightClasses[this.weight()];
    const variantClass = variantClasses[this.variant()];
    const colorClass = colorClasses[this.color()];
    const truncateClass = this.truncate() ? 'truncate' : '';
    const italicClass = this.italic() ? 'italic' : '';
    const underlineClass = this.underline() ? 'underline' : '';

    return `${baseClasses} ${sizeClass} ${weightClass} ${variantClass} ${colorClass} ${truncateClass} ${italicClass} ${underlineClass}`.trim();
  });
}
