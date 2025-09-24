# Design
## Overview
This UI library provides a comprehensive collection of production-ready Angular components with modern design principles, accessibility compliance, and theming support. The components follow Material Design 3 guidelines with custom enhancements for liquid glass effects, advanced animations, and flexible theming.

### Core Principles
- **Accessibility First**: All components meet WCAG 2.1 AA standards with proper ARIA support and keyboard navigation
- **Responsive Design**: Mobile-first approach with fluid layouts and touch-friendly interactions
- **Performance Optimized**: GPU-accelerated animations and efficient rendering
- **Theme Flexibility**: CSS variables-based theming with dark/light mode support
- **Developer Experience**: TypeScript support, consistent APIs, and comprehensive documentation

&nbsp;  
&nbsp;  
## Colors

### Color Guidelines
- Minimum contrast ratio of 4.5:1 for normal text
- Minimum contrast ratio of 3:1 for large text and UI components
- Color should not be the only means of conveying information
- Support for high contrast mode


### Color System
The library uses a semantic color system based on CSS variables for maximum flexibility and theme consistency.
#### Primary Colors - Themes
**Themes**:
- Blue (default): #1768ff
- Green: #4caf50
- Purple: #9c27b0
- Red: #f44336


```css
:root {
  --ui-primary: ;
  --ui-primary-light = --ui-primary - 20% contrast;
  --ui-primary-dark = --ui-primary + 20% contrast;
  --ui-on-primary: #ffffff;
}
```

#### Surface & Background
```css
:root {
  --ui-surface: #ffffff;
  --ui-background: #fafafa;
  --ui-surface-variant: #f5f5f5;
  --ui-on-surface: #1a1a1a;
  --ui-on-background: #212121;
}
```

#### Semantic Colors
```css
:root {
  --ui-success: #4caf50;
  --ui-warning: #ff9800;
  --ui-error: #f44336;
  --ui-info: #2196f3;
}
```

#### Dark Mode
Dark theme variants are automatically applied when `data-theme="dark"` is set on the root element.



&nbsp;  
&nbsp;  
## Typography
### Font System
Primary font: **Inter** with fallbacks to system fonts for optimal performance and cross-platform consistency.

```css
:root {
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
}
```

### Type Scale
```css
:root {
  --text-xs: 12px;    /* Caption, helper text */
  --text-sm: 14px;    /* Body small, secondary text */
  --text-base: 16px;  /* Body text, labels */
  --text-lg: 18px;    /* Subtitle, large body */
  --text-xl: 20px;    /* Card titles, section headers */
  --text-2xl: 24px;   /* Page titles, modal headers */
  --text-3xl: 30px;   /* Display text, hero titles */
  --text-4xl: 36px;   /* Large display text */
}
```

### Font Weights
- **Light (300)**: Large display text
- **Regular (400)**: Body text, captions
- **Medium (500)**: Buttons, labels, emphasis
- **Semibold (600)**: Headings, card titles
- **Bold (700)**: Major headings, important emphasis

### Line Heights
```css
:root {
  --leading-tight: 1.25;    /* Headings */
  --leading-normal: 1.5;    /* Body text */
  --leading-relaxed: 1.75;  /* Large text blocks */
}
```


&nbsp;  
&nbsp;  
## Icons
### Icon System
The library supports multiple icon systems for maximum flexibility:

#### Recommended Icon Libraries
- **Phosphor Icons**: Modern, consistent, and comprehensive
- **Heroicons**: Clean, outlined and solid variations
- **Google Material Icons**: Standard and sharp variants
- **Ionicons**: iOS/Android style icons
- **Remix Icons**: Open-source icon library

#### Implementation
```typescript
@Component({
  selector: 'ui-icon',
  template: `
    <svg [attr.width]="size" [attr.height]="size" class="ui-icon">
      <use [attr.href]="'#' + name"></use>
    </svg>
  `
})
export class UiIcon {
  @Input() name: string;
  @Input() size: number = 24;
}
```

#### Icon Sizes
- **Small**: 16px (inline text, compact UI)
- **Medium**: 20px (buttons, form controls)
- **Large**: 24px (default, general UI)
- **XL**: 32px (headers, prominent actions)



&nbsp;  
&nbsp;  
## Components
### Design Tokens
#### Spacing Scale
```css
:root {
  --space-1: 4px;   /* Tight spacing */
  --space-2: 8px;   /* Component internal padding */
  --space-3: 12px;  /* Small gaps */
  --space-4: 16px;  /* Standard spacing */
  --space-5: 24px;  /* Section spacing */
  --space-6: 32px;  /* Large gaps */
  --space-8: 48px;  /* Major sections */
  --space-12: 64px; /* Page sections */
}
```

#### Border Radius
```css
:root {
  --radius-sm: 4px;   /* Small elements */
  --radius-md: 8px;   /* Default */
  --radius-lg: 12px;  /* Cards, modals */
  --radius-xl: 16px;  /* Large containers */
  --radius-full: 9999px; /* Pills, avatars */
}
```

