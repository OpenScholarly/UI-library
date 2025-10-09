import { KeyValuePipe } from '../UI/node_modules/@angular/common';
import { Injectable,  Component, OnInit, signal, computed, inject, ChangeDetectionStrategy, input } from '../UI/node_modules/@angular/core';
import { 
  ThemeColorSystem, 
  getColorByRole, 
  getThemeColorsByRole,
  getAvailableThemes,
  getThemeInfo,
  applyThemeVariables,
  getCSSVariables,
  type ColorRoles
} from '../UI/projects/ui-components/src/lib/theme-colors';





/**
 * Enhanced Theme Service using Angular Signals
 * Follows Angular best practices from copilot-instructions.md
 * Integrates with existing design tokens and Tailwind configuration
 */
@Injectable({
  providedIn: 'root'
})
export class EnhancedThemeService {
  // Use signals for state management (Angular best practice)
  private currentThemeKey = signal<string>('ocean-blue');
  
  /**
   * Current theme as a readonly signal
   */
  readonly currentTheme = this.currentThemeKey.asReadonly();
  
  /**
   * Computed signal for current theme colors
   */
  readonly currentColors = computed(() => {
    return getThemeColorsByRole(this.currentThemeKey());
  });
  
  /**
   * Computed signal for current theme info
   */
  readonly currentThemeInfo = computed(() => {
    return getThemeInfo(this.currentThemeKey());
  });

  constructor() {
    this.initializeTheme();
  }

  /**
   * Initialize theme from localStorage or default
   */
  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('ui-theme') || 'ocean-blue';
    this.setTheme(savedTheme);
  }

  /**
   * Set the active theme
   * Applies CSS variables and updates localStorage
   */
  setTheme(themeKey: string): void {
    if (!ThemeColorSystem.themes[themeKey]) {
      console.error(`Theme "${themeKey}" not found. Using default.`);
      themeKey = 'ocean-blue';
    }

    // Apply theme using the helper function
    // This sets CSS variables matching Tailwind config and Themes.md patterns
    const success = applyThemeVariables(themeKey);
    
    if (success) {
      // Apply semantic and neutral colors
      this.applySemanticColors();
      this.applyNeutralColors();
      
      // Update signal
      this.currentThemeKey.set(themeKey);
      
      // Save to localStorage
      localStorage.setItem('ui-theme', themeKey);
    }
  }

  /**
   * Apply semantic colors (success, danger, warning, info)
   * These align with the semantic colors in tailwind.config.js
   */
  private applySemanticColors(): void {
    const semantic = ThemeColorSystem.semanticColors.colors;
    
    Object.entries(semantic).forEach(([type, shades]) => {
      Object.entries(shades).forEach(([shade, color]) => {
        document.documentElement.style.setProperty(
          `--color-${type}-${shade}`, 
          color
        );
      });
    });
  }

  /**
   * Apply neutral gray scale colors
   */
  private applyNeutralColors(): void {
    const neutral = ThemeColorSystem.neutralColors.colors.gray;
    
    Object.entries(neutral).forEach(([shade, color]) => {
      document.documentElement.style.setProperty(
        `--color-gray-${shade}`, 
        color
      );
    });
  }

  /**
   * Get a specific color by role from current theme
   */
  getColor(role: keyof ColorRoles): string | undefined {
    return this.currentColors()[role];
  }

  /**
   * Get all available themes with their info
   */
  getAvailableThemes(): Array<{ key: string; name: string; description: string; mainColor: string }> {
    return getAvailableThemes().map(key => {
      const info = getThemeInfo(key);
      return {
        key,
        name: info?.name || key,
        description: info?.description || '',
        mainColor: info?.mainColor || '#000000'
      };
    });
  }

  /**
   * Check if a theme exists
   */
  themeExists(themeKey: string): boolean {
    return !!ThemeColorSystem.themes[themeKey];
  }

  /**
   * Get the raw theme data
   */
  getThemeData(themeKey: string) {
    return ThemeColorSystem.themes[themeKey];
  }
}



















