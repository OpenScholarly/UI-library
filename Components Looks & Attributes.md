# UI Library Components Specification

Following Material Design 3 principles with Tailwind CSS theming, liquid glass effects, advanced animations, and comprehensive design token support.

---

# Tailwind Theme Integration

## Theme Configuration
The UI library leverages Tailwind's theme system with custom design tokens:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          // ... through 950
        },
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          variant: 'rgb(var(--color-surface-variant) / <alpha-value>)',
        },
        glass: {
          DEFAULT: 'rgb(var(--color-glass-bg) / <alpha-value>)',
          border: 'rgb(var(--color-glass-border) / <alpha-value>)',
        }
      },
      spacing: {
        'ui-xs': 'var(--spacing-xs)',
        'ui-sm': 'var(--spacing-sm)',
        'ui-md': 'var(--spacing-md)',
        'ui-lg': 'var(--spacing-lg)',
        'ui-xl': 'var(--spacing-xl)',
      },
      borderRadius: {
        'ui-sm': 'var(--radius-sm)',
        'ui-md': 'var(--radius-md)',
        'ui-lg': 'var(--radius-lg)',
        'ui-xl': 'var(--radius-xl)',
      },
      backdropBlur: {
        'glass-sm': 'var(--blur-sm)',
        'glass-md': 'var(--blur-md)',
        'glass-lg': 'var(--blur-lg)',
        'glass-xl': 'var(--blur-xl)',
      },
      animation: {
        'liquid-ripple': 'liquid-ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'glass-shimmer': 'glass-shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      }
    }
  }
}
```

## CSS Custom Properties
```css
:root {
  /* Colors - Light Theme */
  --color-primary-50: 240 249 255;
  --color-primary-500: 59 130 246;
  --color-primary-950: 23 37 84;
  
  /* Surface Colors */
  --color-surface: 255 255 255;
  --color-surface-variant: 248 250 252;
  
  /* Glass Effect Colors */
  --color-glass-bg: 255 255 255;
  --color-glass-border: 255 255 255;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  
  /* Glass Blur */
  --blur-sm: 4px;
  --blur-md: 8px;
  --blur-lg: 16px;
  --blur-xl: 24px;
}

[data-theme="dark"] {
  --color-surface: 15 23 42;
  --color-surface-variant: 30 41 59;
  --color-glass-bg: 15 23 42;
  --color-glass-border: 71 85 105;
}
```

### Theme Configuration
```typescript
interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    surface: string;
    background: string;
    // ... additional colors
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSizes: Record<string, string>;
    fontWeights: Record<string, number>;
    lineHeights: Record<string, number>;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  motion: {
    durations: Record<string, string>;
    easings: Record<string, string>;
  };
}
```


---

# Component Roadmap
1. Foundation (already in theme section)
- [x] Design tokens (colors, radius, spacing, motion)
- [x] Tailwind theme + utilities (focus ring, glass, transitions)
- [x] A11y utilities (focus trap, aria helpers)
- [x] Overlay/positioning primitives (portal, z-layers, dismiss, positioning)

2. Primitives & Layout
- [x] Container
- [x] Grid / Row / Column
- [x] Dividers
- [x] Typography (Heading, Text)
- [x] Icon
- [x] Link
- [x] Image
- [x] Scroll Area

3. Button Family
- [x] Button
- [x] Icon Button
- [x] Segmented Button
- [x] Split Button
- [x] Button Groups
- [x] Floating Action Button (FAB)
- [x] Extended FAB
- [ ] FAB Menu

4. Form Infrastructure
- [ ] Form Field Wrapper

5. Basic Inputs (non-overlay)
- [x] Text Field / Input (text, password, email, number, search, masks/validators/OTP)
- [x] Textarea
- [x] Checkbox
- [x] Radio Group & Radio
- [x] Toggle / Switch
- [x] Slider / Range

6. Overlay-based Inputs (requires overlay primitives)
- [x] Select (Single & Multi)
- [x] Autocomplete / Combo Box / Typeahead
- [ ] Date Picker
- [ ] Time Picker
- [ ] File Upload
- [x] Search (composite of input + list/command menu)

7. Feedback & Status
- [x] Loading Indicator / Loader
- [?] Progress Indicators (linear + circular) *(increment/reset APIs pending)*
- [x] Badge / Status
- [x] Chip / Tag / Pill
- [x] Toast / Snackbar
- [ ] Notification (alias or wrapper of Toast system)

8. Surfaces & Data Display
- [x] Card
- [ ] List (incl. virtual list)
- [?] Avatar / Avatar Group (with ring/status) *(avatar ready; group pending)*
- [x] Table / Data Grid
- [ ] Feed
- [ ] Stats
- [ ] Timeline
- [ ] Banner
- [ ] Carousel
- [x] Skeleton (after Card/Container)
- [x] Footer / Copyright

9. Navigation
- [x] Tabs
- [x] Breadcrumbs
- [x] Pagination
- [ ] Steps / Stepper
- [ ] Navbar / App Bar / Toolbar
- [ ] Sidebar / Drawer / SlideOver / Side Sheets / Navigation Drawer
- [ ] Navigation Rail
- [ ] Bottom Navigation / Dock
- [x] Menu / Dropdown / Flyout Menu
- [ ] Command Menu / Command Palette
- [x] Accordion
- [ ] Tree View
- [ ] Reorder (drag to reorder)
- [ ] Keyboard Shortcuts (service; used by Command Menu)

10. Overlays
- [x] Tooltip
- [ ] Popover / Pop-up
- [x] Modal / Dialog (alert/confirm/fullscreen)
- [ ] Bottom Sheets
- [ ] Action Sheet
- [ ] Backdrop
- [x] Layout

11. Utility Components  
- [x] Theme Switcher (3-way toggle: system/light/dark)

12. Liquid Glass Suite
- [ ] Glass Card
- [ ] Liquid Button
- [ ] Distortion Container

1.  Misc Utilities
- [ ] Swap (icon/text/hamburger)
- [ ] Diff (image, text)
- [ ] Rating
- [x] Link (advanced states/variants)


**Inputs**
Label
Spinbox
Line editor
Editor
ComboBox
IconChooser
Loading Panel
Calendar
Selection chips
Selection chips editor

**Containers / Layout**
Accordion
Expander
Contextual Menu



List sources:
[Material components](https://m3.material.io/components)
[LiftKit](https://github.com/Chainlift/liftkit)
[Tailwind UI](https://tailwindui.com/)
[PrimeNG](https://primeblocks.org/)
[Ionic Framework Components](https://github.com/ionic-team/ionic-framework/tree/main/core/src/components)
[Flowbite Components](https://flowbite.com/#components)
[Meraki UI Components](https://merakiui.com/components)
[DaisyUI Videos](https://daisyui.com/docs/install/angular/)





---

# 1 — Core/Essential Components

## Button
**Purpose:** Primary interactive element for user actions
**Figma Design:** [Insert Figma link here]

### Variants
`primary`, `secondary`, `tertiary`, `ghost`, `outline`, `danger`, `warning`, `success`, `info`, `link`

### Sizes
`xs`, `sm`, `md`, `lg`, `xl`

### States
`normal`, `hover`, `active`, `focus`, `disabled`, `loading`, `pressed`

### Parameters / Props
```typescript
@Input() variant: 'primary'|'secondary'|'tertiary'|'ghost'|'outline'|'danger'|'warning'|'success'|'info'|'link' = 'primary'
@Input() size: 'xs'|'sm'|'md'|'lg'|'xl' = 'md'
@Input() type: 'button'|'submit'|'reset' = 'button'
@Input() disabled: boolean = false
@Input() loading: boolean = false
@Input() fullWidth: boolean = false
@Input() icon?: string
@Input() iconPosition: 'left'|'right' = 'left'
@Input() iconOnly: boolean = false
@Input() ripple: boolean = true
@Input() elevation: 0|1|2|3|4 = 0
@Input() rounded: 'sm'|'md'|'lg'|'xl'|'full' = 'md'
@Input() colorScheme: 'blue'|'green'|'purple'|'red'|'gray' = 'blue'
/** Material alias support */
@Input() mdVariantAlias?: 'filled'|'outlined'|'text'|'tonal' // optional, maps to current variant presets
@Input() glassEffect: boolean = false
@Input() customClasses?: string // Additional Tailwind classes
@Input() ariaLabel?: string
@Input() ariaPressed?: boolean
@Input() ariaExpanded?: boolean
@Output() click = new EventEmitter<Event>()
@Output() focus = new EventEmitter<FocusEvent>()
@Output() blur = new EventEmitter<FocusEvent>()
```

### Material Variant Aliases
- filled -> primary (solid) button
- outlined -> outline
- text -> link/ghost (no container)
- tonal -> secondary (use container/onContainer tokens)

Implementation hint: When mdVariantAlias is set, map to your existing variantClasses using Material tokens for container/label colors.

### Accessibility Features
- Minimum 48×48px touch target
- WCAG 2.1 AA color contrast compliance
- Keyboard navigation support
- Screen reader compatible
- Focus ring visible on `:focus-visible`
- `aria-pressed` for toggle states


### Tailwind Classes Applied
```typescript
// Base classes
private readonly baseClasses = [
  'inline-flex', 'items-center', 'justify-center',
  'font-medium', 'transition-all', 'duration-200',
  'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2',
  'disabled:opacity-50', 'disabled:cursor-not-allowed'
];

