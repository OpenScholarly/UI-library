# Design References & Guidelines
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
## Rules
### Shadows & “shiny colored backdrop” rules (depth + glow)
**Goal:** depth + personality without breaking contrast/accessibility or looking noisy.
Design rules:
* Treat elevation as discrete tokens (e.g. `elevation-0..5`) and map each to consistent shadow layers (ambient + key). Use layered shadows (small crisp + large soft) to imply distance. (Material uses a z-space with levels.) ([Material Design][1])
* If you add *colored glow*, keep it subtle: low opacity, large blur, and matched to the component’s accent color so it reads as a reflection/ambient light rather than a harsh halo. Use color glows sparingly (primary/cta only).
* For translucent backdrop effects (glassy panels), combine a semi-transparent fill with `backdrop-filter: blur()` and a subtle shadow under the panel to create separation (Apple “materials” guidance). ([Apple Developer][7])


Practical CSS tokens (copy into your design tokens):
```css
:root{
  /* elevation (ambient + key shadows) */
  --elevation-0: none;
  --elevation-1: 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06);
  --elevation-2: 0 4px 10px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08);
  --elevation-3: 0 8px 24px rgba(0,0,0,0.14), 0 3px 8px rgba(0,0,0,0.10);
  /* colored glow (use only for key elements) */
  --accent-r: 22; --accent-g: 120; --accent-b: 255; /* example */
  --glow-1: 0 10px 30px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.10);
  /* glass */
  --glass-bg: rgba(255,255,255,0.6);
  --glass-blur: blur(8px);
}
```


Example usage:
```css
.card {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  box-shadow: var(--elevation-2), var(--glow-1); /* elevation + subtle color glow */
  border-radius: 12px;
}
```

Notes:
* Avoid high-saturation colored shadows at high opacity — they reduce legibility and look amateurish.
* Test shadows at different backgrounds; darker UIs usually need lighter colored glows.





### Motion & animation rules (timing, easing, purpose)
**Goal:** make interactions feel natural and fast without causing confusion or sickness.
Design rules:
* Use motion tokens (durations + easing) across the system; use the same handful everywhere for consistency. Example tokens: `fast = 100–150ms`, `standard = 200–300ms`, `slow = 350–450ms`. Material and Apple use similar ranges (mobile often slightly longer than web). ([Material Design][8], [Material Design][9])
* Choose easing that feels natural: `cubic-bezier(0.4, 0.0, 0.2, 1)` (Material “standard”) for most transitions; reserve spring physics for micro-interactions (buttons, toggles). ([Material Design][10], [Apple Developer][11])
* Animate *meaningful* properties only: opacity, transform (translate/scale) and filters. Avoid animating layout-heavy properties (width/height) when possible — prefer transforms for GPU-accelerated smoothness.
* Respect `prefers-reduced-motion` and provide alternatives (fade instead of slide/scale, or disable non-essential motion). ([MDN Web Docs][2], [W3C][3])


Motion tokens (CSS + JS):
```css
:root{
  --motion-fast: 150ms;
  --motion-standard: 240ms;
  --motion-slow: 360ms;
  --motion-ease-standard: cubic-bezier(.4,0,.2,1);
  --motion-ease-decelerate: cubic-bezier(.0,0,.2,1);
}

/* respect reduced motion */
@media (prefers-reduced-motion: reduce){
  * { transition-duration: 0.001ms !important; animation-duration: 0.001ms !important; }
}
```

Micro-interaction example (button press):
```css
.ui-btn { transition: transform var(--motion-fast) var(--motion-ease-standard); }
.ui-btn:active { transform: scale(0.98); }
```




### Sizing, spacing, and responsive layout
**Goal:** consistent rhythm and comfortable density on every screen.
Rules & tokens:
* Adopt a spacing scale: `4px` base → `[4,8,12,16,24,32,48,64]` (or `1,2,3,4,6,8` units). Use these for padding, gaps, and margins. Material uses `8dp` grid but smaller gaps are fine when grouped. ([Material Design][12])
* Touch / click targets: at least **48×48 dp** on Android/Material and **44×44 pt** on iOS; add at least `8dp` spacing between touch targets where possible. Implement larger targets for desktop pointer (hover) UI when needed. ([Material Design][4], [Apple Developer][5])
* Establish breakpoints and container widths (example):
  * Mobile: `<= 599px` — single column, roomy touch targets
  * Tablet: `600–1023px` — 2 columns or responsive layout
  * Desktop: `>=1024px` — 12-column grid (max container width 1200–1400px)
