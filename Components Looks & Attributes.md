# UI Library Components Specification
**Last Updated:** 02 October 2025  
**Version:** 1.1.0

## Overview
### Design System Documentation
**Style Guide:** [Design System Overview](Design.md)
**Figma Design System:** [Insert main Figma file link here]


### Strategies for Coherence
- Design Tokens: Centralize colors, spacing, typography via CSS variables or Tailwind config for design consistency.
- Component Props: Standardize props (variant, size, density) so variant=“primary” means the same across all types.
- Themeable API: Use custom properties; allow consuming apps to overwrite via parent themes or Tailwind config extension.
- Documentation: Provide Storybook or demo app with examples in both desktop and mobile layouts.
- Testing: Run visual regressions (Chromatic, Percy), support WCAG accessibility checks.

### Mobile Friendliness
- Responsive Variants: Use media queries/Tailwind’s breakpoints (sm:, md:, lg:).
- Touch Optimization: Tap targets min. 48px, visible focus states, avoid hover-only triggers.
- Hide/Convert: Hide secondary elements, use full-screen selectors instead of dropdowns.
- Grid & Flex Layouts: Prefer CSS Grid or Flex for adaptive, fluid layouts.
- Viewport-based Routing: Optionally show different components/routes depending on device size.
- Test on Devices: Leverage device labs or BrowserStack for real physical device responsiveness checks.


