import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'solid' | 'dashed' | 'dotted';

@Component({
  selector: 'ui-divider',
  standalone: true,
  template: `
    <div [class]="dividerClasses()" [attr.aria-orientation]="orientation()">
      <ng-content select="[slot=label]" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerComponent {
  orientation = input<DividerOrientation>('horizontal');
  variant = input<DividerVariant>('solid');
  thickness = input<'thin' | 'medium' | 'thick'>('thin');
  color = input<'gray' | 'primary' | 'secondary'>('gray');
  spacing = input<'none' | 'sm' | 'md' | 'lg'>('md');

  protected dividerClasses = computed(() => {
    const baseClasses = 'flex items-center';

    const orientationClasses = {
      horizontal: 'w-full',
      vertical: 'h-full flex-col'
    };

    const variantClasses = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted'
    };

    const thicknessClasses = {
      thin: this.orientation() === 'horizontal' ? 'border-t' : 'border-l',
      medium: this.orientation() === 'horizontal' ? 'border-t-2' : 'border-l-2',
      thick: this.orientation() === 'horizontal' ? 'border-t-4' : 'border-l-4'
    };

    const colorClasses = {
      gray: 'border-gray-300',
      primary: 'border-primary-500',
      secondary: 'border-gray-500'
    };

    const spacingClasses = {
      none: '',
      sm: this.orientation() === 'horizontal' ? 'my-2' : 'mx-2',
      md: this.orientation() === 'horizontal' ? 'my-4' : 'mx-4',
      lg: this.orientation() === 'horizontal' ? 'my-6' : 'mx-6'
    };

    const orientationClass = orientationClasses[this.orientation()];
    const variantClass = variantClasses[this.variant()];
    const thicknessClass = thicknessClasses[this.thickness()];
    const colorClass = colorClasses[this.color()];
    const spacingClass = spacingClasses[this.spacing()];

    return `${baseClasses} ${orientationClass} ${variantClass} ${thicknessClass} ${colorClass} ${spacingClass}`;
  });
}
