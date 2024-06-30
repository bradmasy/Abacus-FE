import { Component, HostBinding, Input, inject } from '@angular/core';
import { TimeBlock } from '../../../partials/schedule-partial/schedule-partial.component';
import { TaskService } from '../../../../services/task/task.service';

@Component({
  selector: 'ab-task-event-tile',
  templateUrl: './task-event-tile.component.html',
  styleUrl: './task-event-tile.component.scss'
})
export class TaskEventTileComponent {

  topInPx!: number;
  taskTitle: string = '';
  taskStartTime!: Date;
  taskEndTime!: Date;

  public heightInPx!: number;
  public timeblock!: TimeBlock;

  private taskService:TaskService = inject(TaskService);
  
  constructor(){}

  editTask() {
    console.log('editing...')
    
    this.taskService.editTask(this.timeblock)    

  }

  deleteTask() {

  }

  calculateTotal() {
    const totalBlockTime = new Date(this.timeblock.endTime).getTime() - new Date(this.timeblock.startTime).getTime();
    const seconds = Math.floor(totalBlockTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${remainingHours != 0 ? remainingHours : '00'}:${remainingMinutes != 0 ? remainingMinutes : '00'}:00`;

  }

  getDynamicStyles() {
    return {
      'top': `${this.topInPx}px`,
      'height': `${this.heightInPx}px`,
      // Add other styles as needed
    };
  }
  @HostBinding('style.top.px') get topStyle() {
    return this.topInPx;
  }

  @HostBinding('style.height.px') get heightStyle() {
    return this.heightInPx;
  }
}
