import { Component, computed, inject } from '@angular/core';
import { ThemeSelectorComponent, ThemeService, ButtonComponent } from 'ui-components';

@Component({
  selector: 'app-theme-selector-demo',
  standalone: true,
  imports: [ThemeSelectorComponent, ButtonComponent],
  template: `
    <h2>Theme Selector Demo</h2>
    <ui-theme-selector></ui-theme-selector>
    <div class="theme-demo-card">
      <h3>Current Theme: {{ currentThemeName() }}</h3>
      <p>This card uses <code>var(--ui-surface)</code> and <code>var(--ui-primary)</code> to demonstrate the active theme.</p>
      <button class="demo-btn">Primary Button</button>
      <ui-button>Secondary Button</ui-button>
    </div>
  `,
  styles: [`
    .theme-demo-card {
      background: var(--ui-surface, #fff);
      color: var(--ui-primary, #1851A3);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
      padding: 2rem;
      margin-top: 2rem;
      transition: background 0.3s, color 0.3s;
    }
    .demo-btn {
      background: var(--ui-primary, #1851A3);
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 0.5rem 1.5rem;
      font-size: 1rem;
      margin-top: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }
    .demo-btn:hover {
      background: var(--ui-primaryLight, #64B5F6);
    }
  `]
})
export class ThemeSelectorDemoComponent {
  private themeService = inject(ThemeService);
  currentThemeName = computed(() => this.themeService.themeInfo()?.name ?? this.themeService.currentTheme());
}
