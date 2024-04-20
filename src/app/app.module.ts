import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageRoutingModule } from '../components/pages/page-routing.module';
import { CommonUiModule } from '../components/common-ui/common-ui.module';
import { PagesModule } from '../components/pages/pages.module';
import { AbacusFormsModule } from '../components/common-ui/abacus-forms/abacus-forms.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonUiModule,
    PagesModule,
    AbacusFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
