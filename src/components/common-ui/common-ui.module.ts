import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './abacus-forms/login-form/login-form.component';
import { AbacusFormsModule } from './abacus-forms/abacus-forms.module';
import { AbacusButtonsModule } from './abacus-buttons/abacus-buttons.module';
import { MenuModule } from './menu/menu.module';
import { TilesModule } from './tiles/tiles.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { DialogsModule } from './dialogs/dialogs.module';
import { TaskDialogComponent } from './dialogs/task-dialog/task-dialog.component';
import { OverlaysModule } from './overlays/overlays.module';



@NgModule({
  declarations: [
    SpinnerComponent,
    ScheduleComponent,
  ],
  imports: [
    CommonModule,
    AbacusFormsModule,
    AbacusButtonsModule,
    MenuModule,
    TilesModule,
    DialogsModule,
    OverlaysModule,
  ],
  exports: [
    AbacusFormsModule,
    MenuModule,
    TilesModule,
    SpinnerComponent,
    ScheduleComponent,
    DialogsModule,
    AbacusButtonsModule,
    OverlaysModule,
  ]
})
export class CommonUiModule { }
