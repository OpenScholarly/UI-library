# UI-library
## Requirements
- Angular 20+
- TailwindCSS 3.4+

## Color Theme System
This library includes a complete color theme system with:
- **19 Themed Palettes**: Ocean Blue, Forest Green, Purple, Orange, and more
- **Role-Based Colors**: Primary, secondary, accent, surface assignments
- **Interactive Visualization**: See all colors before choosing. Open [color-palette-visualization.html](color-palette-visualization.html) in your browser to explore all themes.

```typescript
import { getColorByRole, getThemeColorsByRole } from '@ui-components/lib/theme-colors';
const primary = getColorByRole('ocean-blue', 'primary'); // #1851A3
const colors = getThemeColorsByRole('sunset-orange');
```

# !TODO https://wave.webaim.org/

## Release plan
[Excalidraw](https://excalidraw.com/)
[Perplexity Chat](https://www.perplexity.ai/search/can-you-help-me-build-a-flexib-6TWeLvLoQk6rnoh3iXADJA)
- Provide **theming** (via CSS variables or SCSS mixins).
- Shadow, contrast, color tester app (Storybook addon or separate page).
- Provide Storybook stories for each component and variants. (Essential for adoption.)
- Provide accessibility tests (axe) and unit tests (Karma/Jest).
- Provide a component index and API docs (auto-generate with Compodoc or Storybook Docs).
- Provide usage examples for Angular Reactive Forms.
- Semantic class names / BEM-like modifiers or use CSS-in-JS? Prefer CSS variables + utility classes.

<!--
https://activitypub.rocks/
https://waapi.readme.io/reference/waapi-api-documentation
-->



## Publishing to a private registry
If you want a proper dependency:
- **npmjs.org (public)**:
  1. Bump version in `projects/my-ui/package.json`.
  2. `npm login`
  3. `npm publish dist/my-ui`

- **Private registry** (GitHub Packages, Azure, Verdaccio, etc.):
  * Configure `.npmrc` with the registry URL and token.
  * `npm publish --registry=https://npm.pkg.github.com/` (example).

Use with:
```bash
npm install @your-scope/my-ui
```

### Versioning strategy
* Use **semantic versioning** (`major.minor.patch`) to avoid breaking consumer apps unexpectedly.
* Update `peerDependencies` to require compatible Angular versions.


<https://medium.com/@rootsn221/angular-google-maps-22d316eaf605>

### Rendering strategies
- SSR + Hydration: Ensure every component renders stable HTML on the server and hydrates cleanly on the client.
- SSG/Prerender for the demo: Faster docs site, SEO-friendly examples.
- Deferrable views (@defer) for heavy/low-priority widgets (carousel, charts, large tables).
- Progressive enhancement: Components should still look correct with CSS only; JS augments behavior.

In the demo:
`npx ng add @angular/ssr --project demo`
```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration() // enables hydration when SSR is active
  ]
};
```
Dev: `npx ng serve —ssr`
Prod build: `npx ng build && npx ng run demo:server && npx ng run demo:serve-ssr`


Discover and prerender routes:
npx ng run demo:prerender
Ensure routes include: "/", "/theme-selector", "/big-features"
Use deferrable views to reduce hydration/JS cost
Defer heavy or below-the-fold components in demo pages. This cuts hydration work on initial paint and simulates “progressive hydration.”
```html
<div class="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
  <ui-container [size]="'2xl'" [centerContent]="true" [padding]="'md'" [stack]="true" [gap]="'lg'">
    <header class="text-center mb-12 w-full">
      <!-- critical content renders immediately -->
    </header>

    <!-- Defer big sections until visible -->
    @defer (on viewport) {
      <ui-grid cols="3" gap="lg" [responsive]="true">
        <!-- heavy cards/list -->
      </ui-grid>
    } @placeholder {
      <ui-skeleton variant="rectangular" [height]="'200px'"></ui-skeleton>
    } @loading {
      <ui-skeleton variant="rectangular" [height]="'200px'"></ui-skeleton>
    } @error {
      <ui-text variant="body2">Failed to load section.</ui-text>
    }

    <ui-divider />

    @defer (on viewport) {
      <ui-carousel></ui-carousel>
    } @placeholder {
      <ui-skeleton variant="rectangular" [height]="'320px'"></ui-skeleton>
    }
  </ui-container>
</div>
```

If a component renders differently server vs client (e.g., randomized content, time), opt it out of hydration to prevent mismatch:
<ui-carousel ngSkipHydration></ui-carousel>
Make library components SSR/hydration-safe
Guard browser-only APIs:
Inject DOCUMENT and check for existence before calling document APIs.
For window, use typeof window !== 'undefined'.
Avoid non-determinism in templates during SSR:
No Math.random() or Date.now() directly in templates/host bindings. Compute once in a stable way or on client-only hooks.
Stable IDs:
If you need unique IDs, derive from inputs or generate once in a constructor and reuse. Do not regenerate on render.
Overlays/portals:
Render nothing server-side or render inert placeholders; initialize on client only. ngSkipHydration is useful here.
Theming and dark mode:
Ensure CSS variables include light/dark defaults at :root and [data-theme="dark"] so SSR markup looks correct without JS.
TypographyService:
You already load fonts post-bootstrap. Keep it non-blocking and avoid affecting SSR markup to prevent mismatches.
Streaming SSR
No extra code in components; Angular’s SSR server streams chunks by default (Angular 17+).
For best UX, render lightweight server HTML, then @defer non-critical widgets.
Which strategies to adopt for this library

Must-have: SPA, SSR + Hydration, SSG (for docs/demo), Progressive Enhancement.
Strongly consider: Deferrable Views (@defer) to reduce hydration/JS cost.
Optional/advanced: Streaming SSR (already on), selective ngSkipHydration for overlays or non-deterministic widgets.
Not recommended to chase now: Islands, ISR, Resumability, unless you introduce non-Angular tooling.


## Installation
1) `npx @angular/cli@latest new ui-library-workspace --no-create-application --package-manager=npm --style=scss --routing=false --ai-config=copilot -S`  
2) `cd ui-library-workspace`  
3) `ng generate library ui-components --prefix=ui`
4) `ng generate application demo --style=scss --routing`

