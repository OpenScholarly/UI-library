/**
 * Example Theme Service Integration
 * 
 * This example shows how to integrate the color palette system
 * with an Angular theme service for dynamic theme switching.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  ThemeColorSystem, 
  getColorByRole, 
  getThemeColorsByRole,
  getAvailableThemes,
  getThemeInfo,
  type ColorRoles
} from '@ui-components/lib/theme-colors';

interface ThemeState {
  currentTheme: string;
  colors: Record<string, string>;
}

@Injectable({
  providedIn: 'root'
})
export class EnhancedThemeService {
  private themeState$ = new BehaviorSubject<ThemeState>({
    currentTheme: 'ocean-blue',
    colors: {}
  });

  /**
   * Observable stream of theme state
   */
  public theme$: Observable<ThemeState> = this.themeState$.asObservable();

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
   */
  setTheme(themeKey: string): void {
    if (!ThemeColorSystem.themes[themeKey]) {
      console.error(`Theme "${themeKey}" not found. Using default.`);
      themeKey = 'ocean-blue';
    }

    // Get all colors with their roles for the theme
    const colors = getThemeColorsByRole(themeKey);
    
    // Apply colors to CSS variables
    this.applyCSSVariables(colors);
    
    // Apply semantic and neutral colors
    this.applySemanticColors();
    this.applyNeutralColors();
    
    // Update state
    this.themeState$.next({
      currentTheme: themeKey,
      colors
    });
    
    // Save to localStorage
    localStorage.setItem('ui-theme', themeKey);
    
    // Set data attribute for CSS targeting
    document.documentElement.setAttribute('data-theme', themeKey);
  }

  /**
   * Apply theme colors as CSS variables
   */
  private applyCSSVariables(colors: Record<string, string>): void {
    Object.entries(colors).forEach(([role, color]) => {
      document.documentElement.style.setProperty(`--color-${role}`, color);
    });
  }

  /**
   * Apply semantic colors (success, danger, warning, info)
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
   * Get current theme key
   */
  getCurrentTheme(): string {
    return this.themeState$.value.currentTheme;
  }

  /**
   * Get current theme colors
   */
  getCurrentColors(): Record<string, string> {
    return this.themeState$.value.colors;
  }

  /**
   * Get a specific color by role from current theme
   */
  getColor(role: keyof ColorRoles): string | undefined {
    return this.themeState$.value.colors[role];
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
 */
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-theme-selector',
  template: `
    <div class="theme-selector">
      <h3>Select Theme</h3>
      <div class="theme-grid">
        <div 
          *ngFor="let theme of availableThemes"
          class="theme-option"
          [class.active]="theme.key === currentTheme"
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
      </div>
      
      <div class="current-colors">
        <h4>Current Theme Colors</h4>
        <div class="color-swatches">
          <div *ngFor="let color of currentColors | keyvalue" class="color-swatch">
            <div 
              class="swatch-color" 
              [style.background-color]="color.value">
            </div>
            <span>{{ color.key }}</span>
          </div>
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
  `]
})
export class ThemeSelectorComponent implements OnInit, OnDestroy {
  availableThemes: Array<{ key: string; name: string; description: string; mainColor: string }> = [];
  currentTheme: string = '';
  currentColors: Record<string, string> = {};
  
  private destroy$ = new Subject<void>();

  constructor(private themeService: EnhancedThemeService) {}

  ngOnInit(): void {
    this.availableThemes = this.themeService.getAvailableThemes();
    
    // Subscribe to theme changes
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.currentTheme = state.currentTheme;
        this.currentColors = state.colors;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectTheme(themeKey: string): void {
    this.themeService.setTheme(themeKey);
  }
}

/**
 * Example usage in a button component
 */
@Component({
  selector: 'app-themed-button',
  template: `
    <button 
      class="themed-button"
      [class.variant-primary]="variant === 'primary'"
      [class.variant-secondary]="variant === 'secondary'"
      [class.variant-accent]="variant === 'accent'">
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
  `]
})
export class ThemedButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'accent' = 'primary';
}
