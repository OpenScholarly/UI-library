# 1 — Core/Essential components
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