### Testing Strategy
- Unit tests for all components with Jest
- [Page Object Tests](#page-object) for component behavior
- Integration tests for complex interactions
- Visual regression tests with Chromatic
- Accessibility tests with axe-core
- Performance tests for animations and interactions


## API Design Patterns
### Modal Service
```typescript
interface ModalService {
  open<T>(component: ComponentType<T>, config?: ModalConfig): ModalRef<T>;
  confirm(config: ConfirmConfig): ModalRef<boolean>;
  alert(config: AlertConfig): ModalRef<void>;
  closeAll(): void;
}
```

&nbsp;  
&nbsp;  
### Form Integration
All form controls implement [`ControlValueAccessor`](#controlvalueaccessor) and integrate seamlessly with Angular Reactive Forms:

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


&nbsp;  
&nbsp;  
### Theme Provider
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



&nbsp;  
&nbsp;  
### Component Base Class
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



&nbsp;  
&nbsp;  
### ControlValueAccessor
```typescript
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, Injectable, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';

@Injectable()
export abstract class BaseFormControl<T = any> implements ControlValueAccessor, OnDestroy {
  protected _value: T | null = null;
  protected _disabled = false;
  protected _touched = false;
  
  private onChange = (value: T) => {};
  private onTouched = () => {};
  private destroy$ = new Subject<void>();

  get value(): T | null {
    return this._value;
  }

  set value(val: T | null) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val);
    }
  }

  get disabled(): boolean {
    return this._disabled;
  }

  // ControlValueAccessor implementation
  writeValue(value: T): void {
    this._value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
    this.cdr.markForCheck();
  }

  protected markAsTouched(): void {
    if (!this._touched) {
      this._touched = true;
      this.onTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(protected cdr: ChangeDetectorRef) {}
}

// Example implementation for button component
@Component({
  selector: 'my-ui-input',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MyUiInput),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyUiInput extends BaseFormControl<string> implements AfterViewInit {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type = 'text';
  @Input() required = false;
  @Input() hint?: string;
  @Input() errorMessage?: string;
  
  readonly inputId = `ui-input-${Math.random().toString(36).substr(2, 9)}`;
  readonly hintId = `${this.inputId}-hint`;
  readonly errorId = `${this.inputId}-error`;

  get hasError(): boolean {
    return !!this.errorMessage;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
  }

  onBlur(): void {
    this.markAsTouched();
  }

  onFocus(): void {
    // Handle focus logic
  }

  getAriaDescribedBy(): string | null {
    const ids = [];
    if (this.hint) ids.push(this.hintId);
    if (this.errorMessage) ids.push(this.errorId);
    return ids.length > 0 ? ids.join(' ') : null;
  }
}
```

<https://dev.to/valorsoftware/avoiding-common-pitfalls-with-controlvalueaccessors-in-angular-4m57>
<https://angular.love/never-again-be-confused-when-implementing-controlvalueaccessor-in-angular-forms>
<https://www.sparkcodehub.com/angular/accessibility/use-aria-labels-in-ui>
<https://testing-library.com/docs/angular-testing-library/intro/>
<https://codelabs.developers.google.com/angular-a11y#0>
<https://fontawesome.com/v4/examples/>
<https://fontawesome.com/icons/language?f=slab&s=regular>





&nbsp;  
&nbsp;  
### Content Projection with Slots
```typescript
export class MyUiCard implements AfterContentInit {
  @Input() variant: 'elevated' | 'outlined' | 'filled' = 'elevated';
    @ContentChild('[slot=header]') headerContent?: ElementRef;
  @ContentChild('[slot=media]') mediaContent?: ElementRef;
  @ContentChild('[slot=actions]') actionsContent?: ElementRef;

  get hasHeader(): boolean {
    return !!this.headerContent;
  }

  get hasMedia(): boolean {
    return !!this.mediaContent;
  }

  get hasActions(): boolean {
    return !!this.actionsContent;
  }
}
```


&nbsp;  
&nbsp;  
### Page Object
```typescript
import { render, screen, fireEvent } from '@testing-library/angular';
import { MyUiButton } from './button.component';

describe('MyUiButton', () => {
  test('renders button with text', async () => {
    await render(MyUiButton, {
      componentProperties: {
        variant: 'primary'
      },
      template: '<my-ui-button>Click me</my-ui-button>'
    });

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  test('emits click event', async () => {
    const clickSpy = jest.fn();
    
    await render(MyUiButton, {
      componentProperties: {
        click: { emit: clickSpy } as any
      },
      template: '<my-ui-button (click)="click.emit()">Click me</my-ui-button>'
    });

    fireEvent.click(screen.getByRole('button'));
    expect(clickSpy).toHaveBeenCalled();
  });

  test('is accessible', async () => {
    await render(MyUiButton, {
      template: '<my-ui-button aria-label="Save document">Save</my-ui-button>'
    });

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Save document');
  });
});
```










## Accessibility Implementation
### WCAG 2.1 AA Compliance Checklist
- ✅ Color contrast ratios (4.5:1 for normal text, 3:1 for large text/UI components)
- ✅ Keyboard navigation and focus management
- ✅ Screen reader support with proper ARIA attributes
- ✅ Respect for `prefers-reduced-motion`
- ✅ Touch targets ≥ 44×44px with adequate spacing
- ✅ Alternative text for images and icons
- ✅ Logical tab order and focus indicators
- ✅ Error identification and suggestions
- ✅ Consistent navigation and identification

### Testing Requirements
- Automated testing with axe-core
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- High contrast mode verification
- Mobile accessibility testing
- Color blindness simulation


### Accessible Modal Component Example
```typescript
// Accessibility service
@Injectable({
  providedIn: 'root'
})
export class A11yService {
  private liveAnnouncer = inject(LiveAnnouncer);
  
  announceForScreenReader(message: string, priority: AriaLivePoliteness = 'polite'): void {
    this.liveAnnouncer.announce(message, priority);
  }

  generateUniqueId(prefix = 'ui'): string {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  trapFocus(element: HTMLElement): void {
    // Implementation for focus trapping in modals
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
}

// Accessible modal component
@Component({
  selector: 'my-ui-modal',
  template: `
    <div 
      *ngIf="open"
      class="ui-modal-backdrop"
      [attr.aria-hidden]="!open"
      (click)="onBackdropClick($event)">
      <div 
        class="ui-modal-container"
        role="dialog"
        [attr.aria-modal]="open"
        [attr.aria-labelledby]="titleId"
        [attr.aria-describedby]="descriptionId"
        (click)="$event.stopPropagation()">
        
        <div class="ui-modal-header">
          <h2 [id]="titleId" class="ui-modal-title">
            <ng-content select="[slot=title]"></ng-content>
          </h2>
          <button 
            *ngIf="closable"
            type="button"
            class="ui-modal-close"
            [attr.aria-label]="closeAriaLabel"
            (click)="close()">
            ×
          </button>
        </div>
        
        <div [id]="descriptionId" class="ui-modal-body">
          <ng-content></ng-content>
        </div>
        
        <div class="ui-modal-footer">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  host: {
    '(keydown.escape)': 'close()',
    '[class.ui-modal--open]': 'open'
  }
})
export class MyUiModal implements OnInit, OnDestroy {
  @Input() open = false;
  @Input() closable = true;
  @Input() closeAriaLabel = 'Close dialog';
  @Output() openChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  readonly titleId = this.a11y.generateUniqueId('modal-title');
  readonly descriptionId = this.a11y.generateUniqueId('modal-desc');