// Size classes
private readonly sizeClasses = {
  xs: ['h-7', 'px-2', 'text-xs', 'gap-1'],
  sm: ['h-8', 'px-3', 'text-sm', 'gap-1.5'],
  md: ['h-10', 'px-4', 'text-sm', 'gap-2'],
  lg: ['h-12', 'px-6', 'text-base', 'gap-2'],
  xl: ['h-14', 'px-8', 'text-lg', 'gap-2.5']
};

// Variant classes with color scheme integration
private readonly variantClasses = {
  primary: (scheme: string) => [
    `bg-${scheme}-500`, `hover:bg-${scheme}-600`, `active:bg-${scheme}-700`,
    'text-white', `focus:ring-${scheme}-500`
  ],
  outline: (scheme: string) => [
    'bg-transparent', `border-2`, `border-${scheme}-500`,
    `text-${scheme}-600`, `hover:bg-${scheme}-50`, `focus:ring-${scheme}-500`
  ],
  ghost: (scheme: string) => [
    'bg-transparent', `text-${scheme}-600`,
    `hover:bg-${scheme}-50`, `active:bg-${scheme}-100`, `focus:ring-${scheme}-500`
  ]
};
```

### Examples
[Screenshot placeholder - Button variants with Tailwind theming]

---

## Form Field Wrapper
**Purpose:** Consistent wrapper for all form controls with label, hints, and error handling
**Figma Design:** [Insert Figma link here]

### Parameters / Props
```typescript
@Input() label?: string
@Input() labelPosition: 'top'|'left'|'floating' = 'top'
@Input() hint?: string
@Input() error?: string
@Input() required: boolean = false
@Input() disabled: boolean = false
@Input() dense: boolean = false
@Input() colorScheme: 'blue'|'green'|'purple'|'red'|'gray' = 'blue'
@Input() showRequiredMarker: boolean = true
@Input() prefixIcon?: string
@Input() suffixIcon?: string
@Input() customClasses?: string
@Input() ariaDescribedBy?: string
```

### Content Projection Slots
- `prefix` - Icon or text before the control
- `suffix` - Icon or text after the control  
- `control` - The form control itself
- `hint` - Helper text below the control
- `error` - Error message below the control

### Tailwind Classes Applied
```typescript
private readonly wrapperClasses = [
  'space-y-1', // Default spacing between label and input
];

private readonly labelClasses = {
  top: ['block', 'text-sm', 'font-medium', 'text-gray-700', 'dark:text-gray-300'],
  left: ['flex', 'items-center', 'text-sm', 'font-medium', 'text-gray-700', 'dark:text-gray-300'],
  floating: ['absolute', 'text-sm', 'text-gray-500', 'transition-all', 'pointer-events-none']
};

private readonly errorClasses = [
  'text-sm', 'text-red-600', 'dark:text-red-400'
];

private readonly hintClasses = [
  'text-sm', 'text-gray-500', 'dark:text-gray-400'
];
```

---

## Input (Text)
**Purpose:** Single-line text input with comprehensive validation and styling
**Figma Design:** [Insert Figma link here]

### Input Types
`text`, `password`, `search`, `url`, `email`, `tel`, `number`, `hidden`

### Sizes
`sm` (32px), `md` (40px), `lg` (48px)

### Parameters / Props
```typescript
@Input() type: 'text'|'password'|'search'|'url'|'email'|'tel'|'number' = 'text'
@Input() value: string = ''
@Input() placeholder?: string
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() readonly: boolean = false
@Input() disabled: boolean = false
@Input() autofocus: boolean = false
@Input() autocomplete?: string
@Input() spellcheck: boolean = true
@Input() clearable: boolean = false
@Input() showPasswordToggle: boolean = false
@Input() maxLength?: number
@Input() minLength?: number
@Input() pattern?: string
@Input() step?: number // for number type
@Input() min?: number // for number type
@Input() max?: number // for number type
@Input() debounceTime: number = 0
@Input() validation?: ValidationFunction[]
@Input() mask?: string
@Input() colorScheme: 'blue'|'green'|'purple'|'red'|'gray' = 'blue'
@Input() variant: 'outline'|'filled'|'glass' = 'outline'
@Input() customClasses?: string
@Input() ariaLabel?: string
@Input() ariaDescribedBy?: string
@Output() valueChange = new EventEmitter<string>()
@Output() focus = new EventEmitter<FocusEvent>()
@Output() blur = new EventEmitter<FocusEvent>()
@Output() enter = new EventEmitter<KeyboardEvent>()
@Output() escape = new EventEmitter<KeyboardEvent>()
@Output() clear = new EventEmitter<void>()
```

### Accessibility note (Material)
- role="textbox" and aria-invalid on error.
- Describe with aria-describedby for hint and error; update dynamically.

### Tailwind Classes Applied
```typescript
private readonly baseInputClasses = [
  'w-full', 'transition-all', 'duration-200',
  'placeholder:text-gray-400', 'dark:placeholder:text-gray-500',
  'focus:outline-none', 'disabled:opacity-50', 'disabled:cursor-not-allowed'
];

private readonly sizeClasses = {
  sm: ['h-8', 'px-3', 'text-sm'],
  md: ['h-10', 'px-4', 'text-sm'],
  lg: ['h-12', 'px-6', 'text-base']
};

