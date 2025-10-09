import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { ThemeSelectorDemoComponent } from './components/theme-selector-demo.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
    {
    path: 'theme-selector',
    component: ThemeSelectorDemoComponent,
    title: 'Theme Selector Demo'
  }
];
