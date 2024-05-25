import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectTileComponent } from './project-tile/project-tile.component';
import { ScheduleTileComponent } from './schedule-tile/schedule-tile.component';



@NgModule({
  declarations: [
    ProjectTileComponent,
    ScheduleTileComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ProjectTileComponent,
    ScheduleTileComponent
  ]
})
export class TilesModule { }
