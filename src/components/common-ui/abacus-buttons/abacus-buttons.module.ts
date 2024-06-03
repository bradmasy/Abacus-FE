import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbacusBasicButtonComponent } from './abacus-basic-button/abacus-basic-button.component';



@NgModule({
  declarations: [
    AbacusBasicButtonComponent
  ],
  imports: [
    CommonModule,
    
  ],
  exports:[
    AbacusBasicButtonComponent
  ]
})
export class AbacusButtonsModule { }