* Layout grid: 12 columns with gutter = one spacing unit (e.g., 16px). Use `minmax()` and CSS Grid for robust responsive behavior.


Example spacing variables:
```css
:root{
  --space-1: 4px; --space-2: 8px; --space-3: 12px;
  --space-4: 16px; --space-5: 24px; --space-6: 32px;
  --container-max: 1280px;
  --gutter: var(--space-4);
}
```

Sizing rules for components:
* Buttons: small/normal/large heights = `32px/40px/48px` (desktop can be slightly larger); ensure label text still meets contrast/legibility.
* Inputs/controls: consistent vertical rhythm — e.g., input height 40px with 12px internal padding.
* Icons: use 16/20/24/32 sizes and keep visual weight consistent.




### Color, contrast & accessible color usage
**Goal:** beautiful palettes that remain readable and accessible.
Rules:
* Meet WCAG contrast for all text and UI elements: **4.5:1** for normal text; **3:1** for large text/UI components. Use tooling to check ratios (WCAG / WebAIM). ([W3C][6], [WebAIM][13])
* Don’t rely on color alone to convey meaning (also add icons or labels). WCAG’s “use of color” guidance covers this. ([W3C][14])
* For shiny/colored backgrounds: ensure foreground content (text/icons) sits on a solid or well-contrasted layer; if you use translucency, add gradient overlays or a subtle tint to preserve contrast.

Practical tip: build theme tokens:
```css
:root{
  --color-bg: #0f1724;
  --color-surface: #0b1220;
  --color-primary: #1768ff;
  --color-on-primary: #ffffff;
}
```
Then generate accessible light/dark variants and test them.



### Keyboard & screen-reader accessibility (must-haves)
**Goal:** full keyboard operability and clear semantics.
Checklist:
* Use native controls where possible (native semantics are best). When building custom widgets, follow WAI-ARIA Authoring Practices for patterns (menu, dialog, tabs, listbox). ([W3C][15])
* Ensure visible focus styles (use `:focus-visible`) that meet contrast and size requirements. Provide a clear focus ring that’s not removed.
* Keyboard rules: `Tab`/`Shift+Tab` for forward/backward focus, arrow keys for menus/radios/listboxes, `Esc` to close overlays; document any deviation. ([W3C][16])
* Announce dynamic changes to assistive tech (use `aria-live` regions for notifications/toasts); ensure role attributes and `aria-*` states reflect real state.
* Follow color contrast and “don’t rely on color alone” rules above. ([W3C][6])


### Performance & practical constraints
* Keep shadows & backdrop-filter usage moderate — `backdrop-filter` can be expensive on low-end devices and cause repainting; use sparingly (e.g., top nav, dialogs). Apple’s glassy materials are powerful but expensive. ([Apple Developer][7])
* Prefer GPU-accelerated transforms (`transform`, `opacity`) and limit layout-triggering animations.


### Quick implementation recipes
**A. CSS multi-layer shadow + colored glow**
```css
.card {
  box-shadow:
    0 2px 6px rgba(0,0,0,0.12),  /* crisp umbra */
    0 12px 30px rgba(0,0,0,0.08), /* soft penumbra */
    0 10px 40px rgba(22,120,255,0.06); /* colored ambient glow */
}
```

**B. Motion token + reduced motion**
```css
:root { --standard: 240ms; --ease: cubic-bezier(.4,0,.2,1); }
.anim { transition: transform var(--standard) var(--ease), opacity var(--standard) var(--ease); }
@media (prefers-reduced-motion: reduce) {
  .anim { transition: none !important; animation: none !important; }
}
```

**C. Accessible modal basics**
* `role="dialog" aria-modal="true" aria-labelledby="dialog-title"`
* Trap focus inside modal, restore focus on close, close on `Esc`. Follow ARIA dialog pattern. ([W3C][15])

---