  private previousActiveElement?: HTMLElement;

  constructor(private a11y: A11yService, private elementRef: ElementRef) {}

  ngOnInit(): void {
    if (this.open) {
      this.handleOpen();
    }
  }

  @HostListener('openChange')
  onOpenChange(): void {
    if (this.open) {
      this.handleOpen();
    } else {
      this.handleClose();
    }
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
    this.closed.emit();
  }

  private handleOpen(): void {
    this.previousActiveElement = document.activeElement as HTMLElement;
    
    // Trap focus within modal
    setTimeout(() => {
      const modalElement = this.elementRef.nativeElement.querySelector('.ui-modal-container');
      if (modalElement) {
        this.a11y.trapFocus(modalElement);
        modalElement.focus();
      }
    });

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  private handleClose(): void {
    // Restore focus
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }

    // Restore body scroll
    document.body.style.overflow = '';
  }

  onBackdropClick(event: Event): void {
    if (this.closable && event.target === event.currentTarget) {
      this.close();
    }
  }
}
```



## Component Roadmap
1. Foundation (already in theme section)
- [x] Design tokens (colors, radius, spacing, motion)
- [x] [Tailwind theme](#tailwind-theme-integration) + utilities (focus ring, glass, transitions)
- [x] A11y utilities (focus trap, aria helpers)
- [x] Overlay/positioning primitives (portal, z-layers, dismiss, positioning)

2. Primitives & Layout
- [x] [Container](#container-props)
- [x] [Grid](#grid-props) / Row / Column
- [x] Dividers
- [x] Typography (Heading, Text)
- [x] [Icon](#icon)
- [x] Link
- [x] Image
- [x] Scroll Area

3. Button Family
- [x] [Button / Icon Button / Button Groups](#button)
- [x] Segmented Button
- [x] Split Button
- [x] Floating Action Button (FAB)
- [x] Extended FAB
- [ ] FAB Menu

4. Form Infrastructure
- [ ] Form Field Wrapper

5. Basic Inputs (non-overlay)
- [ ] Label
- [x] [Text Field / Input](#input-text) (text, password, email, number, search, masks/validators/OTP)
- [x] [Textarea](#textarea)
- [x] [Checkbox](#checkbox)
- [x] [Radio Group & Radio](#radio-group--radio)
- [x] [Toggle / Switch](#toggle--switch)
- [x] [Slider / Range](#slider--range-input)

6. Overlay-based Inputs (requires overlay primitives)
- [x] [Select](#select-single--multi) (Single & Multi)
- [x] [Autocomplete / Combo Box / Typeahead](#autocomplete--typeahead)
- [ ] [Date Picker](#date-picker)
- [ ] [Time Picker](#time-picker)
- [ ] [File Upload](#file-upload)
- [x] Search (composite of input + list/command menu)

7. Feedback & Status
- [x] Loading Indicator / Loader
- [?] Progress Indicators (linear + circular) *(increment/reset APIs pending)*
- [x] [Badge / Status](#badge)
- [x] [Chip / Tag / Pill](#chip--tag)
- [x] [Toast / Snackbar](#toast--snackbar)

8. Surfaces & Data Display
- [x] [Card](#card)
- [ ] [List (incl. virtual list)](#list--virtual-list)
- [?] [Avatar / Avatar Group (with ring/status)](#avatar)
- [x] [Table / Data Grid](#table--data-grid)
- [x] Feed
- [x] Stats
- [x] Timeline
- [x] Banner
- [x] Carousel
- [x] [Skeleton (after Card/Container)](#skeleton-props)
- [x] Footer / Copyright

9. Navigation
- [x] [Tabs](#tabs)
- [x] [Breadcrumbs](#breadcrumb)
- [x] [Pagination](#pagination)
- [ ] [Steps / Stepper](#stepper)
- [x] [Navbar / App Bar / Toolbar](#navbar--toolbar)
- [ ] [Sidebar / Drawer / SlideOver / Side Sheets / Navigation Drawer](#sidenav--drawer)
- [ ] Navigation Rail
- [ ] Bottom Navigation / Dock
- [x] [Menu / Dropdown / Flyout Menu](#menu--dropdown)
- [x] [Command Menu / Command Palette](#command-palette)
- [x] Accordion
- [x] Tree View
- [ ] Reorder (drag to reorder)
- [ ] Keyboard Shortcuts (service; used by Command Menu)
- [ ] Expander
- [ ] Context Menu

1.  Overlays
- [x] [Tooltip](#tooltip)
- [ ] [Popover / Pop-up](#popover--popper)
- [x] [Modal / Dialog (alert/confirm/fullscreen)](#modal--dialog)
- [ ] Bottom Sheets
- [ ] Action Sheet
- [ ] Backdrop
- [x] [Layout](#layout-components)

1.  Utility Components
- [x] Dark Mode Switcher (3-way toggle: system/light/dark)
- [ ] Theme Switcher (dropdown to select from available themes)

1.  Liquid Glass Suite
- [ ] [Glass Card](#glass-card)
- [ ] [Liquid Button](#liquid-button)
- [ ] [Distortion Container](#distortion-container)

1.  Misc Utilities
- [ ] Swap (icon/text/hamburger)
- [ ] Diff (image, text)
- [ ] Rating


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


## Tailwind Theme Integration
### Theme Configuration
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

### CSS Custom Properties
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

### Typography Component Service
```typescript
@Injectable({
  providedIn: 'root'
})
export class TypographyService {
  private fontLoadingSubject = new BehaviorSubject<boolean>(false);
  
