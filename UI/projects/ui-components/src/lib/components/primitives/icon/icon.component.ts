import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type IconVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';

@Component({
  selector: 'ui-icon',
  standalone: true,
  template: `
    <svg
      [class]="iconClasses()"
      [attr.width]="sizeValue()"
      [attr.height]="sizeValue()"
      [attr.viewBox]="viewBox()"
      [attr.fill]="fill()"
      [attr.stroke]="stroke()"
      [attr.stroke-width]="strokeWidth()"
      [attr.aria-hidden]="ariaHidden()"
      [attr.role]="role()">
      <ng-content />
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  name = input<string>('');
  size = input<IconSize>('md');
  variant = input<IconVariant>('default');
  viewBox = input('0 0 24 24');
  fill = input('none');
  stroke = input('currentColor');
  strokeWidth = input('2');
  ariaHidden = input(true);
  role = input<string | null>(null);

  protected sizeValue = computed(() => {
    const sizes = {
      xs: '12',
      sm: '16',
      md: '20',
      lg: '24',
      xl: '32',
      '2xl': '48'
    };
    return sizes[this.size()];
  });

  protected iconClasses = computed(() => {
    const baseClasses = 'inline-block';

    const variantClasses = {
      default: 'text-gray-600 dark:text-gray-400',
      primary: 'text-primary-600 dark:text-primary-400',
      secondary: 'text-gray-500 dark:text-gray-500',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400'
    };

    const variantClass = variantClasses[this.variant()];

    return `${baseClasses} ${variantClass}`;
  });
}