private readonly variantClasses = {
  outline: (scheme: string, hasError: boolean) => [
    'border', 'rounded-ui-md', 'bg-white', 'dark:bg-gray-800',
    hasError ? 'border-red-500' : 'border-gray-300',
    'dark:border-gray-600',
    `focus:border-${scheme}-500`, `focus:ring-1`, `focus:ring-${scheme}-500`
  ],
  filled: (scheme: string, hasError: boolean) => [
    'border-0', 'rounded-ui-md', 'bg-gray-100', 'dark:bg-gray-700',
    hasError ? 'ring-1 ring-red-500' : '',
    `focus:bg-white`, 'dark:focus:bg-gray-800',
    `focus:ring-2`, `focus:ring-${scheme}-500`
  ],
  glass: (scheme: string, hasError: boolean) => [
    'border', 'rounded-ui-md', 'backdrop-blur-glass-md',
    'bg-glass/60', 'border-glass-border/20',
    hasError ? 'border-red-500/50' : 'border-glass-border/20',
    `focus:border-${scheme}-500/50`, `focus:ring-1`, `focus:ring-${scheme}-500/30`
  ]
};
```

---

## Textarea
**Purpose:** Multi-line text input with auto-resize capabilities
**Figma Design:** [Insert Figma link here]

### Parameters / Props
```typescript
// Inherits from Input plus:
@Input() rows: number = 4
@Input() autoResize: boolean = false
@Input() minRows?: number
@Input() maxRows?: number
@Input() resizable: 'none'|'vertical'|'horizontal'|'both' = 'vertical'
@Input() characterCount: boolean = false
```

### Examples
[Screenshot placeholder - Textarea variants]

---

## Select (Single & Multi)
**Purpose:** Dropdown selection with search, multi-select, and virtual scrolling
**Figma Design:** [Insert Figma link here]

### Types
- Single select (native/custom)
- Multi-select with chips
- Creatable/taggable
- Grouped options

### Parameters / Props
```typescript
@Input() multiple: boolean = false
@Input() options: SelectOption[] = []
@Input() value: any
@Input() placeholder?: string
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() searchable: boolean = false
@Input() clearable: boolean = false
@Input() creatable: boolean = false
@Input() loading: boolean = false
@Input() virtualScroll: boolean = false
@Input() virtualScrollItemSize: number = 40
@Input() maxDisplayedOptions: number = 8
@Input() closeOnSelect: boolean = true
@Input() chipRemovable: boolean = true // for multi-select
@Input() groupBy?: string
@Input() labelKey: string = 'label'
@Input() valueKey: string = 'value'
@Input() disabledKey: string = 'disabled'
@Input() searchFunction?: (term: string) => Observable<SelectOption[]>
@Input() colorScheme: 'blue'|'green'|'purple'|'red'|'gray' = 'blue'
@Input() variant: 'outline'|'filled'|'glass' = 'outline'
@Input() customClasses?: string
@Input() customOptionClasses?: string
@Input() customDropdownClasses?: string
@Output() valueChange = new EventEmitter<any>()
@Output() searchChange = new EventEmitter<string>()
@Output() open = new EventEmitter<void>()
@Output() close = new EventEmitter<void>()
@Output() optionSelect = new EventEmitter<SelectOption>()
@Output() optionRemove = new EventEmitter<SelectOption>()
```

### Template Slots
- `optionTemplate` - Custom option rendering
- `selectedTemplate` - Custom selected value display
- `noOptionsTemplate` - No results message
- `loadingTemplate` - Loading indicator

### Accessibility Features
- Keyboard navigation with arrow keys
- Type-ahead search
- `aria-expanded`, `aria-owns`, `aria-activedescendant`
- Screen reader announcements

### Examples
[Screenshot placeholder - Select variants]
[Screenshot placeholder - Multi-select with chips]

---

## Checkbox
**Purpose:** Binary or tri-state selection control
**Figma Design:** [Insert Figma link here]

### Variants
`default`, `tristate`, `custom`

### Parameters / Props
```typescript
@Input() checked: boolean | 'indeterminate' = false
@Input() disabled: boolean = false
@Input() label?: string
@Input() labelPosition: 'left'|'right' = 'right'
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() colorScheme: 'blue'|'green'|'purple'|'red'|'gray' = 'blue' // renamed from `color`
@Input() customIcon?: string
@Input() indeterminateIcon?: string
@Input() rounded: boolean = false
@Input() ariaLabel?: string
@Input() ariaDescribedBy?: string
@Output() checkedChange = new EventEmitter<boolean | 'indeterminate'>()
@Output() focus = new EventEmitter<FocusEvent>()
@Output() blur = new EventEmitter<FocusEvent>()
```

### Examples
[Screenshot placeholder - Checkbox states and variants]

---

## Radio Group & Radio
**Purpose:** Single selection from multiple options
**Figma Design:** [Insert Figma link here]

### Radio Group Props
```typescript
@Input() name: string
@Input() value: any
@Input() orientation: 'horizontal'|'vertical' = 'vertical'
@Input() disabled: boolean = false
@Input() required: boolean = false
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() colorScheme: 'blue'|'green'|'purple'|'red'|'gray' = 'blue' // renamed from `color`
@Input() ariaLabel?: string
@Input() ariaLabelledBy?: string
@Output() valueChange = new EventEmitter<any>()
```

### Radio Props
```typescript
@Input() value: any
@Input() label?: string
@Input() disabled: boolean = false
@Input() ariaLabel?: string
@Input() ariaDescribedBy?: string
```

### Accessibility Features
- Arrow key navigation between options
- Space key to select
- Roving tabindex
- role="combobox" with aria-expanded/aria-controls; popup list role="listbox" with option items role="option".
- Manage active option via aria-activedescendant.

### Examples
[Screenshot placeholder - Radio group orientations]

---

## Toggle / Switch
**Purpose:** On/off control with smooth animations
**Figma Design:** [Insert Figma link here]

### Parameters / Props
```typescript
@Input() checked: boolean = false
@Input() disabled: boolean = false
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() colorScheme: 'blue'|'green'|'purple'|'red'|'gray' = 'blue' // renamed from `color`
@Input() labelOn?: string
@Input() labelOff?: string
@Input() showLabels: boolean = false
@Input() icons: boolean = false
@Input() iconOn?: string
@Input() iconOff?: string
@Input() ariaLabel?: string
@Input() ariaDescribedBy?: string
@Output() checkedChange = new EventEmitter<boolean>()
@Output() focus = new EventEmitter<FocusEvent>()
@Output() blur = new EventEmitter<FocusEvent>()
```

### Examples
[Screenshot placeholder - Toggle variants and sizes]

---

## Slider / Range Input
**Purpose:** Numeric input via dragging or touch
**Figma Design:** [Insert Figma link here]

### Types
- Single value
- Range (dual handle)
- Stepped values
- With marks/ticks

### Parameters / Props
```typescript
@Input() min: number = 0
@Input() max: number = 100
@Input() step: number = 1
@Input() value: number | [number, number]
@Input() range: boolean = false
@Input() orientation: 'horizontal'|'vertical' = 'horizontal'
@Input() marks: SliderMark[] = []
@Input() showTooltip: boolean = false
@Input() tooltipPlacement: 'top'|'bottom'|'left'|'right' = 'top'
@Input() disabled: boolean = false
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() colorScheme: 'blue'|'green'|'purple'|'red'|'gray' = 'blue' // renamed from `color`
@Input() trackHeight: number = 4
@Input() thumbSize: number = 20
@Input() ariaLabel?: string
@Input() ariaValueText?: string
@Output() valueChange = new EventEmitter<number | [number, number]>()
@Output() slideStart = new EventEmitter<void>()
@Output() slideEnd = new EventEmitter<void>()
```

### Examples
[Screenshot placeholder - Slider variants and orientations]

---

# 2 — Navigation & Structure

## Tabs
**Purpose:** Content organization and switching interface
**Figma Design:** [Insert Figma link here]

### Variants
`line`, `pills`, `box`, `segmented`, `glass`

### Parameters / Props
```typescript
@Input() variant: 'line'|'pills'|'box'|'segmented'|'glass' = 'line'
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() orientation: 'horizontal'|'vertical' = 'horizontal'
@Input() activeIndex: number = 0
@Input() scrollable: boolean = false
@Input() centered: boolean = false
@Input() fullWidth: boolean = false
@Input() lazyLoad: boolean = false
@Input() animateContent: boolean = true
@Input() colorScheme: 'blue'|'green'|'purple'|'red'|'gray' = 'blue'
@Input() glassEffect: boolean = false
@Input() tabs: TabItem[] = []
@Input() ariaLabel?: string
@Input() customClasses?: string
@Input() customTabClasses?: string
@Input() customPanelClasses?: string
@Output() activeIndexChange = new EventEmitter<number>()
@Output() tabClick = new EventEmitter<{index: number, tab: TabItem}>()
```

### Tab Item Props
```typescript
interface TabItem {
  label: string;
  icon?: string;
  disabled?: boolean;
  closable?: boolean;
  badge?: string | number;
  ariaLabel?: string;
}
```

### Accessibility Notes
- role="tablist" on container, role="tab" on triggers, role="tabpanel" on content.
- aria-selected, aria-controls, id binding per WAI-ARIA Authoring Practices.
- Use roving tabindex for horizontal/vertical arrow key navigation.
- Follow WAI-ARIA APG: roving tabindex, aria-selected on active tab, aria-controls/id linkage.

### Examples
[Screenshot placeholder - Tab variants and orientations]

---

## Menu / Dropdown
**Purpose:** Contextual actions and navigation
**Figma Design:** [Insert Figma link here]

### Types
- Context menu
- Menu button
- Split button
- Nested menus

### Parameters / Props
```typescript
@Input() trigger: 'click'|'hover'|'contextmenu' = 'click'
@Input() placement: Placement = 'bottom-start'
@Input() offset: number = 4
@Input() closeOnSelect: boolean = true
@Input() closeOnOutsideClick: boolean = true
@Input() disabled: boolean = false
@Input() maxHeight?: number
@Input() minWidth?: number
@Input() trapFocus: boolean = true
@Input() returnFocusOnClose: boolean = true
@Input() glassEffect: boolean = false
@Input() elevation: 1|2|3|4 = 2
@Input() ariaLabel?: string
@Output() open = new EventEmitter<void>()
@Output() close = new EventEmitter<void>()
@Output() itemClick = new EventEmitter<MenuItem>()
```

### Menu Item Props
```typescript
interface MenuItem {
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  divider?: boolean;
  children?: MenuItem[];
  action?: () => void;
  ariaLabel?: string;
}
```

### Accessibility Notes
- role="menu" with role="menuitem" (or menuitemcheckbox/menuitemradio) when appropriate.
- Manage focus with looped arrow key navigation; Esc closes and returns focus to trigger.
- Leverage aria-activedescendant with active option id.

### Examples
[Screenshot placeholder - Menu variants and nested menus]

---

## Breadcrumb
**Purpose:** Hierarchical navigation display
**Figma Design:** [Insert Figma link here]

### Parameters / Props
```typescript
@Input() items: BreadcrumbItem[] = []
@Input() separator: 'slash'|'chevron'|'arrow'|'custom' = 'slash'
@Input() customSeparator?: string
@Input() maxItems: number = 0 // 0 = no limit
@Input() showRoot: boolean = true
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() ariaLabel: string = 'Breadcrumb'
@Output() itemClick = new EventEmitter<BreadcrumbItem>()
```

### Breadcrumb Item
```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
  ariaLabel?: string;
}
```

### Examples
[Screenshot placeholder - Breadcrumb variants]

---

## Pagination
**Purpose:** Large dataset navigation
**Figma Design:** [Insert Figma link here]

### Types
- Standard pagination
- Simple (previous/next only)
- Compact (mobile-optimized)

### Parameters / Props
```typescript
@Input() currentPage: number = 1
@Input() pageSize: number = 10
@Input() total: number = 0
@Input() pageSizeOptions: number[] = [10, 25, 50, 100]
@Input() showSizeChanger: boolean = false
@Input() showQuickJumper: boolean = false
@Input() showFirstLast: boolean = true
@Input() showTotal: boolean = true
@Input() maxPagesDisplay: number = 7
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() simple: boolean = false
@Input() disabled: boolean = false
@Input() ariaLabel: string = 'Pagination'
@Output() pageChange = new EventEmitter<number>()
@Output() pageSizeChange = new EventEmitter<number>()
```

### Examples
[Screenshot placeholder - Pagination variants]

---

## Sidenav / Drawer
**Purpose:** Side navigation panel with multiple display modes
**Figma Design:** [Insert Figma link here]

### Modes
- `over` - Overlays content
- `push` - Pushes content aside
- `side` - Side-by-side with content

### Parameters / Props
```typescript
@Input() mode: 'over'|'push'|'side' = 'over'
@Input() position: 'left'|'right' = 'left'
@Input() opened: boolean = false
@Input() backdrop: boolean = true
@Input() backdropClose: boolean = true
@Input() width: string = '280px'
@Input() autoFocus: boolean = true
@Input() restoreFocus: boolean = true
@Input() trapFocus: boolean = true
@Input() glassEffect: boolean = false
@Input() elevation: 1|2|3|4 = 2
@Input() ariaLabel?: string
@Output() openedChange = new EventEmitter<boolean>()
@Output() openedStart = new EventEmitter<void>()
@Output() closedStart = new EventEmitter<void>()
@Output() openedEnd = new EventEmitter<void>()
@Output() closedEnd = new EventEmitter<void>()
```

### Examples
[Screenshot placeholder - Drawer modes and positions]

---

## Navbar / Toolbar
**Purpose:** Application header with navigation and actions
**Figma Design:** [Insert Figma link here]

### Parameters / Props
```typescript
@Input() fixed: boolean = false
@Input() sticky: boolean = false
@Input() elevated: boolean = false
@Input() transparent: boolean = false
@Input() height: string = '64px'
@Input() maxWidth?: string
@Input() centerContent: boolean = false
@Input() glassEffect: boolean = false
@Input() elevation: 0|1|2|3|4 = 1
@Input() theme: 'blue'|'green'|'purple'|'red' = 'blue'
@Input() ariaLabel: string = 'Navigation'
```

### Content Slots
- `brand` - Logo/brand area
- `nav` - Navigation links
- `actions` - Action buttons
- `mobile-menu` - Mobile menu toggle

### Examples
[Screenshot placeholder - Navbar variants]

---

# 3 — Feedback & Overlays

## Tooltip
**Purpose:** Contextual information on hover/focus
**Figma Design:** [Insert Figma link here]

### Parameters / Props
```typescript
@Input() content: string | TemplateRef<any>
@Input() placement: Placement = 'top'
@Input() trigger: 'hover'|'focus'|'click'|'manual' = 'hover'
@Input() showDelay: number = 200
@Input() hideDelay: number = 100
@Input() interactive: boolean = false
@Input() disabled: boolean = false
@Input() maxWidth: string = '200px'
@Input() theme: 'dark'|'light' = 'dark'
@Input() arrow: boolean = true
@Input() offset: number = 8
@Input() ariaLabel?: string
@Output() show = new EventEmitter<void>()
@Output() hide = new EventEmitter<void>()
```

### Examples
[Screenshot placeholder - Tooltip placements and themes]

---

## Popover / Popper
**Purpose:** Rich contextual content overlay
**Figma Design:** [Insert Figma link here]

### Parameters / Props
```typescript
@Input() trigger: 'click'|'hover'|'focus'|'manual' = 'click'
@Input() placement: Placement = 'bottom'
@Input() offset: number = 8
@Input() closeOnOutsideClick: boolean = true
@Input() closeOnEscape: boolean = true
@Input() trapFocus: boolean = false
@Input() autoFocus: boolean = false
@Input() returnFocus: boolean = true
@Input() disabled: boolean = false
@Input() arrow: boolean = true
@Input() elevation: 1|2|3|4 = 2
@Input() glassEffect: boolean = false
@Input() maxWidth?: string
@Input() maxHeight?: string
@Input() ariaLabel?: string
@Output() open = new EventEmitter<void>()
@Output() close = new EventEmitter<void>()
```

### Content Slots
- `header` - Popover header
- `content` - Main content area
- `footer` - Action buttons area

### Examples
[Screenshot placeholder - Popover variants]

---

## Modal / Dialog
**Purpose:** Modal overlays for important content and actions
**Figma Design:** [Insert Figma link here]

### Types
- Standard dialog
- Alert dialog
- Confirmation dialog
- Full-screen modal

### Parameters / Props
```typescript
@Input() open: boolean = false
@Input() size: 'xs'|'sm'|'md'|'lg'|'xl'|'fullscreen' = 'md'
@Input() centered: boolean = true
@Input() backdrop: boolean | 'static' = true
@Input() keyboard: boolean = true
@Input() focus: boolean = true
@Input() restoreFocus: boolean = true
@Input() closeButton: boolean = true
@Input() scrollable: boolean = false
@Input() animation: 'fade'|'slide'|'zoom' = 'fade'
@Input() glassEffect: boolean = false
@Input() elevation: 1|2|3|4 = 3
@Input() variant: 'standard'|'glass'|'gradient' = 'standard'
@Input() colorScheme: 'blue'|'green'|'purple'|'red'|'gray' = 'blue'
@Input() ariaLabel?: string
@Input() ariaLabelledBy?: string
@Input() ariaDescribedBy?: string
@Input() customClasses?: string
@Input() customBackdropClasses?: string
@Input() customContentClasses?: string
@Output() openChange = new EventEmitter<boolean>()
@Output() opened = new EventEmitter<void>()
@Output() closed = new EventEmitter<any>()
@Output() backdropClick = new EventEmitter<void>()
@Output() escapeKey = new EventEmitter<void>()
```

### Content Slots
- `header` - Modal header with title
- `body` - Main content area
- `footer` - Action buttons

### Accessibility (Material Dialog)
- role="dialog" or role="alertdialog" with aria-modal="true".
- Focus trap on open; return focus to trigger on close.
- Label via aria-labelledby or aria-label; describe via aria-describedby.

### Examples
[Screenshot placeholder - Modal sizes and types] 
### Tailwind Classes Applied
```typescript
private readonly backdropClasses = [
  'fixed', 'inset-0', 'z-50',
  'bg-black/50', 'backdrop-blur-sm',
  'flex', 'items-center', 'justify-center',
  'p-4'
];

