# Themes & Color Systems
## Sources
- [Material Theme Builder](https://m3.material.io/theme-builder)
- [Coolors.co](https://coolors.co)
- [Adobe Color](https://color.adobe.com)
- [Paletton](https://paletton.com)


&nbsp;  
## Implementation
```typescript
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme$ = new BehaviorSubject<string>('ocean-light');
  
  private themes = {
    'ocean-light': 'Ocean Blue Light',
    'ocean-dark': 'Ocean Blue Dark',
    'forest-light': 'Forest Green Light',
    'forest-dark': 'Forest Green Dark',
    'purple-light': 'Creative Purple Light',
    'purple-dark': 'Creative Purple Dark',
    'glass-light': 'Glass Light',
    'glass-dark': 'Glass Dark',
    'monochrome-light': 'Pure Light',
    'monochrome-dark': 'Pure Dark'
  };

  setTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme$.next(theme);
    localStorage.setItem('ui-theme', theme);
  }

  getCurrentTheme(): string {
    return this.currentTheme$.value;
  }

  getAvailableThemes(): Record<string, string> {
    return this.themes;
  }

  initializeTheme(): void {
    const savedTheme = localStorage.getItem('ui-theme') || 'ocean-light';
    this.setTheme(savedTheme);
  }
}
```


Component Usage:  
```typescript
@Component({
  template: `
    <div class="theme-selector">
      <label for="theme-select">Choose Theme:</label>
      <select id="theme-select" [value]="currentTheme" (change)="onThemeChange($event)">
        <option *ngFor="let theme of themes | keyvalue" [value]="theme.key">
          {{ theme.value }}
        </option>
      </select>
    </div>
  `
})
export class ThemeSelectorComponent {
  currentTheme: string;
  themes: Record<string, string>;

  constructor(private themeService: ThemeService) {
    this.currentTheme = this.themeService.getCurrentTheme();
    this.themes = this.themeService.getAvailableThemes();
  }

  onThemeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.themeService.setTheme(target.value);
    this.currentTheme = target.value;
  }
}
```




&nbsp;  
## Themes
### Monochrome Theme
```scss
/* === MONOCHROME THEME === */
[data-theme="monochrome"] {
  /* Pure monochrome surfaces */
  --surface-primary: #FFFFFF;
  --surface-secondary: #F8F8F8;
  --surface-tertiary: #F0F0F0;
  --surface-inverse: #000000;
  --surface-elevated: #FFFFFF;
  
  /* Monochrome text */
  --text-primary: #000000;
  --text-secondary: #404040;
  --text-tertiary: #808080;
  --text-inverse: #FFFFFF;
  --text-on-color: #FFFFFF;
  
  /* Monochrome borders */
  --border-subtle: #E8E8E8;
  --border-default: #D0D0D0;
  --border-strong: #B0B0B0;
  
  /* Interactive states (using grays) */
  --interactive-primary: #000000;
  --interactive-primary-hover: #1A1A1A;
  --interactive-primary-active: #333333;
  --interactive-primary-disabled: #CCCCCC;
  
  --interactive-secondary: #FFFFFF;
  --interactive-secondary-hover: #F5F5F5;
  --interactive-secondary-active: #E8E8E8;
  
  /* Monochrome shadows */
  --shadow-subtle: rgba(0, 0, 0, 0.08);
  --shadow-default: rgba(0, 0, 0, 0.16);
  --shadow-strong: rgba(0, 0, 0, 0.32);
  
  /* Status colors in monochrome */
  --success-color: #000000;
  --warning-color: #666666;
  --error-color: #000000;
  --info-color: #404040;
}

/* Monochrome component styles */
.mono-button-primary {
  background: var(--interactive-primary);
  color: var(--text-inverse);
  border: 2px solid var(--interactive-primary);
}

.mono-button-secondary {
  background: var(--interactive-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-strong);
}

.mono-card {
  background: var(--surface-primary);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-subtle);
}
```













&nbsp;  
### Tech Forward - Deep Ocean Blue
Primary Color: `#1851A3` (Deep Ocean Blue)
**Purpose**: Projects trust, innovation, and professionalism. Perfect for tech, fintech, and SaaS applications.
```css
:root {
  /* Primary Palette - Ocean Blue Theme */
  --primary-50: #E3F2FD;
  --primary-100: #BBDEFB;
  --primary-200: #90CAF9;
  --primary-300: #64B5F6;
  --primary-400: #42A5F5;
  --primary-500: #1851A3; /* Main primary */
  --primary-600: #1565C0;
  --primary-700: #0D47A1;
  --primary-800: #0A3D91;
  --primary-900: #073081;
}
```

&nbsp;  
### Organic Modern - Forest Green
Primary Color: `#2D5F3F` (Forest Green)
Purpose: Sustainable, trustworthy, and contemporary. Ideal for health, finance, and eco-friendly brands.
```css
:root {
  /* Primary Palette - Forest Green Theme */
  --primary-50: #E8F5E8;
  --primary-100: #C8E6C9;
  --primary-200: #A5D6A7;
  --primary-300: #81C784;
  --primary-400: #66BB6A;
  --primary-500: #2D5F3F; /* Main primary */
  --primary-600: #388E3C;
  --primary-700: #2E7D32;
  --primary-800: #1B5E20;
  --primary-900: #0F4C1A;
}
```

&nbsp;  
### Creative Edge - Vibrant Purple
Primary Color: `#6B46C1` (Rich Purple)
Purpose: Creative, innovative, and premium. Perfect for creative agencies, entertainment, and luxury brands.
```css
:root {
  /* Primary Palette - Vibrant Purple Theme */
  --primary-50: #F3E8FF;
  --primary-100: #E9D5FF;
  --primary-200: #D8B4FE;
  --primary-300: #C084FC;
  --primary-400: #A855F7;
  --primary-500: #6B46C1; /* Main primary */
  --primary-600: #7C3AED;
  --primary-700: #6D28D9;
  --primary-800: #5B21B6;
  --primary-900: #4C1D95;
}
```

&nbsp;  
### Warm & Approachable - Sunset Orange
Primary Color: `#EA580C` (Sunset Orange)
Purpose: Energetic, friendly, and attention-grabbing. Great for education, food, and lifestyle brands.
```css
:root {
  /* Primary Palette - Sunset Orange Theme */
  --primary-50: #FFF7ED;
  --primary-100: #FFEDD5;
  --primary-200: #FED7AA;
  --primary-300: #FDBA74;
  --primary-400: #FB923C;
  --primary-500: #EA580C; /* Main primary */
  --primary-600: #DC2626;
  --primary-700: #C2410C;
  --primary-800: #9A3412;
  --primary-900: #7C2D12;
}
```


&nbsp;  
### Liquid Glass Theme
```scss
/* === GLASS THEME === */
[data-theme="glass"] {
  /* Glass-specific surfaces */
  --surface-glass-primary: rgba(255, 255, 255, 0.1);
  --surface-glass-secondary: rgba(255, 255, 255, 0.05);
  --surface-glass-tertiary: rgba(255, 255, 255, 0.02);
  
  /* Glass borders */
  --border-glass: rgba(255, 255, 255, 0.2);
  --border-glass-strong: rgba(255, 255, 255, 0.3);
  
  /* Glass text (higher contrast for readability) */
  --text-glass-primary: rgba(255, 255, 255, 0.95);
  --text-glass-secondary: rgba(255, 255, 255, 0.8);
  --text-glass-tertiary: rgba(255, 255, 255, 0.6);
  
  /* Background gradients for glass effect */
  --bg-glass-gradient: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
  
  /* Backdrop filters */
  --glass-blur-subtle: blur(10px);
  --glass-blur-medium: blur(20px);
  --glass-blur-strong: blur(40px);
}

/* Glass component styles */
.glass-card {
  background: var(--surface-glass-primary);
  backdrop-filter: var(--glass-blur-medium);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.glass-nav {
  background: var(--surface-glass-secondary);
  backdrop-filter: var(--glass-blur-strong);
  border-bottom: 1px solid var(--border-glass);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.glass-button {
  background: var(--bg-glass-gradient);
  backdrop-filter: var(--glass-blur-subtle);
  border: 1px solid var(--border-glass-strong);
  color: var(--text-glass-primary);
  transition: all 0.3s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}
```


## Themes Adobe Color
### Lader: Neutral Sans Serif
`#F24F13` - `#F26430` - `#F2865E` - `#F2C1AE` - `#F2F2F2`


### Interior design of a living room
/* Color Theme Swatches in Hex */
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-1-hex { color: #402D1D; }
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-2-hex { color: #8C715A; }
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-3-hex { color: #594839; }
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-4-hex { color: #BFB0A3; }
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-5-hex { color: #F2E4D8; }

/* Color Theme Swatches in RGBA */
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-1-rgba { color: rgba(64, 45, 29, 1); }
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-2-rgba { color: rgba(140, 113, 90, 1); }
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-3-rgba { color: rgba(89, 72, 57, 1); }
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-4-rgba { color: rgba(191, 176, 163, 1); }
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-5-rgba { color: rgba(242, 228, 216, 1); }

/* Color Theme Swatches in HSLA */
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-1-hsla { color: hsla(27, 37, 18, 1); }
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-2-hsla { color: hsla(27, 21, 45, 1); }
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-3-hsla { color: hsla(28, 21, 28, 1); }
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-4-hsla { color: hsla(27, 17, 69, 1); }
.Interior-design-of-a-living-room-with-arches-columns-and-a-painting-in-a-warm-neutral-color-palette-architectural-style-5-hsla { color: hsla(27, 49, 89, 1); }






### Cosmetics texture patterns
/* Color Theme Swatches in Hex */
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-1-hex { color: #D9C9BA; }
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-2-hex { color: #F2E9E4; }
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-3-hex { color: #8C4D3F; }
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-4-hex { color: #BF726B; }
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-5-hex { color: #D99B96; }

/* Color Theme Swatches in RGBA */
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-1-rgba { color: rgba(217, 201, 186, 1); }
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-2-rgba { color: rgba(242, 233, 228, 1); }
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-3-rgba { color: rgba(140, 77, 63, 1); }
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-4-rgba { color: rgba(191, 114, 107, 1); }
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-5-rgba { color: rgba(217, 155, 150, 1); }

/* Color Theme Swatches in HSLA */
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-1-hsla { color: hsla(29, 28, 79, 1); }
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-2-hsla { color: hsla(21, 34, 92, 1); }
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-3-hsla { color: hsla(10, 37, 39, 1); }
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-4-hsla { color: hsla(5, 39, 58, 1); }
.Cosmetics-texture-pattern,-makeup-palette-pastel-neutral-color-eye-shadow,-square-eye-powder-swatches.-Female-cosmetic-and-beauty-products,-aesthetic-minimal-beauty-photo,-shimmer-eyeshade,-top-view-5-hsla { color: hsla(4, 46, 71, 1); }





### GenFrisk04
/* Color Theme Swatches in Hex */
.GenFrisk04-1-hex { color: #030404; }
.GenFrisk04-2-hex { color: #1D1F21; }
.GenFrisk04-3-hex { color: #07201D; }
.GenFrisk04-4-hex { color: #0F2823; }
.GenFrisk04-5-hex { color: #DDDEE5; }

/* Color Theme Swatches in RGBA */
.GenFrisk04-1-rgba { color: rgba(3, 4, 4, 1); }
.GenFrisk04-2-rgba { color: rgba(29, 31, 33, 1); }
.GenFrisk04-3-rgba { color: rgba(7, 32, 29, 1); }
.GenFrisk04-4-rgba { color: rgba(15, 40, 35, 1); }
.GenFrisk04-5-rgba { color: rgba(221, 222, 229, 1); }

/* Color Theme Swatches in HSLA */
.GenFrisk04-1-hsla { color: hsla(180, 14, 1, 1); }
.GenFrisk04-2-hsla { color: hsla(210, 6, 12, 1); }
.GenFrisk04-3-hsla { color: hsla(172, 64, 7, 1); }
.GenFrisk04-4-hsla { color: hsla(168, 45, 10, 1); }
.GenFrisk04-5-hsla { color: hsla(232, 13, 88, 1); }







### Villa Real-Estate
/* Color Theme Swatches in Hex */
.Villa-Real-Estate-|-Branding-1-hex { color: #A6A5A4; }
.Villa-Real-Estate-|-Branding-2-hex { color: #D9D9D9; }
.Villa-Real-Estate-|-Branding-3-hex { color: #8C8377; }
.Villa-Real-Estate-|-Branding-4-hex { color: #403B36; }
.Villa-Real-Estate-|-Branding-5-hex { color: #0D0D0D; }

/* Color Theme Swatches in RGBA */
.Villa-Real-Estate-|-Branding-1-rgba { color: rgba(166, 165, 164, 1); }
.Villa-Real-Estate-|-Branding-2-rgba { color: rgba(217, 217, 217, 1); }
.Villa-Real-Estate-|-Branding-3-rgba { color: rgba(140, 131, 119, 1); }
.Villa-Real-Estate-|-Branding-4-rgba { color: rgba(64, 59, 54, 1); }
.Villa-Real-Estate-|-Branding-5-rgba { color: rgba(13, 13, 13, 1); }

/* Color Theme Swatches in HSLA */
.Villa-Real-Estate-|-Branding-1-hsla { color: hsla(30, 1, 64, 1); }
.Villa-Real-Estate-|-Branding-2-hsla { color: hsla(0, 0, 85, 1); }
.Villa-Real-Estate-|-Branding-3-hsla { color: hsla(34, 8, 50, 1); }
.Villa-Real-Estate-|-Branding-4-hsla { color: hsla(30, 8, 23, 1); }
.Villa-Real-Estate-|-Branding-5-hsla { color: hsla(0, 0, 5, 1); }




### Sun, blue sky and autumn
/* Color Theme Swatches in Hex */
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-1-hex { color: #79A3D9; }
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-2-hex { color: #C4DDF2; }
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-3-hex { color: #73461F; }
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-4-hex { color: #BF7B3F; }
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-5-hex { color: #F2A35E; }

/* Color Theme Swatches in RGBA */
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-1-rgba { color: rgba(121, 163, 217, 1); }
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-2-rgba { color: rgba(196, 221, 242, 1); }
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-3-rgba { color: rgba(115, 70, 31, 1); }
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-4-rgba { color: rgba(191, 123, 63, 1); }
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-5-rgba { color: rgba(242, 163, 94, 1); }

/* Color Theme Swatches in HSLA */
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-1-hsla { color: hsla(213, 55, 66, 1); }
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-2-hsla { color: hsla(207, 63, 85, 1); }
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-3-hsla { color: hsla(27, 57, 28, 1); }
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-4-hsla { color: hsla(28, 50, 49, 1); }
.Sun,-blue-sky-and-autumn-trees-with-grass-in-nature-for-season,-natural-growth-or-conservation.-Empty,-sunlight-and-forest-with-bushes-and-lush-plants-in-countryside,-wilderness-or-outdoor-woods-5-hsla { color: hsla(27, 85, 65, 1); }




### Barren desert landscape
/* Color Theme Swatches in Hex */
.Barren-desert-landscape-with-jagged-sand,-clear-sky-1-hex { color: #024059; }
.Barren-desert-landscape-with-jagged-sand,-clear-sky-2-hex { color: #126173; }
.Barren-desert-landscape-with-jagged-sand,-clear-sky-3-hex { color: #4E9DA6; }
.Barren-desert-landscape-with-jagged-sand,-clear-sky-4-hex { color: #D9A679; }
.Barren-desert-landscape-with-jagged-sand,-clear-sky-5-hex { color: #A65437; }

/* Color Theme Swatches in RGBA */
.Barren-desert-landscape-with-jagged-sand,-clear-sky-1-rgba { color: rgba(2, 64, 89, 1); }
.Barren-desert-landscape-with-jagged-sand,-clear-sky-2-rgba { color: rgba(18, 97, 115, 1); }
.Barren-desert-landscape-with-jagged-sand,-clear-sky-3-rgba { color: rgba(78, 157, 166, 1); }
.Barren-desert-landscape-with-jagged-sand,-clear-sky-4-rgba { color: rgba(217, 166, 121, 1); }
.Barren-desert-landscape-with-jagged-sand,-clear-sky-5-rgba { color: rgba(166, 84, 55, 1); }

/* Color Theme Swatches in HSLA */
.Barren-desert-landscape-with-jagged-sand,-clear-sky-1-hsla { color: hsla(197, 95, 17, 1); }
.Barren-desert-landscape-with-jagged-sand,-clear-sky-2-hsla { color: hsla(191, 72, 26, 1); }
.Barren-desert-landscape-with-jagged-sand,-clear-sky-3-hsla { color: hsla(186, 36, 47, 1); }
.Barren-desert-landscape-with-jagged-sand,-clear-sky-4-hsla { color: hsla(28, 55, 66, 1); }
.Barren-desert-landscape-with-jagged-sand,-clear-sky-5-hsla { color: hsla(15, 50, 43, 1); }




### Tozeur
/* Color Theme Swatches in Hex */
.Tozeur-1-hex { color: #F2A35E; }
.Tozeur-2-hex { color: #BF5D24; }
.Tozeur-3-hex { color: #F29863; }
.Tozeur-4-hex { color: #F2C1AE; }
.Tozeur-5-hex { color: #BF9C99; }

/* Color Theme Swatches in RGBA */
.Tozeur-1-rgba { color: rgba(242, 163, 94, 1); }
.Tozeur-2-rgba { color: rgba(191, 93, 36, 1); }
.Tozeur-3-rgba { color: rgba(242, 152, 99, 1); }
.Tozeur-4-rgba { color: rgba(242, 193, 174, 1); }
.Tozeur-5-rgba { color: rgba(191, 156, 153, 1); }

/* Color Theme Swatches in HSLA */
.Tozeur-1-hsla { color: hsla(27, 85, 65, 1); }
.Tozeur-2-hsla { color: hsla(22, 68, 44, 1); }
.Tozeur-3-hsla { color: hsla(22, 84, 66, 1); }
.Tozeur-4-hsla { color: hsla(16, 72, 81, 1); }
.Tozeur-5-hsla { color: hsla(4, 22, 67, 1); }



### Stone desert
/* Color Theme Swatches in Hex */
.Stone-desert-in-centre-of-the-island,-Fuerteventura-1-hex { color: #5080BF; }
.Stone-desert-in-centre-of-the-island,-Fuerteventura-2-hex { color: #508BBF; }
.Stone-desert-in-centre-of-the-island,-Fuerteventura-3-hex { color: #7EAED9; }
.Stone-desert-in-centre-of-the-island,-Fuerteventura-4-hex { color: #D9AE89; }
.Stone-desert-in-centre-of-the-island,-Fuerteventura-5-hex { color: #A67D65; }

/* Color Theme Swatches in RGBA */
.Stone-desert-in-centre-of-the-island,-Fuerteventura-1-rgba { color: rgba(80, 128, 191, 1); }
.Stone-desert-in-centre-of-the-island,-Fuerteventura-2-rgba { color: rgba(80, 139, 191, 1); }
.Stone-desert-in-centre-of-the-island,-Fuerteventura-3-rgba { color: rgba(126, 174, 217, 1); }
.Stone-desert-in-centre-of-the-island,-Fuerteventura-4-rgba { color: rgba(217, 174, 137, 1); }
.Stone-desert-in-centre-of-the-island,-Fuerteventura-5-rgba { color: rgba(166, 125, 101, 1); }

/* Color Theme Swatches in HSLA */
.Stone-desert-in-centre-of-the-island,-Fuerteventura-1-hsla { color: hsla(214, 46, 53, 1); }
.Stone-desert-in-centre-of-the-island,-Fuerteventura-2-hsla { color: hsla(208, 46, 53, 1); }
.Stone-desert-in-centre-of-the-island,-Fuerteventura-3-hsla { color: hsla(208, 54, 67, 1); }
.Stone-desert-in-centre-of-the-island,-Fuerteventura-4-hsla { color: hsla(27, 51, 69, 1); }
.Stone-desert-in-centre-of-the-island,-Fuerteventura-5-hsla { color: hsla(22, 26, 52, 1); }



### Beach landscape
/* Color Theme Swatches in Hex */
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-1-hex { color: #F2EFE9; }
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-2-hex { color: #BF9169; }
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-3-hex { color: #D9C7B8; }
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-4-hex { color: #8C5B3F; }
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-5-hex { color: #593E2E; }

/* Color Theme Swatches in RGBA */
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-1-rgba { color: rgba(242, 239, 233, 1); }
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-2-rgba { color: rgba(191, 145, 105, 1); }
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-3-rgba { color: rgba(217, 199, 184, 1); }
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-4-rgba { color: rgba(140, 91, 63, 1); }
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-5-rgba { color: rgba(89, 62, 46, 1); }

/* Color Theme Swatches in HSLA */
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-1-hsla { color: hsla(40, 25, 93, 1); }
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-2-hsla { color: hsla(27, 40, 58, 1); }
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-3-hsla { color: hsla(27, 30, 78, 1); }
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-4-hsla { color: hsla(21, 37, 39, 1); }
.Beach-landscape----Cofete,-Fuerteventura,-Canary-Islands.-Perfect-place-for-the-coast-lovers.-Tourist-holiday-destination,-background,-copy-space.-5-hsla { color: hsla(22, 31, 26, 1); }



### Wilderness Landscape Forest
/* Color Theme Swatches in Hex */
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-1-hex { color: #202426; }
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-2-hex { color: #6C733D; }
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-3-hex { color: #9DA65D; }
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-4-hex { color: #8C8C88; }
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-5-hex { color: #F2F2F2; }

/* Color Theme Swatches in RGBA */
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-1-rgba { color: rgba(32, 36, 38, 1); }
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-2-rgba { color: rgba(108, 115, 61, 1); }
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-3-rgba { color: rgba(157, 166, 93, 1); }
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-4-rgba { color: rgba(140, 140, 136, 1); }
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-5-rgba { color: rgba(242, 242, 242, 1); }

/* Color Theme Swatches in HSLA */
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-1-hsla { color: hsla(200, 8, 13, 1); }
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-2-hsla { color: hsla(67, 30, 34, 1); }
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-3-hsla { color: hsla(67, 29, 50, 1); }
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-4-hsla { color: hsla(60, 1, 54, 1); }
.wilderness-landscape-forest-with-pine-trees-and-moss-on-rocks-5-hsla { color: hsla(0, 0, 94, 1); }




### Safari
/* Color Theme Swatches in Hex */
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-1-hex { color: #40282C; }
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-2-hex { color: #7C96A6; }
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-3-hex { color: #D9D8D2; }
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-4-hex { color: #BF8C6F; }
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-5-hex { color: #8C5B49; }

/* Color Theme Swatches in RGBA */
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-1-rgba { color: rgba(64, 40, 44, 1); }
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-2-rgba { color: rgba(124, 150, 166, 1); }
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-3-rgba { color: rgba(217, 216, 210, 1); }
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-4-rgba { color: rgba(191, 140, 111, 1); }
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-5-rgba { color: rgba(140, 91, 73, 1); }

/* Color Theme Swatches in HSLA */
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-1-hsla { color: hsla(350, 23, 20, 1); }
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-2-hsla { color: hsla(202, 19, 56, 1); }
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-3-hsla { color: hsla(51, 8, 83, 1); }
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-4-hsla { color: hsla(21, 38, 59, 1); }
.Safari-and-travel-to-Africa,-extreme-adventures-or-science-expedition-in-a-stone-desert.-Sahara-desert-at-sunrise,-mountain-landscape-with-dust-on-skyline,-hills-and-traces-of-the-off-road-car.-5-hsla { color: hsla(16, 31, 41, 1); }





### Nature Background
/* Color Theme Swatches in Hex */
.nature-background-with-moody-vintage-forest-1-hex { color: #232625; }
.nature-background-with-moody-vintage-forest-2-hex { color: #35403A; }
.nature-background-with-moody-vintage-forest-3-hex { color: #4D5950; }
.nature-background-with-moody-vintage-forest-4-hex { color: #A3A69C; }
.nature-background-with-moody-vintage-forest-5-hex { color: #BFBFB8; }

/* Color Theme Swatches in RGBA */
.nature-background-with-moody-vintage-forest-1-rgba { color: rgba(35, 38, 37, 1); }
.nature-background-with-moody-vintage-forest-2-rgba { color: rgba(53, 64, 58, 1); }
.nature-background-with-moody-vintage-forest-3-rgba { color: rgba(77, 89, 80, 1); }
.nature-background-with-moody-vintage-forest-4-rgba { color: rgba(163, 166, 156, 1); }
.nature-background-with-moody-vintage-forest-5-rgba { color: rgba(191, 191, 184, 1); }

/* Color Theme Swatches in HSLA */
.nature-background-with-moody-vintage-forest-1-hsla { color: hsla(160, 4, 14, 1); }
.nature-background-with-moody-vintage-forest-2-hsla { color: hsla(147, 9, 22, 1); }
.nature-background-with-moody-vintage-forest-3-hsla { color: hsla(135, 7, 32, 1); }
.nature-background-with-moody-vintage-forest-4-hsla { color: hsla(78, 5, 63, 1); }
.nature-background-with-moody-vintage-forest-5-hsla { color: hsla(60, 5, 73, 1); }





### Desert Landscape
/* Color Theme Swatches in Hex */
.Desert-landscape-background-global-warming-concept-1-hex { color: #80BDF2; }
.Desert-landscape-background-global-warming-concept-2-hex { color: #AED3F2; }
.Desert-landscape-background-global-warming-concept-3-hex { color: #8C512E; }
.Desert-landscape-background-global-warming-concept-4-hex { color: #BF7B54; }
.Desert-landscape-background-global-warming-concept-5-hex { color: #F2AD85; }

/* Color Theme Swatches in RGBA */
.Desert-landscape-background-global-warming-concept-1-rgba { color: rgba(128, 189, 242, 1); }
.Desert-landscape-background-global-warming-concept-2-rgba { color: rgba(174, 211, 242, 1); }
.Desert-landscape-background-global-warming-concept-3-rgba { color: rgba(140, 81, 46, 1); }
.Desert-landscape-background-global-warming-concept-4-rgba { color: rgba(191, 123, 84, 1); }
.Desert-landscape-background-global-warming-concept-5-rgba { color: rgba(242, 173, 133, 1); }

/* Color Theme Swatches in HSLA */
.Desert-landscape-background-global-warming-concept-1-hsla { color: hsla(207, 81, 72, 1); }
.Desert-landscape-background-global-warming-concept-2-hsla { color: hsla(207, 72, 81, 1); }
.Desert-landscape-background-global-warming-concept-3-hsla { color: hsla(22, 50, 36, 1); }
.Desert-landscape-background-global-warming-concept-4-hsla { color: hsla(21, 45, 53, 1); }
.Desert-landscape-background-global-warming-concept-5-hsla { color: hsla(22, 80, 73, 1); }





### The wind raises the dust
/* Color Theme Swatches in Hex */
.The-wind-raises-the-dust-in-desert-1-hex { color: #41A8BF; }
.The-wind-raises-the-dust-in-desert-2-hex { color: #B0D1D9; }
.The-wind-raises-the-dust-in-desert-3-hex { color: #F2B077; }
.The-wind-raises-the-dust-in-desert-4-hex { color: #734226; }
.The-wind-raises-the-dust-in-desert-5-hex { color: #A66B49; }

/* Color Theme Swatches in RGBA */
.The-wind-raises-the-dust-in-desert-1-rgba { color: rgba(65, 168, 191, 1); }
.The-wind-raises-the-dust-in-desert-2-rgba { color: rgba(176, 209, 217, 1); }
.The-wind-raises-the-dust-in-desert-3-rgba { color: rgba(242, 176, 119, 1); }
.The-wind-raises-the-dust-in-desert-4-rgba { color: rgba(115, 66, 38, 1); }
.The-wind-raises-the-dust-in-desert-5-rgba { color: rgba(166, 107, 73, 1); }

/* Color Theme Swatches in HSLA */
.The-wind-raises-the-dust-in-desert-1-hsla { color: hsla(190, 49, 50, 1); }
.The-wind-raises-the-dust-in-desert-2-hsla { color: hsla(191, 35, 77, 1); }
.The-wind-raises-the-dust-in-desert-3-hsla { color: hsla(27, 82, 70, 1); }
.The-wind-raises-the-dust-in-desert-4-hsla { color: hsla(21, 50, 30, 1); }
.The-wind-raises-the-dust-in-desert-5-hsla { color: hsla(21, 38, 46, 1); }



### PawHome
/* Color Theme Swatches in Hex */
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-1-hex { color: #F294C0; }
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-2-hex { color: #F29F05; }
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-3-hex { color: #F2DCC2; }
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-4-hex { color: #F27405; }
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-5-hex { color: #A65424; }

/* Color Theme Swatches in RGBA */
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-1-rgba { color: rgba(242, 148, 192, 1); }
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-2-rgba { color: rgba(242, 159, 5, 1); }
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-3-rgba { color: rgba(242, 220, 194, 1); }
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-4-rgba { color: rgba(242, 116, 5, 1); }
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-5-rgba { color: rgba(166, 84, 36, 1); }

/* Color Theme Swatches in HSLA */
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-1-hsla { color: hsla(331, 78, 76, 1); }
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-2-hsla { color: hsla(38, 95, 48, 1); }
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-3-hsla { color: hsla(32, 64, 85, 1); }
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-4-hsla { color: hsla(28, 95, 48, 1); }
.PawHome---Pet-Adoption-Platform-UX/UI-Branding-5-hsla { color: hsla(22, 64, 39, 1); }



### Vorxs - financial
/* Color Theme Swatches in Hex */
.Vorxs-|-All-in-one-financial-management-tool-1-hex { color: #20261C; }
.Vorxs-|-All-in-one-financial-management-tool-2-hex { color: #6B7366; }
.Vorxs-|-All-in-one-financial-management-tool-3-hex { color: #BDBFAE; }
.Vorxs-|-All-in-one-financial-management-tool-4-hex { color: #F2F2F2; }
.Vorxs-|-All-in-one-financial-management-tool-5-hex { color: #0D0D0D; }

/* Color Theme Swatches in RGBA */
.Vorxs-|-All-in-one-financial-management-tool-1-rgba { color: rgba(32, 38, 28, 1); }
.Vorxs-|-All-in-one-financial-management-tool-2-rgba { color: rgba(107, 115, 102, 1); }
.Vorxs-|-All-in-one-financial-management-tool-3-rgba { color: rgba(189, 191, 174, 1); }
.Vorxs-|-All-in-one-financial-management-tool-4-rgba { color: rgba(242, 242, 242, 1); }
.Vorxs-|-All-in-one-financial-management-tool-5-rgba { color: rgba(13, 13, 13, 1); }

/* Color Theme Swatches in HSLA */
.Vorxs-|-All-in-one-financial-management-tool-1-hsla { color: hsla(96, 15, 12, 1); }
.Vorxs-|-All-in-one-financial-management-tool-2-hsla { color: hsla(96, 5, 42, 1); }
.Vorxs-|-All-in-one-financial-management-tool-3-hsla { color: hsla(67, 11, 71, 1); }
.Vorxs-|-All-in-one-financial-management-tool-4-hsla { color: hsla(0, 0, 94, 1); }
.Vorxs-|-All-in-one-financial-management-tool-5-hsla { color: hsla(0, 0, 5, 1); }






### Noise website
/* Color Theme Swatches in Hex */
.Noise-Website-1-hex { color: #ECDFF2; }
.Noise-Website-2-hex { color: #1F261C; }
.Noise-Website-3-hex { color: #D0D9C7; }
.Noise-Website-4-hex { color: #6D7356; }
.Noise-Website-5-hex { color: #D4D9B0; }

/* Color Theme Swatches in RGBA */
.Noise-Website-1-rgba { color: rgba(236, 223, 242, 1); }
.Noise-Website-2-rgba { color: rgba(31, 38, 28, 1); }
.Noise-Website-3-rgba { color: rgba(208, 217, 199, 1); }
.Noise-Website-4-rgba { color: rgba(109, 115, 86, 1); }
.Noise-Website-5-rgba { color: rgba(212, 217, 176, 1); }

/* Color Theme Swatches in HSLA */
.Noise-Website-1-hsla { color: hsla(281, 42, 91, 1); }
.Noise-Website-2-hsla { color: hsla(102, 15, 12, 1); }
.Noise-Website-3-hsla { color: hsla(90, 19, 81, 1); }
.Noise-Website-4-hsla { color: hsla(72, 14, 39, 1); }
.Noise-Website-5-hsla { color: hsla(67, 35, 77, 1); }




### Kepix
/* Color Theme Swatches in Hex */
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-1-hex { color: #070373; }
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-2-hex { color: #2F2B8C; }
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-3-hex { color: #423F8C; }
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-4-hex { color: #7776A6; }
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-5-hex { color: #F2F2F2; }

/* Color Theme Swatches in RGBA */
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-1-rgba { color: rgba(7, 3, 115, 1); }
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-2-rgba { color: rgba(47, 43, 140, 1); }
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-3-rgba { color: rgba(66, 63, 140, 1); }
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-4-rgba { color: rgba(119, 118, 166, 1); }
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-5-rgba { color: rgba(242, 242, 242, 1); }

/* Color Theme Swatches in HSLA */
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-1-hsla { color: hsla(242, 94, 23, 1); }
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-2-hsla { color: hsla(242, 53, 35, 1); }
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-3-hsla { color: hsla(242, 37, 39, 1); }
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-4-hsla { color: hsla(241, 21, 55, 1); }
.WebDesign-for-Auto-Parts-Marketplace-|-Kepix-5-hsla { color: hsla(0, 0, 94, 1); }





### Platform
/* Color Theme Swatches in Hex */
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-1-hex { color: #D3CEF2; }
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-2-hex { color: #0511F2; }
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-3-hex { color: #295BF2; }
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-4-hex { color: #91B2F2; }
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-5-hex { color: #F2F2F2; }

/* Color Theme Swatches in RGBA */
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-1-rgba { color: rgba(211, 206, 242, 1); }
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-2-rgba { color: rgba(5, 17, 242, 1); }
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-3-rgba { color: rgba(41, 91, 242, 1); }
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-4-rgba { color: rgba(145, 178, 242, 1); }
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-5-rgba { color: rgba(242, 242, 242, 1); }

/* Color Theme Swatches in HSLA */
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-1-hsla { color: hsla(248, 58, 87, 1); }
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-2-hsla { color: hsla(236, 95, 48, 1); }
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-3-hsla { color: hsla(225, 88, 55, 1); }
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-4-hsla { color: hsla(219, 78, 75, 1); }
.Carbon-Footprint-Calculation-Platform-UI/UX-Design-5-hsla { color: hsla(0, 0, 94, 1); }





### Remilla Hair Rebranding
/* Color Theme Swatches in Hex */
.Remilia-Hair-Rebranding-1-hex { color: #A8BFAA; }
.Remilia-Hair-Rebranding-2-hex { color: #61734F; }
.Remilia-Hair-Rebranding-3-hex { color: #261201; }
.Remilia-Hair-Rebranding-4-hex { color: #A6896F; }
.Remilia-Hair-Rebranding-5-hex { color: #735646; }

/* Color Theme Swatches in RGBA */
.Remilia-Hair-Rebranding-1-rgba { color: rgba(168, 191, 170, 1); }
.Remilia-Hair-Rebranding-2-rgba { color: rgba(97, 115, 79, 1); }
.Remilia-Hair-Rebranding-3-rgba { color: rgba(38, 18, 1, 1); }
.Remilia-Hair-Rebranding-4-rgba { color: rgba(166, 137, 111, 1); }
.Remilia-Hair-Rebranding-5-rgba { color: rgba(115, 86, 70, 1); }

/* Color Theme Swatches in HSLA */
.Remilia-Hair-Rebranding-1-hsla { color: hsla(125, 15, 70, 1); }
.Remilia-Hair-Rebranding-2-hsla { color: hsla(90, 18, 38, 1); }
.Remilia-Hair-Rebranding-3-hsla { color: hsla(27, 94, 7, 1); }
.Remilia-Hair-Rebranding-4-hsla { color: hsla(28, 23, 54, 1); }
.Remilia-Hair-Rebranding-5-hsla { color: hsla(21, 24, 36, 1); }





### Logofolia 2025
/* Color Theme Swatches in Hex */
.Logofolio-2025-1-hex { color: #205934; }
.Logofolio-2025-2-hex { color: #497354; }
.Logofolio-2025-3-hex { color: #A68A56; }
.Logofolio-2025-4-hex { color: #BF7B54; }
.Logofolio-2025-5-hex { color: #F2D3D0; }

/* Color Theme Swatches in RGBA */
.Logofolio-2025-1-rgba { color: rgba(32, 89, 52, 1); }
.Logofolio-2025-2-rgba { color: rgba(73, 115, 84, 1); }
.Logofolio-2025-3-rgba { color: rgba(166, 138, 86, 1); }
.Logofolio-2025-4-rgba { color: rgba(191, 123, 84, 1); }
.Logofolio-2025-5-rgba { color: rgba(242, 211, 208, 1); }

/* Color Theme Swatches in HSLA */
.Logofolio-2025-1-hsla { color: hsla(141, 47, 23, 1); }
.Logofolio-2025-2-hsla { color: hsla(135, 22, 36, 1); }
.Logofolio-2025-3-hsla { color: hsla(38, 31, 49, 1); }
.Logofolio-2025-4-hsla { color: hsla(21, 45, 53, 1); }
.Logofolio-2025-5-hsla { color: hsla(5, 56, 88, 1); }





### Deep Ceramics
/* Color Theme Swatches in Hex */
.DEEP-CERAMICS---Rebranding-&-Packaging-1-hex { color: #00010D; }
.DEEP-CERAMICS---Rebranding-&-Packaging-2-hex { color: #F2F2F0; }
.DEEP-CERAMICS---Rebranding-&-Packaging-3-hex { color: #40200E; }
.DEEP-CERAMICS---Rebranding-&-Packaging-4-hex { color: #8C7F77; }
.DEEP-CERAMICS---Rebranding-&-Packaging-5-hex { color: #BFB6B0; }

/* Color Theme Swatches in RGBA */
.DEEP-CERAMICS---Rebranding-&-Packaging-1-rgba { color: rgba(0, 1, 13, 1); }
.DEEP-CERAMICS---Rebranding-&-Packaging-2-rgba { color: rgba(242, 242, 240, 1); }
.DEEP-CERAMICS---Rebranding-&-Packaging-3-rgba { color: rgba(64, 32, 14, 1); }
.DEEP-CERAMICS---Rebranding-&-Packaging-4-rgba { color: rgba(140, 127, 119, 1); }
.DEEP-CERAMICS---Rebranding-&-Packaging-5-rgba { color: rgba(191, 182, 176, 1); }

/* Color Theme Swatches in HSLA */
.DEEP-CERAMICS---Rebranding-&-Packaging-1-hsla { color: hsla(235, 100, 2, 1); }
.DEEP-CERAMICS---Rebranding-&-Packaging-2-hsla { color: hsla(60, 7, 94, 1); }
.DEEP-CERAMICS---Rebranding-&-Packaging-3-hsla { color: hsla(21, 64, 15, 1); }
.DEEP-CERAMICS---Rebranding-&-Packaging-4-hsla { color: hsla(22, 8, 50, 1); }
.DEEP-CERAMICS---Rebranding-&-Packaging-5-hsla { color: hsla(24, 10, 71, 1); }




### Encyclopedia of Conservatism
/* Color Theme Swatches in Hex */
.Encyclopedia-of-Conservatism-1-hex { color: #BFBFBD; }
.Encyclopedia-of-Conservatism-2-hex { color: #D9C2A7; }
.Encyclopedia-of-Conservatism-3-hex { color: #F2F2F2; }
.Encyclopedia-of-Conservatism-4-hex { color: #595959; }
.Encyclopedia-of-Conservatism-5-hex { color: #0D0D0D; }

/* Color Theme Swatches in RGBA */
.Encyclopedia-of-Conservatism-1-rgba { color: rgba(191, 191, 189, 1); }
.Encyclopedia-of-Conservatism-2-rgba { color: rgba(217, 194, 167, 1); }
.Encyclopedia-of-Conservatism-3-rgba { color: rgba(242, 242, 242, 1); }
.Encyclopedia-of-Conservatism-4-rgba { color: rgba(89, 89, 89, 1); }
.Encyclopedia-of-Conservatism-5-rgba { color: rgba(13, 13, 13, 1); }

/* Color Theme Swatches in HSLA */
.Encyclopedia-of-Conservatism-1-hsla { color: hsla(60, 1, 74, 1); }
.Encyclopedia-of-Conservatism-2-hsla { color: hsla(32, 39, 75, 1); }
.Encyclopedia-of-Conservatism-3-hsla { color: hsla(0, 0, 94, 1); }
.Encyclopedia-of-Conservatism-4-hsla { color: hsla(0, 0, 34, 1); }
.Encyclopedia-of-Conservatism-5-hsla { color: hsla(0, 0, 5, 1); }





### Sunflower
/* Color Theme Swatches in Hex */
.Sunflower-|-Visual-Identity-1-hex { color: #1C8C4D; }
.Sunflower-|-Visual-Identity-2-hex { color: #6AA67F; }
.Sunflower-|-Visual-Identity-3-hex { color: #D9831A; }
.Sunflower-|-Visual-Identity-4-hex { color: #8C501B; }
.Sunflower-|-Visual-Identity-5-hex { color: #D9CBBF; }

/* Color Theme Swatches in RGBA */
.Sunflower-|-Visual-Identity-1-rgba { color: rgba(28, 140, 77, 1); }
.Sunflower-|-Visual-Identity-2-rgba { color: rgba(106, 166, 127, 1); }
.Sunflower-|-Visual-Identity-3-rgba { color: rgba(217, 131, 26, 1); }
.Sunflower-|-Visual-Identity-4-rgba { color: rgba(140, 80, 27, 1); }
.Sunflower-|-Visual-Identity-5-rgba { color: rgba(217, 203, 191, 1); }

/* Color Theme Swatches in HSLA */
.Sunflower-|-Visual-Identity-1-hsla { color: hsla(146, 66, 32, 1); }
.Sunflower-|-Visual-Identity-2-hsla { color: hsla(141, 25, 53, 1); }
.Sunflower-|-Visual-Identity-3-hsla { color: hsla(32, 78, 47, 1); }
.Sunflower-|-Visual-Identity-4-hsla { color: hsla(28, 67, 32, 1); }
.Sunflower-|-Visual-Identity-5-hsla { color: hsla(27, 25, 80, 1); }





### Quesos la rueda
/* Color Theme Swatches in Hex */
.Quesos-la-rueda-1-hex { color: #A60A27; }
.Quesos-la-rueda-2-hex { color: #9FB0BF; }
.Quesos-la-rueda-3-hex { color: #DCE8F2; }
.Quesos-la-rueda-4-hex { color: #70818C; }
.Quesos-la-rueda-5-hex { color: #400101; }

/* Color Theme Swatches in RGBA */
.Quesos-la-rueda-1-rgba { color: rgba(166, 10, 39, 1); }
.Quesos-la-rueda-2-rgba { color: rgba(159, 176, 191, 1); }
.Quesos-la-rueda-3-rgba { color: rgba(220, 232, 242, 1); }
.Quesos-la-rueda-4-rgba { color: rgba(112, 129, 140, 1); }
.Quesos-la-rueda-5-rgba { color: rgba(64, 1, 1, 1); }

/* Color Theme Swatches in HSLA */
.Quesos-la-rueda-1-hsla { color: hsla(348, 88, 34, 1); }
.Quesos-la-rueda-2-hsla { color: hsla(208, 20, 68, 1); }
.Quesos-la-rueda-3-hsla { color: hsla(207, 45, 90, 1); }
.Quesos-la-rueda-4-hsla { color: hsla(203, 11, 49, 1); }
.Quesos-la-rueda-5-hsla { color: hsla(0, 96, 12, 1); }




### NAQCH
/* Color Theme Swatches in Hex */
.NAQCH-|-SS25-1-hex { color: #F2E0D0; }
.NAQCH-|-SS25-2-hex { color: #BFA095; }
.NAQCH-|-SS25-3-hex { color: #A65E4E; }
.NAQCH-|-SS25-4-hex { color: #735149; }
.NAQCH-|-SS25-5-hex { color: #401713; }

/* Color Theme Swatches in RGBA */
.NAQCH-|-SS25-1-rgba { color: rgba(242, 224, 208, 1); }
.NAQCH-|-SS25-2-rgba { color: rgba(191, 160, 149, 1); }
.NAQCH-|-SS25-3-rgba { color: rgba(166, 94, 78, 1); }
.NAQCH-|-SS25-4-rgba { color: rgba(115, 81, 73, 1); }
.NAQCH-|-SS25-5-rgba { color: rgba(64, 23, 19, 1); }

/* Color Theme Swatches in HSLA */
.NAQCH-|-SS25-1-hsla { color: hsla(28, 56, 88, 1); }
.NAQCH-|-SS25-2-hsla { color: hsla(15, 24, 66, 1); }
.NAQCH-|-SS25-3-hsla { color: hsla(10, 36, 47, 1); }
.NAQCH-|-SS25-4-hsla { color: hsla(11, 22, 36, 1); }
.NAQCH-|-SS25-5-hsla { color: hsla(5, 54, 16, 1); }





### Lake Tahoe
/* Color Theme Swatches in Hex */
.Lake-Tahoe-Summer-'25-1-hex { color: #D9D9D9; }
.Lake-Tahoe-Summer-'25-2-hex { color: #8C8C8C; }
.Lake-Tahoe-Summer-'25-3-hex { color: #595959; }
.Lake-Tahoe-Summer-'25-4-hex { color: #262626; }
.Lake-Tahoe-Summer-'25-5-hex { color: #0D0D0D; }

/* Color Theme Swatches in RGBA */
.Lake-Tahoe-Summer-'25-1-rgba { color: rgba(217, 217, 217, 1); }
.Lake-Tahoe-Summer-'25-2-rgba { color: rgba(140, 140, 140, 1); }
.Lake-Tahoe-Summer-'25-3-rgba { color: rgba(89, 89, 89, 1); }
.Lake-Tahoe-Summer-'25-4-rgba { color: rgba(38, 38, 38, 1); }
.Lake-Tahoe-Summer-'25-5-rgba { color: rgba(13, 13, 13, 1); }

/* Color Theme Swatches in HSLA */
.Lake-Tahoe-Summer-'25-1-hsla { color: hsla(0, 0, 85, 1); }
.Lake-Tahoe-Summer-'25-2-hsla { color: hsla(0, 0, 54, 1); }
.Lake-Tahoe-Summer-'25-3-hsla { color: hsla(0, 0, 34, 1); }
.Lake-Tahoe-Summer-'25-4-hsla { color: hsla(0, 0, 14, 1); }
.Lake-Tahoe-Summer-'25-5-hsla { color: hsla(0, 0, 5, 1); }




### Neiman Marcus
/* Color Theme Swatches in Hex */
.Neiman-Marcus-1-hex { color: #F2F2F0; }
.Neiman-Marcus-2-hex { color: #D5D973; }
.Neiman-Marcus-3-hex { color: #F2DC99; }
.Neiman-Marcus-4-hex { color: #BF8665; }
.Neiman-Marcus-5-hex { color: #8C472E; }

/* Color Theme Swatches in RGBA */
.Neiman-Marcus-1-rgba { color: rgba(242, 242, 240, 1); }
.Neiman-Marcus-2-rgba { color: rgba(213, 217, 115, 1); }
.Neiman-Marcus-3-rgba { color: rgba(242, 220, 153, 1); }
.Neiman-Marcus-4-rgba { color: rgba(191, 134, 101, 1); }
.Neiman-Marcus-5-rgba { color: rgba(140, 71, 46, 1); }

/* Color Theme Swatches in HSLA */
.Neiman-Marcus-1-hsla { color: hsla(60, 7, 94, 1); }
.Neiman-Marcus-2-hsla { color: hsla(62, 57, 65, 1); }
.Neiman-Marcus-3-hsla { color: hsla(45, 77, 77, 1); }
.Neiman-Marcus-4-hsla { color: hsla(22, 41, 57, 1); }
.Neiman-Marcus-5-hsla { color: hsla(15, 50, 36, 1); }




### Evening Dress
/* Color Theme Swatches in Hex */
.EVENING-DRESSES-for-SODAMODA-1-hex { color: #3E5902; }
.EVENING-DRESSES-for-SODAMODA-2-hex { color: #81A632; }
.EVENING-DRESSES-for-SODAMODA-3-hex { color: #B8D943; }
.EVENING-DRESSES-for-SODAMODA-4-hex { color: #ABBF60; }
.EVENING-DRESSES-for-SODAMODA-5-hex { color: #F2F2F2; }

/* Color Theme Swatches in RGBA */
.EVENING-DRESSES-for-SODAMODA-1-rgba { color: rgba(62, 89, 2, 1); }
.EVENING-DRESSES-for-SODAMODA-2-rgba { color: rgba(129, 166, 50, 1); }
.EVENING-DRESSES-for-SODAMODA-3-rgba { color: rgba(184, 217, 67, 1); }
.EVENING-DRESSES-for-SODAMODA-4-rgba { color: rgba(171, 191, 96, 1); }
.EVENING-DRESSES-for-SODAMODA-5-rgba { color: rgba(242, 242, 242, 1); }

/* Color Theme Swatches in HSLA */
.EVENING-DRESSES-for-SODAMODA-1-hsla { color: hsla(78, 95, 17, 1); }
.EVENING-DRESSES-for-SODAMODA-2-hsla { color: hsla(79, 53, 42, 1); }
.EVENING-DRESSES-for-SODAMODA-3-hsla { color: hsla(73, 66, 55, 1); }
.EVENING-DRESSES-for-SODAMODA-4-hsla { color: hsla(72, 42, 56, 1); }
.EVENING-DRESSES-for-SODAMODA-5-hsla { color: hsla(0, 0, 94, 1); }




### DOM part I
/* Color Theme Swatches in Hex */
.DOM-part-I-1-hex { color: #2B3040; }
.DOM-part-I-2-hex { color: #4F5873; }
.DOM-part-I-3-hex { color: #8A91A6; }
.DOM-part-I-4-hex { color: #0D0C0B; }
.DOM-part-I-5-hex { color: #734F43; }

/* Color Theme Swatches in RGBA */
.DOM-part-I-1-rgba { color: rgba(43, 48, 64, 1); }
.DOM-part-I-2-rgba { color: rgba(79, 88, 115, 1); }
.DOM-part-I-3-rgba { color: rgba(138, 145, 166, 1); }
.DOM-part-I-4-rgba { color: rgba(13, 12, 11, 1); }
.DOM-part-I-5-rgba { color: rgba(115, 79, 67, 1); }

/* Color Theme Swatches in HSLA */
.DOM-part-I-1-hsla { color: hsla(225, 19, 20, 1); }
.DOM-part-I-2-hsla { color: hsla(225, 18, 38, 1); }
.DOM-part-I-3-hsla { color: hsla(225, 13, 59, 1); }
.DOM-part-I-4-hsla { color: hsla(30, 8, 4, 1); }
.DOM-part-I-5-hsla { color: hsla(15, 26, 35, 1); }




### Wind of Desert
/* Color Theme Swatches in Hex */
.wind-of-desert-1-hex { color: #1E2620; }
.wind-of-desert-2-hex { color: #0A0D0A; }
.wind-of-desert-3-hex { color: #BFAE9F; }
.wind-of-desert-4-hex { color: #594438; }
.wind-of-desert-5-hex { color: #8C6C5A; }

/* Color Theme Swatches in RGBA */
.wind-of-desert-1-rgba { color: rgba(30, 38, 32, 1); }
.wind-of-desert-2-rgba { color: rgba(10, 13, 10, 1); }
.wind-of-desert-3-rgba { color: rgba(191, 174, 159, 1); }
.wind-of-desert-4-rgba { color: rgba(89, 68, 56, 1); }
.wind-of-desert-5-rgba { color: rgba(140, 108, 90, 1); }

/* Color Theme Swatches in HSLA */
.wind-of-desert-1-hsla { color: hsla(135, 11, 13, 1); }
.wind-of-desert-2-hsla { color: hsla(120, 13, 4, 1); }
.wind-of-desert-3-hsla { color: hsla(28, 20, 68, 1); }
.wind-of-desert-4-hsla { color: hsla(21, 22, 28, 1); }
.wind-of-desert-5-hsla { color: hsla(21, 21, 45, 1); }




### Stolnik editoral
/* Color Theme Swatches in Hex */
.STOLNIK-Fashion-Editorial-May’2025-1-hex { color: #09090D; }
.STOLNIK-Fashion-Editorial-May’2025-2-hex { color: #343840; }
.STOLNIK-Fashion-Editorial-May’2025-3-hex { color: #BDBFBF; }
.STOLNIK-Fashion-Editorial-May’2025-4-hex { color: #8C8069; }
.STOLNIK-Fashion-Editorial-May’2025-5-hex { color: #BFB6A4; }

/* Color Theme Swatches in RGBA */
.STOLNIK-Fashion-Editorial-May’2025-1-rgba { color: rgba(9, 9, 13, 1); }
.STOLNIK-Fashion-Editorial-May’2025-2-rgba { color: rgba(52, 56, 64, 1); }
.STOLNIK-Fashion-Editorial-May’2025-3-rgba { color: rgba(189, 191, 191, 1); }
.STOLNIK-Fashion-Editorial-May’2025-4-rgba { color: rgba(140, 128, 105, 1); }
.STOLNIK-Fashion-Editorial-May’2025-5-rgba { color: rgba(191, 182, 164, 1); }

/* Color Theme Swatches in HSLA */
.STOLNIK-Fashion-Editorial-May’2025-1-hsla { color: hsla(240, 18, 4, 1); }
.STOLNIK-Fashion-Editorial-May’2025-2-hsla { color: hsla(219, 10, 22, 1); }
.STOLNIK-Fashion-Editorial-May’2025-3-hsla { color: hsla(180, 1, 74, 1); }
.STOLNIK-Fashion-Editorial-May’2025-4-hsla { color: hsla(39, 14, 48, 1); }
.STOLNIK-Fashion-Editorial-May’2025-5-hsla { color: hsla(40, 17, 69, 1); }





### Styling
/* Color Theme Swatches in Hex */
.Styling&creative-direction-for-floralcrush-1-hex { color: #D99A4E; }
.Styling&creative-direction-for-floralcrush-2-hex { color: #F2C791; }
.Styling&creative-direction-for-floralcrush-3-hex { color: #BF5D24; }
.Styling&creative-direction-for-floralcrush-4-hex { color: #402313; }
.Styling&creative-direction-for-floralcrush-5-hex { color: #8C5230; }

/* Color Theme Swatches in RGBA */
.Styling&creative-direction-for-floralcrush-1-rgba { color: rgba(217, 154, 78, 1); }
.Styling&creative-direction-for-floralcrush-2-rgba { color: rgba(242, 199, 145, 1); }
.Styling&creative-direction-for-floralcrush-3-rgba { color: rgba(191, 93, 36, 1); }
.Styling&creative-direction-for-floralcrush-4-rgba { color: rgba(64, 35, 19, 1); }
.Styling&creative-direction-for-floralcrush-5-rgba { color: rgba(140, 82, 48, 1); }

/* Color Theme Swatches in HSLA */
.Styling&creative-direction-for-floralcrush-1-hsla { color: hsla(32, 64, 57, 1); }
.Styling&creative-direction-for-floralcrush-2-hsla { color: hsla(33, 78, 75, 1); }
.Styling&creative-direction-for-floralcrush-3-hsla { color: hsla(22, 68, 44, 1); }
.Styling&creative-direction-for-floralcrush-4-hsla { color: hsla(21, 54, 16, 1); }
.Styling&creative-direction-for-floralcrush-5-hsla { color: hsla(22, 48, 36, 1); }





### La Pepa
/* Color Theme Swatches in Hex */
.La-Pepa-1-hex { color: #A60311; }
.La-Pepa-2-hex { color: #A60321; }
.La-Pepa-3-hex { color: #594E3F; }
.La-Pepa-4-hex { color: #D9BEA7; }
.La-Pepa-5-hex { color: #730202; }

/* Color Theme Swatches in RGBA */
.La-Pepa-1-rgba { color: rgba(166, 3, 17, 1); }
.La-Pepa-2-rgba { color: rgba(166, 3, 33, 1); }
.La-Pepa-3-rgba { color: rgba(89, 78, 63, 1); }
.La-Pepa-4-rgba { color: rgba(217, 190, 167, 1); }
.La-Pepa-5-rgba { color: rgba(115, 2, 2, 1); }

/* Color Theme Swatches in HSLA */
.La-Pepa-1-hsla { color: hsla(354, 96, 33, 1); }
.La-Pepa-2-hsla { color: hsla(348, 96, 33, 1); }
.La-Pepa-3-hsla { color: hsla(34, 17, 29, 1); }
.La-Pepa-4-hsla { color: hsla(27, 39, 75, 1); }
.La-Pepa-5-hsla { color: hsla(0, 96, 22, 1); }




### Rocky Salam
/* Color Theme Swatches in Hex */
.Rocky-Salam-1-hex { color: #0378A6; }
.Rocky-Salam-2-hex { color: #049DBF; }
.Rocky-Salam-3-hex { color: #04ADBF; }
.Rocky-Salam-4-hex { color: #A6886D; }
.Rocky-Salam-5-hex { color: #D9C9BA; }

/* Color Theme Swatches in RGBA */
.Rocky-Salam-1-rgba { color: rgba(3, 120, 166, 1); }
.Rocky-Salam-2-rgba { color: rgba(4, 157, 191, 1); }
.Rocky-Salam-3-rgba { color: rgba(4, 173, 191, 1); }
.Rocky-Salam-4-rgba { color: rgba(166, 136, 109, 1); }
.Rocky-Salam-5-rgba { color: rgba(217, 201, 186, 1); }

/* Color Theme Swatches in HSLA */
.Rocky-Salam-1-hsla { color: hsla(196, 96, 33, 1); }
.Rocky-Salam-2-hsla { color: hsla(190, 95, 38, 1); }
.Rocky-Salam-3-hsla { color: hsla(185, 95, 38, 1); }
.Rocky-Salam-4-hsla { color: hsla(28, 24, 53, 1); }
.Rocky-Salam-5-hsla { color: hsla(29, 28, 79, 1); }




### Beauty
/* Color Theme Swatches in Hex */
.BEAUTY-|-PH-GONZALO-CORTES-1-hex { color: #A63348; }
.BEAUTY-|-PH-GONZALO-CORTES-2-hex { color: #D96A93; }
.BEAUTY-|-PH-GONZALO-CORTES-3-hex { color: #F2994B; }
.BEAUTY-|-PH-GONZALO-CORTES-4-hex { color: #F2D8CE; }
.BEAUTY-|-PH-GONZALO-CORTES-5-hex { color: #8C2A14; }

/* Color Theme Swatches in RGBA */
.BEAUTY-|-PH-GONZALO-CORTES-1-rgba { color: rgba(166, 51, 72, 1); }
.BEAUTY-|-PH-GONZALO-CORTES-2-rgba { color: rgba(217, 106, 147, 1); }
.BEAUTY-|-PH-GONZALO-CORTES-3-rgba { color: rgba(242, 153, 75, 1); }
.BEAUTY-|-PH-GONZALO-CORTES-4-rgba { color: rgba(242, 216, 206, 1); }
.BEAUTY-|-PH-GONZALO-CORTES-5-rgba { color: rgba(140, 42, 20, 1); }

/* Color Theme Swatches in HSLA */
.BEAUTY-|-PH-GONZALO-CORTES-1-hsla { color: hsla(349, 52, 42, 1); }
.BEAUTY-|-PH-GONZALO-CORTES-2-hsla { color: hsla(337, 59, 63, 1); }
.BEAUTY-|-PH-GONZALO-CORTES-3-hsla { color: hsla(28, 86, 62, 1); }
.BEAUTY-|-PH-GONZALO-CORTES-4-hsla { color: hsla(16, 58, 87, 1); }
.BEAUTY-|-PH-GONZALO-CORTES-5-hsla { color: hsla(11, 75, 31, 1); }




### Minogarova
/* Color Theme Swatches in Hex */
.Minogarova-x-Otocyon-1-hex { color: #D9D9D9; }
.Minogarova-x-Otocyon-2-hex { color: #736A62; }
.Minogarova-x-Otocyon-3-hex { color: #403734; }
.Minogarova-x-Otocyon-4-hex { color: #A69C98; }
.Minogarova-x-Otocyon-5-hex { color: #0D0D0D; }

/* Color Theme Swatches in RGBA */
.Minogarova-x-Otocyon-1-rgba { color: rgba(217, 217, 217, 1); }
.Minogarova-x-Otocyon-2-rgba { color: rgba(115, 106, 98, 1); }
.Minogarova-x-Otocyon-3-rgba { color: rgba(64, 55, 52, 1); }
.Minogarova-x-Otocyon-4-rgba { color: rgba(166, 156, 152, 1); }
.Minogarova-x-Otocyon-5-rgba { color: rgba(13, 13, 13, 1); }

/* Color Theme Swatches in HSLA */
.Minogarova-x-Otocyon-1-hsla { color: hsla(0, 0, 85, 1); }
.Minogarova-x-Otocyon-2-hsla { color: hsla(28, 7, 41, 1); }
.Minogarova-x-Otocyon-3-hsla { color: hsla(15, 10, 22, 1); }
.Minogarova-x-Otocyon-4-hsla { color: hsla(17, 7, 62, 1); }
.Minogarova-x-Otocyon-5-hsla { color: hsla(0, 0, 5, 1); }




### Fashion
/* Color Theme Swatches in Hex */
.Fashion-1-hex { color: #A60311; }
.Fashion-2-hex { color: #A60321; }
.Fashion-3-hex { color: #594E3F; }
.Fashion-4-hex { color: #D9BEA7; }
.Fashion-5-hex { color: #730202; }

/* Color Theme Swatches in RGBA */
.Fashion-1-rgba { color: rgba(166, 3, 17, 1); }
.Fashion-2-rgba { color: rgba(166, 3, 33, 1); }
.Fashion-3-rgba { color: rgba(89, 78, 63, 1); }
.Fashion-4-rgba { color: rgba(217, 190, 167, 1); }
.Fashion-5-rgba { color: rgba(115, 2, 2, 1); }

/* Color Theme Swatches in HSLA */
.Fashion-1-hsla { color: hsla(354, 96, 33, 1); }
.Fashion-2-hsla { color: hsla(348, 96, 33, 1); }
.Fashion-3-hsla { color: hsla(34, 17, 29, 1); }
.Fashion-4-hsla { color: hsla(27, 39, 75, 1); }
.Fashion-5-hsla { color: hsla(0, 96, 22, 1); }






### Blue summer
/* Color Theme Swatches in Hex */
.Fashion-1-hex { color: #0378A6; }
.Fashion-2-hex { color: #049DBF; }
.Fashion-3-hex { color: #04ADBF; }
.Fashion-4-hex { color: #A6886D; }
.Fashion-5-hex { color: #D9C9BA; }

/* Color Theme Swatches in RGBA */
.Fashion-1-rgba { color: rgba(3, 120, 166, 1); }
.Fashion-2-rgba { color: rgba(4, 157, 191, 1); }
.Fashion-3-rgba { color: rgba(4, 173, 191, 1); }
.Fashion-4-rgba { color: rgba(166, 136, 109, 1); }
.Fashion-5-rgba { color: rgba(217, 201, 186, 1); }

/* Color Theme Swatches in HSLA */
.Fashion-1-hsla { color: hsla(196, 96, 33, 1); }
.Fashion-2-hsla { color: hsla(190, 95, 38, 1); }
.Fashion-3-hsla { color: hsla(185, 95, 38, 1); }
.Fashion-4-hsla { color: hsla(28, 24, 53, 1); }
.Fashion-5-hsla { color: hsla(29, 28, 79, 1); }






### Beige class
/* Color Theme Swatches in Hex */
.Fashion-1-hex { color: #D9D9D9; }
.Fashion-2-hex { color: #736A62; }
.Fashion-3-hex { color: #403734; }
.Fashion-4-hex { color: #A69C98; }
.Fashion-5-hex { color: #0D0D0D; }

/* Color Theme Swatches in RGBA */
.Fashion-1-rgba { color: rgba(217, 217, 217, 1); }
.Fashion-2-rgba { color: rgba(115, 106, 98, 1); }
.Fashion-3-rgba { color: rgba(64, 55, 52, 1); }
.Fashion-4-rgba { color: rgba(166, 156, 152, 1); }
.Fashion-5-rgba { color: rgba(13, 13, 13, 1); }

/* Color Theme Swatches in HSLA */
.Fashion-1-hsla { color: hsla(0, 0, 85, 1); }
.Fashion-2-hsla { color: hsla(28, 7, 41, 1); }
.Fashion-3-hsla { color: hsla(15, 10, 22, 1); }
.Fashion-4-hsla { color: hsla(17, 7, 62, 1); }
.Fashion-5-hsla { color: hsla(0, 0, 5, 1); }
