Nice — that’s a great idea. Below I’ll give a practical, “ready-to-implement” checklist: the **components you should include**, and for each one **types / variants / common @Inputs / @Outputs / behaviors** you’ll want. I’ll also include **API patterns**, accessibility notes, theming/design-token guidance, and short code examples (Button + a form input + Modal) you can copy to start your Angular library.

I assume you want a flexible, production-ready library (ControlValueAccessor for form controls, ARIA + keyboard support, CSS variables for theming, content projection for custom templates). If you want fewer components for an MVP, start with the “Core / Essential” group and add the rest later.

# 1 — Core/Essential components (start here)

These cover 80% of UI needs.

## Button

Variants: `primary`, `secondary`, `tertiary`, `text`, `ghost`, `danger`/`warning`, `success`, `link`
Sizes: `xs`/`sm`/`md`/`lg`/`xl` (or `small|medium|large`)
States: `normal`, `hover`, `active`, `focus`, `disabled`, `loading`, `pressed` (for toggle-like)
Parameters / props:

* `@Input() variant: string = 'primary'`
* `@Input() size: string = 'md'`
* `@Input() type: 'button'|'submit'|'reset' = 'button'`
* `@Input() disabled: boolean`
* `@Input() loading: boolean`
* `@Input() icon?: string` (icon name or template)
* `@Input() iconPosition: 'left'|'right'`
* `@Input() allowFocusRipple: boolean`
* `@Input() ariaLabel?: string`
* `@Output() click = new EventEmitter<Event>()`
* Content projection for label (supports HTML): `<my-button>Save</my-button>`
  Notes: support `aria-pressed` for toggle; if `loading` disable click; support `type="submit"`.

## Form Field primitives

Shared wrapper handling label, hint, error, prefix/suffix icons:

* `label`, `hint`, `error`, `required`, `disabled`, `dense`
* Slots: `prefix`, `suffix`, `control` (ng-content)
  Used by inputs, selects, radio groups.

## Input (text)

Variants: `text`, `password`, `search`, `url`, `email`, `tel`, `number`
Sizes/density, states (disabled, readonly, invalid)
Props:

* `@Input() type = 'text'`
* `@Input() value: string`
* `@Input() placeholder?: string`
* `@Input() readonly: boolean`
* `@Input() disabled: boolean`
* `@Input() clearable: boolean`
* `@Input() iconLeft?: string`, `iconRight?: string`
* `@Input() showPasswordToggle?: boolean` (for password fields)
* `@Input() maxLength?: number`
* `@Output() valueChange = new EventEmitter<string>()` (and implement ControlValueAccessor)
* Events: `focus`, `blur`, `enter` (keyup.enter)
  Notes: implement `ControlValueAccessor`, send `touched`/`dirty` states.

## Textarea

Props similar to Input plus:

* `@Input() rows`, `@Input() autosize?: {minRows, maxRows}`, `resizable: boolean`

## Select (single & multi)

Types: single-select (native/custom), multi-select (chips), creatable (tags)
Props:

* `@Input() multiple: boolean`
* `@Input() options: Array<{value:any,label:string,disabled?:boolean}>`
* `@Input() value`, `@Input() placeholder`
* `@Input() searchable: boolean`
* `@Input() clearable: boolean`
* `@Input() virtualScroll: boolean` (for large lists)
* `@Output() valueChange = new EventEmitter()`
* Template slots: `optionTemplate` for custom rendering
  Accessibility: keyboard navigation (arrow keys), type-ahead, aria expanded/owns

## Checkbox

Variants: default / tristate / custom icons
Props:

* `@Input() checked: boolean | 'indeterminate'`
* `@Input() disabled`, `@Input() label?: string`
* `@Output() checkedChange`

## Radio Group & Radio

Props:

* Group: `name`, `value`, `valueChange`
* Radio: `value`, `label`, `disabled`
  Accessibility: arrow-key navigation between radios

## Toggle / Switch

Props:

* `@Input() checked`, `@Input() disabled`, `size`, `labelOn`, `labelOff`
* `@Output() checkedChange`

## Slider / Range input

Props:

* `min`, `max`, `step`, `value` (single or range), `marks`, `orientation`
* `@Output() valueChange`

# 2 — Navigation & Structure

## Tabs

Modes: `line`, `box`, `pills`, scrollable
Props:

* `@Input() activeIndex`
* `@Output() activeIndexChange`
* `lazyLoad: boolean`, orientation, keyboard nav

## Menu / Dropdown

Options: `context menu`, `menu button`, `split button`
Props:

* open/close events, `placement` (top/bottom/left/right), `offset`, `closeOnSelect`, `trapFocus` optional

## Breadcrumb

Props: `items: Array<{label,href}>` and separator slot.

## Pagination

Props:

* `currentPage`, `pageSize`, `total`, `pageSizeOptions`, `showFirstLast`, `showJumpTo`
* Events: `pageChange`, `pageSizeChange`

## Sidenav / Drawer

Props:

* `mode: 'over'|'push'|'side'`, `opened`, `position: 'left'|'right'`, `backdrop`

## Navbar / Toolbar

Simple container with slots.

# 3 — Feedback & Overlays

## Tooltip

Props:

* `content`, `placement`, `openOnHover`, `delay`, `interactive`
  Accessibility: `aria-describedby`, proper focus handling.

