import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ImageFit, ImageRounded } from '../../../types';

@Component({
  selector: 'ui-image',
  standalone: true,
  template: `
    <div [class]="containerClasses()">
      @if (showImage()) {
        <img
          [class]="imageClasses()"
          [src]="src()"
          [alt]="alt()"
          [loading]="loading()"
          [width]="width()"
          [height]="height()"
          (load)="onLoad()"
          (error)="onError()"
        />
      }

      @if (showPlaceholder()) {
        <div [class]="placeholderClasses()">
          <ng-content select="[slot=placeholder]">
            <div class="flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </ng-content>
        </div>
      }

      @if (showError()) {
        <div [class]="errorClasses()">
          <ng-content select="[slot=error]">
            <div class="flex items-center justify-center text-red-500">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </ng-content>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent {
  src = input.required<string>();
  alt = input<string>('');
  width = input<string | number>('');
  height = input<string | number>('');
  fit = input<ImageFit>('cover');
  rounded = input<ImageRounded>('md');
  loading = input<'lazy' | 'eager'>('lazy');
  placeholder = input<string>('');

  loaded = output<void>();
  error = output<void>();

  private isLoaded = signal(false);
  private hasError = signal(false);

  protected showImage = computed(() => this.isLoaded() && !this.hasError());
  protected showPlaceholder = computed(() => !this.isLoaded() && !this.hasError());
  protected showError = computed(() => this.hasError());

  protected containerClasses = computed(() => {
    const baseClasses = 'relative overflow-hidden bg-gray-100 dark:bg-gray-800';

    const roundedClasses = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full'
    };

    const roundedClass = roundedClasses[this.rounded()];

    return `${baseClasses} ${roundedClass}`;
  });

  protected imageClasses = computed(() => {
    const baseClasses = 'w-full h-full';

    const fitClasses = {
      contain: 'object-contain',
      cover: 'object-cover',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down'
    };

    const fitClass = fitClasses[this.fit()];

    return `${baseClasses} ${fitClass}`;
  });

  protected placeholderClasses = computed(() => {
    return 'absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800';
  });

  protected errorClasses = computed(() => {
    return 'absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800';
  });

  protected onLoad(): void {
    this.isLoaded.set(true);
    this.hasError.set(false);
    this.loaded.emit();
  }

  protected onError(): void {
    this.isLoaded.set(false);
    this.hasError.set(true);
    this.error.emit();
  }
}
