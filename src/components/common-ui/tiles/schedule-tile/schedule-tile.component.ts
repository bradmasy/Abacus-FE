import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { reduce } from 'rxjs';

@Component({
  selector: 'ab-schedule-tile',
  templateUrl: './schedule-tile.component.html',
  styleUrl: './schedule-tile.component.scss'
})
export class ScheduleTileComponent implements OnInit {

  @Input() hour!: number;
  @Input() date!: string;

  @Output() tileInformation: EventEmitter<{ [key: string]: string | number }>;

  constructor() {
    this.tileInformation = new EventEmitter<{ [key: string]: string | number }>();
  }

  ngOnInit(): void {

  }

  /**
   * Sends the data that represents the block of time on a given day that this tile represents
   * 
   * @param block represents the block number in the tile, each block is 0 - 15 minutes worth of time.
   */
  emitTileInformation = (block: number) => {
    const body = {
      'hour': this.hour,
      'block': block,
      'date': this.date
    }
    this.tileInformation.emit(body)
  }




}