## Popover / Popper

Props similar to tooltip: content slot, header/footer templates, closeOnOutsideClick, trapFocus, placement.

## Modal / Dialog

Props:

* `@Input() open`, `@Input() size: 'sm'|'md'|'lg'|'fullscreen'`, `backdrop: boolean | 'static'`, `closable?: boolean`, `escToClose?: boolean`, `trapFocus: boolean`
* `@Output() openChange` or `onClose` event returning result
  Accessibility: focus trap, aria-modal, initial focus, restore focus on close, role="dialog", labelledby.
  Support confirm and custom footers via projection.

## Toast / Snackbar

Types: `info`, `success`, `error`, `warning`
Props:

* `duration`, `pauseOnHover`, `closeable`, `stacking` priority
  Provide a service-driven API for global use.

## Progress / Spinner / Skeleton

* Indeterminate/determinate progress bar, circular progress, skeleton blocks for loading.

# 4 — Data display & complex controls

## Table / Data Grid

Basic Table API:

* columns: definitions with `field`, `header`, `sortable`, `filterable`, `cellTemplate`
* data input, selection modes (single/multi), virtual scroll, pagination, row expansion, column resizing, reordering
  Events: `rowClick`, `sortChange`, `pageChange`
  Support template projection for cells and headers.
  Consider advanced grid (separate package) later.

## Card

Slots: header, body, footer, media. Props: `elevated`, `outlined`, `compact`.

## List / Virtual list

Props: `items`, `itemTemplate`, `virtualScroll`, `loadMore` event.

## Avatar / Badge / Chip / Tag

Props:

* avatar: `src`, `alt`, `size`, `shape`
* badge: `content`, `position`, `dot`
* chip: removable, clickable, icon

## Tooltip & Popover already above.

# 5 — Forms & Controls (advanced)

## Datepicker / Timepicker / Datetime

Features:

* single date / range / multiple selection
* keyboard accessible calendar, localisation (i18n), min/max date, disableDates, firstDayOfWeek
* time picker with 12/24h, step minutes
* `@Input() startView: 'month'|'year'|'decade'`, custom day cell templates, ControlValueAccessor with `Date | string`

## File Upload

Props:

* multiple, accept (MIME/types), maxSize, chunked upload support (optional), drag & drop, preview

## Typeahead / Autocomplete

Props:

* `asyncSearch`: function returning Observable, `minChars`, `debounceTime`, `highlightMatch`, `template` for display

## Form Validation UI

* error messages component which can read `FormControl` errors or accept an errors object
* show/hide on touched/dirty logic

# 6 — Utilities & Design system primitives

## Icon system

* Provide a simple `Icon` component (name or SVG slot). Support icon fonts, inline SVG sprites or Angular components per icon.

## Typography

* Provide components or utility classes: `h1..h6`, `body`, `caption`, `label`.

## Grid / Layout / Flex utilities

* Container, Row, Col with breakpoint props, or CSS utility classes with helper spacing, display, hide/show, alignment.

## Theming & Tokens

Expose CSS variables for:

* Colors: `--ui-primary`, `--ui-on-primary`, `--ui-surface`, `--ui-background`, `--ui-danger`, etc.
* Spacing scale: `--space-1`...`--space-8`
* Radii, fontsizes, font family, line-height, z-index layers, transitions, elevation shadows
  Allow switching theme by root class, `data-theme="dark"` or by changing variables.

## Utilities

* `sr-only`, `visually-hidden`, `truncate`, `clamp`, `screen-reader-only` helpers.

# 7 — Patterns & API design guidelines

* Use consistent prop names: `size`, `variant`, `disabled`, `loading`, `value`, `placeholder`, `label`.
* Implement `ControlValueAccessor` for inputs/selects/checkboxes/radios to integrate with Angular Reactive Forms and template-driven forms.
* Provide `@Output() opened/closed`, `@Output() valueChange` instead of two-way binding unless you also support `[(ngModel)]` or `[(value)]`.
* Use content projection (`ng-content`) for flexible content (buttons, modal footers, custom table cell templates).
* Offer both template-driven and programmatic APIs (e.g., ToastService.open(...), ModalService.open(component, options)).
* Provide templates for customizing complex pieces (optionTemplate, headerTemplate, rowTemplate).

# 8 — Accessibility & Keyboard interactions (must-have)

* All interactive components must have correct role, `tabindex`, visible focus styles.
* Dialog/Modal: trap focus, restore focus to trigger, `aria-modal="true"`, labelledby and describedby.
* Tooltip: not solely relying on hover — show on focus too; use `aria-describedby`.
* Menus/Selects: arrow keys, Esc to close, Enter to select, Home/End support for lists.
* Provide aria attributes for state: `aria-checked`, `aria-selected`, `aria-disabled`, `aria-expanded`.
* Provide screen-reader-only text slots when needed.

# 9 — Events & outputs checklist

Common events to support:

* `open`/`opened`, `close`/`closed`
* `change` / `valueChange`
* `select` / `deselect`
* `focus` / `blur`
* `submit` (for form buttons)
* `confirm`/`cancel` for dialogs

# 10 — Developer ergonomics & docs

