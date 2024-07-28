import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { AbacusButtonsModule } from '../abacus-buttons/abacus-buttons.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditTaskDialogComponent } from './edit-task-dialog/edit-task-dialog.component';



@NgModule({
  declarations: [
    TaskDialogComponent,
    EditTaskDialogComponent,
  ],
  imports: [
    CommonModule,
    AbacusButtonsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    TaskDialogComponent,
    EditTaskDialogComponent
  ]
})
export class DialogsModule { }
