import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, Signal, ViewChildren, WritableSignal, signal } from '@angular/core';
import { TimeBlock } from '../../partials/schedule-partial/schedule-partial.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { ScheduleTileComponent } from '../tiles/schedule-tile/schedule-tile.component';

enum ScheduleState {
  calendar = "calendar",
  day = "day"
}

const REMOVE_TIMEZONE = -11;
const REMOVE_MINUTES = -6;

@Component({
  selector: 'ab-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  @Input() date!: Date;
  @Input() timeBlocksSubject!: Subject<TimeBlock[]>;

  @Output() taskEvent: EventEmitter<{ [key: string]: string | number }>;

  @ViewChildren('tile') scheduleTiles!: QueryList<ScheduleTileComponent>;
    
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
  }

  // ngAfterViewInit(): void {
  //   console.log(this.scheduleTiles)

  //   const mappedScheduleTiles = this.scheduleTiles.reduce((acc: { [key: string]: ScheduleTileComponent }, tile: ScheduleTileComponent) => {
  //     acc[tile.id] = tile;
  //     return acc;
  //   }, {});


  //   // if (this.scheduleTiles) {
  //   //   this.scheduleTiles.forEach((tile) => {
  //   //     console.log(tile.id)
  //   //   })
  //   // }
  // }



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
      this.timeBlocks = data
      this.timeBlocksUpdateSubject.next(this.timeBlocks);// Dispatch signal when timeBlocks are updated

      const mappedScheduleTiles = this.scheduleTiles.reduce((acc: { [key: string]: ScheduleTileComponent }, tile: ScheduleTileComponent) => {
        acc[tile.id] = tile;

        return acc;
      }, {} as { [key: string]: ScheduleTileComponent });

      console.log(this.timeBlocks)
      const timeBlockStartEndTimes = this.timeBlocks.map((block) => {
        return {
          start: block.startTime,
          end: block.endTime,
        }
      })

      const timeBlockStartTimes = this.timeBlocks.map((block) => block.startTime)
      const mappedTileKeys = Object.keys(mappedScheduleTiles);
      const filteredBlocks: ScheduleTileComponent[] = [];

      let inRange = false;
      for (let i = 0; i < timeBlockStartEndTimes.length; i++) {

        const timeBlockStartId = timeBlockStartEndTimes[i].start.toString().slice(0, REMOVE_MINUTES);
        const timeBlockEndId = timeBlockStartEndTimes[i].end.toString().slice(0, REMOVE_MINUTES);

        console.log(timeBlockEndId)

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



      filteredBlocks.forEach((eachBlock) => {
        console.log(eachBlock)
        // eachBlock.
        eachBlock.enabled = true;

      })

      timeBlockStartEndTimes.forEach((eachTimeBlock) => {

        const start = new Date(eachTimeBlock.start);
        const end = new Date(eachTimeBlock.end);

        filteredBlocks.forEach((eachBlock) => {

          // const filteredQuarters = eachBlock.quarterHourBlockIds.filter((quarter) => {

          //   const formattedQuarter = quarter.slice(0, REMOVE_MINUTES + 1);
          //   const convertedDateTime = new Date(formattedQuarter);
  
          //   if (convertedDateTime >= start && convertedDateTime < end) {
          //     console.log(quarter); // Debugging log
          //     return true;
          //   }
          //   return false;
          // });

          // console.log(filteredQuarters);

          
          eachBlock.quarterHourBlockIds.forEach((quarter) => {
            const formattedQuarter = quarter.slice(0, REMOVE_MINUTES + 1);
            const convertedDateTime = new Date(formattedQuarter);
    

            if(convertedDateTime >= start && convertedDateTime < end){
              
              console.log(quarter)
              eachBlock.setBookedBlock(quarter);
            } 
          })

          eachBlock.enabled = true;
        });
      });
    });



    this.timeBlocksUpdateSubject.subscribe((blocks) => {
      // console.log('TIME BLOCKS')
      // console.log(blocks);
    })
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
    console.log(data)
    console.log('hello')
    this.taskEvent.emit(data);
    // need to pump this into the dialog
  }
}
