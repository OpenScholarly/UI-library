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

&nbsp;  
### Interior design of a living room
`#402D1D` - `#8C715A` - `#594839` - `#BFB0A3` - `#F2E4D8`

&nbsp;  
### Cosmetics texture patterns
`#D9C9BA` - `#F2E9E4` - `#8C4D3F` - `#BF726B` - `#D99B96`

&nbsp;  
### GenFrisk04
`#030404` - `#1D1F21` - `#07201D` - `#0F2823` - `#DDDEE5`

&nbsp;  
### Villa Real-Estate
`#A6A5A4` - `#D9D9D9` - `#8C8377` - `#403B36` - `#0D0D0D`

&nbsp;  
### Sun, blue sky and autumn
`#79A3D9` - `#C4DDF2` - `#73461F` - `#BF7B3F` - `#F2A35E`

&nbsp;  
### Barren desert landscape
`#024059` - `#126173` - `#4E9DA6` - `#D9A679` - `#A65437`

&nbsp;  
### Tozeur
`#F2A35E` - `#BF5D24` - `#F29863` - `#F2C1AE` - `#BF9C99`

&nbsp;  
### Stone desert
`#5080BF` - `#508BBF` - `#7EAED9` - `#D9AE89` - `#A67D65`


# Beach landscape
`#F2EFE9` - `#BF9169` - `#D9C7B8` - `#8C5B3F` - `#593E2E`

&nbsp;  
### Wilderness Landscape Forest
`#202426` - `#6C733D` - `#9DA65D` - `#8C8C88` - `#F2F2F2`

&nbsp;  
### Safari
`#40282C` - `#7C96A6` - `#D9D8D2` - `#BF8C6F` - `#8C5B49`

&nbsp;  
### Nature Background
`#232625` - `#35403A` - `#4D5950` - `#A3A69C` - `#BFBFB8`

&nbsp;  
### Desert Landscape
`#80BDF2` - `#AED3F2` - `#8C512E` - `#BF7B54` - `#F2AD85`

&nbsp;  
### The wind raises the dust
`#41A8BF` - `#B0D1D9` - `#F2B077` - `#734226` - `#A66B49`

&nbsp;  
### PawHome
`#F294C0` - `#F29F05` - `#F2DCC2` - `#F27405` - `#A65424`

&nbsp;  
### Vorxs - financial
`#20261C` - `#6B7366` - `#BDBFAE` - `#F2F2F2` - `#0D0D0D`

&nbsp;  
### Noise website
`#ECDFF2` - `#1F261C` - `#D0D9C7` - `#6D7356` - `#D4D9B0`

&nbsp;  
### Kepix
`#070373` - `#2F2B8C` - `#423F8C` - `#7776A6` - `#F2F2F2`

&nbsp;  
### Platform
`#D3CEF2` - `#0511F2` - `#295BF2` - `#91B2F2` - `#F2F2F2`

&nbsp;  
### Remilla Hair Rebranding
`#A8BFAA` - `#61734F` - `#261201` - `#A6896F` - `#735646`

&nbsp;  
### Logofolia 2025
`#205934` - `#497354` - `#A68A56` - `#BF7B54` - `#F2D3D0`

&nbsp;  
### Deep Ceramics
`#00010D` - `#F2F2F0` - `#40200E` - `#8C7F77` - `#BFB6B0`

&nbsp;  
### Encyclopedia of Conservatism
`#BFBFBD` - `#D9C2A7` - `#F2F2F2` - `#595959` - `#0D0D0D`

&nbsp;  
### Sunflower
`#1C8C4D` - `#6AA67F` - `#D9831A` - `#8C501B` - `#D9CBBF`

&nbsp;  
### Quesos la rueda
`#A60A27` - `#9FB0BF` - `#DCE8F2` - `#70818C` - `#400101`

&nbsp;  
### NAQCH
`#F2E0D0` - `#BFA095` - `#A65E4E` - `#735149` - `#401713`

&nbsp;  
### Lake Tahoe
`#D9D9D9` - `#8C8C8C` - `#595959` - `#262626` - `#0D0D0D`

&nbsp;  
### Neiman Marcus
`#F2F2F0` - `#D5D973` - `#F2DC99` - `#BF8665` - `#8C472E`

&nbsp;  
### Evening Dress
`#3E5902` - `#81A632` - `#B8D943` - `#ABBF60` - `#F2F2F2`

&nbsp;  
### DOM part I
`#2B3040` - `#4F5873` - `#8A91A6` - `#0D0C0B` - `#734F43`

&nbsp;  
### Wind of Desert
`#1E2620` - `#0A0D0A` - `#BFAE9F` - `#594438` - `#8C6C5A`

&nbsp;  
### Stolnik editoral
`#09090D` - `#343840` - `#BDBFBF` - `#8C8069` - `#BFB6A4`

&nbsp;  
### Styling
`#D99A4E` - `#F2C791` - `#BF5D24` - `#402313` - `#8C5230`

&nbsp;  
### La Pepa
`#A60311` - `#A60321` - `#594E3F` - `#D9BEA7` - `#730202`

&nbsp;  
### Rocky Salam
`#0378A6` - `#049DBF` - `#04ADBF` - `#A6886D` - `#D9C9BA`

&nbsp;  
### Beauty
`#A63348` - `#D96A93` - `#F2994B` - `#F2D8CE` - `#8C2A14`

&nbsp;  
### Minogarova
`#D9D9D9` - `#736A62` - `#403734` - `#A69C98` - `#0D0D0D`

&nbsp;  
### Fashion
`#A60311` - `#A60321` - `#594E3F` - `#D9BEA7` - `#730202`

&nbsp;  
### Blue summer
`#0378A6` - `#049DBF` - `#04ADBF` - `#A6886D` - `#D9C9BA`

&nbsp;  
### Beige class
`#D9D9D9` - `#736A62` - `#403734` - `#A69C98` - `#0D0D0D`
