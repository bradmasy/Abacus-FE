import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { reduce } from 'rxjs';

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
  public quarterHourBlockIds : string[] = [];
  public enabled?:boolean;
  public enabledBlocks?: string[];

  constructor() {

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
    // console.log(`the id: ${dateId.toISOString()}`)

    this.id = dateId.toISOString();

    // const newId = new Date(this.date.getTime() + 15 * 60000)

    // newId.setUTCHours(this.hour);
    // newId.toLocaleDateString('en-US', options);

    for(let i= 0; i < 4; i++){
      const newId = new Date(this.date.getTime() + (i * 15) * 60000)
      newId.setUTCHours(this.hour);
      newId.toLocaleDateString('en-US', options);

      this.quarterHourBlockIds.push(newId.toISOString());// newId.toISOString();

    }
  }

  setBookedBlock(id:string){
    console.log(this.quarters);
    const element = this.quarters.find((e:ElementRef) => {
    // console.log(e)
      // console.log(e.nativeElement.id)
      return e.nativeElement.id === id;
    })

    // console.log('quart found')
    if(element){
      element.nativeElement.style.backgroundColor = 'blue';
    }
    console.log(element);
    
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
