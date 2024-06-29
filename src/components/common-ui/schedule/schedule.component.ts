import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, Signal, ViewChildren, ViewEncapsulation, WritableSignal, signal } from '@angular/core';
import { TimeBlock } from '../../partials/schedule-partial/schedule-partial.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { ScheduleTileComponent } from '../tiles/schedule-tile/schedule-tile.component';

enum ScheduleState {
  calendar = "calendar",
  day = "day"
}

interface PositionData {
  top: number;
  left: number;
  event: HTMLDivElement | undefined;
}
const REMOVE_TIMEZONE = -11;
const REMOVE_MINUTES = -6;

@Component({
  selector: 'ab-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})

export class ScheduleComponent implements OnInit, AfterViewInit {

  @Input() date!: Date;
  @Input() timeBlocksSubject!: Subject<TimeBlock[]>;

  @Output() taskEvent: EventEmitter<{ [key: string]: string | number }>;

  @ViewChildren('tile') scheduleTiles!: QueryList<ScheduleTileComponent>;
  @ViewChildren('event') events!: QueryList<HTMLDivElement>;

  public formattedDate!: string;
  public state: WritableSignal<ScheduleState> = signal(ScheduleState.day);
  public hoursArray: number[] = Array.from({ length: 24 }, (_, i) => i); // Creates an array [0, 1, 2, ..., 23]
  public daysOfTheWeek: string[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  public months: string[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
  public weekDayDates: number[] = [];
  public currentMonth!: string;
  public currentDay!: string;
  public year!: number;
  public timeBlocksUpdateSubject: BehaviorSubject<TimeBlock[]> = new BehaviorSubject<TimeBlock[]>([]);

  public timeBlocks: TimeBlock[] = [];

  constructor() {
    this.taskEvent = new EventEmitter<{ [key: string]: string | number }>();
    console.log('schedule')
  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    this.formattedDate = this.date.toLocaleDateString('en-US', options);
    this.year = this.date.getFullYear();
    this.currentMonth = this.months[this.date.getMonth()];

    this.calculateWeekDates();

    this.timeBlocksSubject.subscribe((data) => {
      console.log(data)
      this.timeBlocks = data
      this.timeBlocksUpdateSubject.next(this.timeBlocks);// Dispatch signal when timeBlocks are updated

      const mappedScheduleTiles = this.scheduleTiles.reduce((acc: { [key: string]: ScheduleTileComponent }, tile: ScheduleTileComponent) => {
        acc[tile.id] = tile;

        return acc;
      }, {} as { [key: string]: ScheduleTileComponent });

      const timeBlockStartEndTimes = this.timeBlocks.map((block) => {
        return {

          start: block.startTime,
          end: block.endTime,
        }
      })

      const mappedTileKeys = Object.keys(mappedScheduleTiles);
      const filteredBlocks: ScheduleTileComponent[] = [];

      let inRange = false;

      for (let i = 0; i < this.timeBlocks.length; i++) {

        const timeBlockStartId = this.timeBlocks[i].startTime.toString().slice(0, REMOVE_MINUTES);
        const timeBlockEndId = this.timeBlocks[i].endTime.toString().slice(0, REMOVE_MINUTES);


        for (let j = 0; j < mappedTileKeys.length; j++) {

          const mappedKey = mappedTileKeys[j].slice(0, REMOVE_TIMEZONE);


          if (mappedKey === timeBlockStartId) { // once we find the start we can add all the blocks till the end
            inRange = true;
          }

          if (inRange) {
            // any blocks that are within the start and end time on a timeblock are booked
            filteredBlocks.push(mappedScheduleTiles[mappedTileKeys[j]]);
          }

          if (mappedKey === timeBlockEndId) {
            // stop adding the blocks for this one
            inRange = false;
          }
        }

      }

      this.timeBlocks.forEach((eachTimeBlock) => {

        const start = new Date(eachTimeBlock.startTime);
        const end = new Date(eachTimeBlock.endTime);

        const positionData: PositionData[] = [];
        filteredBlocks.forEach((eachBlock) => {


          eachBlock.quarterHourBlockIds.forEach((quarter, index) => {

            const formattedQuarter = quarter.slice(0, REMOVE_MINUTES + 1);
            const convertedDateTime = new Date(formattedQuarter);

            if (convertedDateTime >= start && convertedDateTime < end) {

              const splitQuarter = quarter.split('-');
              const dayNumber = splitQuarter[2].split('T')[0];
              const idIndex = this.weekDayDates.findIndex((e) => e === parseInt(dayNumber));
              const eventContainer = this.events.get(idIndex);

              // this is the location of each block
              const locationForDiv = eachBlock.getPosition();

              const mergedLocationEventObject = {
                top: locationForDiv['top'] + (index * 50), // to represent each block, there are 4 quarterblocks each at 50px
                left: locationForDiv['left'],
                event: eventContainer
              }

              positionData.push(mergedLocationEventObject);
            }
          });

          console.log(positionData)


        })

        if (positionData.length !== 0) {

          this.constructBlock(positionData, eachTimeBlock);

        }
      });
    });



    this.timeBlocksUpdateSubject.subscribe((blocks) => {
      console.log('TIME BLOCKS')
      // console.log(blocks);
    })
  }

  parseQuarterToTopPx(quarter: string): number {
    const splitQuarter = quarter.split('T');
    console.log(splitQuarter);
    const splitTimeBlockFromQuarter = splitQuarter[1].split(':');
    console.log(splitTimeBlockFromQuarter);
    const hour = splitTimeBlockFromQuarter[0];
    const min = splitTimeBlockFromQuarter[1]

    let px = 0;
    px += (50)
    return 0;
  }

  calculateAmountOfBookedTimePerBlock(timeblock: TimeBlock) {

    const totalBlockTime = new Date(timeblock.endTime).getTime() - new Date(timeblock.startTime).getTime();
    const seconds = Math.floor(totalBlockTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${remainingHours != 0 ? remainingHours : '00'}:${remainingMinutes != 0 ? remainingMinutes : '00'}:00`;
  }

  constructBlock(positionArray: PositionData[], timeblock: TimeBlock) {
    console.log(positionArray)
    if (positionArray.length === 0) {
      return;
    }
    let minTop = Number.MAX_VALUE;
    let maxTop = Number.MIN_VALUE;
    let left = 0;

    let heightPx = 0;

    let validEventDiv: HTMLDivElement | undefined;


    positionArray.forEach((position) => {
      heightPx += 50;
      if (position.top !== undefined && position.left !== undefined) {
        if (position.top < minTop) {
          minTop = position.top;
          left = position.left;
          if (position.event instanceof ElementRef) {
            validEventDiv = position.event.nativeElement as HTMLDivElement;
          } else {
            validEventDiv = position.event as HTMLDivElement;
          }
        }
        if (position.top > maxTop) {
          maxTop = position.top;
        }
      }
    });

    if (validEventDiv) {

      const newDiv = document.createElement('div');

      newDiv.classList.add('ab-schedule-event');
      newDiv.style.top = `${minTop - 121}px`;
      newDiv.style.height = `${heightPx}px`;

      if (timeblock.task) {
        const innerHTML = `
        <div class="ab-schedule-event__container">
          <div class="ab-schedule-event__container__title">${timeblock.task.toUpperCase()}</div>
          <div class="ab-schedule-event__container__time">${this.calculateAmountOfBookedTimePerBlock(timeblock)}</div>
        </div
        `
        newDiv.innerHTML = innerHTML;

      }
      // Insert the new div into the event container
      validEventDiv.appendChild(newDiv);
    } else {
      console.error("No valid eventDiv found for positionArray:", positionArray);
    }
  }

  convertDateStringToDate = (date: string): Date => {
    const parts = date.split('-');
    const month = parts[1];
    const day = parts[2];
    const year = parts[3];

    const formattedDateString = `${month} ${day}, ${year}`;
    const dateObject = new Date(formattedDateString);

    return dateObject;
  }

  calculateWeekDates(): void {
    const currentDayIndex = this.date.getDay(); // 0 (Sunday) to 6 (Saturday)
    const startOfWeek = new Date(this.date);
    startOfWeek.setDate(this.date.getDate() - currentDayIndex);

    this.weekDayDates = this.daysOfTheWeek.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date.getDate();
    });
  }

  getDay(day: string): number {
    const dayIndex = this.daysOfTheWeek.indexOf(day);
    return this.weekDayDates[dayIndex];
  }


  receiveTileData = (data: any) => {
    this.taskEvent.emit(data);
    // need to pump this into the dialog
  }
}