* Provide Storybook stories for each component and variants. (Essential for adoption.)
* Provide accessibility tests (axe) and unit tests (Karma/Jest).
* Provide a component index and API docs (auto-generate with Compodoc or Storybook Docs).
* Provide usage examples for Angular Reactive Forms.
* Semantic class names / BEM-like modifiers or use CSS-in-JS? Prefer CSS variables + utility classes.

# 11 — Example APIs (copy/paste starter)

### Button (simple public API)

```ts
@Component({
  selector: 'ui-button',
  template: `
    <button
      class="ui-btn ui-btn--{{variant}} ui-btn--{{size}}"
      [attr.aria-label]="ariaLabel"
      [disabled]="disabled || loading"
      [type]="type"
      (click)="handleClick($event)">
      <span *ngIf="loading" class="ui-spinner"></span>
      <ng-container *ngIf="icon && iconPosition === 'left'">
        <ui-icon [name]="icon"></ui-icon>
      </ng-container>
      <span class="ui-btn__label"><ng-content></ng-content></span>
      <ng-container *ngIf="icon && iconPosition === 'right'">
        <ui-icon [name]="icon"></ui-icon>
      </ng-container>
    </button>
  `
})
export class UiButton {
  @Input() variant: 'primary'|'secondary'|'tertiary'|'text'|'danger' = 'primary';
  @Input() size: 'sm'|'md'|'lg' = 'md';
  @Input() type: 'button'|'submit'|'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left'|'right' = 'left';
  @Input() ariaLabel?: string;
  @Output() click = new EventEmitter<Event>();

  handleClick(e: Event) {
    if (this.disabled || this.loading) { e.preventDefault(); return; }
    this.click.emit(e);
  }
}
```

### Text input (implements ControlValueAccessor — outline)

```ts
@Component({ selector: 'ui-input', template: `
  <div class="ui-form-field" [class.disabled]="disabled">
    <label *ngIf="label">{{label}} <span *ngIf="required">*</span></label>
    <input
      [type]="type"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [value]="value"
      (input)="onInput($event)"
      (blur)="onBlur()"
      (focus)="focus.emit($event)" />
    <small class="ui-hint" *ngIf="hint">{{hint}}</small>
    <small class="ui-error" *ngIf="error">{{error}}</small>
  </div>
`})
export class UiInput implements ControlValueAccessor {
  @Input() type = 'text';
  @Input() placeholder?: string;
  @Input() label?: string;
  @Input() hint?: string;
  @Input() error?: string;
  @Input() disabled = false;
  @Input() required = false;
  @Output() focus = new EventEmitter();

  value = '';

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(obj: any) { this.value = obj ?? ''; }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  onInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.value = v;
    this.onChange(v);
  }

  onBlur() { this.onTouched(); }
}
```

### Modal service pattern (sketch)

* `ModalService.open(ComponentOrTemplate, {size, backdrop, data})` returns `ModalRef` with `afterClosed()` observable and `close(result?)`.

# 12 — Prioritised minimal release (MVP)

If you want to launch quickly:

1. Button, Input, Textarea, Checkbox, Radio, Select (single), FormField wrapper
2. Modal/Dialog, Tooltip, Toast (service)
3. Icon, Avatar, Badge
4. Table (simple), Tabs, Pagination
   Add advanced things (Datepicker, Virtualized List, Complex Data Grid) later.

# 13 — Testing, packaging & distribution

* Publish as Angular library (ng-packagr), keep CSS separate or use component-scoped styles.
* Provide a theme loader and example app.
* Use semantic versioning and keep breaking changes documented.

# 14 — Naming & folder structure suggestion

```
/projects/ui-lib/
  /src/lib/button/
    button.component.ts
    button.scss
    button.stories.ts
  /src/lib/input/
  /src/lib/modal/
  /tokens/
    _variables.scss
    themes.ts
  index.ts
```

# Quick checklist table (high level)

* Accessibility: focus, aria, roles ✅
* Forms: ControlValueAccessor ✅
* Theming: CSS variables / tokens ✅
* Docs: Storybook/Examples ✅
* Tests: unit + axe ✅

---

If you want, I can:

* generate a **starter component** repository skeleton (Angular components + CSS variables + Storybook config), or
* produce **detailed API files** (TypeScript interfaces) for a chosen subset (say Button, Input, Select, Modal) so you can start implementing them.

Which subset would you like me to scaffold first?




