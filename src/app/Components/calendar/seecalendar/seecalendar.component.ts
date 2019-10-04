import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Calendar } from '../../../Models/Calendar.model'
import { CalendarService } from '../../../Services/Calendar.service'
import { EventService } from '../../../Services/Event.service'
import { EventHandler } from '../../../Services/EventHandler.service'

//CALENDAR
import { ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

@Component({
  selector: 'app-seecalendar',
  templateUrl: './seecalendar.component.html',
  styleUrls: ['./seecalendar.component.css']
})
export class SeecalendarComponent  {
  public currentUser: any
  public calendar: any
  public eventList: any
  public loadedDates = false

  //CALENDAR
  public view: string = 'month';
  public refresh: Subject<any> = new Subject();
  public activeDayIsOpen: boolean = false;
  public viewDate: Date = new Date();
  public events: CalendarEvent[] = [];

  public isSpanish

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    //this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  cancelViewedDay()
  {
    this.activeDayIsOpen = false
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void
  {
    if (isSameMonth(date, this.viewDate))
    {
      if ( (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0 )
      {
        this.activeDayIsOpen = false;
      }
      else
      {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  constructor(
    public dialogRef: MatDialogRef<SeecalendarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public calendarService: CalendarService,
    public eventService: EventService,
    public ev: EventHandler
    )
  {
    this.isSpanish = this.ev.isSpanish
    this.ev.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })


    this.currentUser = data.currentUser
    this.calendar = data.calendar

    this.eventService.index().subscribe( data => {
      data = data._embedded.events
      let calendarId = this.calendar._links.self.href.split('/')[ ( this.calendar._links.self.href.split('/').length - 1 ) ]
      data = data.filter( u => u.calendar_id === calendarId )
      this.eventList = data

      for( let ev of this.eventList )
        {

          let year = ev.date.split('/')[0]
          let month = ev.date.split('/')[1]
          let day = ev.date.split('/')[2]

          this.events.push(
                    {
                      title: ev.name+' - '+ev.description+' ('+ev.date+')',
                      color:  {
                        primary: '#e3bc08',
                        secondary: '#FDF1BA'
                      },
                      start: new Date(year, month, day)
                    }
            )
        }


        this.loadedDates = true


    })

  }




}
