import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { TextSize, TextWeight, TextVariant } from '../../../types';

/**
 * A versatile and accessible text component for inline and block content.
 *
 * ## Features
 * - Multiple size options (xs to xl)
 * - Weight control (thin to black)
 * - Visual variants (body, caption, overline, code)
 * - Theme-aware color variants
 * - Truncation with ellipsis
 * - Italic and underline options
 * - Custom class support
 * - Dark mode support
 * - WCAG 2.1 Level AA compliance
 *
 * @example
 * ```html
 * <!-- Basic body text -->
 * <ui-text>This is standard body text</ui-text>
 *
 * <!-- Small secondary text -->
 * <ui-text size="sm" color="secondary">
 *   Supporting information
 * </ui-text>
 *
 * <!-- Caption text -->
 * <ui-text variant="caption" color="muted">
 *   Figure 1: Chart showing data
 * </ui-text>
 *
 * <!-- Overline label -->
 * <ui-text variant="overline" weight="medium">
 *   CATEGORY
 * </ui-text>
 *
 * <!-- Inline code -->
 * <ui-text variant="code">const x = 42;</ui-text>
 *
 * <!-- Keyboard key -->
 * <ui-text variant="kbd">Ctrl</ui-text>
 *
 * <!-- Truncated text -->
 * <ui-text [truncate]="true" style="max-width: 200px">
 *   This is a long text that will be truncated with ellipsis
 * </ui-text>
 *
 * <!-- Colored text -->
 * <ui-text color="success">Success message</ui-text>
 * <ui-text color="error">Error message</ui-text>
 *
 * <!-- Styled text -->
 * <ui-text [italic]="true" [underline]="true">
 *   Emphasized text
 * </ui-text>
 * ```
 */
@Component({
  selector: 'ui-text',
  standalone: true,
  template: `<ng-content />`,
  host: {
    'class': 'ui-text',
    '[class]': 'textClasses()',
    '[attr.data-variant]': 'variant() === "kbd" ? "kbd" : null'
  },
  styles: [`
    :host([data-variant="kbd"]) {
      @apply px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-base font-mono inline-block;
      color: inherit;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextComponent {
  /**
   * Size of the text.
   * - `xs`: Extra small
   * - `sm`: Small
   * - `md`: Medium (default)
   * - `lg`: Large
   * - `xl`: Extra large
   * @default "md"
   */
  size = input<TextSize>('md');
  
  /**
   * Font weight of the text.
   * - `thin`: 100
   * - `light`: 300
   * - `normal`: 400 (default)
   * - `medium`: 500
   * - `semibold`: 600
   * - `bold`: 700
   * - `extrabold`: 800
   * - `black`: 900
   * @default "normal"
   */
  weight = input<TextWeight>('normal');
  
  /**
   * Visual variant of the text.
   * - `body`: Standard body text (default)
   * - `caption`: Smaller caption text
   * - `overline`: Uppercase overline label
   * - `code`: Monospace code text
   * - `kbd`: Keyboard key styling
   * @default "body"
   */
  variant = input<TextVariant>('body');
  
  /**
   * Display behavior of the text element.
   * - `block`: Renders as a block element (default), allowing vertical margins (mt/mb)
   * - `inline`: Renders inline, flowing with surrounding text
   * @default "block"
   */
  display = input<'block' | 'inline'>('block');

  /**
   * Color variant of the text.
   * - `default`: Standard text color
   * - `inherit`: Inherits from parent
   * - `primary`: Primary brand color
   * - `secondary`: Secondary color
   * - `muted`: Muted/dimmed text
   * - `success`: Success green
   * - `warning`: Warning yellow
   * - `error`: Error red
   * @default "default"
   */
  color = input<'default' | 'inherit' | 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error'>('default');
  
  /**
   * Truncate text with ellipsis when it overflows.
   * Requires a max-width to be set on the element.
   * @default false
   */
  truncate = input(false);
  
  /**
   * Renders text in italic style.
   * @default false
   */
  italic = input(false);
  
  /**
   * Underlines the text.
   * @default false
   */
  underline = input(false);
  
  /**
   * Additional Tailwind CSS classes to apply.
   * @default ""
   * @example "font-bold text-center"
   */
  customClasses = input<string>('');
  /**
   * Consumer-provided CSS classes via the `class` attribute on the component.
   * This allows using `<ui-text class="mb-3">` and have it merge correctly.
   */
  hostClasses = input<string>('', { alias: 'class' });

  protected textClasses = computed(() => {
    // Base font family uses Tailwind's font-sans mapping to CSS var(--font-family-base)
    const isCode = this.variant() === 'code';
    const isKbd = this.variant() === 'kbd';
    const baseClasses = (isCode || isKbd) ? 'font-mono' : 'font-sans';
    
    // Kbd elements should default to inline, but allow override
    const displayClass = this.variant() === 'kbd' 
      ? (this.display() === 'block' ? 'block' : 'inline')
      : (this.display() === 'inline' ? 'inline' : 'block');

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
      code: 'bg-surface-light dark:bg-surface-dark px-1 py-0.5 rounded text-sm',
      kbd: ''  // Styling will be applied to the inner <kbd> element via CSS
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
      displayClass,
      baseClasses,
      sizeClass,
      weightClass,
      variantClass,
      colorClass,
      truncateClass,
      italicClass,
      underlineClass,
      this.customClasses(),
      this.hostClasses()
    ].filter(Boolean).join(' ');
  });
}
