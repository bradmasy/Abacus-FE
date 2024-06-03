import { Component, EventEmitter, OnInit, Output, WritableSignal, signal } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';

export type ProjectData = {
  id: string;
  project: string;
  description: string;
  projectHours: number;
  spend: number;
  startDate: Date;
  endDate: Date;
  status: number;
  budget: number;
  version: number;
  name: string;
}

export enum State {
  dashboard = "dashboard",
  projects = "projects",
  time = "time",
  settings = "settings"
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {

  // @Output() state: EventEmitter<string> = new EventEmitter<string>();
  public displayTask: WritableSignal<boolean> = signal(false);
  public projects!: ProjectData[];
  public viewState: WritableSignal<State> = signal(State.projects); // Initialize to a default state of the page, at this current time it is projects 
  public taskData: WritableSignal<{ [key: string]: string | number }> = signal({});
  public date = new Date(); // the current day



  stateChange = (state: string) => {
    console.log(state)
    this.viewState.set(State[state as keyof typeof State]);
  }

  constructor(private api: ApiService) {

  }

  ngOnInit(): void {
    this.api.getProjectsForUser().subscribe({
      next: (success: any) => {
        console.log(success)
        this.projects = success
        console.log(this.projects)
      },
      error: (err) => {
        // error state
        console.log(err)
      }
    })
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
    console.log(hour)
    

    const body = {
      startTime: `${hour}:${minutes === 0 ? '00' : minutes} ${amOrPm}`,
      endTime: `${hour === 12 && minutes + 15 === 60 ? hour - 12 + 1: minutes + 15 === 60? hour + 1: hour}:${minutes + 15 === 60 ? '00' : minutes + 15} ${amOrPm}`
    }

    this.taskData.set(body); // sets the data for the form
    this.displayTask.set(true); // will display the task form
  }
}
