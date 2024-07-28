import { Component, HostBinding, Input, OnInit, inject } from '@angular/core';
import { TimeBlock } from '../../../partials/schedule-partial/schedule-partial.component';
import { TaskService } from '../../../../services/task/task.service';

@Component({
  selector: 'ab-task-event-tile',
  templateUrl: './task-event-tile.component.html',
  styleUrl: './task-event-tile.component.scss'
})
export class TaskEventTileComponent implements OnInit {

  topInPx!: number;
  taskTitle: string = '';
  taskStartTime!: Date;
  taskEndTime!: Date;
  dateOfEvent!: Date;

  public heightInPx!: number;
  public timeblock!: TimeBlock;

  private taskService: TaskService = inject(TaskService);

  constructor() { }

  ngOnInit() {
    const startDate = new Date(this.taskStartTime);
    const endDate = new Date(this.taskEndTime);

    startDate.setUTCHours(0);
    startDate.setUTCMinutes(0);

    endDate.setUTCHours(0);
    endDate.setUTCMinutes(0);
 
    if (startDate.getTime() === endDate.getTime()) {
      this.dateOfEvent = startDate;
    }
  }

  editTask() {
    const data = { date: this.dateOfEvent.toISOString(), ...this.timeblock }
    
    this.taskService.editTask(data);
  }

  deleteTask() {
    // TODO
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
    };
  }

  @HostBinding('style.top.px') get topStyle() {
    return this.topInPx;
  }

  @HostBinding('style.height.px') get heightStyle() {
    return this.heightInPx;
  }
}