[![kinsta.com/blog/angular-...](https://images.openai.com/thumbnails/url/sDyip3icu1mUUVJSUGylr5-al1xUWVCSmqJbkpRnoJdeXJJYkpmsl5yfq5-Zm5ieWmxfaAuUsXL0S7F0Tw5JNYp3NA-NMPEpi_cN8TdMdIx0MS9ytXSNT0pK9NNNya3M8zItizeIKjSPyPFNKisyzvEJKnDxyE9RKwYAprgoww)](https://kinsta.com/blog/angular-component-libraries/?utm_source=chatgpt.com)

Here are some **real-world screenshots** showing graphical elements from well-known Angular UI component libraries:

* **Image 1 (top-left):** Shows button examples from a component library that resembles Angular Material (primary, secondary, icon buttons).
* **Image 2 (top-right):** A dark-themed “smart” table interface likely from Nebular, featuring sortable columns and custom theming.
* **Image 3 (bottom-left):** A dashboard-like data table with actions—similar to layouts in ArchitectUI or PrimeNG-based themes.
* **Image 4 (bottom-right):** A rich components menu (grid, tabs, charts, date pickers, toast notifications) from jQWidgets’ Angular showcase.

---

## Notable Angular UI Libraries (with descriptions & examples)

### 1. **Angular Material**

**Why it stands out:**

* Official Angular library by the Angular team, following \[Material Design guidelines]\([Webs Optimization][1], [UI Bakery][2], [Wikipedia][3]).
* Excellent accessibility, responsive behavior, theming, and deep Angular integration.

### 2. **PrimeNG**

**Why it's powerful:**

* Huge collection—80 + components including data tables, charts, file uploaders, calendars, overlays, and more([Webs Optimization][1], [Bacancy][4], [@NgDevelop][5], [UI Bakery][2]).
* Includes built-in theming and icons; widely used in enterprise contexts.

### 3. **NG-Bootstrap**

**Key points:**

* Angular components styled with Bootstrap 4/5, no jQuery dependencies([Webs Optimization][1], [MoldoWEB][6], [@NgDevelop][5]).
* Provides modals, tooltips, carousels, dropdowns, date pickers, typeahead, and others.

### 4. **NG-Zorro**

**Highlights:**

* Angular implementation of Alibaba’s Ant Design—beautiful, modern UI([UI Bakery][2], [Prateeksha Web Design][7], [Reddit][8]).
* Excellent for enterprise-focused apps and dashboards; supports internationalization.

### 5. **Kendo UI for Angular**

**Enterprise-grade:**

* Over 100 components including data grids, charts, schedulers, pivot grids, with Material/Bootstrap themes and theme builder([MoldoWEB][6], [UI Bakery][2]).
* Extensive documentation and professional support options.

### 6. **Nebular**

**Theming + security:**

* \~40 components with multiple themes (Default, Dark, Cosmic, Corporate), plus authentication/security modules([MoldoWEB][6], [UI Bakery][2], [Webs Optimization][1]).
* Ideal for admin dashboards; you can see its table-style layout in the second screenshot above.

### 7. **Clarity (VMware)**

**Design-system-driven:**

* Robust UI library with enterprise focus—includes forms, wizards, grids, modals, tree views, toggles([Written for Coders][9], [Prateeksha Web Design][7]).
* Built for accessibility (WCAG 2.0 AA) and consistent UX design.

### 8. **Syncfusion Angular UI**

**Rich and high-performance:**

* Over 90 components: DataGrid, Charts, Scheduler, Kanban, PDF Viewer, Spreadsheet, and more.
* Lightweight, responsive, supports localization and modern themes (Fluent 2, Material 3, Bootstrap 5, Tailwind CSS 4).

---

## What the Community Says

Some developers shared feedback and preferences on Reddit:

> “I’ve been using ng-zorro on my current project… Ant Design is amazing for React, really glad they made Angular version as well.”([Reddit][8])
> “Absolutely PrimeNG. I use it on all my enterprise greenfield projects.”([Reddit][10])
> “Syncfusion offers a free community license also… Best component set out there.”([Reddit][11])

---

## Summary Table

| Library              | Strengths                                                 |
| -------------------- | --------------------------------------------------------- |
| **Angular Material** | Official, accessible, themable, well-documented           |
| **PrimeNG**          | Huge component catalog, theming, enterprise-ready         |
| **NG-Bootstrap**     | Bootstrap styles, no jQuery, reliable UI components       |
| **NG-Zorro**         | Elegant Ant Design, i18n, enterprise focus                |
| **Kendo UI**         | Extensive suite, pro support, theme builder               |
| **Nebular**          | Themed + security modules → perfect admin dashboards      |
| **Clarity**          | Design system + accessibility, enterprise UX baked-in     |
| **Syncfusion**       | Rich, high-perf, lightweight UI for business applications |

---

### Choosing the Right Fit

* **Want official and material?** → **Angular Material**
* **Need tons of UI widgets (e.g., grids, charts, uploads)?** → **PrimeNG**, **Syncfusion**, or **Kendo UI**
* **Like Bootstrap look & feel?** → **NG-Bootstrap**
* **Prefer Ant Design style and global support?** → **NG-Zorro**
* **Building admin portals with custom theming and auth?** → **Nebular**
* **Care about design consistency + accessibility?** → **Clarity**

---

Let me know if you'd like more screenshots, API comparisons, or help starting with one of these libraries—I can also show sample component usage or theming demos based on your choice!

[1]: https://www.websoptimization.com/blog/best-angular-component-libraries/?utm_source=chatgpt.com "Exploring Top Angular UI Component Libraries for Enhanced Development"
[2]: https://uibakery.io/blog/top-angular-libraries?utm_source=chatgpt.com "5 Top Angular Component Libraries You Should Know in 2025 | UI Bakery Blog"
[3]: https://en.wikipedia.org/wiki/Angular_%28web_framework%29?utm_source=chatgpt.com "Angular (web framework)"
[4]: https://www.bacancytechnology.com/blog/angular-component-libraries?utm_source=chatgpt.com "Best Angular Component Libraries You Should Use in 2025"
[5]: https://www.ngdevelop.tech/best-angular-ui-component-libraries/?utm_source=chatgpt.com "Angular UI Components | 11 Best Angular UI Component Libraries"
[6]: https://moldoweb.com/blog/best-angular-ui-component-libraries?utm_source=chatgpt.com "5 Best Angular UI Component Libraries in 2024 | MoldoWEB"
[7]: https://prateeksha.com/blog/top-10-angular-component-libraries-to-boost-your-frontend-in-2025?utm_source=chatgpt.com "Top 10 Angular Component Libraries to Elevate Your UI in 2025"
[8]: https://www.reddit.com/r/Angular2/comments/112fphy?utm_source=chatgpt.com "What are your favorite component libraries for angular beside angular material ?"
[9]: https://writtenforcoders.com/blog/best-angular-ui-libraries-for-2023?utm_source=chatgpt.com "Written for Coders"
[10]: https://www.reddit.com/r/Angular2/comments/1ig4hl8?utm_source=chatgpt.com "Best UI Libraries for Angular Besides Material Design?"
[11]: https://www.reddit.com/r/Angular2/comments/1gku1jh?utm_source=chatgpt.com "The best UI libraries for Angular"










Nice — here’s a compact, practical design-rule cheat-sheet you can apply straight into your UI library. I’ll cover visual language (shiny colored/backdrop shadows), motion, sizing & spacing, responsiveness, accessibility, and give ready-to-copy CSS token examples and snippets. I reference Apple’s and Google’s official guidance plus accessibility standards so you can be confident the rules are modern **and** inclusive.

# Principles at a glance

* Use **clear hierarchy** (surface → elevation → shadow → motion) to show relationships. ([Material Design][1])
* Motion is an *enhancer*, not required for understanding; obey user reduced-motion preferences. ([MDN Web Docs][2], [W3C][3])
* Make interactive targets comfortably large (≈48×48dp or 44×44pt) and spaced. ([Material Design][4], [Apple Developer][5])
* Ensure color contrast meets WCAG (4.5:1 for body text; 3:1 for large text / UI components). ([W3C][6])

---

# 1 — Shadows & “shiny colored backdrop” rules (depth + glow)

**Goal:** depth + personality without breaking contrast/accessibility or looking noisy.

Design rules

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

---

# 2 — Motion & animation rules (timing, easing, purpose)

**Goal:** make interactions feel natural and fast without causing confusion or sickness.

Design rules

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

---

# 3 — Sizing, spacing, and responsive layout

**Goal:** consistent rhythm and comfortable density on every screen.

Rules & tokens

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

Sizing rules for components

* Buttons: small/normal/large heights = `32px/40px/48px` (desktop can be slightly larger); ensure label text still meets contrast/legibility.
* Inputs/controls: consistent vertical rhythm — e.g., input height 40px with 12px internal padding.
* Icons: use 16/20/24/32 sizes and keep visual weight consistent.

---

# 4 — Color, contrast & accessible color usage

**Goal:** beautiful palettes that remain readable and accessible.

Rules

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

---

# 5 — Keyboard & screen-reader accessibility (must-haves)

**Goal:** full keyboard operability and clear semantics.

Checklist

* Use native controls where possible (native semantics are best). When building custom widgets, follow WAI-ARIA Authoring Practices for patterns (menu, dialog, tabs, listbox). ([W3C][15])
* Ensure visible focus styles (use `:focus-visible`) that meet contrast and size requirements. Provide a clear focus ring that’s not removed.
* Keyboard rules: `Tab`/`Shift+Tab` for forward/backward focus, arrow keys for menus/radios/listboxes, `Esc` to close overlays; document any deviation. ([W3C][16])
* Announce dynamic changes to assistive tech (use `aria-live` regions for notifications/toasts); ensure role attributes and `aria-*` states reflect real state.
* Follow color contrast and “don’t rely on color alone” rules above. ([W3C][6])

---

# 6 — Performance & practical constraints

* Keep shadows & backdrop-filter usage moderate — `backdrop-filter` can be expensive on low-end devices and cause repainting; use sparingly (e.g., top nav, dialogs). Apple’s glassy materials are powerful but expensive. ([Apple Developer][7])
* Prefer GPU-accelerated transforms (`transform`, `opacity`) and limit layout-triggering animations.

---

# 7 — Quick implementation recipes

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

# 8 — Checklist before you ship a component

* keyboard reachable + operable? ✔️
* focus indicator visible and high-contrast? ✔️
* colors pass WCAG contrast? ✔️
* animations obey `prefers-reduced-motion`? ✔️
* touch targets >= 44–48 px and good spacing? ✔️
* shadows consistent and not overpowering? ✔️
* test on low-end devices for performance (backdrop-filter, heavy blurs)? ✔️

---

# Sources & further reading (key official docs)

* Material Design — Elevation / Motion guidance (elevation tokens and motion system). ([Material Design][1])
* Apple Human Interface Guidelines — Materials & Motion. ([Apple Developer][7])
* WCAG 2.1 — color contrast & accessibility success criteria. ([W3C][6])
* prefers-reduced-motion (MDN / W3) — support and recommended practice. ([MDN Web Docs][2], [W3C][17])
* WAI-ARIA Authoring Practices — keyboard & widget guidance for custom components. ([W3C][15])

---

If you want, I can:

1. Produce a **design-token file** (JSON/CSS variables) with spacing, elevation, motion and color tokens based on the rules above.
2. Generate **4 example visuals** (card with glass/backdrop, CTA with colored glow, modal with motion, button micro-interaction) and provide image thumbnails you can embed in docs.
3. Or scaffold one component (e.g., a `ui-card` with glass + colored glow + entrance animation + reduced-motion support) as production-ready Angular component code.

Which of those would help you next?

[1]: https://m3.material.io/styles/elevation/applying-elevation?utm_source=chatgpt.com "Elevation – Material Design 3"
[2]: https://developer.mozilla.org/en-US/docs/Web/CSS/%40media/prefers-reduced-motion?utm_source=chatgpt.com "prefers-reduced-motion - CSS - MDN Web Docs"
[3]: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html?utm_source=chatgpt.com "Understanding Success Criterion 2.3.3: Animation from Interactions"
[4]: https://m2.material.io/develop/web/supporting/touch-target?utm_source=chatgpt.com "Touch Target - Material Design"
[5]: https://developer.apple.com/design/tips/?utm_source=chatgpt.com "UI Design Dos and Don'ts - Apple Developer"
[6]: https://www.w3.org/TR/WCAG21/?utm_source=chatgpt.com "Web Content Accessibility Guidelines (WCAG) 2.1 - W3C"
[7]: https://developer.apple.com/design/human-interface-guidelines/materials?utm_source=chatgpt.com "Materials | Apple Developer Documentation"
[8]: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs?utm_source=chatgpt.com "Easing and duration – Material Design 3"
[9]: https://m1.material.io/motion/duration-easing.html?utm_source=chatgpt.com "Duration & easing - Motion - Material Design"
[10]: https://m3.material.io/styles/motion/easing-and-duration?utm_source=chatgpt.com "Easing and duration – Material Design 3"
[11]: https://developer.apple.com/videos/play/wwdc2023/10158/?utm_source=chatgpt.com "Animate with springs - WWDC23 - Videos - Apple Developer"
[12]: https://m2.material.io/design/layout/spacing-methods.html?utm_source=chatgpt.com "Spacing methods - Material Design"
[13]: https://webaim.org/articles/contrast/?utm_source=chatgpt.com "Understanding WCAG 2 Contrast and Color Requirements - WebAIM"
[14]: https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html?utm_source=chatgpt.com "Understanding Success Criterion 1.4.1: Use of Color | WAI - W3C"
[15]: https://www.w3.org/WAI/ARIA/apg/?utm_source=chatgpt.com "ARIA Authoring Practices Guide | APG | WAI - W3C"
[16]: https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/?utm_source=chatgpt.com "Developing a Keyboard Interface | APG | WAI - W3C"
[17]: https://www.w3.org/WAI/WCAG22/Techniques/css/C39?utm_source=chatgpt.com "C39: Using the CSS reduce-motion query to prevent motion | WAI"








Great question 👍 — once you’ve built your Angular UI library of components, you want to **package and consume it as a dependency** across projects. Angular provides a structured way to do this.

---

# 1. Create the library

If you don’t already have one:

```bash
ng new my-workspace --create-application=false
cd my-workspace
ng generate library my-ui
```

This gives you a `projects/my-ui/` folder with `src/lib/` where you add your components, and a `public-api.ts` that controls what gets exported.

---

# 2. Build the library

```bash
ng build my-ui
```

This outputs a distributable package in `dist/my-ui/`.

---

# 3. Using the library *locally* (during dev)

In another Angular project:

Option A: **Path install**

```bash
cd another-project
npm install ../my-workspace/dist/my-ui
```

Option B: **Link**

```bash
cd my-workspace/dist/my-ui
npm link
cd ../../../another-project
npm link my-ui
```

This way, your `another-project` can import:

```ts
import { MyUiButtonModule } from 'my-ui';
```

---

# 4. Publishing to a private registry

If you want a proper dependency:

* **npmjs.org (public)**:

  1. Bump version in `projects/my-ui/package.json`.
  2. `npm login`
  3. `npm publish dist/my-ui`

* **Private registry** (GitHub Packages, Azure, Verdaccio, etc.):

  * Configure `.npmrc` with the registry URL and token.
  * `npm publish --registry=https://npm.pkg.github.com/` (example).

Then in your other projects:

```bash
npm install @your-scope/my-ui
```

---

# 5. Versioning strategy

* Use **semantic versioning** (`major.minor.patch`) to avoid breaking consumer apps unexpectedly.
* Update `peerDependencies` to require compatible Angular versions.

---

# 6. Good practices

* Export everything from `public-api.ts` so consumers don’t rely on deep imports.
* Provide **theming** (via CSS variables or SCSS mixins).
* Document install steps in a README (`npm i @you/my-ui`, then `import { UiButtonModule } from '@you/my-ui'`).
* Keep build clean (`ng-packagr` handles Angular packaging for libraries).

---

✅ **Summary:**

* Generate with `ng generate library`.
* Build with `ng build`.
* Use locally via `npm install ../dist/my-ui`.
* Publish to npm/GitHub/other registry to use it as `npm install @you/my-ui`.

---

Do you want me to show you how to **set it up as a GitHub dependency** (installable directly from your repo without publishing to npm)? That’s often the easiest for internal projects.



















Nice — let’s build that “liquid glass” Apple-style card with blur, chromatic aberration and edge distortion. Below I give a **ready-to-use Angular component** (template + TypeScript + SCSS) that:

* uses `backdrop-filter` for the glassy lens,
* applies an SVG displacement filter for subtle edge distortion,
* fakes chromatic aberration with three colored, slightly offset layers,
* respects `prefers-reduced-motion`, and
* includes a graceful fallback for browsers without `backdrop-filter`.

Copy the three files into an Angular library or app and tweak the tokens (blur, color, strength) to taste.

---

## 1) Component TypeScript — `liquid-card.component.ts`

Generates a unique filter id per instance so multiple cards don’t conflict.

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-liquid-card',
  templateUrl: './liquid-card.component.html',
  styleUrls: ['./liquid-card.component.scss'],
})
export class LiquidCardComponent {
  // unique id for the svg filter so multiple cards don't clash
  filterId = 'liquid-distort-' + Math.random().toString(36).slice(2, 9);

