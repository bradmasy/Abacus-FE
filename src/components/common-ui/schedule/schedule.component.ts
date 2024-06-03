import { Component, EventEmitter, Input, OnInit, Output, WritableSignal, signal } from '@angular/core';

enum ScheduleState {
  calendar = "calendar",
  day = "day"
}

@Component({
  selector: 'ab-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  @Input() date!: Date;

  @Output() taskEvent: EventEmitter<{ [key: string]: string | number }>;


  public formattedDate!: string;
  public state: WritableSignal<ScheduleState> = signal(ScheduleState.day);
  public hoursArray: number[] = Array.from({ length: 24 }, (_, i) => i); // Creates an array [0, 1, 2, ..., 23]
  public daysOfTheWeek: string[] = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  public months: string[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT", "OCT", "NOV", "DEC"];
  public weekDayDates: number[] = [];
  public currentMonth!: string;
  public currentDay!: string;


  constructor() {
    this.taskEvent = new EventEmitter<{ [key: string]: string | number }>();
  }

  ngOnInit(): void {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    this.formattedDate = this.date.toLocaleDateString('en-US', options);
    this.currentMonth = this.months[this.date.getMonth()];

    this.calculateWeekDates();
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