#### Elevation System
```css
:root {
  --elevation-0: none;
  --elevation-1: 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06);
  --elevation-2: 0 4px 10px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08);
  --elevation-3: 0 8px 24px rgba(0,0,0,0.14), 0 3px 8px rgba(0,0,0,0.10);
  --elevation-4: 0 16px 32px rgba(0,0,0,0.16), 0 6px 12px rgba(0,0,0,0.12);
}
```

### Buttons
#### Variants
- **Primary**: Main call-to-action buttons
- **Secondary**: Secondary actions, outlined style
- **Tertiary**: Subtle actions, text-only
- **Text**: Minimal styling, text appearance
- **Ghost**: Transparent background with hover effects
- **Danger**: Destructive actions (red theme)
- **Success**: Positive actions (green theme)

#### Sizes
- **XS**: 28px height, compact interfaces
- **SM**: 32px height, dense layouts
- **MD**: 40px height, default size
- **LG**: 48px height, prominence
- **XL**: 56px height, hero actions

#### States
- Normal, hover, active, focus, disabled, loading, pressed


### Forms
#### Form Field Architecture
All form controls use a consistent wrapper pattern:
- Label positioning (top, left, floating)
- Helper text and validation messages
- Prefix/suffix icons
- Required indicators
- Error state styling

#### Input Types
- Text, password, email, tel, url, number
- Search with clear button
- Textarea with auto-resize
- File upload with drag & drop

#### Advanced Controls
- Select (single/multi) with search and virtual scrolling
- Datepicker with range selection
- Timepicker (12/24 hour)
- Slider/range inputs
- Color picker
- Rich text editor integration


### Modals
#### Modal Types
- **Dialog**: Standard modal with backdrop
- **Drawer**: Side-sliding panels
- **Bottom Sheet**: Mobile-optimized modals
- **Popover**: Contextual overlays
- **Tooltip**: Hover/focus information

#### Features
- Focus trapping and restoration
- Keyboard navigation (ESC to close)
- Backdrop click handling
- Stacking support
- Responsive sizing
- Animation presets


### Navigation
#### Navigation Components
- **Navbar**: Top-level navigation bar
- **Sidebar**: Collapsible side navigation
- **Breadcrumbs**: Hierarchical navigation
- **Tabs**: Content switching interface
- **Pagination**: Data set navigation
- **Stepper**: Multi-step processes

#### Mobile Considerations
- Touch-friendly targets (minimum 44px)
- Swipe gestures support
- Collapsible menus
- Bottom navigation for mobile apps


### Liquid Glass Effects
#### Visual Design
The library includes advanced "liquid glass" components with:
- Backdrop blur filters
- Chromatic aberration simulation
- Edge distortion effects
- Subtle animations and micro-interactions

#### Implementation Features
- SVG displacement filters for organic distortion
- Multi-layer color fringing effects
- Graceful fallbacks for older browsers
- Performance optimizations for mobile devices


&nbsp;  
&nbsp;  
## Animation System
### Motion Tokens
```css
:root {
  --motion-fast: 150ms;      /* Micro-interactions */
  --motion-standard: 240ms;  /* Standard transitions */
  --motion-slow: 360ms;      /* Complex animations */
  --motion-ease-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --motion-ease-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
  --motion-ease-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
}
```

### Animation Principles
- Respect `prefers-reduced-motion` preferences
- Use GPU-accelerated properties (transform, opacity)
- Consistent easing curves across components
- Purposeful motion that enhances usability

### Common Animations
- Fade in/out transitions
- Slide movements for drawers and sheets
- Scale transforms for button interactions
- Stagger animations for lists
- Loading spinners and progress indicators

## Accessibility Guidelines

### WCAG 2.1 Compliance
- **Level AA** conformance for all components
- Color contrast ratios meet requirements
- Keyboard navigation support
- Screen reader compatibility
- Focus management

### Implementation Standards
- Semantic HTML structure
- ARIA labels and descriptions
- Role attributes for custom components
- Live regions for dynamic content
- Skip links for navigation

### Testing Requirements
- Automated accessibility testing with axe
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- High contrast mode support


&nbsp;  
&nbsp;  
## Resources
### Design References
- [Material Design 3](https://m3.material.io)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)

### Development Tools
- [Storybook](https://storybook.js.org/) for component documentation
- [Angular CDK](https://material.angular.io/cdk/) for advanced functionality
- [axe-core](https://github.com/dequelabs/axe-core) for accessibility testing

### Icon Libraries
- [Phosphor Icons](https://phosphoricons.com/)
- [Heroicons](https://heroicons.com/)
- [Google Material Icons](https://fonts.google.com/icons)
- [Ionicons](https://ionic.io/ionicons)


&nbsp;  
&nbsp;  
## References
### Component Inspiration
- [Material Design Components](https://m3.material.io/components)
- [Bootstrap Components](https://getbootstrap.com/docs/5.3/components/)
- [Tailwind UI](https://tailwindui.com/)
- [PrimeNG](https://www.primefaces.org/primeng/)

### Best Practices
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [CSS Architecture Guidelines](https://cssguidelin.es/)
- [Performance Best Practices](https://web.dev/performance/)