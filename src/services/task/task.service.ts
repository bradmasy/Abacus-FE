import { ElementRef, Injectable, OnInit, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { TaskDialogComponent } from '../../components/common-ui/dialogs/task-dialog/task-dialog.component';
import { ApiService } from '../api/api.service';
import { catchError, EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  public displayTask: WritableSignal<boolean> = signal(false);
  public displayDelete: WritableSignal<boolean> = signal(false);

  public displayEditTask: WritableSignal<boolean> = signal(false);
  public editData!: { [key: string]: string | number };
  public deleteData!: { [key: string]: string | number };

  public api: ApiService;
  public timePattern = (/(\d+):(\d+)\s*(AM|PM)/i);

  constructor() {
    this.api = inject(ApiService);

  }


  displayOn() {
    this.displayTask.set(true);
  }

  displayOff() {
    this.displayTask.set(false)
  }

  editTask(data: any) {
    this.displayEditTask.set(true);
    this.editData = data
  }

  displayEdit() {
    this.displayEditTask.set(true);
  }


  updateTask(data: any): Observable<any> {

    const startTimeConverted = this.convertTimeToApiValues(data["date"], data["startTime"]);
    const endTimeConverted = this.convertTimeToApiValues(data["date"], data["endTime"])

    const task = data["task"] || null;
    const projectId = data["projectId"] || null;

    const body = {
      StartTime: startTimeConverted,
      EndTime: endTimeConverted,
      Id: data['id'],
      Task: task,
      ProjectId: projectId
    }

    return this.api.updateTimeBlock(body).pipe(
      catchError((error) => {
        console.error(error);
        return EMPTY;
      }),
    )
  }

  convertTimeToApiValues(date: Date, time: string): Date {
    const timeParts = time.match(this.timePattern);
    const dateOfTask: Date = new Date(date);

    if (timeParts) {
      const amOrPmStart = timeParts[3];
      const hour = amOrPmStart === "AM" && parseInt(timeParts[1]) === 12 ? 0 : parseInt(timeParts[1]);
      const mins = parseInt(timeParts[2]);

      dateOfTask.setUTCHours(hour);
      dateOfTask.setUTCMinutes(mins);

      return dateOfTask;
    }

    return new Date();
  }

  createTimeBlock(data: any): Observable<any> {

    const startTimeConverted = this.convertTimeToApiValues(data["date"], data["startTime"]);
    const endTimeConverted = this.convertTimeToApiValues(data["date"], data["endTime"])

    const task = data["task"] || null;
    const projectId = data["projectId"] || null;

    const body = {
      StartTime: startTimeConverted,
      EndTime: endTimeConverted,
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

  deleteTask(id:string):Observable<any>{
    return this.api.deleteTimeBlock(id)
    .pipe(
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    )
  }

}
