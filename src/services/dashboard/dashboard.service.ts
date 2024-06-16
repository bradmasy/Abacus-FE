import { Injectable } from '@angular/core';
import { ProjectData } from '../../components/pages/dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  public projects!: ProjectData[];

}
