import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgStyle } from '@angular/common';
import { ContainerSize } from '../../../types';

@Component({
  selector: 'ui-container',
  standalone: true,
  imports: [NgStyle],
  template: `
    <div [class]="containerClasses()" [ngStyle]="containerStyles()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * A flexible and customizable container component for layout and styling.
 *
 * ## Features
 * - Responsive design with predefined size breakpoints
 * - Customizable padding, margins, and spacing
 * - Support for various background styles (colors, gradients, images)
 * - Built-in flexbox utilities for content alignment
 * - Border customization (width, radius, color, style)
 * - Advanced visual effects (shadows, backdrop filters, opacity)
 * - CSS transitions and animations support
 * - Overflow and positioning controls
 *
 * @example
 * ```html
 * <!-- Basic centered container -->
 * <ui-container size="lg" centerContent="true">
 *   <p>Centered content</p>
 * </ui-container>
 *
 * <!-- Glass effect container with blur -->
 * <ui-container
 *   backdrop="blur"
 *   backdropIntensity="md"
 *   background="rgba(255, 255, 255, 0.1)"
 *   borderRadius="lg"
 *   boxShadow="xl">
 *   <p>Glass morphism effect</p>
 * </ui-container>
 *
 * <!-- Stacked vertical layout with gap -->
 * <ui-container
 *   stack="true"
 *   gap="md"
 *   alignItems="center"
 *   padding="lg">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </ui-container>
 * ```
 */
export class ContainerComponent {
  /**
   * Predefined responsive size breakpoints for the container max-width.
   * - `sm`: 640px
   * - `md`: 768px
   * - `lg`: 1024px (default)
   * - `xl`: 1280px
   * - `2xl`: 1536px
   * - `full`: 100% width
   * 
   * Ignored when `maxWidth` is set.
   */
  size = input<ContainerSize>('lg');
  
  /**
   * Makes the container take the full height of its parent element.
   * Applies `h-full` class when enabled.
   * @default false
   */
  fullHeight = input(false);
  
  /**
   * Custom max-width value (e.g., "800px", "80%", "50rem").
   * When set, overrides the predefined `size` property.
   * @default null
   */
  maxWidth = input<string | null>(null);

  /**
   * Horizontally centers the container using auto margins.
   * Applies `mx-auto` class when enabled.
   * @default true
   */
  centerContent = input(true);
  
  /**
   * Internal padding size applied to all sides.
   * - `none`: No padding
   * - `sm`: 4px horizontal, 2px vertical
   * - `md`: 6px horizontal, 3px vertical (default)
   * - `lg`: 8px horizontal, 4px vertical
   * @default "md"
   */
  padding = input<'none' | 'sm' | 'md' | 'lg'>('md');
  
  /**
   * Vertical alignment of flex items (cross-axis alignment).
   * Only applies when container uses flexbox layout.
   * @default "start"
   */
  alignItems = input<'start' | 'center' | 'end' | 'stretch'>('start');
  
  /**
   * Horizontal alignment of flex items (main-axis alignment).
   * Only applies when container uses flexbox layout.
   * @default "start"
   */
  justifyContent = input<'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'>('start');
  
  /**
   * Background styling for the container.
   * Accepts:
   * - Color values: `"#ffffff"`, `"rgb(255, 255, 255)"`, `"var(--color-primary)"`
   * - Gradients: `"linear-gradient(to right, #fff, #000)"`
   * - Images: `"url('/path/to/image.jpg')"` or direct URL
   * @default null
   */
  background = input<string | null>(null);
  
  /**
   * Box shadow elevation level.
   * @default "none"
   */
  boxShadow = input<'none' | 'sm' | 'md' | 'lg' | 'xl'>('none');
  
  /**
   * Custom CSS transition properties (e.g., `"all 0.3s ease-in-out"`).
   * @default null
   */
  transition = input<string | null>(null);
  
  /**
   * Custom CSS animation properties (e.g., `"pulse 2s infinite"`).
   * @default null
   */
  animation = input<string | null>(null);
  
  /**
   * Backdrop filter effect type.
   * Requires `backdropIntensity` to be set to a value other than "none".
   * @default "none"
   */
  backdrop = input<'none' | 'blur' | 'brightness' | 'contrast' | 'grayscale' | 'hue-rotate' | 'invert' | 'opacity' | 'saturate' | 'sepia'>('none');
  
  /**
   * Intensity level for the backdrop filter effect.
   * Must be used in combination with the `backdrop` property.
   * @default "none"
   */
  backdropIntensity = input<'none' | 'sm' | 'md' | 'lg' | 'xl'>('none');
  
  /**
   * Opacity value for the entire container (0 to 1).
   * - `0`: Fully transparent
   * - `1`: Fully opaque (default)
   * @default 1
   */
  opacity = input<number>(1);
  
  /**
   * Border width preset.
   * @default "none"
   */
  borderWidth = input<'none' | 'sm' | 'md' | 'lg'>('none');
  
  /**
   * Border radius (corner rounding).
   * - `full`: Fully rounded (pill shape)
   * @default "none"
   */
  borderRadius = input<'none' | 'sm' | 'md' | 'lg' | 'full'>('none');
  
  /**
   * Custom border color (e.g., `"#000"`, `"rgb(0, 0, 0)"`, `"var(--color-border)"`).
   * Only applies when `borderWidth` is not "none".
   * @default null
   */
  borderColor = input<string | null>(null);
  
  /**
   * Border style type.
   * Only applies when `borderWidth` is not "none".
   * @default "solid"
   */
  borderStyle = input<'solid' | 'dashed' | 'dotted' | 'double' | 'none'>('solid');
  
  /**
   * Gap spacing between child elements.
   * Only applies when container uses flexbox layout.
   * @default "none"
   */
  gap = input<'none' | 'sm' | 'md' | 'lg' | 'xl'>('none');
  
  /**
   * Stacks children vertically using flex-direction column.
   * When false, uses default flex-row (horizontal layout).
   * @default false
   */
  stack = input(false);
  
  /**
   * Overflow behavior for content that exceeds container bounds.
   * @default "visible"
   */
  overflow = input<'visible' | 'hidden' | 'scroll' | 'auto'>('auto');
  
  /**
   * CSS positioning type for the container.
   * @default "static"
   */
  position = input<'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'>('static');

  protected containerClasses = computed(() => {
    const baseClasses = 'w-full';

    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-4xl',
      xl: 'max-w-6xl',
      '2xl': 'max-w-7xl',
      full: 'max-w-full'
    };

    const paddings = {
      none: '',
      sm: 'px-4 py-2',
      md: 'px-6 py-3',
      lg: 'px-8 py-4'
    };

    const bordersWidth = {
      none: '',
      sm: 'border',
      md: 'border-2',
      lg: 'border-4',
    };

    const bordersRadius = {
      none: '',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full'
    };

    const bordersStyle = {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
      double: 'border-double',
      none: 'border-none'
    };

    const shadows = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    };

    const alignItemsMap = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch'
    };

    const justifyContentMap = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly'
    };

    const gapMap = {
      none: '',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8'
    };

    const overflowMap = {
      visible: 'overflow-visible',
      hidden: 'overflow-hidden',
      scroll: 'overflow-scroll',
      auto: 'overflow-auto'
    };

    const positionMap = {
      static: 'static',
      relative: 'relative',
      absolute: 'absolute',
      fixed: 'fixed',
      sticky: 'sticky'
    };

    const backdropFilters: Record<string, Record<string, string>> = {
      blur: { none: '', sm: 'backdrop-blur-sm', md: 'backdrop-blur-md', lg: 'backdrop-blur-lg', xl: 'backdrop-blur-xl' },
      brightness: { none: '', sm: 'backdrop-brightness-90', md: 'backdrop-brightness-75', lg: 'backdrop-brightness-50', xl: 'backdrop-brightness-25' },
      contrast: { none: '', sm: 'backdrop-contrast-90', md: 'backdrop-contrast-75', lg: 'backdrop-contrast-50', xl: 'backdrop-contrast-25' },
      grayscale: { none: '', sm: 'backdrop-grayscale-[25%]', md: 'backdrop-grayscale-[50%]', lg: 'backdrop-grayscale-[75%]', xl: 'backdrop-grayscale' },
      'hue-rotate': { none: '', sm: 'backdrop-hue-rotate-15', md: 'backdrop-hue-rotate-30', lg: 'backdrop-hue-rotate-60', xl: 'backdrop-hue-rotate-90' },
      invert: { none: '', sm: 'backdrop-invert-[25%]', md: 'backdrop-invert-[50%]', lg: 'backdrop-invert-[75%]', xl: 'backdrop-invert' },
      opacity: { none: '', sm: 'backdrop-opacity-90', md: 'backdrop-opacity-75', lg: 'backdrop-opacity-50', xl: 'backdrop-opacity-25' },
      saturate: { none: '', sm: 'backdrop-saturate-150', md: 'backdrop-saturate-200', lg: 'backdrop-saturate-[250%]', xl: 'backdrop-saturate-[300%]' },
      sepia: { none: '', sm: 'backdrop-sepia-[25%]', md: 'backdrop-sepia-[50%]', lg: 'backdrop-sepia-[75%]', xl: 'backdrop-sepia' },
      none: { none: '', sm: '', md: '', lg: '', xl: '' }
    };

    const classes = [
      baseClasses,
      !this.maxWidth() ? sizes[this.size()] : '',
      paddings[this.padding()],
      this.centerContent() ? 'mx-auto' : '',
      bordersWidth[this.borderWidth()],
      bordersRadius[this.borderRadius()],
      this.borderWidth() !== 'none' ? bordersStyle[this.borderStyle()] : '',
      shadows[this.boxShadow()],
      this.fullHeight() ? 'h-full' : '',
      this.stack() ? 'flex flex-col' : 'flex',
      alignItemsMap[this.alignItems()],
      justifyContentMap[this.justifyContent()],
      gapMap[this.gap()],
      overflowMap[this.overflow()],
      positionMap[this.position()],
      this.backdrop() !== 'none' && this.backdropIntensity() !== 'none' 
        ? backdropFilters[this.backdrop()][this.backdropIntensity()] 
        : ''
    ];

    return classes.filter(Boolean).join(' ').trim();
  });

  protected containerStyles = computed(() => {
    const styles: Record<string, string> = {};

    if (this.maxWidth()) {
      styles['max-width'] = this.maxWidth()!;
    }

    if (this.background()) {
      // Handle gradient, color, or image URL
      const bg = this.background()!;
      if (bg.startsWith('linear-gradient') || bg.startsWith('radial-gradient') || bg.startsWith('conic-gradient')) {
        styles['background-image'] = bg;
      } else if (bg.startsWith('url(') || bg.startsWith('http')) {
        styles['background-image'] = bg.startsWith('url(') ? bg : `url(${bg})`;
        styles['background-size'] = 'cover';
        styles['background-position'] = 'center';
      } else {
        styles['background-color'] = bg;
      }
    }

    if (this.borderColor() && this.borderWidth() !== 'none') {
      styles['border-color'] = this.borderColor()!;
    }

    if (this.opacity() !== 1) {
      styles['opacity'] = this.opacity().toString();
    }

    if (this.transition()) {
      styles['transition'] = this.transition()!;
    }

    if (this.animation()) {
      styles['animation'] = this.animation()!;
    }

    return Object.keys(styles).length > 0 ? styles : null;
  });
}
