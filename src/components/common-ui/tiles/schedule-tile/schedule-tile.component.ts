import { Component, effect, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChildren, WritableSignal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const QUARTERS = 4;
const MINUTES_QTR_HOUR = 15;
const SECONDS_HOUR = 60000;

@Component({
  selector: 'ab-schedule-tile',
  templateUrl: './schedule-tile.component.html',
  styleUrl: './schedule-tile.component.scss'
})

export class ScheduleTileComponent implements OnInit, OnDestroy {

  @Input() hour!: number;
  @Input() date!: WritableSignal<Date>;

  @Output() tileInformation: EventEmitter<{ [key: string]: string | number }>;

  @ViewChildren('quarter') quarters!: QueryList<ElementRef>;

  public id!: string;
  public quarterHourBlockIds: string[] = [];
  public enabled?: boolean;
  public enabledBlocks?: string[];
  public position!: { top: number, left: number };
  public loaded = false;
  public options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  public currentDate!: Date;

  constructor(private elRef: ElementRef) {

    this.tileInformation = new EventEmitter<{ [key: string]: string | number }>();


    effect(() => {

      if (this.date() !== this.currentDate && this.loaded) {
        console.log('setting up')
        this.setupTile();

      }

      this.currentDate = this.date();
      this.loaded = true;
    })
  }

  ngOnDestroy(): void {
    this.quarterHourBlockIds = [];

    this.quarters.forEach((quarter) => {
      quarter.nativeElement.style.backgroundColor = '';
      quarter.nativeElement.style.border = '';
    });

    this.tileInformation.complete();
  }

  ngOnInit(): void {
    this.setupTile();
  }

  setupTile() {
    this.quarterHourBlockIds = [];

    const dateId = this.date()
    dateId.setUTCHours(this.hour);

    this.id = dateId.toISOString();

    for (let i = 0; i < QUARTERS; i++) {

      const newId = new Date(this.date().getTime() + (i * MINUTES_QTR_HOUR) * SECONDS_HOUR)
      newId.setUTCHours(this.hour);
      newId.toLocaleDateString('en-US', this.options);

      this.quarterHourBlockIds.push(newId.toISOString());

    }

    this.calculatePosition();
  }

  calculateId(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    for (let i = 0; i < QUARTERS; i++) {

      const newId = new Date(date.getTime() + (i * MINUTES_QTR_HOUR) * SECONDS_HOUR)
      newId.setUTCHours(this.hour);
      newId.toLocaleDateString('en-US', options);

      this.quarterHourBlockIds.push(newId.toISOString());
    }
  }

  calculatePosition(): void {
    const rect = this.elRef.nativeElement.getBoundingClientRect();
    // console.log(rect)
    this.position = { top: rect.top, left: rect.left };
  }

  getPosition(): { [key: string]: number } {
    return this.position;
  };

  getRect() {
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
      'date': this.date().toISOString()
    }
    this.tileInformation.emit(body)
  }




}