  async loadFonts(): Promise<void> {
    try {
      await Promise.all([
        document.fonts.load('400 16px Inter'),
        document.fonts.load('700 16px Inter'),
        document.fonts.load('400 24px Playfair Display')
      ]);
      this.fontLoadingSubject.next(true);
    } catch (error) {
      console.warn('Font loading failed:', error);
    }
  }
  
  get fontsLoaded$(): Observable<boolean> {
    return this.fontLoadingSubject.asObservable();
  }
}
```

#### Font Loading Strategies
1. Preload critical fonts in HTML head
2. Use `font-display: swap` for better UX
3. Implement font fallbacks with similar metrics
4. Test across devices and screen sizes
5. Monitor performance with Core Web Vitals


---


## Components
All components should be wrapped in [UIComponent Base Class](#component-base-class) to inherit theme and utility props.
### Button
**Purpose:** Primary interactive element for user actions
**Figma Design:** [Insert Figma link here]

Variants: `primary`, `secondary`, `tertiary`, `ghost`, `outline`, `danger`, `warning`, `success`, `info`, `link`
Sizes: `xs`, `sm`, `md`, `lg`, `xl`
States: `normal`, `hover`, `active`, `focus`, `disabled`, `loading`, `pressed`

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


- filled -> primary (solid) button
- outlined -> outline
- text -> link/ghost (no container)
- tonal -> secondary (use container/onContainer tokens)

Implementation hint: When mdVariantAlias is set, map to your existing variantClasses using Material tokens for container/label colors.

#### Accessibility Features
- Minimum 48×48px touch target
- WCAG 2.1 AA color contrast compliance
- Keyboard navigation support
- Screen reader compatible
- Focus ring visible on `:focus-visible`
- `aria-pressed` for toggle states



&nbsp;  
&nbsp;  
### Form Field Wrapper
**Purpose:** Consistent wrapper for all form controls with label, hints, and error handling
**Figma Design:** [Insert Figma link here]


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


Content Projection Slots:  
- `prefix` - Icon or text before the control
- `suffix` - Icon or text after the control  
- `control` - The form control itself
- `hint` - Helper text below the control
- `error` - Error message below the control



&nbsp;  
&nbsp;  
### Input (Text)
**Purpose:** Single-line text input with comprehensive validation and styling
**Figma Design:** [Insert Figma link here]

Input Types: `text`, `password`, `search`, `url`, `email`, `tel`, `number`, `hidden`
Sizes: `sm` (32px), `md` (40px), `lg` (48px)
Implement [`ControlValueAccessor`](#controlvalueaccessor), send `touched`/`dirty` states.


```typescript
@Input() type: 'text'|'password'|'search'|'url'|'email'|'tel'|'number' = 'text'
@Input() value: string = ''
@Input() placeholder?: string
@Input() iconLeft?: string
@Input() iconRight?: string
@Input() label?: string
@Input() hint?: string
@Input() error?: string
@Input() size: 'sm'|'md'|'lg' = 'md'
@Input() required: boolean = false
@Input() readonly: boolean = false
@Input() disabled: boolean = false
@Input() autofocus: boolean = false
@Input() autocomplete?: string
@Input() spellcheck: boolean = true
@Input() clearable: boolean = false
@Input() showPasswordToggle: boolean = false // input necessary?
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

