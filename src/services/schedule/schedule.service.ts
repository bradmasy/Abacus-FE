import { Injectable, inject } from '@angular/core';
import { ApiService } from '../api/api.service';
import { LoadingService } from '../loading/loading.service';
import { EMPTY, Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private api: ApiService = inject(ApiService)
  private loadingService: LoadingService = inject(LoadingService)

  constructor() {

  }

  public createTimeBlock(data: any): Observable<any> {


    const timePattern = (/(\d+):(\d+)\s*(AM|PM)/i);

    const startTimeParts = data["startTime"].match(timePattern);
    const endTimeParts = data["endTime"].match(timePattern);
    console.log(startTimeParts)
    const startDate: Date = new Date(data["date"]);
    console.log(startDate)
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