  @Input() title = 'Card title';
  @Input() body = 'This is a short description explaining the card content.';
  @Input() cta = 'Action';
  @Input() ariaLabel = 'Liquid glass card';
}
```

---

## 2) Template — `liquid-card.component.html`

We render the SVG `filter` defs inline and use layered `.glass` elements. The base glass gets the displacement filter via binding.

```html
<div class="liquid-card" role="group" [attr.aria-label]="ariaLabel">
  <!-- SVG defs for distortion filter (unique id per component) -->
  <svg aria-hidden="true" class="svg-defs" focusable="false">
    <defs>
      <!-- Turbulence + displacement for gentle lens edge distortion -->
      <filter [attr.id]="filterId" x="-20%" y="-20%" width="140%" height="140%">
        <!-- a low-frequency turbulence creates organic ripples -->
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" result="noise"/>
        <!-- reduce / soften the noise so displacement isn't too strong -->
        <feGaussianBlur in="noise" stdDeviation="2" result="noiseBlur"/>
        <!-- displacement map — scale controls strength -->
        <feDisplacementMap in="SourceGraphic" in2="noiseBlur" scale="6" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
  </svg>

  <!-- layered glass surfaces -->
  <!-- base: actual glass with blur + distortion -->
  <div class="glass base"
       [style.filter]="'url(#' + filterId + ')'">
  </div>

  <!-- chromatic layers: slightly offset and tinted to simulate CA -->
  <div class="glass chroma chroma-r" aria-hidden="true"></div>
  <div class="glass chroma chroma-g" aria-hidden="true"></div>
  <div class="glass chroma chroma-b" aria-hidden="true"></div>

  <!-- content sits above the glass layers -->
  <div class="content">
    <h3 class="title">{{ title }}</h3>
    <p class="body">{{ body }}</p>

    <button class="cta" type="button" aria-label="{{cta}}">
      {{ cta }}
    </button>
  </div>