#### Accessibility Features
- role="textbox" and aria-invalid on error.
- Describe with aria-describedby for hint and error; update dynamically.




&nbsp;  
&nbsp;  
### Textarea
**Purpose:** Multi-line text input with auto-resize capabilities
**Figma Design:** [Insert Figma link here]


```typescript
// Inherits from Input plus:
@Input() rows: number = 4
@Input() autoResize: boolean = false
@Input() minRows?: number
@Input() maxRows?: number
@Input() resizable: 'none'|'vertical'|'horizontal'|'both' = 'vertical'
@Input() characterCount: boolean = false
```

&nbsp;  
&nbsp;  
### Select (Single & Multi)
**Purpose:** Dropdown selection with search, multi-select, and virtual scrolling
**Figma Design:** [Insert Figma link here]

Types:  
- Single select (native/custom)
- Multi-select with chips
- Creatable/taggable
- Grouped options


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

#### Template Slots
- `optionTemplate` - Custom option rendering
- `selectedTemplate` - Custom selected value display
- `noOptionsTemplate` - No results message
- `loadingTemplate` - Loading indicator

#### Accessibility Features
- Keyboard navigation with arrow keys
- Type-ahead search
- `aria-expanded`, `aria-owns`, `aria-activedescendant`
- Screen reader announcements



&nbsp;  
&nbsp;  
### Checkbox
**Purpose:** Binary or tri-state selection control
**Figma Design:** [Insert Figma link here]

Variants: `default`, `tristate`, `custom`

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



&nbsp;  
&nbsp;  
### Radio Group & Radio
**Purpose:** Single selection from multiple options
**Figma Design:** [Insert Figma link here]

#### Radio Group Props
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

#### Radio Props
```typescript
@Input() value: any
@Input() label?: string
@Input() disabled: boolean = false
@Input() ariaLabel?: string
@Input() ariaDescribedBy?: string
```

