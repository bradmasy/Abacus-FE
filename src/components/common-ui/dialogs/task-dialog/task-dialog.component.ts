import { Component, EventEmitter, HostBinding, Input, OnInit, Output, WritableSignal, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { HOURS, HOURS_IN_DAY, HOUR_INTERVAL, MINS_IN_INTERVAL, NOON } from '../constants';


export interface Option {
  label: string;
  value: string;
  default: boolean;
}

@Component({
  selector: 'ab-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss',
})

export class TaskDialogComponent implements OnInit {

  @Input() taskData!: { [key: string]: string | number };
  @Input() display: WritableSignal<boolean> = signal(false);

  @Output() taskBookingInformation: EventEmitter<{ [key: string]: string | number }> = new EventEmitter<{ [key: string]: string | number }>()

  public options: Option[];
  public taskForm: FormGroup;
  public startTime: FormControl;
  public endTime: FormControl;
  public date: FormControl;
  public task: FormControl;
  public project: FormControl<string | null | number>;
  public linkProjectText = "Link Project";


  private taskSubject: BehaviorSubject<{ [key: string]: string | number }> = new BehaviorSubject<{ [key: string]: string | number }>(this.taskData);
  private taskObserver: Observable<{ [key: string]: string | number }> = this.taskSubject.asObservable();

  @HostBinding('class.visible') get isVisible() {
    return this.display();
  }

  constructor() {
    this.startTime = new FormControl('')
    this.endTime = new FormControl('')
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

    this.startTime = new FormControl(this.taskData['startTime'])
    this.endTime = new FormControl(this.taskData['endTime'])
    this.date = new FormControl('');
    this.task = new FormControl(this.taskData['task']);
    this.project = new FormControl(this.taskData['project']);

    this.taskForm = new FormGroup({
      startTime: this.startTime,
      endTime: this.endTime,
      date: this.date,
      task: this.task,
      project: this.project
    })

    // get all the projects

    this.taskSubject.next(this.taskData);

    this.taskObserver.subscribe((data) => {
      this.startTime.setValue(data['startTime']);
      this.endTime.setValue(data['endTime']);
      this.project.setValue(data['project'] || null);
      this.task.setValue(data['task'] || null);
      this.date.setValue(data['date'])
    })
  }

  ngOnChanges(): void {
    if (this.taskData) {
      this.taskSubject.next(this.taskData);
    }
  }

  closeTask = () => {
    this.display.set(false);
  }

  addTime = () => {

    this.taskBookingInformation.emit(this.taskForm.value)
    this.closeTask();
  }

  editTask = (data:any) => {
    console.log(data)
    
  }
}