</div>
```

---

## 3) Styles (SCSS) — `liquid-card.component.scss`

Explained inline with comments. These styles use CSS variables so you can adapt theme tokens.

```scss
:host { display: block; }

/* tokens — tweak to match your theme */
:root {
  --glass-radius: 16px;
  --glass-bg: rgba(255,255,255,0.06);     /* base translucent sheet */
  --glass-border: rgba(255,255,255,0.12);
  --accent-r: 88; --accent-g: 115; --accent-b: 255;
  --glass-blur: 18px;
  --glass-saturation: 1.25;
  --card-padding: 24px;
  --card-width: 360px;
  --shadow-elevation: 0 14px 40px rgba(8, 10, 30, 0.45);
}

/* container */
.liquid-card {
  position: relative;
  width: var(--card-width);
  min-height: 160px;
  padding: var(--card-padding);
  border-radius: var(--glass-radius);
  overflow: visible; /* we purposely let glows extend */
  isolation: isolate; /* keep blend modes local */
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;

  /* fallback if no backdrop-filter: use solid translucent panel + stronger shadow */
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  box-shadow: var(--shadow-elevation);
}

/* place the SVG defs out of flow */
.svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

/* glass layers share base positioning */
.glass {
  position: absolute;
  inset: 0; /* cover the card */
  border-radius: inherit;
  pointer-events: none;
}

