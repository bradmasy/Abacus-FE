import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './abacus-forms/login-form/login-form.component';
import { AbacusFormsModule } from './abacus-forms/abacus-forms.module';
import { AbacusButtonsModule } from './abacus-buttons/abacus-buttons.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    AbacusFormsModule,
    AbacusButtonsModule,
  ],
  exports:[
    AbacusFormsModule,
    
  ]
})
export class CommonUiModule { }