#### Accessibility Features
- Arrow key navigation between options
- Space key to select
- Roving tabindex
- role="combobox" with aria-expanded/aria-controls; popup list role="listbox" with option items role="option".
- Manage active option via aria-activedescendant.



&nbsp;  
&nbsp;  
### Toggle / Switch
**Purpose:** On/off control with smooth animations
**Figma Design:** [Insert Figma link here]


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


&nbsp;  
&nbsp;  
### Slider / Range Input
**Purpose:** Numeric input via dragging or touch
**Figma Design:** [Insert Figma link here]

Types:  
- Single value
- Range (dual handle)
- Stepped values
- With marks/ticks


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



&nbsp;  
&nbsp;  
### Tabs
**Purpose:** Content organization and switching interface
**Figma Design:** [Insert Figma link here]

Variants: `line`, `pills`, `box`, `segmented`, `glass`

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

#### Accessibility Notes
- role="tablist" on container, role="tab" on triggers, role="tabpanel" on content.
- aria-selected, aria-controls, id binding per WAI-ARIA Authoring Practices.
- Use roving tabindex for horizontal/vertical arrow key navigation.
- Follow WAI-ARIA APG: roving tabindex, aria-selected on active tab, aria-controls/id linkage.



&nbsp;  
&nbsp;  
### Menu / Dropdown
**Purpose:** Contextual actions and navigation
**Figma Design:** [Insert Figma link here]

Types:  
- Context menu
- Menu button
- Split button
- Nested menus


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

#### Accessibility Notes
- role="menu" with role="menuitem" (or menuitemcheckbox/menuitemradio) when appropriate.
- Manage focus with looped arrow key navigation; Esc closes and returns focus to trigger.
- Leverage aria-activedescendant with active option id.



&nbsp;  
&nbsp;  
### Breadcrumb
**Purpose:** Hierarchical navigation display
**Figma Design:** [Insert Figma link here]


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

```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
  ariaLabel?: string;
}
```


&nbsp;  
&nbsp;  
### Pagination
**Purpose:** Large dataset navigation
**Figma Design:** [Insert Figma link here]

Types:  
- Standard pagination
- Simple (previous/next only)
- Compact (mobile-optimized)


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




&nbsp;  
&nbsp;  
### Sidenav / Drawer
**Purpose:** Side navigation panel with multiple display modes
**Figma Design:** [Insert Figma link here]

Modes:  
- `over` - Overlays content
- `push` - Pushes content aside
- `side` - Side-by-side with content



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



&nbsp;  
&nbsp;  
### Navbar / Toolbar
**Purpose:** Application header with navigation and actions
**Figma Design:** [Insert Figma link here]

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

Content Slots:  
- `brand` - Logo/brand area
- `nav` - Navigation links
- `actions` - Action buttons
- `mobile-menu` - Mobile menu toggle


&nbsp;  
&nbsp;  
### Tooltip
**Purpose:** Contextual information on hover/focus
**Figma Design:** [Insert Figma link here]

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



&nbsp;  
&nbsp;  
### Popover / Popper
**Purpose:** Rich contextual content overlay
**Figma Design:** [Insert Figma link here]

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

Content Slots:  
- `header` - Popover header
- `content` - Main content area
- `footer` - Action buttons area



&nbsp;  
&nbsp;  
### Modal / Dialog
**Purpose:** Modal overlays for important content and actions
**Figma Design:** [Insert Figma link here]

Types:  
- Standard dialog
- Alert dialog
- Confirmation dialog
- Full-screen modal


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



Content Slots:
- `header` - Modal header with title
- `body` - Main content area
- `footer` - Action buttons

#### Accessibility
- role="dialog" or role="alertdialog" with aria-modal="true".
- Focus trap on open; return focus to trigger on close.
- Label via aria-labelledby or aria-label; describe via aria-describedby.