/* base glass uses actual backdrop-filter and subtle fill */
.glass.base {
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
  border: 1px solid var(--glass-border);
  /* key lens effect: blur/backdrop-filter */
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  mix-blend-mode: normal;
  box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset;
  transition: transform 240ms cubic-bezier(.4,0,.2,1), box-shadow 240ms;
  transform-origin: center;
}

/* chromatic aberration layers: small tinted offsets + blur + blend to simulate fringing */
.glass.chroma {
  background: rgba(255,255,255,0.02); /* translucent base so backdrop still shows */
  backdrop-filter: blur(calc(var(--glass-blur) * 0.9)) saturate(calc(var(--glass-saturation) * 0.9));
  -webkit-backdrop-filter: blur(calc(var(--glass-blur) * 0.9)) saturate(calc(var(--glass-saturation) * 0.9));
  mix-blend-mode: screen; /* overlay tint nicely */
  opacity: 0.85;
  transition: transform 320ms cubic-bezier(.4,0,.2,1), opacity 320ms;
  will-change: transform, opacity;
}

/* per-channel color tints and offsets */
.glass.chroma-r {
  filter: blur(2px) saturate(1.2);
  background: rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.04);
  transform: translateX(6px) translateY(2px) scale(1.01);
  mix-blend-mode: screen;
  border-radius: inherit;
  mask-image: radial-gradient(closest-side, transparent 60%, black 100%); /* keep tint to edges */
}