private readonly variantClasses = {
  standard: [
    'bg-white', 'dark:bg-gray-800',
    'rounded-ui-lg', 'shadow-2xl',
    'border', 'border-gray-200', 'dark:border-gray-700'
  ],
  glass: [
    'backdrop-blur-glass-lg', 'bg-glass/80',
    'rounded-ui-lg', 'shadow-2xl',
    'border', 'border-glass-border/30'
  ],
  gradient: (scheme: string) => [
    'bg-gradient-to-br', `from-${scheme}-50`, `to-${scheme}-100`,
    `dark:from-${scheme}-900/20`, `dark:to-${scheme}-800/20`,
    'rounded-ui-lg', 'shadow-2xl',
    'border', `border-${scheme}-200/50`, `dark:border-${scheme}-700/50`
  ]
};

private readonly sizeClasses = {
  xs: ['max-w-xs'],
  sm: ['max-w-sm'],
  md: ['max-w-md'],
  lg: ['max-w-lg'],
  xl: ['max-w-xl'],
  fullscreen: ['w-full', 'h-full', 'max-w-none', 'rounded-none']
};
```

---

## Toast / Snackbar
**Purpose:** Non-intrusive notifications
**Figma Design:** [Insert Figma link here]

### Types
`info`, `success`, `warning`, `error`, `custom`

### Parameters / Props
```typescript
@Input() type: 'info'|'success'|'warning'|'error' = 'info'
@Input() title?: string
@Input() message: string
@Input() duration: number = 5000
@Input() closable: boolean = true
@Input() pauseOnHover: boolean = true
@Input() showProgress: boolean = false
@Input() position: ToastPosition = 'top-right'
@Input() icon?: string
@Input() iconColor?: string
@Input() actions?: ToastAction[]
@Input() ariaLabel?: string
@Output() close = new EventEmitter<void>()
@Output() actionClick = new EventEmitter<ToastAction>()
```

### Service API
```typescript
interface ToastService {
  show(config: ToastConfig): ToastRef;
  success(message: string, title?: string): ToastRef;
  error(message: string, title?: string): ToastRef;
  warning(message: string, title?: string): ToastRef;
  info(message: string, title?: string): ToastRef;
  clear(): void;
}
```

### Examples
[Screenshot placeholder - Toast types and positions]

---

## Progress Indicators
**Purpose:** Loading and progress feedback
**Figma Design:** [Insert Figma link here]

### Types
- Linear progress bar
- Circular progress/spinner
- Skeleton loaders

### Linear Progress Props
```typescript
@Input() value?: number // undefined for indeterminate
@Input() buffer?: number
@Input() size: 'xs'|'sm'|'md'|'lg' = 'md'
@Input() color: 'blue'|'green'|'purple'|'red' = 'blue'
@Input() showLabel: boolean = false
@Input() label?: string
@Input() ariaLabel?: string
```

### Circular Progress Props
```typescript
@Input() value?: number // undefined for indeterminate
@Input() size: number = 40
@Input() strokeWidth: number = 4
@Input() color: 'blue'|'green'|'purple'|'red' = 'blue'
@Input() showLabel: boolean = false
@Input() ariaLabel?: string
```

### Skeleton Props
```typescript
@Input() variant: 'text'|'rectangular'|'circular' = 'text'
@Input() width?: string | number
@Input() height?: string | number
@Input() animation: 'pulse'|'wave'|'none' = 'pulse'
@Input() lines?: number // for text variant
```

### Examples
[Screenshot placeholder - Progress variants]

---

# 4 — Data Display & Complex Controls

## Table / Data Grid
**Purpose:** Structured data display with sorting, filtering, and pagination
**Figma Design:** [Insert Figma link here]

### Features
- Column sorting and filtering
- Row selection (single/multi)
- Virtual scrolling
- Column resizing and reordering
- Row expansion
- Sticky headers

### Parameters / Props
```typescript
@Input() columns: TableColumn[] = []
@Input() data: any[] = []
@Input() loading: boolean = false
@Input() selectionMode: 'none'|'single'|'multiple' = 'none'
@Input() selectedRows: any[] = []
@Input() sortable: boolean = true
@Input() filterable: boolean = false
@Input() resizable: boolean = false
@Input() reorderable: boolean = false
@Input() virtualScroll: boolean = false
@Input() virtualScrollItemSize: number = 48
@Input() stickyHeader: boolean = false
@Input() expandable: boolean = false
@Input() striped: boolean = false
@Input() bordered: boolean = false
@Input() hover: boolean = true
@Input() dense: boolean = false
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() emptyMessage: string = 'No data available'
@Input() ariaLabel?: string
@Output() sortChange = new EventEmitter<SortEvent>()
@Output() filterChange = new EventEmitter<FilterEvent>()
@Output() selectionChange = new EventEmitter<any[]>()
@Output() rowClick = new EventEmitter<any>()
@Output() rowDoubleClick = new EventEmitter<any>()
@Output() columnResize = new EventEmitter<ColumnResizeEvent>()
@Output() columnReorder = new EventEmitter<ColumnReorderEvent>()
```

### Column Definition
```typescript
interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  sticky?: 'left' | 'right';
  cellTemplate?: TemplateRef<any>;
  headerTemplate?: TemplateRef<any>;
  filterTemplate?: TemplateRef<any>;
  sortFunction?: (a: any, b: any) => number;
  filterFunction?: (value: any, filter: any) => boolean;
}
```

### Examples
[Screenshot placeholder - Table variants and features]

---

## Card
**Purpose:** Content container with optional header, body, and footer
**Figma Design:** [Insert Figma link here]

### Variants
`elevated`, `outlined`, `filled`

### Parameters / Props
```typescript
@Input() variant: 'elevated'|'outlined'|'filled' = 'elevated'
@Input() elevation: 0|1|2|3|4 = 1
@Input() padding: 'none'|'sm'|'md'|'lg' = 'md'
@Input() clickable: boolean = false
@Input() disabled: boolean = false
@Input() loading: boolean = false
@Input() glassEffect: boolean = false
@Input() rounded: 'sm'|'md'|'lg'|'xl' = 'md'
@Input() ariaLabel?: string
@Output() click = new EventEmitter<Event>()
@Output() focus = new EventEmitter<FocusEvent>()
@Output() blur = new EventEmitter<FocusEvent>()
```

### Content Slots
- `header` - Card header with title and actions
- `media` - Image or media content
- `content` - Main card content
- `actions` - Action buttons
- `footer` - Additional footer content

### Examples
[Screenshot placeholder - Card variants and layouts]

---

## List / Virtual List
**Purpose:** Efficient display of large data sets
**Figma Design:** [Insert Figma link here]

### Types
- Simple list
- Virtual scrolling list
- Infinite scroll list

### Parameters / Props
```typescript
@Input() items: any[] = []
@Input() trackBy?: TrackByFunction<any>
@Input() virtualScroll: boolean = false
@Input() virtualScrollItemSize: number = 48
@Input() virtualScrollMinBufferPx: number = 100
@Input() virtualScrollMaxBufferPx: number = 200
@Input() selectionMode: 'none'|'single'|'multiple' = 'none'
@Input() selectedItems: any[] = []
@Input() dividers: boolean = true
@Input() dense: boolean = false
@Input() multiline: boolean = false
@Input() emptyMessage: string = 'No items'
@Input() loading: boolean = false
@Input() loadMore: boolean = false
@Input() ariaLabel?: string
@Output() itemClick = new EventEmitter<any>()
@Output() selectionChange = new EventEmitter<any[]>()
@Output() loadMoreClick = new EventEmitter<void>()
```

### Item Templates
- `itemTemplate` - Custom item rendering
- `emptyTemplate` - Empty state display
- `loadingTemplate` - Loading indicator

### Examples
[Screenshot placeholder - List variants]

---

## Avatar
**Purpose:** User profile image or initials display
**Figma Design:** [Insert Figma link here]

### Parameters / Props
```typescript
@Input() src?: string
@Input() alt?: string
@Input() name?: string // for generating initials
@Input() size: 'xs'|'sm'|'md'|'lg'|'xl'|number = 'md'
@Input() shape: 'circle'|'square'|'rounded' = 'circle'
@Input() color?: string // background color for initials
@Input() textColor?: string
@Input() clickable: boolean = false
@Input() badge?: AvatarBadge
@Input() loading: boolean = false
@Input() ariaLabel?: string
@Output() click = new EventEmitter<Event>()
@Output() error = new EventEmitter<Event>()
@Output() load = new EventEmitter<Event>()
```

### Avatar Badge
```typescript
interface AvatarBadge {
  content?: string | number;
  color?: string;
  dot?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
```

### Examples
[Screenshot placeholder - Avatar sizes and variants]

---

## Badge
**Purpose:** Status indicators and counters
**Figma Design:** [Insert Figma link here]

### Variants
`dot`, `count`, `text`, `status`

### Parameters / Props
```typescript
@Input() variant: 'dot'|'count'|'text'|'status' = 'count'
@Input() content?: string | number
@Input() max: number = 99 // for count variant
@Input() colorScheme: 'blue'|'green'|'purple'|'red'|'gray' = 'red' // renamed from `color`
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() position: 'top-right'|'top-left'|'bottom-right'|'bottom-left'|'inline' = 'top-right'
@Input() overlap: boolean = true
@Input() showZero: boolean = false
@Input() pulse: boolean = false
@Input() ariaLabel?: string
```

### Examples
[Screenshot placeholder - Badge variants and positions]

---

## Chip / Tag
**Purpose:** Compact elements for filters, selections, and labels
**Figma Design:** [Insert Figma link here]

### Variants
`filled`, `outlined`, `text`

### Parameters / Props
```typescript
@Input() variant: 'filled'|'outlined'|'text' = 'filled'
@Input() label: string
@Input() removable: boolean = false
@Input() disabled: boolean = false
@Input() clickable: boolean = false
@Input() selected: boolean = false
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() colorScheme: 'blue'|'green'|'purple'|'red'|'gray' = 'blue' // renamed from `color`
@Input() icon?: string
@Input() avatar?: string
@Input() ariaLabel?: string
@Output() click = new EventEmitter<Event>()
@Output() remove = new EventEmitter<Event>()
@Output() focus = new EventEmitter<FocusEvent>()
@Output() blur = new EventEmitter<FocusEvent>()
```

### Examples
[Screenshot placeholder - Chip variants and states]

---

# 5 — Advanced Form Controls

## Date Picker
**Purpose:** Date selection with calendar interface
**Figma Design:** [Insert Figma link here]

### Selection Modes
- Single date
- Date range
- Multiple dates

### Parameters / Props
```typescript
@Input() value: Date | DateRange | Date[]
@Input() selectionMode: 'single'|'range'|'multiple' = 'single'
@Input() placeholder?: string
@Input() disabled: boolean = false
@Input() readonly: boolean = false
@Input() minDate?: Date
@Input() maxDate?: Date
@Input() disabledDates?: Date[] | ((date: Date) => boolean)
@Input() format: string = 'MM/dd/yyyy'
@Input() firstDayOfWeek: number = 0 // 0 = Sunday
@Input() showWeekNumbers: boolean = false
@Input() showToday: boolean = true
@Input() showClear: boolean = true
@Input() inline: boolean = false
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() locale: string = 'en-US'
@Input() ariaLabel?: string
@Output() valueChange = new EventEmitter<Date | DateRange | Date[]>()
@Output() open = new EventEmitter<void>()
@Output() close = new EventEmitter<void>()
@Output() focus = new EventEmitter<FocusEvent>()
@Output() blur = new EventEmitter<FocusEvent>()
```

### Templates
- `headerTemplate` - Custom calendar header
- `dayTemplate` - Custom day cell
- `footerTemplate` - Custom calendar footer

### Examples
[Screenshot placeholder - Date picker variants]

---

## Time Picker
**Purpose:** Time selection interface
**Figma Design:** [Insert Figma link here]

### Parameters / Props
```typescript
@Input() value: string | Date
@Input() format: '12h'|'24h' = '12h'
@Input() minuteStep: number = 1
@Input() secondsEnabled: boolean = false
@Input() disabled: boolean = false
@Input() readonly: boolean = false
@Input() placeholder?: string
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() clearable: boolean = true
@Input() ariaLabel?: string
@Output() valueChange = new EventEmitter<string | Date>()
@Output() focus = new EventEmitter<FocusEvent>()
@Output() blur = new EventEmitter<FocusEvent>()
```

### Examples
[Screenshot placeholder - Time picker variants]

---

## File Upload
**Purpose:** File selection and upload with preview
**Figma Design:** [Insert Figma link here]

### Upload Types
- Single file
- Multiple files
- Drag & drop zone
- Directory upload

### Parameters / Props
```typescript
@Input() multiple: boolean = false
@Input() directory: boolean = false
@Input() accept?: string
@Input() maxSize?: number // in bytes
@Input() maxFiles?: number
@Input() disabled: boolean = false
@Input() dragDrop: boolean = true
@Input() showPreview: boolean = true
@Input() showProgress: boolean = true
@Input() autoUpload: boolean = false
@Input() uploadUrl?: string
@Input() uploadHeaders?: { [key: string]: string }
@Input() customUploadFunction?: (file: File) => Observable<UploadEvent>
@Input() placeholder: string = 'Drop files here or click to select'
@Input() ariaLabel?: string
@Output() filesSelected = new EventEmitter<File[]>()
@Output() fileRemoved = new EventEmitter<File>()
@Output() uploadStart = new EventEmitter<File>()
@Output() uploadProgress = new EventEmitter<UploadProgressEvent>()
@Output() uploadComplete = new EventEmitter<UploadCompleteEvent>()
@Output() uploadError = new EventEmitter<UploadErrorEvent>()
```

### Examples
[Screenshot placeholder - File upload variants]

---

## Autocomplete / Typeahead
**Purpose:** Search-as-you-type input with suggestions
**Figma Design:** [Insert Figma link here]

### Parameters / Props
```typescript
@Input() value: string = ''
@Input() placeholder?: string
@Input() options: any[] = []
@Input() optionLabel: string = 'label'
@Input() optionValue: string = 'value'
@Input() optionDisabled: string = 'disabled'
@Input() searchFunction?: (query: string) => Observable<any[]>
@Input() minChars: number = 1
@Input() debounceTime: number = 300
@Input() maxResults: number = 10
@Input() loading: boolean = false
@Input() disabled: boolean = false
@Input() clearable: boolean = true
@Input() highlightMatch: boolean = true
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() ariaLabel?: string
@Output() valueChange = new EventEmitter<string>()
@Output() optionSelect = new EventEmitter<any>()
@Output() search = new EventEmitter<string>()
@Output() clear = new EventEmitter<void>()
```

### Templates
- `optionTemplate` - Custom option display
- `noResultsTemplate` - No results message
- `loadingTemplate` - Loading indicator

### Examples
[Screenshot placeholder - Autocomplete variants]

---

# 6 — Utilities & System Components

## Icon
**Purpose:** Scalable vector icons with multiple source support
**Figma Design:** [Insert Figma link here]

### Icon Sources
- Font icons (Material, Phosphor, etc.)
- SVG sprites
- Individual SVG files
- Component-based icons

### Parameters / Props
```typescript
@Input() name: string
@Input() size: 'xs'|'sm'|'md'|'lg'|'xl'|number = 'md'
@Input() color?: string
@Input() spin: boolean = false
@Input() pulse: boolean = false
@Input() flip: 'horizontal'|'vertical'|'both' = undefined
@Input() rotate: 0|90|180|270 = 0
@Input() ariaLabel?: string
@Input() ariaHidden: boolean = true
```

### Examples
[Screenshot placeholder - Icon sizes and effects]

---

## Typography Components
**Purpose:** Consistent text styling across the application
**Figma Design:** [Insert Figma link here]

### Text Component Props
```typescript
@Input() variant: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'body1'|'body2'|'caption'|'overline' = 'body1'
@Input() color?: string
@Input() align: 'left'|'center'|'right'|'justify' = 'left'
@Input() truncate: boolean = false
@Input() lines?: number // for line clamping
@Input() weight: 'light'|'normal'|'medium'|'semibold'|'bold' = 'normal'
@Input() italic: boolean = false
@Input() underline: boolean = false
@Input() strikethrough: boolean = false
@Input() ariaLabel?: string
```

### Examples
[Screenshot placeholder - Typography variants]

---

## Layout Components
**Purpose:** Responsive grid and flex utilities
**Figma Design:** [Insert Figma link here]

### Container Props
```typescript
@Input() maxWidth: 'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'none' = 'lg'
@Input() fluid: boolean = false
@Input() gutters: boolean = true
```

### Grid Props
```typescript
@Input() columns: number = 12
@Input() gap: 'xs'|'sm'|'md'|'lg'|'xl' = 'md'
@Input() alignItems: 'start'|'center'|'end'|'stretch' = 'stretch'
@Input() justifyContent: 'start'|'center'|'end'|'between'|'around'|'evenly' = 'start'
```

### Column Props
```typescript
@Input() span: number | ResponsiveValue = 12
@Input() offset: number | ResponsiveValue = 0
@Input() order: number | ResponsiveValue = 0
```

### Examples
[Screenshot placeholder - Layout components]

---


# 7 — Liquid Glass Components
- Prefer bg-glass and border-glass-border tokens to keep consistent luminance in light/dark.
- Respect prefers-reduced-motion by disabling shimmer/float animations when set.

```css
@media (prefers-reduced-motion: reduce) {
  .animate-float, .animate-glass-shimmer, .animate-liquid-ripple {
    animation: none !important;
  }
}
```

## Glass Card
### Parameters / Props
```typescript
@Input() blur: 'sm'|'md'|'lg'|'xl' = 'md'
@Input() opacity: number = 0.6
@Input() borderOpacity: number = 0.2
@Input() colorTint?: string
@Input() distortion: boolean = false
@Input() chromaticAberration: boolean = false
@Input() animation: 'none'|'float'|'pulse'|'shimmer' = 'none'
@Input() elevation: 1|2|3|4 = 2
```

## Liquid Button
### Parameters / Props
```typescript
@Input() liquidEffect: 'ripple'|'morph'|'flow' = 'ripple'
@Input() viscosity: number = 0.5
@Input() tension: number = 0.3
@Input() flowDirection: 'horizontal'|'vertical'|'radial' = 'radial'
```

## Distortion Container
### Parameters / Props
```typescript
@Input() intensity: number = 0.1
@Input() frequency: number = 2
@Input() type: 'wave'|'turbulence'|'noise' = 'wave'
@Input() animated: boolean = false
@Input() speed: number = 1
```

### Examples
[Screenshot placeholder - Liquid glass effects]

---

# 8 — Advanced Patterns

## Command Palette
**Purpose:** Quick action and navigation interface
**Figma Design:** [Insert Figma link here]

### Parameters / Props
```typescript
@Input() placeholder: string = 'Type a command or search...'
@Input() commands: Command[] = []
@Input() recentCommands: Command[] = []
@Input() maxResults: number = 8
@Input() showRecent: boolean = true
@Input() groupByCategory: boolean = true
@Input() searchFunction?: (query: string) => Observable<Command[]>
@Input() ariaLabel: string = 'Command palette'
@Output() commandExecute = new EventEmitter<Command>()
@Output() close = new EventEmitter<void>()
```

### Command Interface
```typescript
interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  category?: string;
  shortcut?: string;
  disabled?: boolean;
  action: () => void | Promise<void>;
}
```

## Stepper
**Purpose:** Multi-step process navigation
**Figma Design:** [Insert Figma link here]

### Parameters / Props
```typescript
@Input() steps: Step[] = []
@Input() activeStep: number = 0
@Input() orientation: 'horizontal'|'vertical' = 'horizontal'
@Input() linear: boolean = true
@Input() editable: boolean = false
@Input() showNumbers: boolean = true
@Input() alternativeLabel: boolean = false
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() ariaLabel: string = 'Step navigation'
@Output() stepChange = new EventEmitter<number>()
@Output() stepClick = new EventEmitter<Step>()
```

### Step Interface
```typescript
interface Step {
  label: string;
  description?: string;
  icon?: string;
  completed?: boolean;
  error?: boolean;
  disabled?: boolean;
  optional?: boolean;
}
```

## Data Visualization
**Purpose:** Chart and graph components for data display
**Figma Design:** [Insert Figma link here]

### Chart Types
- Line chart
- Bar chart  
- Area chart
- Pie/Donut chart
- Scatter plot
- Heatmap

### Base Chart Props
```typescript
@Input() data: ChartData
@Input() config: ChartConfig
@Input() responsive: boolean = true
@Input() maintainAspectRatio: boolean = true
@Input() theme: 'light'|'dark' = 'light'
@Input() animation: boolean = true
@Input() interactive: boolean = true
@Input() loading: boolean = false
@Input() height?: number
@Input() width?: number
@Output() chartClick = new EventEmitter<ChartEvent>()
@Output() chartHover = new EventEmitter<ChartEvent>()
```

### Examples
[Screenshot placeholder - Chart variants]

---

# 9 — API Design Patterns

## Service-Based Components
Many components offer both declarative and programmatic APIs:

### Modal Service
```typescript
interface ModalService {
  open<T>(component: ComponentType<T>, config?: ModalConfig): ModalRef<T>;
  confirm(config: ConfirmConfig): ModalRef<boolean>;
  alert(config: AlertConfig): ModalRef<void>;
  closeAll(): void;
}
```

### Toast Service
```typescript
interface ToastService {
  show(config: ToastConfig): ToastRef;
  success(message: string, config?: Partial<ToastConfig>): ToastRef;
  error(message: string, config?: Partial<ToastConfig>): ToastRef;
  warning(message: string, config?: Partial<ToastConfig>): ToastRef;
  info(message: string, config?: Partial<ToastConfig>): ToastRef;
  clear(): void;
  clearByType(type: ToastType): void;
}
```

## Form Integration
All form controls implement `ControlValueAccessor` and integrate seamlessly with Angular Reactive Forms:

```typescript
// Reactive Forms
this.form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]],
  preferences: this.fb.group({
    newsletter: [false],
    theme: ['light']
  })
});

