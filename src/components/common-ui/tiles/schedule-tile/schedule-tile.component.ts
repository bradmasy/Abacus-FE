import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ab-schedule-tile',
  templateUrl: './schedule-tile.component.html',
  styleUrl: './schedule-tile.component.scss'
})
export class ScheduleTileComponent implements OnInit{
  @Input() hour!:number;

  ngOnInit(): void {
    console.log(this.hour);
  }


  
}