### Checklist before you ship a component
* keyboard reachable + operable? ✔️
* focus indicator visible and high-contrast? ✔️
* colors pass WCAG contrast? ✔️
* animations obey `prefers-reduced-motion`? ✔️
* touch targets >= 44–48 px and good spacing? ✔️
* shadows consistent and not overpowering? ✔️
* test on low-end devices for performance (backdrop-filter, heavy blurs)? ✔️


[1]: https://m3.material.io/styles/elevation/applying-elevation "Elevation – Material Design 3"
[2]: https://developer.mozilla.org/en-US/docs/Web/CSS/%40media/prefers-reduced-motion "prefers-reduced-motion - CSS - MDN Web Docs"
[3]: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html "Understanding Success Criterion 2.3.3: Animation from Interactions"
[4]: https://m2.material.io/develop/web/supporting/touch-target "Touch Target - Material Design"
[5]: https://developer.apple.com/design/tips/ "UI Design Dos and Don'ts - Apple Developer"
[6]: https://www.w3.org/TR/WCAG21/ "Web Content Accessibility Guidelines (WCAG) 2.1 - W3C"
[7]: https://developer.apple.com/design/human-interface-guidelines/materials "Materials | Apple Developer Documentation"
[8]: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs "Easing and duration – Material Design 3"
[9]: https://m1.material.io/motion/duration-easing.html "Duration & easing - Motion - Material Design"
[10]: https://m3.material.io/styles/motion/easing-and-duration "Easing and duration – Material Design 3"
[11]: https://developer.apple.com/videos/play/wwdc2023/10158/ "Animate with springs - WWDC23 - Videos - Apple Developer"
[12]: https://m2.material.io/design/layout/spacing-methods.html "Spacing methods - Material Design"
[13]: https://webaim.org/articles/contrast/ "Understanding WCAG 2 Contrast and Color Requirements - WebAIM"
[14]: https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html "Understanding Success Criterion 1.4.1: Use of Color | WAI - W3C"
[15]: https://www.w3.org/WAI/ARIA/apg/ "ARIA Authoring Practices Guide | APG | WAI - W3C"
[16]: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/ "Developing a Keyboard Interface | APG | WAI - W3C"
[17]: https://www.w3.org/WAI/WCAG22/Techniques/css/C39 "C39: Using the CSS reduce-motion query to prevent motion | WAI"



