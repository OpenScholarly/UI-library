# UiComponents

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.0.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the library, run:

```bash
ng build ui-components
```

This command will compile your project, and the build artifacts will be placed in the `dist/` directory.

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:
   ```bash
   cd dist/ui-components
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

# UI Components Library

A collection of reusable Angular components built with Tailwind CSS.

## Installation

```bash
npm install @your-org/ui-components
```

## Requirements

### Tailwind CSS
This library requires Tailwind CSS to be configured in your project.

### Optional: Enhanced Scrollbar Styling

Some components (like `ScrollAreaComponent`) can use enhanced scrollbar styling. To enable this:

1. Install the Tailwind CSS Scrollbar plugin:
```bash
npm install -D tailwind-scrollbar
```

2. Add to your `tailwind.config.js`:
```js
module.exports = {
  content: [
    // your content paths
  ],
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
```

3. If you prefer not to use the plugin, set `useNativeScrollbar="true"` on scroll area components to use built-in CSS scrollbar styling.

## Components

### ScrollAreaComponent

A customizable scrollable container.

**Basic Usage:**
```html
<ui-scroll-area>
  <p>Scrollable content goes here...</p>
</ui-scroll-area>
```

**With Native Scrollbar (no plugin required):**
```html
<ui-scroll-area [useNativeScrollbar]="true">
  <p>Content with native scrollbar styling...</p>
</ui-scroll-area>
```

**Properties:**
- `direction`: 'vertical' | 'horizontal' | 'both' (default: 'vertical')
- `size`: 'sm' | 'md' | 'lg' | 'full' (default: 'md')
- `maxHeight`: Custom max height string
- `maxWidth`: Custom max width string
- `showScrollbar`: Show/hide scrollbar (default: true)
- `rounded`: Apply rounded corners (default: true)
- `useNativeScrollbar`: Use native CSS instead of Tailwind plugin (default: false)

### LinkComponent

A customizable link component with security features.

**Basic Usage:**
```html
<ui-link href="https://example.com">Click me</ui-link>
```

**External Link:**
```html
<ui-link href="https://example.com" target="_blank">
  External link
</ui-link>
```

**Properties:**
- `href`: Link URL (default: '#')
- `target`: '_self' | '_blank' | '_parent' | '_top' (default: '_self')
- `rel`: Custom rel attribute (auto-set to 'noopener noreferrer' for _blank)
- `variant`: 'default' | 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error'
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `disabled`: Disable the link (default: false)
- `underline`: 'none' | 'hover' | 'always' (default: 'hover')
- `external`: Show external link styling (default: false)

## Development

### Building the Library

```bash
ng build ui-components
```

### Running Tests

```bash
ng test ui-components
```
