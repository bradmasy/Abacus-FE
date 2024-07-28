import { ElementRef, Injectable, inject, ViewContainerRef, ComponentRef, QueryList } from '@angular/core';
import { ApiService } from '../api/api.service';
import { LoadingService } from '../loading/loading.service';
import { EMPTY, Observable, catchError } from 'rxjs';
import { TimeBlock } from '../../components/partials/schedule-partial/schedule-partial.component';
import { PositionData } from '../../components/common-ui/schedule/schedule.component';
import { TaskEventTileComponent } from '../../components/common-ui/tiles/task-event-tile/task-event-tile.component';
import { EventDirective } from '../../components/common-ui/schedule/event/event.directive';


enum daysOfTheWeek {
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
};


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private api: ApiService = inject(ApiService);
  private loadingService: LoadingService = inject(LoadingService);
  private times: number[] = [];
  private eventTiles: ComponentRef<TaskEventTileComponent>[] = [];

  constructor() {

  }

  resetTimes() {
    this.times = [];
  }

  createTaskEventTileOnDOM(viewContainerRef: ViewContainerRef, positionArray: PositionData[], timeblock: TimeBlock) {
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
            validEventDiv = position.event.nativeElement;
          } else {
            validEventDiv = position.event;
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

      this.eventTiles.push(tileRef);
      tileRef.instance.heightInPx = heightPx;
      tileRef.instance.topInPx = minTop - 201
      tileRef.instance.timeblock = timeblock;

      if (timeblock.task) {
        tileRef.instance.taskTitle = timeblock.task;
      }
    }
  }

  createTimeBlock(data: any): Observable<any> {

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

  calculateWeeklyTotalTime(weeklyDiv: ElementRef): void {
    const total = this.times.reduce((acc, current) => acc + current, 0);
    if (weeklyDiv) {
      weeklyDiv.nativeElement.innerHTML = `<div>Weekly Time: ${total} Hours</div>`;
    }
  }

  calculateTimes(timeblocks: TimeBlock[], timeDivs: QueryList<ElementRef>, weeklyDiv: ElementRef): void {
    this.calculateTimePerDay(timeblocks, timeDivs);
    this.calculateWeeklyTotalTime(weeklyDiv);
  }

  /**
   * Calculates the total hours of logged time within a day for the user.
   * 
   * @param timeblocks 
   * @param timeDivs 
   */
  calculateTimePerDay(timeblocks: TimeBlock[], timeDivs: QueryList<ElementRef>): void {
    const calculatedTimeLoggedPerDay = timeDivs.toArray().reduce<{ [key: number]: number }>((acc, el, index) => {
      acc[index] = 0;
      return acc;
    }, {});

    const conversionFactor = (1000 * 60 * 60);

    timeblocks.forEach((block: TimeBlock) => {
      const start = new Date(block.startTime);
      const end = new Date(block.endTime);
      const dayIndex = start.getDay();
      const timeInMs = (end.getTime() - start.getTime());
      calculatedTimeLoggedPerDay[dayIndex] = calculatedTimeLoggedPerDay[dayIndex] += timeInMs;

    })

    Object.keys(calculatedTimeLoggedPerDay).forEach((key) => {
      const dayIndex = parseInt(key, 10);
      const el = timeDivs.toArray()[dayIndex];
      const timeInHours = calculatedTimeLoggedPerDay[dayIndex] / conversionFactor;
      this.times.push(timeInHours);

      if (el) {
        const elRef = el.nativeElement;
        elRef.innerHTML = timeInHours > 0 ? `<div>Total Daily Hours: ${timeInHours.toFixed(2)}</div>` : `<div>No Hours Logged</div>`;
      }
    });
  }



  getTimeBlocks() {

  }

  destroyEvents() {
    console.log(this.loadingService.loading())
    this.loadingService.loadingOn();
    console.log(this.loadingService.loading())

    this.eventTiles.forEach((tile) => {
      tile.destroy();
    })
  }
}
