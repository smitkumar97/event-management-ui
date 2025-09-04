import { Component, Input, SimpleChanges } from '@angular/core';
import { DateAdapter, provideCalendar, CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective, CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent, CalendarEvent, CalendarView, CalendarDatePipe, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import {
  isSameDay,
  isSameMonth
} from 'date-fns';
import { CommonModule } from '@angular/common';
import { EventData } from '../../models/event.model';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, MatButtonModule, MatIconModule, CalendarPreviousViewDirective, CalendarTodayDirective, CalendarNextViewDirective, CalendarMonthViewComponent, CalendarWeekViewComponent, CalendarDayViewComponent, CalendarDatePipe],
  providers: [
    provideCalendar({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar {
  @Input() eventData: any[] = [];

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  activeDayIsOpen = true;
  events: CalendarEvent[] = [];

  constructor(private router: Router) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventData']) {
      this.mapEvents();
    }
  }

  private mapEvents(): void {
    this.events = this.eventData.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.date),
      color: { primary: '#1e90ff', secondary: '#D1E8FF' },
      meta: event
    }));
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    if (action === 'Clicked') {
      this.router.navigate(['./event', event.id]);
    }
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter(e => e !== eventToDelete);
    let stored = JSON.parse(localStorage.getItem('eventList') || '[]');
    stored = stored.filter((e: EventData) => e.id !== eventToDelete.id);
    localStorage.setItem('eventList', JSON.stringify(stored));
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
  }
}
