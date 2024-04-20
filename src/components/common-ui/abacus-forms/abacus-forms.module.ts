import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonUiModule } from '../common-ui.module';
import { AbacusButtonsModule } from '../abacus-buttons/abacus-buttons.module';



@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AbacusButtonsModule
  ],
  exports: [
    LoginFormComponent
  ]
})
export class AbacusFormsModule { }
