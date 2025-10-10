import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ImageFit, ImageRounded } from '../../../types';

/**
 * A versatile and accessible image component with loading and error states.
 *
 * ## Features
 * - Multiple object-fit options (cover, contain, fill, etc.)
 * - Rounded corner options
 * - Loading states with placeholder
 * - Error handling with customizable error display
 * - Lazy loading support
 * - Aspect ratio control
 * - Dark mode support
 * - Full accessibility with alt text
 *
 * @example
 * ```html
 * <!-- Basic image -->
 * <ui-image
 *   src="/path/to/image.jpg"
 *   alt="Description">
 * </ui-image>
 *
 * <!-- Rounded image with cover -->
 * <ui-image
 *   src="/avatar.jpg"
 *   alt="User avatar"
 *   fit="cover"
 *   rounded="full">
 * </ui-image>
 *
 * <!-- With aspect ratio -->
 * <ui-image
 *   src="/banner.jpg"
 *   alt="Banner"
 *   aspectRatio="16:9">
 * </ui-image>
 *
 * <!-- Lazy loaded image -->
 * <ui-image
 *   src="/large-image.jpg"
 *   alt="Large image"
 *   loading="lazy">
 * </ui-image>
 *
 * <!-- With custom placeholder -->
 * <ui-image src="/image.jpg" alt="Image">
 *   <div slot="placeholder">Loading...</div>
 * </ui-image>
 *
 * <!-- With error handler -->
 * <ui-image
 *   src="/image.jpg"
 *   alt="Image"
 *   (error)="handleImageError($event)">
 * </ui-image>
 * ```
 */
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
  /**
   * Image source URL.
   * @required
   * @example "/images/photo.jpg" or "https://example.com/image.png"
   */
  src = input.required<string>();
  
  /**
   * Alternative text for accessibility.
   * @default ""
   * @example "User profile photo"
   */
  alt = input<string>('');
  
  /**
   * Width of the image.
   * @default ""
   * @example "300" or "100%"
   */
  width = input<string | number>('');
  
  /**
   * Height of the image.
   * @default ""
   * @example "200" or "auto"
   */
  height = input<string | number>('');
  
  /**
   * How the image should fit within its container.
   * - `cover`: Scales to cover container (default)
   * - `contain`: Scales to fit within container
   * - `fill`: Stretches to fill container
   * - `none`: Original size
   * - `scale-down`: Scales down if larger
   * @default "cover"
   */
  fit = input<ImageFit>('cover');
  
  /**
   * Border radius of the image.
   * - `none`: No rounding
   * - `sm`: Small rounding
   * - `md`: Medium rounding (default)
   * - `lg`: Large rounding
   * - `xl`: Extra large rounding
   * - `full`: Fully circular
   * @default "md"
   */
  rounded = input<ImageRounded>('md');
  
  /**
   * Native image loading strategy.
   * - `lazy`: Defers loading until visible (default)
   * - `eager`: Loads immediately
   * @default "lazy"
   */
  loading = input<'lazy' | 'eager'>('lazy');
  
  /**
   * Placeholder image URL or text.
   * @default ""
   */
  placeholder = input<string>('');

  /**
   * Emitted when the image finishes loading.
   * @event loaded
   */
  loaded = output<void>();
  
  /**
   * Emitted when the image fails to load.
   * @event error
   */
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
