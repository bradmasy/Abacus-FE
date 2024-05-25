import { Component, Input } from '@angular/core';
import { ProjectData } from '../../../pages/dashboard/dashboard.component';

@Component({
  selector: 'ab-project-tile',
  templateUrl: './project-tile.component.html',
  styleUrl: './project-tile.component.scss'
})
export class ProjectTileComponent {

  @Input() projectData!: ProjectData;

  
}
