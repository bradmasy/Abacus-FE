import { ElementRef, Injectable, inject, ViewContainerRef, ComponentRef } from '@angular/core';
import { ApiService } from '../api/api.service';
import { LoadingService } from '../loading/loading.service';
import { EMPTY, Observable, catchError } from 'rxjs';
import { TimeBlock } from '../../components/partials/schedule-partial/schedule-partial.component';
import { PositionData } from '../../components/common-ui/schedule/schedule.component';
import { TaskEventTileComponent } from '../../components/common-ui/tiles/task-event-tile/task-event-tile.component';
import { EventDirective } from '../../components/common-ui/schedule/event/event.directive';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private api: ApiService = inject(ApiService);
  private loadingService: LoadingService = inject(LoadingService);

  constructor() {

  }


  public createTaskEventTileOnDOM(viewContainerRef: ViewContainerRef, positionArray: PositionData[], timeblock: TimeBlock) {
    console.log(positionArray)
    if (positionArray.length === 0) {
      return;
    }
    let minTop = Number.MAX_VALUE;
    let maxTop = Number.MIN_VALUE;
    let left = 0;
    let heightPx = 0;

    let validEventDiv: EventDirective | undefined;

    positionArray.forEach((position) => {
      heightPx += 50;
      if (position.top !== undefined && position.left !== undefined) {
        if (position.top < minTop) {
          minTop = position.top;
          left = position.left;
          if (position.event instanceof ElementRef) {
            validEventDiv = position.event.nativeElement// as HTMLDivElement;
          } else {
            validEventDiv = position.event// as HTMLDivElement;
          }
        }
        if (position.top > maxTop) {
          maxTop = position.top;
        }
      }
    });

    if (validEventDiv) {

      const newDiv = document.createElement('div');

      newDiv.classList.add('ab-schedule-event');
      newDiv.style.height = `${heightPx}px`;

      const tileRef =
        validEventDiv.viewContainerRef.createComponent(TaskEventTileComponent);

      tileRef.instance.heightInPx = heightPx;
      tileRef.instance.topInPx = minTop - 121
      tileRef.instance.timeblock = timeblock;

      if (timeblock.task) {
        tileRef.instance.taskTitle = timeblock.task;
      }
    }
  }

  public createTimeBlock(data: any): Observable<any> {

    const timePattern = (/(\d+):(\d+)\s*(AM|PM)/i);

    const startTimeParts = data["startTime"].match(timePattern);
    const endTimeParts = data["endTime"].match(timePattern);

    const startDate: Date = new Date(data["date"]);
    const endDate: Date = new Date(data["date"]);

    const amOrPmStart = startTimeParts[3];
    const amOrPmEnd = endTimeParts[3];

    const startHour = amOrPmStart === "AM" && parseInt(startTimeParts[1]) === 12 ? 0 : parseInt(startTimeParts[1]);
    const startMins = startTimeParts[2];

    const endHour = amOrPmEnd === "AM" && parseInt(endTimeParts[1]) === 12 ? 0 : parseInt(endTimeParts[1]);
    const endMins = endTimeParts[2];

    const startTime = startDate;
    const endTime = endDate;


    startTime.setUTCHours(startHour);
    startTime.setUTCMinutes(startMins);

    endTime.setUTCHours(endHour);
    endTime.setUTCMinutes(endMins);

    const task = data["task"] || null;
    const projectId = data["projectId"] || null;

    const body = {
      StartTime: startTime,
      EndTime: endTime,
      Task: task,
      ProjectId: projectId
    }

    return this.api.createTimeBlock(body)
      .pipe(
        catchError((err) => {
          console.error(err);
          return EMPTY;
        })
      )
  }
}
