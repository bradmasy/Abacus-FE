import { ElementRef, Injectable, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { TaskDialogComponent } from '../../components/common-ui/dialogs/task-dialog/task-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class TaskService{

  // @ViewChild(TaskDialogComponent) taskDialog!: ElementRef<TaskDialogComponent>
  public displayTask: WritableSignal<boolean> = signal(false);

  constructor() { }


  displayOn(){
    this.displayTask.set(true);
  }

  displayOff(){
    this.displayTask.set(false)
  }

  editTask(data:any){
    console.log(data);
    // this.taskDialog.nativeElement.display.set(true);
  }
}