&nbsp;  
&nbsp;  
### Toast / Snackbar
**Purpose:** Non-intrusive notifications
**Figma Design:** [Insert Figma link here]

Types: `info`, `success`, `warning`, `error`, `custom`


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

Another option is to use the `ngx-toastr` library.


&nbsp;  
&nbsp;  
### Progress Indicators
**Purpose:** Loading and progress feedback
**Figma Design:** [Insert Figma link here]

Types:  
- Linear progress bar
- Circular progress/spinner
- Skeleton loaders

#### Linear Progress Props
```typescript
@Input() value?: number // undefined for indeterminate
@Input() buffer?: number
@Input() size: 'xs'|'sm'|'md'|'lg' = 'md'
@Input() color: 'blue'|'green'|'purple'|'red' = 'blue'
@Input() showLabel: boolean = false
@Input() label?: string
@Input() ariaLabel?: string
```

#### Circular Progress Props
```typescript
@Input() value?: number // undefined for indeterminate
@Input() size: number = 40
@Input() strokeWidth: number = 4
@Input() color: 'blue'|'green'|'purple'|'red' = 'blue'
@Input() showLabel: boolean = false
@Input() ariaLabel?: string
```

#### Skeleton Props
```typescript
@Input() variant: 'text'|'rectangular'|'circular' = 'text'
@Input() width?: string | number
@Input() height?: string | number
@Input() animation: 'pulse'|'wave'|'none' = 'pulse'
@Input() lines?: number // for text variant
```



&nbsp;  
&nbsp;  
### Table / Data Grid
**Purpose:** Structured data display with sorting, filtering, and pagination
**Figma Design:** [Insert Figma link here]

Features:  
- Column sorting and filtering
- Row selection (single/multi)
- Virtual scrolling
- Column resizing and reordering
- Row expansion
- Sticky headers


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


&nbsp;  
&nbsp;  
### Card
**Purpose:** Content container with optional header, body, and footer
**Figma Design:** [Insert Figma link here]

Variants: `elevated`, `outlined`, `filled`

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

Content Slots:  
- `header` - Card header with title and actions
- `media` - Image or media content
- `content` - Main card content
- `actions` - Action buttons
- `footer` - Additional footer content



&nbsp;  
&nbsp;  
### List / Virtual List
**Purpose:** Efficient display of large data sets
**Figma Design:** [Insert Figma link here]

Types:  
- Simple list
- Virtual scrolling list
- Infinite scroll list


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

Item Templates:  
- `itemTemplate` - Custom item rendering
- `emptyTemplate` - Empty state display
- `loadingTemplate` - Loading indicator


&nbsp;  
&nbsp;  
### Avatar
**Purpose:** User profile image or initials display
**Figma Design:** [Insert Figma link here]

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

```typescript
interface AvatarBadge {
  content?: string | number;
  color?: string;
  dot?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
```


&nbsp;  
&nbsp;  
### Badge
**Purpose:** Status indicators and counters
**Figma Design:** [Insert Figma link here]

Variants: `dot`, `count`, `text`, `status`


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


&nbsp;  
&nbsp;  
### Chip / Tag
**Purpose:** Compact elements for filters, selections, and labels
**Figma Design:** [Insert Figma link here]

Variants: `filled`, `outlined`, `text`

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


&nbsp;  
&nbsp;  
### Date Picker
**Purpose:** Date selection with calendar interface
**Figma Design:** [Insert Figma link here]

Selection Modes:  
- Single date
- Date range
- Multiple dates


