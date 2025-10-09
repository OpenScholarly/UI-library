import { Component, signal, effect } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { getThemeInfo } from '../../theme-colors';

@Component({
  selector: 'ui-theme-selector',
  template: `
    <label for="theme-select">Theme:</label>
    <select id="theme-select" [value]="selected()" (change)="onChange($event)">
      @for(key of themes; track key) {
        <option [value]="key">{{ getThemeInfo(key)?.name || key }}</option>
      }
    </select>
  `,
  styles: [`
    :host { display: inline-block; margin: 0 1rem; }
    select { padding: 0.25rem 0.5rem; border-radius: 4px; }
  `]
})
export class ThemeSelectorComponent {
  themes: string[];
  selected = signal('');

  constructor(public themeService: ThemeService) {
    this.themes = themeService.availableThemes;
    this.selected.set(themeService.currentTheme());
    effect(() => {
      this.selected.set(themeService.currentTheme());
    });
  }

  getThemeInfo(key: string) {
    return getThemeInfo(key);
  }

  onChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.themeService.setTheme(value);
  }
}
