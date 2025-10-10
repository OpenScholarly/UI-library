import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { TypographyService } from 'ui-components';

bootstrapApplication(App, appConfig)
  .then(appRef => {
    // Initialize font loading after bootstrap without deprecated initializers
    const typography = appRef.injector.get(TypographyService);
    void typography.loadFonts();
  })
  .catch((err) => console.error(err));
