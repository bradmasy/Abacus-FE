import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulePartialComponent } from './schedule-partial/schedule-partial.component';
import { CommonUiModule } from '../common-ui/common-ui.module';



@NgModule({
  declarations: [
    SchedulePartialComponent
  ],
  imports: [
    CommonModule,
    CommonUiModule,

  ],
  exports: [
    SchedulePartialComponent
  ],
})
export class PartialsModule { }
