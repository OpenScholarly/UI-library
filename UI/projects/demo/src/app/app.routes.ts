import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ThemeSelectorDemoComponent } from './components/theme-selector-demo.component';

import { BigFeaturesComponent } from './components/big-features/big-features.components';

export const routes: Routes = [
  { path: '', component: MainComponent },
  {
    path: 'theme-selector',
    component: ThemeSelectorDemoComponent,
    title: 'Theme Selector Demo'
  },
  {
    path: 'big-features',
    component: BigFeaturesComponent,
    title: 'Big Features Showcase'
  }
];
