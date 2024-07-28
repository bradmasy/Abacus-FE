import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbacusBasicButtonComponent } from './abacus-basic-button/abacus-basic-button.component';
import { AbacusIconButtonComponent } from './abacus-icon-button/abacus-icon-button.component';
import { AbacusDropdownButtonComponent } from './abacus-dropdown-button/abacus-dropdown-button.component';



@NgModule({
  declarations: [
    AbacusBasicButtonComponent,
    AbacusIconButtonComponent,
    AbacusDropdownButtonComponent
  ],
  imports: [
    CommonModule,
    
  ],
  exports:[
    AbacusBasicButtonComponent,
    AbacusIconButtonComponent,
    AbacusDropdownButtonComponent
  ]
})
export class AbacusButtonsModule { }
