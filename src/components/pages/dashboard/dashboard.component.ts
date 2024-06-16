import { Component, EventEmitter, OnInit, Output, WritableSignal, inject, signal } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { EMPTY, catchError } from 'rxjs';
import { DashboardService } from '../../../services/dashboard/dashboard.service';

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
  public dashboardService: DashboardService;


  stateChange = (state: string) => {
    this.viewState.set(State[state as keyof typeof State]);
  }

  constructor(private api: ApiService) {
    this.dashboardService = inject(DashboardService);
  }

  ngOnInit(): void {


    this.api.getProjectsForUser().subscribe({
      next: (success: any) => {
        this.projects = success
      },
      error: (err) => {
        // error state
        console.log(err)
      }
    })

    // this needs to be the start of the week

  

  }


  receiveTask(data: any) {
    console.log(data)

    const timePattern = (/(\d+):(\d+)\s*(AM|PM)/i);

    const startTimeParts = data["startTime"].match(timePattern);
    const endTimeParts = data["endTime"].match(timePattern);

    const startDate: Date = new Date(data["date"]);
    const endDate: Date = new Date(data["date"]);

    const startHour = startTimeParts[1];
    const startMins = startTimeParts[2];

    const endHour = endTimeParts[1];
    const endMins = endTimeParts[2];

    const startTime = startDate;
    const endTime = endDate;

    startTime.setUTCHours(startHour);
    startTime.setUTCMinutes(startMins);

    endTime.setUTCHours(endHour);
    endTime.setUTCMinutes(endMins);

    const task = data["task"] || null;
    const projectId = data["projectId"] || null;

    //const startTime =
    const body = {
      StartTime: startTime,
      EndTime: endTime,
      Task: task,
      ProjectId: projectId
    }
    //    make API call here
    console.log(body)
    this.api.createTimeBlock(body)
      .pipe(
        catchError((err) => {
          console.log(err);
          return EMPTY;
        })
      )
      .subscribe((blocks) => {
        console.log(blocks)
      })

    // create a task dialog here and update the UI on booked data
  }
}
