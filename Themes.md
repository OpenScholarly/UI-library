# Themes & Color Systems
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
| `tozeur` | Desert Terracotta | #F2A35E | Warm, inviting brands |
| `lader-neutral` | Bold Citrus | #F26430 | Modern, minimalist |
| `wilderness-forest` | Wilderness Landscape Forest | #9DA65D | Outdoor, sustainability, editorial |
| `safari` | Safari | #BF8C6F | Travel, adventure, lifestyle |
| `pawhome` | Playful Sunset | #F29F05 | Pets, kids, playful brands |
| `platform` | Platform | #295BF2 | Tech platforms, dashboards |
| `sunflower` | Sunflower | #D9831A | Agriculture, wellness, eco retail |
| `naqch` | Clay & Rust | #A65E4E | Artisanal, interiors, editorial |
| `neiman-marcus` | Golden Luxury | #BF8665 | Luxury retail, fashion, hospitality |
| `rocky-salam` | Coastal Breeze | #049DBF | Coastal brands, travel, marketing |
| `beauty` | Beauty | #D96A93 | Beauty, fashion, e-commerce |


&nbsp;  
Each theme includes these color roles:
- **primary**: Your main brand color for primary actions (e.g., buttons, links)
- **primaryLight**: Lighter variant (e.g., hover states)
- **primaryDark**: Darker variant (e.g., pressed states)
- **secondary**: Supporting color (e.g., secondary buttons)
- **accent**: Highlight color (e.g., CTAs, badges)
- **surface**: Background color (e.g., cards, panels)


&nbsp;  
## Implementation
```typescript
import { Injectable, signal, computed } from '@angular/core';
import { applyThemeVariables, getThemeInfo } from '@ui-components/lib/theme-colors';
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeKey = signal<string>('ocean-blue');
  readonly currentTheme = this.currentThemeKey.asReadonly();

  readonly themeInfo = computed(() => getThemeInfo(this.currentThemeKey()));
  
  setTheme(themeKey: string): void {
    // This automatically sets both --ui-* and --primary-* variables
    const success = applyThemeVariables(themeKey);
    
    if(success) {
      this.currentThemeKey.set(themeKey);
      localStorage.setItem('ui-theme', themeKey);
    }
  }
}
```


Use the standard `--ui-*` variables that align with Tailwind config:  
```css
.my-button {
  background-color: var(--ui-primary);
  color: white;
}
```

Or use shade variables for more granular control:  
```css
.my-element {
  background: var(--primary-50);
}
```

Get a color by role in your component:  
```typescript
import { getColorByRole, signal } from '@ui-components/lib/theme-colors';

@Component({
  selector: 'app-card',
  styles: [`
    :host {
      background-color: {{ surfaceColor() }};
    }
  `]
})
export class CardComponent {
  surfaceColor = signal(getColorByRole('ocean-blue', 'surface'));
}
```




&nbsp;  
## Sources
- [Material Theme Builder](https://m3.material.io/theme-builder)
- [Coolors.co](https://coolors.co)
- [Adobe Color](https://color.adobe.com)
- [Paletton](https://paletton.com)