/**
 * Example Component using the Enhanced Theme Service
 * Follows Angular best practices: signals, computed values, native control flow
 */
@Component({
  selector: 'app-theme-selector',
  imports: [KeyValuePipe],
  template: `
    <div class="theme-selector">
      <h3>Select Theme</h3>
      <div class="theme-grid">
        @for (theme of availableThemes; track theme.key) {
          <div 
            class="theme-option"
            [class.active]="theme.key === themeService.currentTheme()"
            (click)="selectTheme(theme.key)">
            <div 
              class="theme-preview" 
              [style.background-color]="theme.mainColor">
            </div>
            <div class="theme-info">
              <strong>{{ theme.name }}</strong>
              <p>{{ theme.description }}</p>
            </div>
          </div>
        }
      </div>
      
      <div class="current-colors">
        <h4>Current Theme Colors</h4>
        <div class="color-swatches">
          @for (color of currentColorsArray(); track color.key) {
            <div class="color-swatch">
              <div 
                class="swatch-color" 
                [style.background-color]="color.value">
              </div>
              <span>{{ color.key }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .theme-selector {
      padding: 2rem;
    }

    .theme-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .theme-option {
      border: 2px solid var(--color-gray-200);
      border-radius: 8px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .theme-option:hover {
      border-color: var(--color-primary);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .theme-option.active {
      border-color: var(--color-primary);
      background-color: var(--color-surface);
    }

    .theme-preview {
      width: 100%;
      height: 60px;
      border-radius: 6px;
      margin-bottom: 0.5rem;
    }

    .theme-info strong {
      display: block;
      margin-bottom: 0.25rem;
    }

    .theme-info p {
      font-size: 0.875rem;
      color: var(--color-gray-600);
      margin: 0;
    }

    .current-colors {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--color-gray-200);
    }

    .color-swatches {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 1rem;
    }

    .color-swatch {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .swatch-color {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      border: 1px solid var(--color-gray-300);
    }

    .color-swatch span {
      font-size: 0.75rem;
      color: var(--color-gray-600);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSelectorComponent implements OnInit {
  // Use inject() instead of constructor injection
  readonly themeService = inject(EnhancedThemeService);
  
  availableThemes: Array<{ key: string; name: string; description: string; mainColor: string }> = [];
  
  // Computed signal for converting colors object to array for @for loop
  currentColorsArray = computed(() => {
    const colors = this.themeService.currentColors();
    return Object.entries(colors).map(([key, value]) => ({ key, value }));
  });

  ngOnInit(): void {
    this.availableThemes = this.themeService.getAvailableThemes();
  }

  selectTheme(themeKey: string): void {
    this.themeService.setTheme(themeKey);
  }
}























/**
 * Example usage in a button component
 * Uses input() function and class bindings instead of ngClass
 */
// import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-themed-button',
  template: `
    <button 
      class="themed-button"
      [class.variant-primary]="variant() === 'primary'"
      [class.variant-secondary]="variant() === 'secondary'"
      [class.variant-accent]="variant() === 'accent'">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .themed-button {
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      border: none;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .variant-primary {
      background-color: var(--color-primary);
      color: white;
    }

    .variant-primary:hover {
      background-color: var(--color-primaryLight);
    }

    .variant-primary:active {
      background-color: var(--color-primaryDark);
    }

    .variant-secondary {
      background-color: var(--color-secondary);
      color: white;
    }

    .variant-secondary:hover {
      opacity: 0.9;
    }

    .variant-accent {
      background-color: var(--color-accent);
      color: white;
    }

    .variant-accent:hover {
      opacity: 0.9;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemedButtonComponent {
  // Use input() function instead of @Input decorator
  variant = input<'primary' | 'secondary' | 'accent'>('primary');
}
