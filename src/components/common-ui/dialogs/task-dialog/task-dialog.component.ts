import { Component, HostBinding, Input, OnInit, WritableSignal, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'ab-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss',
})
export class TaskDialogComponent implements OnInit {

  @Input() taskData!: { [key: string]: string | number };
  @Input() display: WritableSignal<boolean> = signal(false);

  // public startTime: string = "4:45 PM";
  // public endTime: string = "5:00 PM";

  private taskSubject: BehaviorSubject<{ [key: string]: string | number }> = new BehaviorSubject<{ [key: string]: string | number }>({});
  private taskObserver: Observable<{ [key: string]: string | number }> = this.taskSubject.asObservable();

  @HostBinding('class.visible') get isVisible() {
    return this.display();
  }

  constructor() {
    // this.startTime = "4:45 PM";
    // this.endTime = "5:00 PM";
  }

  ngOnInit(): void {

    this.taskObserver.subscribe((task) => {

      console.log('task changing')
      console.log(task)
    })
    

  }

  closeTask = () => {
    console.log('clicked')
    this.display.set(false);
  }

}
