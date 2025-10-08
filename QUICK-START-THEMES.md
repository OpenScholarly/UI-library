# Quick Start: Color Themes

This guide will get you up and running with the UI library's color theme system in 5 minutes.

## 📋 What You Get

- **19 Pre-built Themes**: Ready-to-use color palettes for different brand personalities
- **Role-Based Colors**: Primary, secondary, accent, surface colors clearly defined
- **Type-Safe**: Full TypeScript support with autocomplete
- **Interactive Visualization**: See all colors before choosing
- **Easy Integration**: Works seamlessly with Angular services

## 🚀 Quick Start

### Step 1: View Available Themes

Open `color-palette-visualization.html` in your browser to see all 19 themes with their colors.

### Step 2: Install the Library

```bash
npm install @ui-components
```

### Step 3: Import and Use

```typescript
import { getColorByRole, getThemeColorsByRole } from '@ui-components/lib/theme-colors';

// Get a specific color
const primaryColor = getColorByRole('ocean-blue', 'primary');
console.log(primaryColor); // '#1851A3'

// Get all theme colors
const allColors = getThemeColorsByRole('sunset-orange');
console.log(allColors);
// {
//   primary: '#EA580C',
//   primaryLight: '#FDBA74',
//   primaryDark: '#C2410C',
//   accent: '#FB923C',
//   surface: '#FFF7ED'
// }
```

## 🎨 Available Themes

| Theme Key | Name | Main Color | Best For |
|-----------|------|------------|----------|
| `ocean-blue` | Tech Forward - Deep Ocean Blue | #1851A3 | Tech, fintech, SaaS |
| `forest-green` | Organic Modern - Forest Green | #2D5F3F | Health, finance, eco-friendly |
| `vibrant-purple` | Creative Edge - Vibrant Purple | #6B46C1 | Creative agencies, entertainment |
| `sunset-orange` | Warm & Approachable - Sunset Orange | #EA580C | Education, food, lifestyle |
| `beach-landscape` | Beach Landscape | #BF9169 | Travel, hospitality |
| `villa-real-estate` | Villa Real-Estate | #8C8377 | Real estate, luxury |
| `sun-blue-autumn` | Sun, Blue Sky and Autumn | #79A3D9 | Seasonal, vibrant brands |
| `barren-desert` | Barren Desert Landscape | #4E9DA6 | Nature, outdoor brands |
| `tozeur` | Tozeur | #F2A35E | Warm, inviting brands |
| `lader-neutral` | Lader: Neutral Sans Serif | #F26430 | Modern, minimalist |
| ... and 9 more! | | | |

## 🎯 Color Roles Explained

Each theme includes these color roles:

- **primary**: Your main brand color (e.g., buttons, links)
- **primaryLight**: Lighter variant (e.g., hover states)
- **primaryDark**: Darker variant (e.g., pressed states)
- **secondary**: Supporting color (e.g., secondary buttons)
- **accent**: Highlight color (e.g., CTAs, badges)
- **surface**: Background color (e.g., cards, panels)

## 💡 Example: Theme Switcher Component

```typescript
import { Component } from '@angular/core';
import { getAvailableThemes, getThemeInfo } from '@ui-components/lib/theme-colors';

@Component({
  selector: 'app-theme-picker',
  template: `
    <select (change)="onThemeChange($event)">
      <option *ngFor="let theme of themes" [value]="theme.key">
        {{ theme.name }}
      </option>
    </select>
  `
})
export class ThemePickerComponent {
  themes = getAvailableThemes().map(key => ({
    key,
    ...getThemeInfo(key)!
  }));

  onThemeChange(event: Event) {
    const themeKey = (event.target as HTMLSelectElement).value;
    // Apply theme colors...
  }
}
```

## 🎨 Using Colors in Your Components

### CSS Variables (Recommended)

```css
.my-button {
  background-color: var(--color-primary);
  color: white;
}

.my-button:hover {
  background-color: var(--color-primaryLight);
}
```

### Direct Usage

```typescript
import { getColorByRole } from '@ui-components/lib/theme-colors';

@Component({
  selector: 'app-card',
  styles: [`
    :host {
      background-color: {{ surfaceColor }};
    }
  `]
})
export class CardComponent {
  surfaceColor = getColorByRole('ocean-blue', 'surface');
}
```

## 📚 Next Steps

1. **Explore the Visualization**: Open `color-palette-visualization.html` to see all themes
2. **Read Full Documentation**: See `COLOR-SYSTEM.md` for complete details
3. **Check Examples**: See `examples/theme-service-integration.ts` for a full implementation
4. **Customize**: Use `color-palettes.json` to add your own themes

## 🔗 Related Files

- `color-palette-visualization.html` - Interactive visualization
- `COLOR-SYSTEM.md` - Complete documentation
- `color-palettes.json` - Raw color data
- `examples/theme-service-integration.ts` - Full Angular example
- `examples/README.md` - Examples overview

## ❓ FAQ

**Q: Can I add my own themes?**  
A: Yes! Add your palette to `color-palettes.json` following the same structure.

**Q: How do I switch themes dynamically?**  
A: See `examples/theme-service-integration.ts` for a complete example with RxJS state management.

**Q: Are semantic colors included?**  
A: Yes! Success, danger, warning, and info colors are included and consistent across all themes.

**Q: Does it work with dark mode?**  
A: Yes! Each theme can have light and dark variants. Use the `surfaceDark` role for dark surfaces.

## 🎉 You're Ready!

Start by opening the visualization to pick a theme, then use the helper functions to integrate it into your app. Happy theming!