```typescript
@Input() value: Date | DateRange | Date[]
@Input() selectionMode: 'single'|'range'|'multiple' = 'single'
@Input() placeholder?: string
@Input() disabled: boolean = false
@Input() readonly: boolean = false
@Input() minDate?: Date
@Input() maxDate?: Date
@Input() disabledDates?: Date[] | ((date: Date) => boolean)
@Input() startView: 'month'|'year'|'decade' = 'month'
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

Templates:  
- `headerTemplate` - Custom calendar header
- `dayTemplate` - Custom day cell
- `footerTemplate` - Custom calendar footer


&nbsp;  
&nbsp;  
### Time Picker
**Purpose:** Time selection interface
**Figma Design:** [Insert Figma link here]


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



&nbsp;  
&nbsp;  
### File Upload
**Purpose:** File selection and upload with preview
**Figma Design:** [Insert Figma link here]

Upload Types:  
- Single file
- Multiple files
- Drag & drop zone
- Directory upload


```typescript
@Input() multiple: boolean = false
@Input() directory: boolean = false
@Input() accept?: string // e.g. "image/*,.pdf" (MIME types or extensions)
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


&nbsp;  
&nbsp;  
### Autocomplete / Typeahead
**Purpose:** Search-as-you-type input with suggestions
**Figma Design:** [Insert Figma link here]

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

Templates:  
- `optionTemplate` - Custom option display
- `noResultsTemplate` - No results message
- `loadingTemplate` - Loading indicator



&nbsp;  
&nbsp;  
### Icon
**Purpose:** Scalable vector icons with multiple source support
**Figma Design:** [Insert Figma link here]

Icon Sources:  
- Font icons (Material, Phosphor, etc.)
- SVG sprites
- Individual SVG files
- Component-based icons

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


&nbsp;  
&nbsp;  
### Text / Typography
**Purpose:** Consistent text styling across the application
**Figma Design:** [Insert Figma link here]

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

&nbsp;  
&nbsp;  
### Container
**Purpose:** Responsive grid and flex utilities
**Figma Design:** [Insert Figma link here]

```typescript
@Input() maxWidth: 'xs'|'sm'|'md'|'lg'|'xl'|'2xl'|'none' = 'lg'
@Input() fluid: boolean = false
@Input() gutters: boolean = true
```

&nbsp;  
&nbsp;  
### Grid
**Purpose:** Responsive grid and flex utilities
**Figma Design:** [Insert Figma link here]

```typescript
@Input() columns: number = 12
@Input() gap: 'xs'|'sm'|'md'|'lg'|'xl' = 'md'
@Input() alignItems: 'start'|'center'|'end'|'stretch' = 'stretch'
@Input() justifyContent: 'start'|'center'|'end'|'between'|'around'|'evenly' = 'start'
```


&nbsp;  
&nbsp;  
### Column
**Purpose:** Responsive column and flex utilities
**Figma Design:** [Insert Figma link here]
```typescript
@Input() span: number | ResponsiveValue = 12
@Input() offset: number | ResponsiveValue = 0
@Input() order: number | ResponsiveValue = 0
```


&nbsp;  
&nbsp;  
### Glass Card
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

&nbsp;  
&nbsp;  
### Liquid Button
```typescript
@Input() liquidEffect: 'ripple'|'morph'|'flow' = 'ripple'
@Input() viscosity: number = 0.5
@Input() tension: number = 0.3
@Input() flowDirection: 'horizontal'|'vertical'|'radial' = 'radial'
```

&nbsp;  
&nbsp;  
### Distortion Container
```typescript
@Input() intensity: number = 0.1
@Input() frequency: number = 2
@Input() type: 'wave'|'turbulence'|'noise' = 'wave'
@Input() animated: boolean = false
@Input() speed: number = 1
```


&nbsp;  
&nbsp;  
### Command Palette
**Purpose:** Quick action and navigation interface
**Figma Design:** [Insert Figma link here]

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


&nbsp;  
&nbsp;  
### Stepper
**Purpose:** Multi-step process navigation
**Figma Design:** [Insert Figma link here]

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

&nbsp;  
&nbsp;  
### Data Visualization
**Purpose:** Chart and graph components for data display
**Figma Design:** [Insert Figma link here]

Chart Types:  
- Line chart
- Bar chart  
- Area chart
- Pie/Donut chart
- Scatter plot
- Heatmap


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



