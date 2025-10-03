import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ButtonGroupOrientation, ButtonGroupSize, ButtonGroupVariant } from '../../../../types';

@Component({
  selector: 'ui-button-group',
  standalone: true,
  template: `
    <div [class]="groupClasses()" role="group" [attr.aria-label]="ariaLabel()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonGroupComponent {
  orientation = input<ButtonGroupOrientation>('horizontal');
  size = input<ButtonGroupSize>('md');
  variant = input<ButtonGroupVariant>('default');
  spacing = input<'none' | 'sm' | 'md'>('sm');
  fullWidth = input(false);
  ariaLabel = input<string>('');

  protected groupClasses = computed(() => {
    const baseClasses = 'inline-flex p-2 m-0';

    const orientationClasses = {
      horizontal: 'flex-row',
      vertical: 'flex-col'
    };

    const variantClasses = {
      default: '[&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child)]:-ml-px',
      contained: 'bg-white border border-gray-300 rounded-md overflow-hidden [&>*]:border-0 [&>*]:rounded-none [&>*:not(:last-child)]:border-r [&>*:not(:last-child)]:border-gray-300',
      outlined: 'border border-gray-300 rounded-md overflow-hidden [&>*]:border-0 [&>*]:rounded-none'
    };

    const spacingClasses = {
      none: '',
      sm: this.orientation() === 'horizontal' ? 'gap-1' : 'gap-1',
      md: this.orientation() === 'horizontal' ? 'gap-2' : 'gap-2'
    };

    const orientationClass = orientationClasses[this.orientation()];
    const variantClass = this.spacing() === 'none' ? variantClasses[this.variant()] : '';
    const spacingClass = spacingClasses[this.spacing()];
    const fullWidthClass = this.fullWidth() ? 'w-full [&>*]:flex-1' : '';

    // Vertical orientation adjustments for connected buttons
    const verticalAdjustments = this.orientation() === 'vertical' && this.spacing() === 'none'
      ? '[&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child)]:-mt-px'
      : '';

    return `${baseClasses} ${orientationClass} ${variantClass} ${spacingClass} ${fullWidthClass} ${verticalAdjustments}`.trim();
  });
}
