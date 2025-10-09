import { signal, computed } from '@angular/core';
import { applyThemeVariables, getThemeInfo, getAvailableThemes } from '../theme-colors';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeKey = signal<string>('ocean-blue');
  readonly currentTheme = this.currentThemeKey.asReadonly();
  readonly themeInfo = computed(() => getThemeInfo(this.currentThemeKey()));
  readonly availableThemes = getAvailableThemes();

  constructor() {
    const stored = localStorage.getItem('ui-theme');
    if (stored && this.availableThemes.includes(stored)) {
      this.setTheme(stored);
    } else {
      this.setTheme(this.currentThemeKey());
    }
  }

  setTheme(themeKey: string): void {
    if (applyThemeVariables(themeKey)) {
      this.currentThemeKey.set(themeKey);
      localStorage.setItem('ui-theme', themeKey);
    }
  }
}
