import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { AbacusBasicButtonComponent } from '../abacus-buttons/abacus-basic-button/abacus-basic-button.component';
import { AbacusButtonsModule } from '../abacus-buttons/abacus-buttons.module';



@NgModule({
  declarations: [
    TaskDialogComponent
  ],
  imports: [
    CommonModule,
    AbacusButtonsModule,
  ],
  exports: [
    TaskDialogComponent
  ]
})
export class DialogsModule { }
