import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AvatarComponent } from './avatar.component';

/**
 * An avatar group component for displaying multiple avatars in a stack.
 * 
 * ## Features
 * - Stack multiple avatars with overlap
 * - Configurable max display count with overflow indicator
 * - Hover effects and animations
 * - Tooltip support for each avatar
 * - Multiple size variants matching avatar sizes
 * - Responsive spacing
 * - Full ARIA support
 * - WCAG 2.1 Level AA compliant
 * - Dark mode support
 * 
 * @example
 * ```html
 * <!-- Basic avatar group -->
 * <ui-avatar-group
 *   [avatars]="[
 *     { name: 'John Doe', src: '/john.jpg' },
 *     { name: 'Jane Smith', src: '/jane.jpg' },
 *     { name: 'Bob Johnson' }
 *   ]">
 * </ui-avatar-group>
 * 
 * <!-- Avatar group with max count -->
 * <ui-avatar-group
 *   [avatars]="userList"
 *   [max]="3"
 *   [showOverflow]="true">
 * </ui-avatar-group>
 * 
 * <!-- Large size with custom spacing -->
 * <ui-avatar-group
 *   [avatars]="teamMembers"
 *   size="lg"
 *   [spacing]="-12">
 * </ui-avatar-group>
 * ```
 */
@Component({
  selector: 'ui-avatar-group',
  imports: [AvatarComponent],
  template: `
    <div 
      [class]="containerClasses()"
      role="group"
      [attr.aria-label]="ariaLabel() || 'Avatar group'">
      
      @for (avatar of displayedAvatars(); track avatar.name; let idx = $index) {
        <div 
          [class]="avatarWrapperClasses(idx)"
          [attr.title]="avatar.name">
          <ui-avatar
            [name]="avatar.name"
            [src]="avatar.src ?? ''"
            [alt]="avatar.alt ?? ''"
            [size]="size()"
            [shape]="shape()"
            [status]="avatar.status ?? null">
          </ui-avatar>
        </div>
      }

      @if (showOverflow() && remainingCount() > 0) {
        <div 
          [class]="overflowAvatarClasses()"
          [attr.title]="getOverflowTitle()">
          <div [class]="overflowContentClasses()">
            +{{ remainingCount() }}
          </div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ui-avatar-group inline-block'
  }
})
export class AvatarGroupComponent {
  /**
   * Array of avatar data objects.
   * @default []
   */
  avatars = input<Array<{
    name: string;
    src?: string;
    alt?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  }>>([]);

  /**
   * Maximum number of avatars to display.
   * Remaining avatars shown as overflow count.
   * @default undefined (show all)
   */
  max = input<number>();

  /**
   * Whether to show overflow count indicator.
   * @default true
   */
  showOverflow = input<boolean>(true);

  /**
   * Size of all avatars in the group.
   * @default "md"
   */
  size = input<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md');

  /**
   * Shape of all avatars in the group.
   * @default "circle"
   */
  shape = input<'circle' | 'square' | 'rounded'>('circle');

  /**
   * Overlap spacing in pixels (negative value).
   * @default -8
   */
  spacing = input<number>(-8);

  /**
   * ARIA label for the group.
   * @default "Avatar group"
   */
  ariaLabel = input<string>();

  displayedAvatars = computed(() => {
    const max = this.max();
    if (max && max > 0) {
      return this.avatars().slice(0, max);
    }
    return this.avatars();
  });

  remainingCount = computed(() => {
    const max = this.max();
    if (max && this.avatars().length > max) {
      return this.avatars().length - max;
    }
    return 0;
  });

  containerClasses = computed(() => 'flex items-center -space-x-2 hover:space-x-0 transition-all');

  avatarWrapperClasses = (index: number) => {
    const base = 'relative transition-all duration-200 ease-in-out';
    const zIndex = `z-${10 - index}`;
    const border = 'ring-2 ring-white dark:ring-gray-900';
    const hover = 'hover:scale-110 hover:z-50';
    return `${base} ${zIndex} ${border} ${hover} rounded-full`;
  };

  overflowAvatarClasses = computed(() => {
    const base = 'relative flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium';
    const sizes = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
      '2xl': 'w-20 h-20 text-xl'
    };
    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-none',
      rounded: 'rounded-lg'
    };
    const border = 'ring-2 ring-white dark:ring-gray-900';
    const hover = 'hover:scale-110 hover:z-50 transition-transform cursor-pointer';
    
    return `${base} ${sizes[this.size()]} ${shapeClasses[this.shape()]} ${border} ${hover}`;
  });

  overflowContentClasses = computed(() => 'select-none');

  getOverflowTitle(): string {
    const count = this.remainingCount();
    return `${count} more ${count === 1 ? 'person' : 'people'}`;
  }
}
