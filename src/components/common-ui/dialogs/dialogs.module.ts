import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { AbacusBasicButtonComponent } from '../abacus-buttons/abacus-basic-button/abacus-basic-button.component';
import { AbacusButtonsModule } from '../abacus-buttons/abacus-buttons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TaskDialogComponent
  ],
  imports: [
    CommonModule,
    AbacusButtonsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    TaskDialogComponent
  ]
})
export class DialogsModule { }
