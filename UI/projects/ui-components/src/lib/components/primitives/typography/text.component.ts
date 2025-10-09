import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TextSize, TextWeight, TextVariant } from '../../../types';

/**
 * A flexible, theme-aware text primitive for inline and block textual content.
 *
 * Features
 * - Size and weight presets aligned with the design system
 * - Variants: body, caption, overline, code
 * - Theme-aware color tokens (primary, secondary, muted, success, warning, error)
 * - Utility toggles: truncate, italic, underline
 * - Optimized for accessibility and readable defaults
 *
 * Examples
 * ```html
 * <ui-text size="sm" color="secondary">Secondary small text</ui-text>
 * <ui-text variant="overline" weight="medium">OVERLINE LABEL</ui-text>
 * <ui-text variant="code">const x = 42;</ui-text>
 * <ui-text [truncate]="true" style="max-width: 12rem">Will be truncated...</ui-text>
 * ```
 */
@Component({
  selector: 'ui-text',
  standalone: true,
  template: `
    <ng-content />
  `,
  host: {
    'class': 'ui-text inline',
    '[class]': 'textClasses()'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextComponent {
  /** Size of the text. */
  size = input<TextSize>('md');
  /** Font weight preset. */
  weight = input<TextWeight>('normal');
  /** Visual variant: body, caption, overline, code. */
  variant = input<TextVariant>('body');
  /** Theme-aware color token. */
  color = input<'default' | 'inherit' | 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error'>('default');
  /** Truncate the text with ellipsis when it overflows (requires max-width). */
  truncate = input(false);
  /** Render italic text. */
  italic = input(false);
  /** Underline the text. */
  underline = input(false);
  /** Additional Tailwind classes to merge. */
  customClasses = input<string>('');

  protected textClasses = computed(() => {
    // Base font family uses Tailwind's font-sans mapping to CSS var(--font-family-base)
    const isCode = this.variant() === 'code';
    const baseClasses = isCode ? 'font-mono' : 'font-sans';

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
      caption: 'text-xs text-text-secondary dark:text-text-secondary',
      overline: 'text-xs uppercase tracking-wider text-text-secondary dark:text-text-secondary',
      code: 'bg-surface-light dark:bg-surface-dark px-1 py-0.5 rounded text-sm'
    };

    const colorClasses = {
      default: 'text-gray-900 dark:text-white',
      inherit: 'text-inherit dark:text-inherit',
      primary: 'text-text-primary dark:text-text-primary',
      secondary: 'text-text-secondary dark:text-text-secondary',
      muted: 'text-text-disabled dark:text-text-disabled',
      success: 'text-success dark:text-success',
      warning: 'text-warning dark:text-warning',
      error: 'text-danger dark:text-danger'
    };

    const sizeClass = sizeClasses[this.size()];
    const weightClass = weightClasses[this.weight()];
    const variantClass = variantClasses[this.variant()];
    const colorClass = colorClasses[this.color()];
    const truncateClass = this.truncate() ? 'truncate' : '';
    const italicClass = this.italic() ? 'italic' : '';
    const underlineClass = this.underline() ? 'underline' : '';

    return [
      baseClasses,
      sizeClass,
      weightClass,
      variantClass,
      colorClass,
      truncateClass,
      italicClass,
      underlineClass,
      this.customClasses()
    ].filter(Boolean).join(' ');
  });
}
