import { Component, EventEmitter, HostBinding, Input, Output, WritableSignal, inject, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Option } from '../task-dialog/task-dialog.component';
import { HOURS, HOURS_IN_DAY, HOUR_INTERVAL, MINS_IN_INTERVAL, NOON } from '../constants';
import { TaskService } from '../../../../services/task/task.service';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrl: './edit-task-dialog.component.scss'
})
export class EditTaskDialogComponent {
  @Input() taskData: { [key: string]: string | number } = {};
  @Input() display: WritableSignal<boolean> = signal(false);

  @Output() taskBookingInformation: EventEmitter<{ [key: string]: string | number }> = new EventEmitter<{ [key: string]: string | number }>()

  public options: Option[];
  public taskForm: FormGroup;
  public startTime: FormControl;
  public endTime: FormControl;
  public id: FormControl;
  public date: FormControl;
  public task: FormControl;
  public project: FormControl<string | null | number>;
  public linkProjectText = "Link Project";
  public editTaskTitle = "Edit Task";

  private taskSubject: BehaviorSubject<{ [key: string]: string | number }> = new BehaviorSubject<{ [key: string]: string | number }>(this.taskData);
  private taskObserver: Observable<{ [key: string]: string | number }> = this.taskSubject.asObservable();

  private taskService: TaskService;

  @HostBinding('class.visible') get isVisible() {
    return this.display();
  }

  constructor() {

    this.taskService = inject(TaskService);

    this.startTime = new FormControl('')
    this.endTime = new FormControl('')
    this.id = new FormControl('')
    this.date = new FormControl('');
    this.task = new FormControl('');
    this.project = new FormControl(null);

    this.taskForm = new FormGroup({
      startTime: this.startTime,
      endTime: this.endTime,
      date: this.date,
      task: this.task,
      project: this.project
    })

    this.options = []

    for (let i = 0; i < HOURS; i++) {
      for (let j = 0; j < HOUR_INTERVAL; j++) {

        const amOrPm = i < NOON ? i === HOURS_IN_DAY ? 'AM' : 'AM' : 'PM'
        const hour = i === 0 ? NOON : i > NOON ? i - NOON : i;
        const minutes = j * MINS_IN_INTERVAL;

        const option = {
          label: `${hour}:${minutes === 0 ? '00' : minutes} ${amOrPm}`,
          value: `${i}-${j}`,
          default: true,
        }

        this.options.push(option);
      }
    }
  }

  ngOnInit(): void {
    this.taskForm = new FormGroup({
      id: this.id,
      startTime: this.startTime,
      endTime: this.endTime,
      date:this.date,
      task: this.task,
      project: this.project
    })

    this.taskObserver.subscribe((data) => {

      if (Object.keys(data).length > 0) {
        const startValue = this.getTimeValue(new Date(data['startTime']));
        const endValue = this.getTimeValue(new Date(data['endTime']));
        this.id.setValue(data['id'])
        this.date.setValue(data['date'])
        this.startTime.setValue(startValue);
        this.endTime.setValue(endValue);
        this.task.setValue(data['task'] || null);
      }
    })


    this.taskData
  }

  getTimeValue(date: Date): string {

    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? 0 + minutes : minutes;
    const strTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
    return strTime;
  }

  calculateMin(minuteStr: string): string {
    let min = ''

    switch (minuteStr) {
      case '00':
        min = '0'
        break;
      case '15':
        min = '1';
        break;
      case '30':
        min = '2';
        break;
      case '45':
        min = '3'
        break;
      default:
        min = '0';
        break;
    }

    return min;
  }

  ngOnChanges(): void {
    if (this.taskData) {
      this.taskSubject.next(this.taskData);
    }
  }

  closeTask = () => {
    this.display.set(false);
  }

  editTask = () => {
    // this.taskService.updateTask(this.taskForm.value);
    this.taskBookingInformation.emit(this.taskForm.value);
    this.closeTask();
  }

  deleteTask() {

  }
}
