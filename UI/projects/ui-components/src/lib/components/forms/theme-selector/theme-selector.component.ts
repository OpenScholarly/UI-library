import { Component, signal, effect, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { getThemeInfo } from '../../../theme-colors';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '../select/select.component';
import type { SelectOption, SelectVariant, SelectSize } from '../../../types';

/**
 * A theme selector dropdown component for choosing color themes.
 *
 * ## Features
 * - Dropdown selection of available color themes
 * - Syncs with ThemeService for global theme management
 * - Displays theme names from theme configuration
 * - Automatic theme application on selection
 * - Reactive updates when theme changes externally
 * - Dark mode compatible
 *
 * @example
 * ```html
 * <!-- Basic theme selector -->
 * <ui-theme-selector></ui-theme-selector>
 *
 * <!-- With inline label and different style -->
 * <ui-theme-selector
 *   label="Select Theme"
 *   labelPlacement="inline"
 *   variant="filled"
 *   size="sm"
 * ></ui-theme-selector>
 *
 * <!-- Disabled selector -->
 * <ui-theme-selector [disabled]="true"></ui-theme-selector>
 *
 * <!-- Non-searchable selector -->
 * <ui-theme-selector [searchable]="false"></ui-theme-selector>
 *
 * <!-- In a form or settings panel -->
 * <div class="flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
 *   <span class="font-medium">Theme:</span>
 *   <ui-theme-selector
 *     label="Interface Theme"
 *     labelPlacement="inline"
 *     class="w-48"
 *   ></ui-theme-selector>
 * </div>
 * ```
 */
@Component({
  selector: 'ui-theme-selector',
  standalone: true,
  imports: [CommonModule, SelectComponent],
  template: `
    <ui-select
      [label]="label()"
      [labelPlacement]="labelPlacement()"
      [options]="options()"
      [placeholder]="placeholder()"
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [searchable]="searchable()"
      (change)="handleSelect($event)">
    </ui-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block' }
})
export class ThemeSelectorComponent {
  /**
   * The label text for the theme selector dropdown.
   * @default "Theme"
   */
  label = input<string>('');

  /**
   * Placement of the label relative to the select input.
   * - `block`: Label is rendered above the field.
   * - `inline`: Label is rendered to the left of the field.
   * @default "block"
   */
  labelPlacement = input<'block' | 'inline'>('block');

  /**
   * The placeholder text displayed when no theme is selected.
   * @default "Select theme"
   */
  placeholder = input<string>('Select theme');

  /**
   * The visual style variant of the underlying `ui-select` component.
   * @default "default"
   */
  variant = input<SelectVariant>('default');

  /**
   * The size of the underlying `ui-select` component.
   * @default "md"
   */
  size = input<SelectSize>('md');

  /**
   * Disables the theme selector, preventing interaction.
   * @default false
   */
  disabled = input<boolean>(false);

  /**
   * Enables the search input within the theme selector dropdown.
   * @default true
   */
  searchable = input<boolean>(true);

  /**
   * Emitted when the selected theme changes.
   * The payload is the string key of the newly selected theme.
   * @event changed
   */
  changed = output<string>();

  protected selected = signal('');
  protected themes: string[] = [];
  protected options = computed<SelectOption[]>(() =>
    this.themes.map((key) => ({ value: key, label: getThemeInfo(key)?.name ?? key }))
  );

  constructor(public themeService: ThemeService) {
    this.themes = themeService.availableThemes;
    this.selected.set(themeService.currentTheme());
    effect(() => {
      const current = this.themeService.currentTheme();
      this.selected.set(current);
    });
  }

  handleSelect(value: string) {
    if (!value || value === this.selected()) return;
    this.selected.set(value);
    this.themeService.setTheme(value);
    this.changed.emit(value);
  }
}
