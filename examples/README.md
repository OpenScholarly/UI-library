# Examples

This directory contains example implementations and integration guides for the UI library.

## Color System Examples

### 1. Interactive Visualization
**File:** `../color-palette-visualization.html`

Open this file in a browser to see an interactive visualization of all 19 color palettes with:
- Color swatches with hex values
- Hover effects to see color details
- Click to copy colors to clipboard
- Role assignments for each palette
- Semantic and neutral colors

### 2. Theme Service Integration
**File:** `theme-service-integration.ts`

Complete example showing how to integrate the color palette system with an Angular theme service:

- `EnhancedThemeService` - Full-featured theme service with:
  - Dynamic theme switching
  - CSS variable management
  - Theme state management with RxJS
  - LocalStorage persistence
  
- `ThemeSelectorComponent` - Example component for selecting themes
  - Grid display of available themes
  - Preview of current theme colors
  - Click to switch themes

- `ThemedButtonComponent` - Example themed button component
  - Uses CSS variables for colors
  - Primary, secondary, and accent variants
  - Hover and active states

## Usage

### Installing the Library

```bash
npm install @ui-components
```

### Import Theme Colors

```typescript
import { 
  ThemeColorSystem, 
  getColorByRole, 
  getThemeColorsByRole,
  getAvailableThemes 
} from '@ui-components/lib/theme-colors';
```

### Quick Start

```typescript
// Get a specific color
const primaryColor = getColorByRole('ocean-blue', 'primary');

// Get all colors for a theme
const allColors = getThemeColorsByRole('forest-green');

// List available themes
const themes = getAvailableThemes();
```

## Other Examples

- **vercel_dark_mode.html** - Example of dark mode implementation
- **tokens/_variables.scss** - SCSS variables for design tokens
- **components/** - Various component examples

## Documentation

For complete documentation on the color system, see:
- `../COLOR-SYSTEM.md` - Comprehensive color system documentation
- `../color-palettes.json` - Raw color data in JSON format
- `../Themes.md` - Theme specifications and CSS implementations

## Running Examples Locally

To run the examples locally:

1. Clone the repository
2. Open HTML files directly in a browser
3. For TypeScript examples, integrate into your Angular project

### Viewing the Color Visualization

```bash
# Option 1: Open directly
open color-palette-visualization.html

# Option 2: Use a local server
python3 -m http.server 8080
# Then open http://localhost:8080/color-palette-visualization.html
```

## Contributing

When adding new examples:

1. Follow the existing code style
2. Include comments explaining key concepts
3. Add the example to this README
4. Test the example works correctly

## Questions?

See the main project README or open an issue on GitHub.
