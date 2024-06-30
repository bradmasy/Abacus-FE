import { APP_INITIALIZER, NgModule, ViewContainerRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageRoutingModule } from '../components/pages/page-routing.module';
import { CommonUiModule } from '../components/common-ui/common-ui.module';
import { PagesModule } from '../components/pages/pages.module';
import { AbacusFormsModule } from '../components/common-ui/abacus-forms/abacus-forms.module';
import { ApiService } from '../services/api/api.service';
import { SessionService } from '../services/session/session.service';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { CookieInitializationService } from '../services/cookieInitializer/cookie-initialization.service';
import { MenuModule } from '../components/common-ui/menu/menu.module';
import { HttpClientModule } from '@angular/common/http';
import { PartialsModule } from '../components/partials/partials.module';
import { ScheduleService } from '../services/schedule/schedule.service';
import { TaskService } from '../services/task/task.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonUiModule,
    PagesModule,
    PartialsModule,
    AbacusFormsModule,
    MenuModule,
    HttpClientModule
  ],
  providers: [ApiService, SessionService, SsrCookieService, ScheduleService, TaskService,
    {
      provide: APP_INITIALIZER,
      useFactory: (cookieInitializationService: CookieInitializationService) => () => cookieInitializationService.initializeCookies(),
      deps: [CookieInitializationService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