.glass.chroma-g {
  filter: blur(2px) saturate(1.05);
  background: rgba(120, 255, 180, 0.03);
  transform: translateX(-4px) translateY(1px) scale(1.01);
  mask-image: radial-gradient(closest-side, transparent 65%, black 100%);
}

.glass.chroma-b {
  filter: blur(3px) saturate(1.4);
  background: rgba(88, 115, 255, 0.05);
  transform: translateX(2px) translateY(-3px) scale(1.02);
  mask-image: radial-gradient(closest-side, transparent 55%, black 100%);
}

/* content above the glass */
.content {
  position: relative; /* above glass */
  z-index: 3;
  color: rgba(255,255,255,0.95);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.body {
  margin: 0;
  color: rgba(255,255,255,0.86);
  line-height: 1.4;
  font-size: 14px;
}

/* CTA button: colored glow and micro-interaction */
.cta {
  margin-top: 8px;
  width: fit-content;
  padding: 10px 16px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(var(--accent-r),var(--accent-g),var(--accent-b),1) 0%, rgba(60,90,255,1) 100%);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 26px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.18);
  transition: transform 160ms cubic-bezier(.4,0,.2,1), box-shadow 160ms;
  font-weight: 600;
}

/* micro interaction: press */
.cta:active { transform: translateY(1px) scale(0.995); box-shadow: 0 6px 20px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.14); }

/* hover lift for card */
.liquid-card:hover .glass.base {
  transform: translateY(-6px) scale(1.005);
  box-shadow: 0 20px 54px rgba(8,10,30,0.55);
}

/* accessibility: respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .glass, .glass.chroma, .cta, .liquid-card { transition: none !important; animation: none !important; }
}

/* fallback: browsers without backdrop-filter */
@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
  .glass.base, .glass.chroma { backdrop-filter: none; -webkit-backdrop-filter: none; }
  .glass.base { background: rgba(255,255,255,0.06); }
  /* slightly stronger background + border to mimic separation */
  .liquid-card { background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015)); }
}
```

---

## Explanation & notes

### How the effect works

1. **Backdrop blur**: `backdrop-filter: blur(...)` blurs whatever is behind the card to produce the “lens” look. That’s the core of the liquid glass feel.
2. **Distortion**: the SVG `feTurbulence` + `feDisplacementMap` filter is applied to the `.glass.base` layer so its painted result is subtly warped — edges appear distorted like a lens. The `scale` parameter controls intensity.
3. **Chromatic aberration**: true optical chromatic aberration is done by splitting RGB channels; here we approximate it with three tinted, slightly offset translucent layers (`.chroma-r/.chroma-g/.chroma-b`) using `mix-blend-mode` and masks so tint appears strongest near edges. This is cheap and cross-browser friendly relative to full channel-splitting in shaders.
4. **Micro-interactions**: small translate/scale on hover for lift, compressed on button press, all bounded by `prefers-reduced-motion`.

### Performance & compatibility

* `backdrop-filter` and `filter` (SVG displacement) can be GPU- and CPU-intensive on low-end devices. Use sparingly for hero UI pieces, top navs, modals, or a small number of cards per screen.
* Provide the `@supports not (backdrop-filter)` fallback (above). On older browsers you’ll get a translucent panel + shadow instead of the full lens.
* Test on Safari (good `backdrop-filter` support) and Chrome/Edge (supported, prefixed in some cases). Mobile: iOS Safari supports `-webkit-backdrop-filter`. Android Chrome supports `backdrop-filter` behind a flag on some older versions.

### Accessibility

* Ensure text has sufficient contrast against the resulting surface. When backdrop is highly varied, consider a slightly more opaque fill or an overlay gradient behind text to guarantee legibility.
* Respect `prefers-reduced-motion`: we disable transitions/animations if user prefers reduced motion.
* Do not rely on the visual effects to convey meaning — icons or text should be used for status/meaning.

### Tuning tips

* **Stronger lens**: increase `--glass-blur` and `feDisplacementMap` `scale`.
* **Gentler distortion**: reduce `baseFrequency` in `feTurbulence` (e.g., `0.6` → `0.4`) and reduce `scale`.
* **More color fringing**: bump chroma layer translations (translateX/Y) and tint alpha. Or create SVG feColorMatrix-based channel split — more accurate but more complex and heavier.
* **Edge-only distortion**: use mask (radial gradient) on the base glass to limit distortion to edges.

---

## Advanced: true RGB channel split (optional)

If you want a more physically accurate chromatic aberration and are comfortable with heavier filters, you can:

* Render three copies of the blurred backdrop into separate SVG `feColorMatrix` channels and offset each, then composite. This requires a more complex SVG pipeline and may be slower. The layered pseudo-element approach above is a good pragmatic compromise.

---

## Usage

Import `LiquidCardComponent` into your module and use in templates:

```html
<ui-liquid-card
  [title]="'Frosted Lens'"
  [body]="'This uses backdrop-filter + an SVG displacement map and layer tints for chromatic edge effects.'"
  [cta]="'Try it'">
</ui-liquid-card>
```

