import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlyoutMenuComponent } from './flyout-menu/flyout-menu.component';



@NgModule({
  declarations: [
    FlyoutMenuComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    FlyoutMenuComponent
  ]
})
export class MenuModule { }
