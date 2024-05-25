import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectTileComponent } from './project-tile/project-tile.component';



@NgModule({
  declarations: [
    ProjectTileComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    ProjectTileComponent
  ]
})
export class TilesModule { }
