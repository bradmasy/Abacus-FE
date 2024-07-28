import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, WritableSignal, effect, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { EMPTY, Subject, catchError } from 'rxjs';
import { LoadingService } from '../../../services/loading/loading.service';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { TaskService } from '../../../services/task/task.service';

export interface TimeBlock {
  id: string;
  createdAt: Date;
  endTime: Date;
  startTime: Date;
  task: string | null;
  userId: string;
  projectId: string | null;
}

@Component({
  selector: 'ab-schedule-partial',
  templateUrl: './schedule-partial.component.html',
  styleUrl: './schedule-partial.component.scss'
})

export class SchedulePartialComponent implements OnInit {

  @Input() date!: WritableSignal<Date>;
  @Output() emitTaskData: EventEmitter<{ [key: string]: string | number }> = new EventEmitter<{ [key: string]: string | number }>();

  public displayTask: WritableSignal<boolean> = signal(false);
  public taskData: WritableSignal<{ [key: string]: string | number }> = signal({});
  public daysOfTheWeek: string[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  public months: string[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
  public weekDayDates: Date[] = [];
  public currentMonth!: string;
  public currentDay!: string;
  public changeDate = signal(false);
  public year!: number;
  public timeBlocksSubject: Subject<TimeBlock[]> = new Subject<TimeBlock[]>();
  public loading: WritableSignal<boolean> = signal(true);
  public api: ApiService;
  public loadingService: LoadingService = inject(LoadingService);
  public scheduleService: ScheduleService = inject(ScheduleService);
  public taskService: TaskService = inject(TaskService)
  public onChanges = new Subject<SimpleChanges>();

  private cdr: ChangeDetectorRef;

  constructor() {
    this.api = inject(ApiService);
    this.cdr = inject(ChangeDetectorRef)

    effect(() => {
      if (this.changeDate()) {
        this.calculateWeekDates();
        this.calculateDates();

        const startDate = this.calculateDateTime(this.weekDayDates[0], 0, 0);
        const endDate = this.calculateDateTime(this.weekDayDates[6], 23, 59)

        this.getUpdatedTimeBlocks(startDate, endDate);
        this.changeDate.set(false);
      }
    }, { allowSignalWrites: true })
  }

  calculateDateTime(startDate: Date, hours: number, mins: number) {
    startDate.setHours(hours);
    startDate.setMinutes(mins);
    return startDate;
  }
  calculateDates() {
    this.calculateWeekDates();
    this.year = this.date().getFullYear();
    this.currentMonth = this.months[this.date().getMonth()];

  }
  ngOnInit(): void {
    this.buildSchedule();
  }

  buildSchedule() {
    this.loadingService.loading.set(true); // queue the load

    this.calculateWeekDates();
    this.year = this.date().getFullYear();
    this.currentMonth = this.months[this.date().getMonth()];
    const startDate = this.weekDayDates[0];
    const endDate = this.weekDayDates[6];

    startDate.setHours(0);
    startDate.setMinutes(0);
    endDate.setHours(23);
    endDate.setMinutes(59);

    this.getUpdatedTimeBlocks(startDate, endDate);
  }

  getUpdatedTimeBlocks(startDate: Date, endDate: Date) {
    this.api.getTimeBlock(startDate.toDateString(), endDate.toDateString())
      .subscribe((timeBlocks) => {

        this.loadingService.loading.set(false);
        setTimeout(() => {
          this.timeBlocksSubject.next(timeBlocks);
        }, 500)
      })
  }

  calculateWeekDates(): void {
    const currentDayIndex = this.date().getDay(); // 0 (Sunday) to 6 (Saturday)
    const startOfWeek = new Date(this.date());

    startOfWeek.setDate(this.date().getDate() - currentDayIndex);

    this.weekDayDates = this.daysOfTheWeek.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  }

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
    this.taskService.displayOn();
  }

  taskDialogData(data: { [key: string]: string | number }) {
    this.taskService.createTimeBlock(data)
      .pipe(
        catchError((err: Error) => {
          console.error(err);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.loadingService.loadingOn()
        this.buildSchedule();
      })
  }

  receiveDateChange(event: Date) {
    this.date.set(new Date(event.getTime())); // Ensure new reference
    this.changeDate.set(true);
    this.cdr.detectChanges();
  }


  editTask(event: { [key: string]: string | number }) {
    this.taskService.updateTask(event) .pipe(
      catchError((err: Error) => {
        console.error(err);
        return EMPTY;
      })
    )
    .subscribe(() => {
      this.loadingService.loadingOn()
      this.buildSchedule();
    })
  }
}
