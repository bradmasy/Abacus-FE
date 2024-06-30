import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CommonUiModule } from '../common-ui/common-ui.module';
import { AppModule } from '../../app/app.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PartialsModule } from '../partials/partials.module';
import { PageOverlayDirective } from './page-overlay-directive/page-overlay.directive';



@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    PageOverlayDirective,
  ],
  imports: [
    CommonModule,
    CommonUiModule,
    PartialsModule
  ]
})

export class PagesModule { }
