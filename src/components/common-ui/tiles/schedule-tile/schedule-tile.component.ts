import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';

const QUARTERS = 4;
const MINUTES_QTR_HOUR = 15;
const SECONDS_HOUR = 60000;

@Component({
  selector: 'ab-schedule-tile',
  templateUrl: './schedule-tile.component.html',
  styleUrl: './schedule-tile.component.scss'
})

export class ScheduleTileComponent implements OnInit {

  @Input() hour!: number;
  @Input() date!: Date;

  @Output() tileInformation: EventEmitter<{ [key: string]: string | number }>;

  @ViewChildren('quarter') quarters!: QueryList<ElementRef>;

  public id!: string;
  public quarterHourBlockIds: string[] = [];
  public enabled?: boolean;
  public enabledBlocks?: string[];
  public position!: { top: number, left: number };

  constructor(private elRef: ElementRef) {

    this.tileInformation = new EventEmitter<{ [key: string]: string | number }>();
  }

  ngOnInit(): void {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    const dateId = this.date
    dateId.setUTCHours(this.hour);

    this.id = dateId.toISOString();

    for (let i = 0; i < QUARTERS; i++) {

      const newId = new Date(this.date.getTime() + (i * MINUTES_QTR_HOUR) * SECONDS_HOUR)
      newId.setUTCHours(this.hour);
      newId.toLocaleDateString('en-US', options);

      this.quarterHourBlockIds.push(newId.toISOString());

    }

    this.calculatePosition();
  }

  calculatePosition(): void {
    const rect = this.elRef.nativeElement.getBoundingClientRect();
   // console.log(rect)
    this.position = { top: rect.top , left: rect.left };
  }

  getPosition(): { [key: string]: number } {
    return this.position;
  };

  getRect(){
    return this.elRef.nativeElement.getBoundingClientRect();
  }



  setBookedBlock(id: string) {
    const element = this.quarters.find((e: ElementRef) => {

      return e.nativeElement.id === id;
    })

    if (element) {
      element.nativeElement.style.backgroundColor = 'blue';
      element.nativeElement.style.border = 'none';
    }

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
      'date': this.date.toISOString()
    }
    this.tileInformation.emit(body)
  }




}
