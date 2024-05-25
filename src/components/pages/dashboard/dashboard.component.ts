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

  public projects!: ProjectData[];
  public viewState: WritableSignal<State> = signal(State.projects); // Initialize to a default state of the page, at this current time it is projects 
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
}
