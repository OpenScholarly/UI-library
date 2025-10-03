import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { AvatarSize, AvatarShape, AvatarStatus } from '../../../types';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  template: `
    <div [class]="wrapperClasses()">
      <div [class]="avatarClasses()" [attr.aria-label]="getAriaLabel()">
        @if (src() && !imageError()) {
          <img
            [src]="src()"
            [alt]="alt() || name() || 'Avatar'"
            [class]="imageClasses()"
            (error)="onImageError()"
            (load)="onImageLoad()"
          />
        } @else if (name()) {
          <span [class]="initialsClasses()">
            {{ getInitials() }}
          </span>
        } @else {
          <!-- Default avatar icon -->
          <svg [class]="iconClasses()" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
      </div>

      @if (status()) {
        <div [class]="statusClasses()" [attr.aria-label]="getStatusLabel()">
          <div [class]="statusDotClasses()"></div>
        </div>
      }

      @if (badge()) {
        <div [class]="badgeClasses()">
          {{ badge() }}
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarComponent {
  src = input<string>('');
  alt = input<string>('');
  name = input<string>('');
  size = input<AvatarSize>('md');
  shape = input<AvatarShape>('circle');
  status = input<AvatarStatus | null>(null);
  badge = input<string | number>('');
  loading = input<'lazy' | 'eager'>('lazy');

  protected imageError = signal(false);

  protected wrapperClasses = computed(() => {
    return 'relative inline-block';
  });

  protected avatarClasses = computed(() => {
    const baseClasses = 'flex items-center justify-center overflow-hidden bg-gray-100 text-gray-600';

    const sizeClasses = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
      '2xl': 'w-20 h-20 text-2xl'
    };

    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-none',
      rounded: 'rounded-lg'
    };

    return `${baseClasses} ${sizeClasses[this.size()]} ${shapeClasses[this.shape()]}`;
  });

  protected imageClasses = computed(() => {
    const baseClasses = 'w-full h-full object-cover';
    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-none',
      rounded: 'rounded-lg'
    };

    return `${baseClasses} ${shapeClasses[this.shape()]}`;
  });

  protected initialsClasses = computed(() => {
    return 'font-medium select-none';
  });

  protected iconClasses = computed(() => {
    const sizeClasses = {
      xs: 'w-4 h-4',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-7 h-7',
      xl: 'w-10 h-10',
      '2xl': 'w-12 h-12'
    };

    return `${sizeClasses[this.size()]}`;
  });

  protected statusClasses = computed(() => {
    const baseClasses = 'absolute flex items-center justify-center bg-white rounded-full';

    const positionClasses = {
      xs: 'w-2 h-2 -bottom-0 -right-0',
      sm: 'w-2.5 h-2.5 -bottom-0 -right-0',
      md: 'w-3 h-3 -bottom-0.5 -right-0.5',
      lg: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
      xl: 'w-4 h-4 -bottom-1 -right-1',
      '2xl': 'w-5 h-5 -bottom-1 -right-1'
    };

    return `${baseClasses} ${positionClasses[this.size()]}`;
  });

  protected statusDotClasses = computed(() => {
    const baseClasses = 'rounded-full';

    const sizeClasses = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
      xl: 'w-3 h-3',
      '2xl': 'w-3.5 h-3.5'
    };

    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
      dnd: 'bg-red-500'
    };

    const statusColor = this.status() ? statusColors[this.status()!] : '';

    return `${baseClasses} ${sizeClasses[this.size()]} ${statusColor}`;
  });

  protected badgeClasses = computed(() => {
    const baseClasses = 'absolute flex items-center justify-center bg-red-500 text-white text-xs font-medium rounded-full min-w-0';

    const positionClasses = {
      xs: 'w-4 h-4 -top-1 -right-1',
      sm: 'w-4 h-4 -top-1 -right-1',
      md: 'w-5 h-5 -top-1.5 -right-1.5',
      lg: 'w-5 h-5 -top-1.5 -right-1.5',
      xl: 'w-6 h-6 -top-2 -right-2',
      '2xl': 'w-7 h-7 -top-2 -right-2'
    };

    return `${baseClasses} ${positionClasses[this.size()]}`;
  });

  protected getInitials(): string {
    if (!this.name()) return '';

    const names = this.name().trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  protected getAriaLabel(): string {
    if (this.name()) {
      return `Avatar for ${this.name()}`;
    }
    if (this.alt()) {
      return this.alt();
    }
    return 'Avatar';
  }

  protected getStatusLabel(): string {
    const statusLabels = {
      online: 'Online',
      offline: 'Offline',
      away: 'Away',
      busy: 'Busy',
      dnd: 'Do not disturb'
    };

    return this.status() ? statusLabels[this.status()!] : '';
  }

  protected onImageError(): void {
    this.imageError.set(true);
  }

  protected onImageLoad(): void {
    this.imageError.set(false);
  }
}
