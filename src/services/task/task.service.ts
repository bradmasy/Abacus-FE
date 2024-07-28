import { ElementRef, Injectable, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { TaskDialogComponent } from '../../components/common-ui/dialogs/task-dialog/task-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  public displayTask: WritableSignal<boolean> = signal(false);
  public displayEditTask: WritableSignal<boolean> = signal(false);
  public editData!: { [key: string]: string | number };

  constructor() { }


  displayOn() {
    this.displayTask.set(true);
  }

  displayOff() {
    this.displayTask.set(false)
  }

  editTask(data: any) {
    console.log(data);
    this.displayEditTask.set(true);
    this.editData = data
    // this.displayTask.set(true);
  }

  displayEdit(){
    
    this.displayEditTask.set(true);
  }
}
