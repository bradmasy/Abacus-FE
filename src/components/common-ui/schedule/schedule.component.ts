import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Query, QueryList, Signal, SimpleChanges, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation, WritableSignal, inject, signal } from '@angular/core';
import { TimeBlock } from '../../partials/schedule-partial/schedule-partial.component';
import { BehaviorSubject, Subject, take } from 'rxjs';
import { ScheduleTileComponent } from '../tiles/schedule-tile/schedule-tile.component';
import { ScheduleService } from '../../../services/schedule/schedule.service';
import { EventDirective } from './event/event.directive';
import { NavBarTypes } from '../menu/navigation-bar/navigation-bar.component';
import * as _ from 'lodash';

enum ScheduleState {
  calendar = "calendar",
  day = "day"
}

export interface PositionData {
  top: number;
  left: number;
  event: EventDirective | undefined;
}
const REMOVE_TIMEZONE = -11;
const REMOVE_MINUTES = -6;

@Component({
  selector: 'ab-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})

export class ScheduleComponent implements OnInit {

  @Input() date!: WritableSignal<Date>;
  @Input() timeBlocksSubject!: Subject<TimeBlock[]>;
  @Input() resetEmitSignal!: WritableSignal<Date>;

  @Output() taskEvent: EventEmitter<{ [key: string]: string | number }>;
  @Output() dateChangeEvent: EventEmitter<Date>;

  @ViewChild('weeklyTotal') weeklyTotal!: ElementRef;

  @ViewChildren('tile') scheduleTiles!: QueryList<ScheduleTileComponent>;
  @ViewChildren('event') events!: QueryList<HTMLDivElement>;
  @ViewChildren(EventDirective) eventDirectives!: QueryList<EventDirective>;
  @ViewChildren('timeBlockContainer') timeBlocksContainers!: QueryList<ElementRef>;
  @ViewChildren('totalTime') totalTimes!: QueryList<ElementRef>;

  public formattedDate!: string;
  public state: WritableSignal<ScheduleState> = signal(ScheduleState.day);
  public hoursArray: number[] = Array.from({ length: 24 }, (_, i) => i); // Creates an array [0, 1, 2, ..., 23]
  public daysOfTheWeek: string[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  public months: string[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
  public weekDayDates: Date[] = [];
  public currentMonth!: string;
  public currentDay!: string;
  public year!: number;
  public timeBlocksUpdateSubject: BehaviorSubject<TimeBlock[]> = new BehaviorSubject<TimeBlock[]>([]);
  public timeBlocks: TimeBlock[] = [];
  public loaded: boolean = false;
  public navBarInputs = [
    {
      link: "Views",
      type: NavBarTypes.Dropdown,
      selectOptions: [{
        link: 'Day',
        value: 'day-view'
      }, {
        link: 'Calendar',
        value: 'calendar-view'
      }]
    },
    {
      link: "Preferences",
      type: NavBarTypes.Link,

    }
  ]
  public options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  public scheduleTileDateSignals: WritableSignal<Date>[] = [];
  private scheduleService: ScheduleService = inject(ScheduleService);

  constructor(private viewContainerRef: ViewContainerRef
  ) {
    this.taskEvent = new EventEmitter<{ [key: string]: string | number }>();
    this.dateChangeEvent = new EventEmitter<Date>();
  }

  ngOnInit(): void {
    this.createSchedule();
  }

  createSchedule() {
    this.scheduleService.resetTimes();
    this.formattedDate = this.date().toLocaleDateString('en-US', this.options);
    this.year = this.date().getFullYear();
    this.currentMonth = this.months[this.date().getMonth()];

    this.calculateWeekDates();
    this.getTimeBlocks();
  }

  getTimeBlocks() {
    this.loaded = true;

    this.timeBlocksSubject
      .pipe(take(1))
      .subscribe((data) => {
        this.timeBlocks = data
        this.timeBlocksUpdateSubject.next(this.timeBlocks);// Dispatch signal when timeBlocks are updated
        this.scheduleService.calculateTimes(this.timeBlocks, this.totalTimes, this.weeklyTotal)

        const mappedScheduleTiles = this.scheduleTiles.reduce((acc: { [key: string]: ScheduleTileComponent }, tile: ScheduleTileComponent) => {
          acc[tile.id] = tile;

          return acc;
        }, {} as { [key: string]: ScheduleTileComponent });

        const mappedTileKeys = Object.keys(mappedScheduleTiles);
        const filteredBlocks: ScheduleTileComponent[] = [];

        let inRange = false;

        for (let i = 0; i < this.timeBlocks.length; i++) {

          const timeBlockStartId = this.timeBlocks[i].startTime.toString().slice(0, REMOVE_MINUTES);
          const timeBlockEndId = this.timeBlocks[i].endTime.toString().slice(0, REMOVE_MINUTES);

          for (let j = 0; j < mappedTileKeys.length; j++) {

            const mappedKey = mappedTileKeys[j].slice(0, REMOVE_TIMEZONE);

            if (mappedKey === timeBlockEndId && !inRange) {
              filteredBlocks.push(mappedScheduleTiles[mappedTileKeys[j]]);
              break;
            }

            if (mappedKey === timeBlockStartId) {
              inRange = true;
            }

            if (mappedKey === timeBlockEndId) {
              inRange = false;
            }

            if (inRange) {
              filteredBlocks.push(mappedScheduleTiles[mappedTileKeys[j]]);
            }
          }
        }


        this.timeBlocks.forEach((eachTimeBlock) => {

          const start = new Date(eachTimeBlock.startTime);
          const end = new Date(eachTimeBlock.endTime);

          const positionData: PositionData[] = [];
          filteredBlocks.forEach((eachBlock) => {
            // console.log(eachBlock)
            eachBlock.quarterHourBlockIds.forEach((quarter, index) => {
              console.log(quarter)
              const formattedQuarter = quarter.slice(0, REMOVE_MINUTES + 1);
              const convertedDateTime = new Date(formattedQuarter);
              if (convertedDateTime >= start && convertedDateTime < end) {
                console.log(start);
                console.log(end);
                console.log(convertedDateTime)
                console.log(eachBlock)
                const splitQuarter = quarter.split('-');
                const dayNumber = splitQuarter[2].split('T')[0];

                const idIndex = this.weekDayDates.findIndex((e) => {
                  const eachDateNum = e.toDateString().split(' ')[2]
                  return parseInt(eachDateNum) === parseInt(dayNumber)
                });

                const eventContainer = this.eventDirectives.get(idIndex);
                // this is the location of each block
                const locationForDiv = eachBlock.getPosition();

                const mergedLocationEventObject = {
                  top: locationForDiv['top'] + (index * 50), // to represent each block, there are 4 quarterblocks each at 50px
                  left: locationForDiv['left'],
                  event: eventContainer
                }

                const isDuplicateEntry = positionData.some((pos) => this.isDuplicate(pos, mergedLocationEventObject));

                if (!isDuplicateEntry) {
                  positionData.push(mergedLocationEventObject);
                }
              }
            });

          })

          if (positionData.length !== 0) {

            this.scheduleService.createTaskEventTileOnDOM(this.viewContainerRef, positionData, eachTimeBlock)
          }
        });

      });

  }

  isDuplicate(obj1: PositionData, obj2: PositionData): boolean {
    return obj1.top === obj2.top && obj1.left === obj2.left && obj1.event === obj2.event;
  }

  parseQuarterToTopPx(quarter: string): number {
    const splitQuarter = quarter.split('T');
    const splitTimeBlockFromQuarter = splitQuarter[1].split(':');
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


  convertDateStringToDate = (date: string): WritableSignal<Date> => {

    const parts = date.split('-');
    const month = parts[1];
    const day = parts[2];
    const year = parts[3];

    const formattedDateString = `${month} ${day}, ${year}`;
    const dateObject = new Date(formattedDateString);
    const dateSignal = signal(dateObject);
    this.scheduleTileDateSignals.push(dateSignal);

    return dateSignal;
  }

  calculateWeekDates(): void {
    const currentDayIndex = this.date().getDay(); // 0 (Sunday) to 6 (Saturday)
    const startOfWeek = new Date(this.date());
    startOfWeek.setDate(this.date().getDate() - currentDayIndex);

    this.weekDayDates = this.daysOfTheWeek.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  }

  getDay(day: string): string {
    const dayIndex = this.daysOfTheWeek.indexOf(day);
    return this.weekDayDates[dayIndex].toDateString();
  }

  getDateStringArray(day: string): string[] {
    const dayIndex = this.daysOfTheWeek.indexOf(day);
    const dateStr = this.weekDayDates[dayIndex].toDateString();
    return dateStr.split(' ');
  }

  receiveTileData = (data: any) => {
    this.taskEvent.emit(data);
  }

  changeWeek(direction: number) {
    this.date.set(new Date(this.date().getTime()));
    this.date().setDate(this.date().getDate() + direction * 7);
    this.calculateWeekDates();
    this.createSchedule();

    this.notifyScheduleTilesDateChange();

    this.dateChangeEvent.emit(this.date());

  }

  notifyScheduleTilesDateChange() {
    this.scheduleTileDateSignals.forEach((dateSig) => {
      dateSig.set(this.date());
    })

  }
  destroyEvents() {

  }

}
