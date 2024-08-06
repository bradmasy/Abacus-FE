import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteNotificationComponent } from './delete-notification/delete-notification.component';



@NgModule({
  declarations: [
    DeleteNotificationComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DeleteNotificationComponent
  ],
})
export class NotificationsModule { }