// Template
<form [formGroup]="form">
  <ui-input 
    formControlName="email" 
    type="email" 
    label="Email Address"
    placeholder="Enter your email">
  </ui-input>
  
  <ui-input 
    formControlName="password" 
    type="password" 
    label="Password"
    showPasswordToggle="true">
  </ui-input>
  
  <ui-toggle 
    formControlName="preferences.newsletter"
    label="Subscribe to newsletter">
  </ui-toggle>
</form>
```

---


## Theme Provider
**Purpose:** Global theming and design token management
**Figma Design:** [Insert Figma link here]

### Theme Service
```typescript
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = signal<ThemeConfig>(defaultTheme);
  private isDark = signal<boolean>(false);

  setTheme(theme: ThemeConfig): void {
    this.currentTheme.set(theme);
    this.applyThemeVariables(theme);
  }

  toggleDarkMode(): void {
    this.isDark.update(dark => !dark);
    document.documentElement.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
  }

  private applyThemeVariables(theme: ThemeConfig): void {
    const root = document.documentElement;
    
    // Apply color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([shade, color]) => {
          root.style.setProperty(`--color-${key}-${shade}`, this.hexToRgb(color));
        });
      } else {
        root.style.setProperty(`--color-${key}`, this.hexToRgb(value));
      }
    });

    // Apply spacing, radius, etc.
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
  }

  getColorClasses(scheme: string): ColorClasses {
    return {
      bg: `bg-${scheme}-500`,
      bgHover: `hover:bg-${scheme}-600`,
      text: `text-${scheme}-600`,
      border: `border-${scheme}-500`,
      ring: `ring-${scheme}-500`,
    };
  }
}

