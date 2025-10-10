import { Component, signal, effect, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { getThemeInfo } from '../../theme-colors';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '../forms/select/select.component';
import type { SelectOption, SelectVariant, SelectSize } from '../../types';

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
 * <!-- In navbar or settings panel -->
 * <div class="flex items-center gap-4">
 *   <span>Choose theme:</span>
 *   <ui-theme-selector></ui-theme-selector>
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
  /** Label for the selector */
  label = input<string>('Theme');
  /** Placeholder when no theme is selected */
  placeholder = input<string>('Select theme');
  /** Visual variant to pass to ui-select */
  variant = input<SelectVariant>('default');
  /** Size to pass to ui-select */
  size = input<SelectSize>('md');
  /** Disable the selector */
  disabled = input<boolean>(false);
  /** Enable search in the selector */
  searchable = input<boolean>(true);

  /** Emit when theme changes */
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
