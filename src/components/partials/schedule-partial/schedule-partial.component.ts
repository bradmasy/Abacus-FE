import { Component, EventEmitter, Input, OnInit, Output, WritableSignal, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { EMPTY, Subject, catchError } from 'rxjs';
import { LoadingService } from '../../../services/loading/loading.service';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { TaskService } from '../../../services/task/task.service';

export interface TimeBlock {
  id:string;
  createdAt:Date;
  endTime:Date;
  startTime:Date;
  task:string | null;
  userId:string;
  projectId: string | null;
}

@Component({
  selector: 'ab-schedule-partial',
  templateUrl: './schedule-partial.component.html',
  styleUrl: './schedule-partial.component.scss'
})

export class SchedulePartialComponent implements OnInit {

  @Input() date!: Date;
  @Output() emitTaskData: EventEmitter<{ [key: string]: string | number }> = new EventEmitter<{ [key: string]: string | number }>();

  public displayTask: WritableSignal<boolean> = signal(false);
  public taskData: WritableSignal<{ [key: string]: string | number }> = signal({});
  public daysOfTheWeek: string[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  public months: string[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
  public weekDayDates: number[] = [];
  public currentMonth!: string;
  public currentDay!: string;
  public year!: number;
  public timeBlocksSubject: Subject<TimeBlock[]> = new Subject<TimeBlock[]>();
  public loading:WritableSignal<boolean> = signal(true);

  public api: ApiService;
  public loadingService: LoadingService = inject(LoadingService);
  public scheduleService:ScheduleService = inject(ScheduleService);
  public taskService:TaskService = inject(TaskService)

  constructor() {
    console.log('schedule partial')
    this.api = inject(ApiService);

  }

  ngOnInit(): void {
    this.loadingService.loading.set(true); // queue the load

    this.calculateWeekDates();
    this.year = this.date.getFullYear();
    this.currentMonth = this.months[this.date.getMonth()];

    const startDate = new Date(`${this.currentMonth} ${this.weekDayDates[0]}, ${this.year}`);
    
    startDate.setUTCHours(0);
    startDate.setUTCMinutes(0); 

    this.api.getTimeBlock(startDate.toISOString())
      .subscribe((timeBlocks) => {
        this.loadingService.loading.set(false);
        setTimeout(()=>{
          this.timeBlocksSubject.next(timeBlocks);
        },500)
      })
  }

  calculateWeekDates(): void {
    const currentDayIndex = this.date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startOfWeek = new Date(this.date);
    startOfWeek.setDate(this.date.getDate() - currentDayIndex);

    this.weekDayDates = this.daysOfTheWeek.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date.getDate();
    });
  }

  // for the form
  receiveTask(event: any) {
    let minutes

    switch (event["block"]) {
      case 0:
        minutes = 0;
        break;
      case 1:
        minutes = 15;
        break;
      case 2:
        minutes = 30;
        break;
      case 3:
        minutes = 45
        break
      default:
        minutes = 0;
    }

    const amOrPm = event["hour"] < 12 ? event["hour"] === '24' ? 'AM' : 'AM' : 'PM'
    const hour = event["hour"] === 0 ? 12 : event["hour"] > 12 ? event["hour"] - 12 : event["hour"];


    const body = {
      date: event["date"],
      startTime: `${hour}:${minutes === 0 ? '00' : minutes} ${amOrPm}`,
      endTime: `${hour === 12 && minutes + 15 === 60 ? hour - 12 + 1 : minutes + 15 === 60 ? hour + 1 : hour}:${minutes + 15 === 60 ? '00' : minutes + 15} ${amOrPm}`
    }

    this.taskData.set(body); // sets the data for the form
    //this.displayTask.set(true); // will display the task form
    this.taskService.displayOn();
  }

  // the actual data being sent

  taskDialogData(data: { [key: string]: string | number }) {
    this.scheduleService.createTimeBlock(data)
    .pipe(
      catchError( (err:Error) => {
        console.error(err);
        return EMPTY;
      })
    )
    .subscribe((block) => {
      this.loadingService.loading.set(true);
      this.ngOnInit() // reload the component to dynamically update the UI with new

    })

    // this.emitTaskData.emit(data);
  }
}
