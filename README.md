# UI-library
Release plan (https://excalidraw.com/)
https://www.perplexity.ai/search/can-you-help-me-build-a-flexib-6TWeLvLoQk6rnoh3iXADJA


https://activitypub.rocks/
https://waapi.readme.io/reference/waapi-api-documentation


&nbsp;  
## Design
- https://m2.material.io
- https://m3.material.io


&nbsp;  
## Icons
- https://icomoon.io/
- https://icons8.com/icons/set/health--style-material
- https://ionic.io/ionicons
- https://fonts.google.com/icons
- https://phosphoricons.com/
- https://isocons.app
- https://heroicons.com/
- https://iconscout.com/
- https://remixicon.com/
- https://iconboddy.com


&nbsp;  
## Models & Components & Libraries
- https://getbootstrap.com/docs/5.3/examples/
- https://mobbin.com/explore/web/ui-elements/card
- https://mobbin.com/collections/72af2281-5c22-4a5d-ac12-ce6ac37e215d/web/screens
- https://uiverse.io/
- https://uiverse.io/jeremyssocial/ugly-bullfrog-62
- https://shuffle.dev/marketplace
- https://github.com/Chainlift/liftkit

### Tailwind components
- https://www.material-tailwind.com/blocks
- https://flowbite.com/#components
- https://merakiui.com/components
- https://daisyui.com/resources/videos/fast-beautiful-uis-angular-daisyui-x5l6lsj6ekw/
- https://tailwindflex.com/tag/navbar?is_responsive=true
- https://windytoolbox.com/
- https://mobbin.com/explore/web
- https://demos.creative-tim.com/soft-ui-design-system/presentation.html
- https://lbegey.fr/templates-tailwind.html
- https://github.com/ionic-team/ionic-framework/tree/main/core/src/components

### Menus
- https://tailwindcss.com/plus/ui-blocks/marketing/elements/flyout-menus
- https://forum.bubble.io/t/creating-a-three-state-toggle-slider-switch-button/310817
- https://www.spartan.ng/components/dropdown-menu

### Liquid glass
- https://snipzy.dev/snippets/liquid-glass-nav.html

### Cards
- https://ui.aceternity.com/components/3d-card-effect


&nbsp;  
## Colors
- https://www.iamsajid.com/ui-colors/
- https://m2.material.io/design/color/dark-theme.html#ui-application


&nbsp;  
## Fonts
- https://fonts.google.com/


&nbsp;  
## Animations
- https://animejs.com/
- https://reactbits.dev/text-animations/circular-text
- gsap
- https://animejs.com/documentation/stagger


&nbsp;  
## Examples
- Dark mode slider: [Vercel dark mode slider](./vercel_dark_mode.html)
- Dark mode slider: https://fr.freepik.com/vecteurs-premium/slider-jour-nuit_44129227.htm#from_element=cross_selling__vector
- Dark mode toggle button: https://fr.freepik.com/vecteurs-premium/bouton-vectoriel-interrupteur-bascule-mode-nuit-jour-luminosite-du-theme-application-element-option-diapositive-clair-sombre_28183375.htm
- 404: https://tailwindcss.com/plus/ui-blocks/marketing/feedback/404-pages


&nbsp;  
&nbsp;  
## Points of attention
- Overflow
- Mobile friendliness
- scroll in dropdown
- reject notifications
- Profile pop-up menu with dark mode toggle, logout
- create button with checkmark and animation
- dark mode in components
- loading spinner when waiting for API calls (https://sweetalert2.github.io/)
- profile on hover
- Tooltips (use group on related button and group-hover to show tooltip)
- custom radio button component
- OAuth
- Badge for notifications
- tags
- Page transitions for SPA
- Sounds
- Use Swl2 for modal inputs etc ?
- Wrap navbar + sidebar dans un composant
- Use only specific components (buttons, toggles, search bar, pop-up, menu, radio buttons, notifs, input with notifs etc, ...)
  For instance use a title component like `<h1 class="text-2xl text-text-main dark:text-text-main">{{ quiz.nom }}</h1>`
- Use only css variables for colors
- Order tailwind classes (luke display > position > ... > hover > focus)
- Use SwPush for notifications on desktop and mobile
- ionic angular https://github.com/ionic-team/ionic-framework/tree/main/core/src/components + PWA



`npm install -g web-codegen-scorer`



# Installation
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