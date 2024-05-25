import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CommonUiModule } from '../common-ui/common-ui.module';
import { AppModule } from '../../app/app.module';
import { DashboardComponent } from './dashboard/dashboard.component';



@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    CommonUiModule
  ]
})

export class PagesModule { }