interface ColorClasses {
  bg: string;
  bgHover: string;
  text: string;
  border: string;
  ring: string;
}
```

### Usage Examples
```typescript
// Component usage with theme integration
@Component({
  template: `
    <ui-button 
      [colorScheme]="themeService.currentScheme()"
      variant="primary"
      customClasses="shadow-lg hover:shadow-xl">
      Themed Button
    </ui-button>
    
    <ui-card 
      variant="glass"
      [colorScheme]="themeService.currentScheme()"
      customClasses="backdrop-blur-glass-lg">
      Glass morphism card with theme integration
    </ui-card>
  `
})
export class ExampleComponent {
  constructor(public themeService: ThemeService) {}
}
```

### Tailwind Configuration Extension
```javascript
// tailwind.config.js - Extended for UI library
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './projects/ui-lib/**/*.{html,ts}'
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      // ...existing code...
      
      // Component-specific utilities
      utilities: {
        '.ui-focus': {
          '@apply focus:outline-none focus:ring-2 focus:ring-offset-2': {},
        },
        '.ui-transition': {
          '@apply transition-all duration-200 ease-in-out': {},
        },
        '.ui-glass': {
          '@apply backdrop-blur-glass-md bg-glass/60 border border-glass-border/20': {},
        },
        '.ui-liquid-hover': {
          '@apply relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-radial before:from-current/20 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100': {},
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Custom plugin for UI library utilities
    function({ addUtilities, theme }) {
      addUtilities({
        '.ui-focus': {
          '&:focus': {
            outline: 'none',
            'box-shadow': `0 0 0 2px ${theme('colors.blue.500')}`,
          }
        }
      });
    }
  ]
}
```

---

## Component Base Class
```typescript
export abstract class UiComponentBase {
  @Input() colorScheme: ColorScheme = 'blue';
  @Input() customClasses?: string;
  
