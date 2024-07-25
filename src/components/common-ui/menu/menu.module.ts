import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlyoutMenuComponent } from './flyout-menu/flyout-menu.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';



@NgModule({
  declarations: [
    FlyoutMenuComponent,
    NavigationBarComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    FlyoutMenuComponent,
    NavigationBarComponent
  ]
})
export class MenuModule { }