Structure:
```
ui-library-workspace/
├── projects/
│   ├── ui-components/           # Your reusable UI library
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   └── components/
│   │   │   │       ├── button/
│   │   │   │       └── card/
│   │   │   └── public-api.ts
│   │   └── ng-package.json
│   └── demo/                    # Demo application
│       └── src/
│           └── app/
├── tailwind.config.js
└── package.json
```



5) `npm install -D @angular-devkit/build-angular ng-packagr`
6) `npm install -D tailwindcss postcss autoprefixer`
7) `npx tailwindcss init -p` then setup tailwind.config.js and styles.scss as per https://tailwindcss.com/docs/guides/angular and in styles.scss of demo project add also:
    ```scss
    @import 'ui-components';
    ```


8) in public-api.ts, export components you want to use outside the library:
    ```ts
    /*
    * Public API Surface of ui-components
    */
    export * from './lib/ui-components.module';
    export * from './lib/components/button/button.component';
    export * from './lib/components/card/card.component';
    ```

9) Edit the configurations like this:
    angular.json:
    ```json
    {
      "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
      "version": 1,
      "newProjectRoot": "projects",
      "projects": {
        "ui-components": {
          "projectType": "library",
          "root": "projects/ui-components",
          "sourceRoot": "projects/ui-components/src",
          "prefix": "ui",
          "architect": {
            "build": {
              "builder": "@angular-devkit/build-angular:ng-packagr",
              "options": {
                "project": "projects/ui-components/ng-package.json"
              },
              "configurations": {
                "production": {
                  "tsConfig": "projects/ui-components/tsconfig.lib.prod.json"
                },
                "development": {
                  "tsConfig": "projects/ui-components/tsconfig.lib.json"
                }
              },
              "defaultConfiguration": "production"
            }
          }
        },
        "demo": {
          "projectType": "application",
          "schematics": {},
          "root": "projects/demo",
          "sourceRoot": "projects/demo/src",
          "prefix": "app",
          "architect": {
            "build": {
              "builder": "@angular-devkit/build-angular:application",
              "options": {
                "outputPath": "dist/demo",
                "index": "projects/demo/src/index.html",
                "browser": "projects/demo/src/main.ts",
                "polyfills": ["zone.js"],
                "tsConfig": "projects/demo/tsconfig.app.json",
                "assets": [
                  "projects/demo/src/favicon.ico",
                  "projects/demo/src/assets"
                ],
                "styles": ["projects/demo/src/styles.scss"],
                "scripts": []
              },
              "configurations": {
                "production": {
                  "budgets": [
                    {
                      "type": "initial",
                      "maximumWarning": "500kb",
                      "maximumError": "1mb"
                    },
                    {
                      "type": "anyComponentStyle",
                      "maximumWarning": "2kb",
                      "maximumError": "4kb"
                    }
                  ],
                  "outputHashing": "all"
                },
                "development": {
                  "optimization": false,
                  "extractLicenses": false,
                  "sourceMap": true
                }
              },
              "defaultConfiguration": "production"
            },
            "serve": {
              "builder": "@angular-devkit/build-angular:dev-server",
              "configurations": {
                "production": {
                  "buildTarget": "demo:build:production"
                },
                "development": {
                  "buildTarget": "demo:build:development"
                }
              },
              "defaultConfiguration": "development"
            }
          }
        }
      }
    }
    ```



    package.json:
    ```json
    {
      "name": "ui",
      "version": "0.0.0",
      "scripts": {
        "ng": "ng",
        "start": "ng serve",
        "build": "ng build",
        "watch": "ng build --watch --configuration development",
        "test": "ng test",
        "lint": "ng lint",
        "build:lib": "ng build ui-components",
        "build:demo": "ng build demo",
        "serve:demo": "ng serve demo",
        "build:all": "npm run build:lib && npm run build:demo",
        "dev": "ng build ui-components && ng serve demo",
        "dev:lib": "ng build ui-components --watch",
        "dev:demo": "ng serve demo --poll=2000"
      },
      "prettier": {
        "printWidth": 100,
        "singleQuote": true,
        "overrides": [
          {
            "files": "*.html",
            "options": {
              "parser": "angular"
            }
          }
        ]
      },
      "private": true,
      "dependencies": {
        "@angular/common": "^20.3.0",
        "@angular/compiler": "^20.3.0",
        "@angular/core": "^20.3.0",
        "@angular/forms": "^20.3.0",
        "@angular/platform-browser": "^20.3.0",
        "@angular/router": "^20.3.0",
        "rxjs": "~7.8.0",
        "tslib": "^2.3.0",
        "zone.js": "~0.15.0"
      },
      "devDependencies": {
        "@angular-devkit/build-angular": "^20.3.2",
        "@angular/build": "^20.3.2",
        "@angular/cli": "^20.3.2",
        "@angular/compiler-cli": "^20.3.0",
        "@types/jasmine": "~5.1.0",
        "autoprefixer": "^10.4.21",
        "jasmine-core": "~5.9.0",
        "karma": "~6.4.0",
        "karma-chrome-launcher": "~3.2.0",
        "karma-coverage": "~2.2.0",
        "karma-jasmine": "~5.1.0",
        "karma-jasmine-html-reporter": "~2.1.0",
        "ng-packagr": "^20.3.0",
        "postcss": "^8.5.6",
        "tailwindcss": "^3.4.0",
        "typescript": "~5.9.2"
      }
    }
    ```


    tsconfig.app.json for demo:
    ```json
    {
      "extends": "../../tsconfig.json",
      "compilerOptions": {
        "outDir": "../../out-tsc/demo",
        "types": [],
        "paths": {
          "ui-components": [
            "../../dist/ui-components",
            "../../projects/ui-components/src/public-api"
          ]
        }
      },
      "files": [
        "src/main.ts"
      ],
      "include": [
        "src/**/*.d.ts"
      ]
    }
    ```

## Development Workflow

### Running in Development Mode
To develop the library with live reload:

```bash
# Start both library watch mode and demo server
npm run dev
```

This command runs two processes in parallel:
1. **Library Watch Mode** (`dev:lib`): Rebuilds `ui-components` whenever you make changes
2. **Demo Server** (`dev:demo`): Serves the demo app with polling enabled to detect library changes

**Alternative (Manual):**
If you prefer to run them separately:

```bash
# Terminal 1: Watch and rebuild library on changes
npm run dev:lib

# Terminal 2: Serve demo app
npm run dev:demo
```

### How It Works
- The library (`ui-components`) is built to `dist/ui-components`
- The demo app imports from `dist/ui-components` (configured in `tsconfig.app.json`)
- When you edit library files, they're automatically rebuilt
- The demo app detects the changes via polling and hot-reloads

### Development Scripts
- `npm run dev` - Run library watch + demo server (recommended for development)
- `npm run dev:lib` - Watch and rebuild library only
- `npm run dev:demo` - Serve demo app only
- `npm run build:lib` - Build library once
- `npm run serve:demo` - Serve demo without library watch
- `npm run build:all` - Build both library and demo for production