  protected getColorClasses(scheme: ColorScheme = this.colorScheme): Record<string, string> {
    return {
      primary: `bg-${scheme}-500 hover:bg-${scheme}-600 text-white`,
      secondary: `bg-${scheme}-100 hover:bg-${scheme}-200 text-${scheme}-800`,
      outline: `border-${scheme}-500 text-${scheme}-600 hover:bg-${scheme}-50`,
      ghost: `text-${scheme}-600 hover:bg-${scheme}-50`,
      text: `bg-${scheme}-500 text-white`,
      ring: `ring-${scheme}-500 focus:ring-${scheme}-500`,
    };
  }
  
  protected combineClasses(...classes: (string | string[] | undefined)[]): string {
    return classes
      .flat()
      .filter(Boolean)
      .join(' ');
  }
}

type ColorScheme = 'blue' | 'green' | 'purple' | 'red' | 'gray';
```



---

# 11 — Accessibility Implementation

## WCAG 2.1 AA Compliance Checklist
- ✅ Color contrast ratios (4.5:1 for normal text, 3:1 for large text/UI components)
- ✅ Keyboard navigation and focus management
- ✅ Screen reader support with proper ARIA attributes
- ✅ Respect for `prefers-reduced-motion`
- ✅ Touch targets ≥ 44×44px with adequate spacing
- ✅ Alternative text for images and icons
- ✅ Logical tab order and focus indicators
- ✅ Error identification and suggestions
- ✅ Consistent navigation and identification

## Testing Requirements
- Automated testing with axe-core
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- High contrast mode verification
- Mobile accessibility testing
- Color blindness simulation

---




# 11 — Development & Documentation

## Storybook Integration
Each component includes comprehensive Storybook stories:
- Default state examples
- All variant demonstrations
- Interactive property controls
- Accessibility testing
- Design token documentation
- Usage guidelines and best practices

## Component Template Structure
```typescript
@Component({
  selector: 'ui-[component-name]',
  templateUrl: './[component-name].component.html',
  styleUrls: ['./[component-name].component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    // ControlValueAccessor for form controls
  ],
  host: {
    'class': 'ui-[component-name]',
    '[class.ui-[component-name]--disabled]': 'disabled',
    '[class.ui-[component-name]--loading]': 'loading',
    '[attr.aria-disabled]': 'disabled || null',
    // Additional host bindings
  }
})
export class Ui[ComponentName] implements OnInit, OnDestroy, ControlValueAccessor {
  // Component implementation
}
```



---


## Testing Strategy
- Unit tests for all components with Jest
- Integration tests for complex interactions
- Visual regression tests with Chromatic
- Accessibility tests with axe-core
- Performance tests for animations and interactions



## Design System Documentation
**Figma Design System:** [Insert main Figma file link here]
**Component Library:** [Insert component library Figma link here]
**Style Guide:** [Insert style guide Figma link here]

## Interactive Examples
All components will include interactive examples in Storybook with:
- Live property editing
- Code snippets
- Design token integration
- Accessibility testing tools
- Responsive preview modes

---

**Last Updated:** September 2025  
**Version:** 1.0.2

