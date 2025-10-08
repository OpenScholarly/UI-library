# Color System Documentation

This document describes the comprehensive color system for the UI library, including visualizations, role classifications, and integration guidelines.

## 📋 Table of Contents

- [Overview](#overview)
- [Color Roles](#color-roles)
- [Theme Palettes](#theme-palettes)
- [Semantic Colors](#semantic-colors)
- [Integration Guide](#integration-guide)
- [Usage Examples](#usage-examples)

## 🎨 Overview

The UI library includes a comprehensive color system with:

- **19 Theme Palettes**: Carefully curated color palettes for different brand personalities
- **Role-Based Classification**: Each color is assigned a role (primary, secondary, accent, etc.)
- **Semantic Colors**: Standard success, danger, warning, and info colors
- **Neutral Scale**: A complete gray scale for surfaces and text

### Visualization

Open `color-palette-visualization.html` in your browser to see an interactive visualization of all color palettes with their hex values and role assignments.

## 🏷️ Color Roles

Colors in each palette are assigned specific roles to ensure consistent usage across the application:

### Primary Colors
- **primary**: The main brand color, used for primary actions and important UI elements
- **primaryLight**: A lighter variant, used for hover states and highlights
- **primaryDark**: A darker variant, used for pressed states and shadows

### Secondary Colors
- **secondary**: Supporting color that complements the primary
- **secondaryLight**: Lighter variant of secondary color
- **secondaryDark**: Darker variant of secondary color

### Accent Colors
- **accent**: Attention-grabbing color for CTAs and highlights
- **accentAlt**: Alternative accent color for variety

### Surface Colors
- **surface**: Background color for cards and containers
- **surfaceLight**: Lighter surface variant
- **surfaceDark**: Darker surface variant (e.g., for dark mode)
- **surfaceAlt**: Alternative surface color

### Utility Colors
- **contrast**: High contrast color for emphasis
- **neutral**: Neutral color for subtle elements

## 🎨 Theme Palettes

### Tech Forward - Deep Ocean Blue
**Theme Key**: `ocean-blue`
**Main Color**: `#1851A3`
**Use Case**: Tech, fintech, and SaaS applications

Color assignments:
- Primary: `#1851A3` (500)
- Primary Light: `#64B5F6` (300)
- Primary Dark: `#0D47A1` (700)
- Accent: `#42A5F5` (400)
- Surface: `#E3F2FD` (50)

### Organic Modern - Forest Green
**Theme Key**: `forest-green`
**Main Color**: `#2D5F3F`
**Use Case**: Health, finance, eco-friendly brands

Color assignments:
- Primary: `#2D5F3F` (500)
- Primary Light: `#81C784` (300)
- Primary Dark: `#2E7D32` (700)
- Accent: `#66BB6A` (400)
- Surface: `#E8F5E8` (50)

### Creative Edge - Vibrant Purple
**Theme Key**: `vibrant-purple`
**Main Color**: `#6B46C1`
**Use Case**: Creative agencies, entertainment, luxury brands

Color assignments:
- Primary: `#6B46C1` (500)
- Primary Light: `#C084FC` (300)
- Primary Dark: `#6D28D9` (700)
- Accent: `#A855F7` (400)
- Surface: `#F3E8FF` (50)

### Warm & Approachable - Sunset Orange
**Theme Key**: `sunset-orange`
**Main Color**: `#EA580C`
**Use Case**: Education, food, lifestyle brands

Color assignments:
- Primary: `#EA580C` (500)
- Primary Light: `#FDBA74` (300)
- Primary Dark: `#C2410C` (700)
- Accent: `#FB923C` (400)
- Surface: `#FFF7ED` (50)

### Beach Landscape
**Theme Key**: `beach-landscape`
**Main Color**: `#BF9169`
**Use Case**: Travel, hospitality, natural brands

Color assignments:
- Primary: `#BF9169` (500)
- Secondary: `#8C5B3F` (700)
- Accent: `#D9C7B8` (300)
- Surface: `#F2EFE9` (100)
- Surface Dark: `#593E2E` (900)

### Additional Palettes

The system includes 14 more unique palettes. See `color-palettes.json` or the visualization HTML for complete details on:

- Villa Real-Estate
- Sun, Blue Sky and Autumn
- Barren Desert Landscape
- Tozeur
- Lader: Neutral Sans Serif
- Wilderness Landscape Forest
- Safari
- PawHome
- Platform
- Sunflower
- NAQCH
- Neiman Marcus
- Rocky Salam
- Beauty

## 🔔 Semantic Colors

Semantic colors are used consistently across all themes for standard UI feedback:

### Success
- Light: `#d4edda`
- Main: `#28a745`
- Dark: `#1e7e34`

**Usage**: Success messages, completed states, positive feedback

### Danger
- Light: `#f8d7da`
- Main: `#dc3545`
- Dark: `#bd2130`

**Usage**: Error messages, destructive actions, critical warnings

### Warning
- Light: `#fff3cd`
- Main: `#ffc107`
- Dark: `#e0a800`

**Usage**: Warning messages, cautionary states, attention needed

### Info
- Light: `#d1ecf1`
- Main: `#17a2b8`
- Dark: `#117a8b`

**Usage**: Informational messages, helper text, neutral notifications

## 🛠️ Integration Guide

### Step 1: Import the Color System

```typescript
import { 
  ThemeColorSystem, 
  getColorByRole, 
  getThemeColorsByRole,
  getAvailableThemes,
  getThemeInfo,
  applyThemeVariables,  // New helper for easy integration
  getCSSVariables       // New helper for custom CSS variable handling
} from '@ui-components/lib/theme-colors';
```

### Step 2: Use in Your Theme Service

**Option A: Simple Integration (Recommended)**
```typescript
import { Injectable, signal, computed } from '@angular/core';
import { applyThemeVariables, getThemeInfo } from '@ui-components/lib/theme-colors';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Use signals for state management (Angular best practice)
  private currentThemeKey = signal<string>('ocean-blue');
  readonly currentTheme = this.currentThemeKey.asReadonly();
  
  // Computed theme info
  readonly themeInfo = computed(() => getThemeInfo(this.currentThemeKey()));
  
  setTheme(themeKey: string): void {
    // Apply theme CSS variables
    // This automatically sets both --ui-* and --primary-* variables
    // Aligns with Tailwind config and Themes.md patterns
    const success = applyThemeVariables(themeKey);
    
    if (success) {
      this.currentThemeKey.set(themeKey);
      localStorage.setItem('ui-theme', themeKey);
    }
  }
}
```

**Option B: Custom CSS Variable Names**
```typescript
import { Injectable, signal } from '@angular/core';
import { getCSSVariables } from '@ui-components/lib/theme-colors';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeKey = signal<string>('ocean-blue');
  
  setTheme(themeKey: string): void {
    // Get CSS variables with custom handling
    const cssVars = getCSSVariables(themeKey);
    
    // Apply variables with your own logic
    Object.entries(cssVars).forEach(([varName, color]) => {
      document.documentElement.style.setProperty(varName, color);
    });
    
    this.currentThemeKey.set(themeKey);
  }
}
```

### Step 3: CSS Variables Convention

The system sets CSS variables that align with existing conventions:

**Standard UI Variables** (used in `tailwind.config.js`):
```css
:root {
  --ui-primary: #1851A3;
  --ui-primary-light: #64B5F6;
  --ui-primary-dark: #0D47A1;
  --ui-secondary: #8C5B3F;
  --ui-surface: #E3F2FD;
  --ui-surface-light: #ffffff;
  --ui-surface-dark: #073081;
  --ui-accent: #42A5F5;
}
```

**Shade Variables** (used in `Themes.md`):
```css
:root {
  /* Primary Palette - Full shade range */
  --primary-50: #E3F2FD;
  --primary-100: #BBDEFB;
  --primary-200: #90CAF9;
  --primary-300: #64B5F6;
  --primary-400: #42A5F5;
  --primary-500: #1851A3;  /* Main primary */
  --primary-600: #1565C0;
  --primary-700: #0D47A1;
  --primary-800: #0A3D91;
  --primary-900: #073081;
}
```

These variables are automatically set when using `applyThemeVariables()`.

## 📝 Usage Examples

### Example 1: Get a specific color by role

```typescript
import { getColorByRole } from '@ui-components/lib/theme-colors';

// Get the primary color from the ocean-blue theme
const primaryColor = getColorByRole('ocean-blue', 'primary');
console.log(primaryColor); // Output: #1851A3
```

### Example 2: Get all colors with roles for a theme

```typescript
import { getThemeColorsByRole } from '@ui-components/lib/theme-colors';

const themeColors = getThemeColorsByRole('sunset-orange');
console.log(themeColors);
// Output:
// {
//   primary: '#EA580C',
//   primaryLight: '#FDBA74',
//   primaryDark: '#C2410C',
//   accent: '#FB923C',
//   surface: '#FFF7ED'
// }
```

### Example 3: List available themes

```typescript
import { getAvailableThemes } from '@ui-components/lib/theme-colors';

const themes = getAvailableThemes();
console.log(themes);
// Output: ['ocean-blue', 'forest-green', 'vibrant-purple', ...]
```

### Example 4: Get theme information

```typescript
import { getThemeInfo } from '@ui-components/lib/theme-colors';

const info = getThemeInfo('vibrant-purple');
console.log(info);
// Output:
// {
//   name: 'Creative Edge - Vibrant Purple',
//   description: 'Creative, innovative, and premium...',
//   mainColor: '#6B46C1'
// }
```

### Example 5: Use in component styles

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `
    <button class="btn-primary">
      Click me
    </button>
  `,
  styles: [`
    .btn-primary {
      background-color: var(--color-primary);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-primary:hover {
      background-color: var(--color-primaryLight);
    }
    
    .btn-primary:active {
      background-color: var(--color-primaryDark);
    }
  `]
})
export class ButtonComponent {}
```

### Example 6: Dynamic theme switching component

```typescript
import { Component, OnInit } from '@angular/core';
import { ThemeService } from './theme.service';
import { getAvailableThemes, getThemeInfo } from '@ui-components/lib/theme-colors';

@Component({
  selector: 'app-theme-selector',
  template: `
    <div class="theme-selector">
      <label for="theme">Choose Theme:</label>
      <select 
        id="theme" 
        [value]="currentTheme" 
        (change)="onThemeChange($event)">
        <option 
          *ngFor="let theme of themes" 
          [value]="theme.key">
          {{ theme.name }}
        </option>
      </select>
    </div>
  `
})
export class ThemeSelectorComponent implements OnInit {
  currentTheme: string = '';
  themes: Array<{ key: string; name: string }> = [];
  
  constructor(private themeService: ThemeService) {}
  
  ngOnInit() {
    this.currentTheme = this.themeService.getCurrentTheme();
    
    this.themes = getAvailableThemes().map(key => {
      const info = getThemeInfo(key);
      return {
        key,
        name: info?.name || key
      };
    });
  }
  
  onThemeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.themeService.setTheme(target.value);
    this.currentTheme = target.value;
  }
}
```

## 🎯 Best Practices

1. **Consistency**: Always use role-based colors instead of hardcoding hex values
2. **Accessibility**: Ensure sufficient contrast between text and background colors
3. **Semantic Usage**: Use semantic colors (success, danger, warning, info) for their intended purposes
4. **Theme Switching**: Support dynamic theme switching by using CSS variables
5. **Documentation**: Document which color roles are used for which UI elements in your design system

## 📦 Files

- `color-palettes.json` - Complete color palette data in JSON format
- `color-palette-visualization.html` - Interactive visualization of all palettes
- `UI/projects/ui-components/src/lib/theme-colors.ts` - TypeScript implementation
- `COLOR-SYSTEM.md` - This documentation file

## 🔄 Updating the Color System

To add a new theme palette:

1. Add the theme to `color-palettes.json`
2. Add the theme to `theme-colors.ts`
3. Update the visualization HTML if needed
4. Test the theme in your application
5. Document the theme's use case and color roles

## 📚 Additional Resources

- [Material Theme Builder](https://m3.material.io/theme-builder)
- [Coolors.co](https://coolors.co)
- [Adobe Color](https://color.adobe.com)
- [Paletton](https://paletton.com)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
