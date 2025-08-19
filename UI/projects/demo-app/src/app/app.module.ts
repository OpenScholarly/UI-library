import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from '../../../ui-components/src/lib/components/button/button.module';
import { CardModule } from '../../../ui-components/src/lib/components/card/card.module';
import { FormFieldModule } from '../../../ui-components/src/lib/components/form/form-field/form-field.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ButtonsDemoComponent } from './components/buttons-demo/buttons-demo.component';
import { CardsDemoComponent } from './components/cards-demo/cards-demo.component';
import { FormsDemoComponent } from './components/forms-demo/forms-demo.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonsDemoComponent,
    CardsDemoComponent,
    FormsDemoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ButtonModule,
    CardModule,
    FormFieldModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
