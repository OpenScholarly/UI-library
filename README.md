# UI-library
## Requirements
- Angular 20+
- TailwindCSS 3.4+


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
        "dev": "ng build ui-components && ng serve demo"
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