&nbsp;  
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
- [UI Colors](https://www.iamsajid.com/ui-colors/)
- [Material Design Dark Theme](https://m2.material.io/design/color/dark-theme.html#ui-application)

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
- [Google Fonts](https://fonts.google.com/)
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
- buttons, toggles, search bar, pop-up, menu, radio buttons, notifs, input with notifs, text, tags, ...
- navbar+sidebar in a component
- Tooltips (use group on related button and group-hover to show tooltip)
- Scroll in dropdown
- Reject notifications
- Profile pop-up menu with dark mode toggle, logout
- Profile on hover
- Badge for notifications

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
- create button with checkmark and animation

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
- [Animate.js](https://animejs.com/)
- [ReactBits](https://reactbits.dev/text-animations/circular-text)
- [GSAP](https://greensock.com/gsap/)
- [Framer Motion](https://www.framer.com/motion/)

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
## Points of attention
### Checklist before you ship a component
- keyboard reachable + operable? ✔️
- focus indicator visible and high-contrast? ✔️
- colors pass WCAG contrast (4.5:1 for body text; 3:1 for large text / UI components)? ✔️
- animations obey `prefers-reduced-motion`? Motion is an enhancer, not a requirement ✔️
- touch targets >= 44–48 px and good spacing? ✔️
- shadows consistent and not overpowering? ✔️
- test on low-end devices for performance (backdrop-filter, heavy blurs)? ✔️
- clear hierarchy (surface → elevation → shadow → motion)? ✔️
- Consistent spacing scale? ✔️
- Mobile friendly? ✔️
- Responsive? ✔️
- Overflow handling? ✔️ ✔️
- Theming support? ✔️
- Dark mode support? ✔️
- RTL support? ✔️
- ARIA roles and attributes? ✔️
- Order tailwind classes (luke display > position > ... > hover > focus)? ✔️
- Use only css variables for colors? ✔️


### General Details
- Make interactive targets comfortably large (≈48×48dp or 44×44pt) and spaced.
- OAuth
- Page transitions for SPA
- Use SweetAlert2 for modal inputs and API wait spinner
- Use SwPush for notifications on desktop and mobile
- Sounds
- [ionic angular](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components) + PWA
- [ActivityPub](https://activitypub.rocks/)
- [WAAPI Documentation](https://waapi.readme.io/reference/waapi-api-documentation)




&nbsp;  
&nbsp;  
## Resources
### Design References
- [Material Design 3](https://m3.material.io)
- [Material Design 2](https://m2.material.io)
- [Bootstrap 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [Tailwind CSS](https://tailwindcss.com/docs)
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
- [IcoMoon](https://icomoon.io/)
- [Icons8](https://icons8.com/icons/set/health--style-material)
- [IsoCons](https://isocons.app)
- [IconScout](https://iconscout.com/)
- [Remix Icon](https://remixicon.com/)
- [IconBuddy](https://iconboddy.com/)



&nbsp;  
&nbsp;  
## References
### Libraries
- [LiftKit](https://github.com/Chainlift/liftkit)
- [Material Tailwind Blocks](https://www.material-tailwind.com/blocks)
- [Tailwind UI](https://tailwindui.com/)
- [Windy Toolbox](https://windytoolbox.com/)
- [Material Design Components](https://m3.material.io/components)
- [PrimeNG](https://www.primefaces.org/primeng/)
- [Bootstrap Components](https://getbootstrap.com/docs/5.3/components/)
- [Bootstrap Examples](https://getbootstrap.com/docs/5.3/examples/)
- [Ionic Framework Components](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components)
- [Uiverse](https://uiverse.io/)
- [Shuffle Marketplace](https://shuffle.dev/marketplace)
- [Flowbite Components](https://flowbite.com/#components)
- [Meraki UI Components](https://merakiui.com/components)
- [DaisyUI Videos](https://daisyui.com/resources/videos/fast-beautiful-uis-angular-daisyui-x5l6lsj6ekw/)
- [Soft UI Design System Presentation](https://demos.creative-tim.com/soft-ui-design-system/presentation.html)
- [Lbegey Templates](https://lbegey.fr/templates-tailwind.html)

### Pages
- [Tailwind's 404](https://tailwindcss.com/plus/ui-blocks/marketing/feedback/404-pages)

### Buttons & toggles
- [Vercel dark mode slider](./examples/vercel_dark_mode.html)
- [Freepik Dark mode slider](https://fr.freepik.com/vecteurs-premium/slider-jour-nuit_44129227.htm#from_element=cross_selling__vector)
- [Freepik Dark mode toggle button](https://fr.freepik.com/vecteurs-premium/bouton-vectoriel-interrupteur-bascule-mode-nuit-jour-luminosite-du-theme-application-element-option-diapositive-clair-sombre_28183375.htm)

### Menus
- [Tailwind Flyout Menus](https://tailwindcss.com/plus/ui-blocks/marketing/elements/flyout-menus)
- [Bubble Forum Toggle Slider](https://forum.bubble.io/t/creating-a-three-state-toggle-slider-switch-button/310817)
- [Spartan Dropdown Menu](https://www.spartan.ng/components/dropdown-menu)

### Liquid glass
- [Liquid Glass Navigation](https://snipzy.dev/snippets/liquid-glass-nav.html)

### Cards
- [Mobbin Explore](https://mobbin.com/explore/web/ui-elements/card)
- [Mobbin Collections](https://mobbin.com/collections/72af2281-5c22-4a5d-ac12-ce6ac37e215d/web/screens)
- [3D Card Effect](https://ui.aceternity.com/components/3d-card-effect)

### Loader
- [Uiverse Jeremy's Social](https://uiverse.io/jeremyssocial/ugly-bullfrog-62)

### Navbar
- [Tailwind Flex Navbar](https://tailwindflex.com/tag/navbar?is_responsive=true)


&nbsp;  
## Best Practices
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [CSS Architecture Guidelines](https://cssguidelin.es/)
- [Performance Best Practices](https://web.dev/performance/)

**Last updated:** September 2025