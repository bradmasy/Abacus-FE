import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewContainerRef, WritableSignal, effect, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { EMPTY, Subject, catchError } from 'rxjs';
import { LoadingService } from '../../../services/loading/loading.service';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { TaskService } from '../../../services/task/task.service';
import { DeleteNotificationComponent } from '../../common-ui/notifications/delete-notification/delete-notification.component';

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

  @ViewChild('schedule', { read: ViewContainerRef }) notificationContainer!: ViewContainerRef;

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
  public deleteData:  WritableSignal<{ [key: string]: string | number }> = signal({});

  public renderer: Renderer2;
  private cdr: ChangeDetectorRef;

  constructor() {
    this.api = inject(ApiService);
    this.cdr = inject(ChangeDetectorRef);
    this.renderer = inject(Renderer2);

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
    this.scheduleService.getTimeBlocks(startDate, endDate)
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
    this.taskService.updateTask(event).pipe(
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


  deleteTask(id: string) {
    this.loadingService.loadingOn()
    this.deleteData.set({
      id:id,
    })
    this.taskService.deleteTask(id).pipe(
      catchError((err: Error) => {
        console.error(err);
        return EMPTY;
      })
    )
      .subscribe(() => {
        console.log('deleted')
        this.taskService.displayDelete.set(true);
        this.buildSchedule();
        this.showDeleteNotification(id);
      })
  }

  showDeleteNotification(taskId: string) {
   // this
    // const componentRef = new DeleteNotificationComponent();
    // const componentRef = this.notificationContainer.createComponent(DeleteNotificationComponent)
    // componentRef.instance.taskId = taskId;

    // const hostElement = componentRef.location.nativeElement;
    // console.log(hostElement)
    // componentRef.instance.slideIn();
    // setTimeout(()=>{
    //   componentRef.instance.slideOut();
    // },3000)
    // Add the class for slide-in animation
    //setTimeout(() => { this.renderer.addClass(hostElement, 'slide-out'); }, 2000);

    // hostElement.addEventListener('animationend', (event: AnimationEvent) => {
    //   console.log(event)
    //   console.log(event.animationName)
    //   if (event.animationName.includes('slideIn')) {
    //     console.log('here')
    //        this.renderer.removeClass(hostElement, 'slide-in');

    //     setTimeout(() => {
    //       this.renderer.addClass(hostElement, 'slide-out');
    //     }, 2000); 
    //   }
    // });

  //  this.renderer.addClass(hostElement, 'slide-in');


  }
}
