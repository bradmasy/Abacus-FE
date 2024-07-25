import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbacusBasicButtonComponent } from './abacus-basic-button/abacus-basic-button.component';
import { AbacusIconButtonComponent } from './abacus-icon-button/abacus-icon-button.component';



@NgModule({
  declarations: [
    AbacusBasicButtonComponent,
    AbacusIconButtonComponent
  ],
  imports: [
    CommonModule,
    
  ],
  exports:[
    AbacusBasicButtonComponent,
    AbacusIconButtonComponent
  ]
})
export class AbacusButtonsModule { }
