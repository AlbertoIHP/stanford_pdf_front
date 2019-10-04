import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Event } from '../../../Models/Event.model'
import { EventService } from '../../../Services/Event.service'
import { EventHandler } from '../../../Services/EventHandler.service'



//CALENDAR
import {
  ChangeDetectionStrategy,
  TemplateRef
} from '@angular/core';
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
import { Subject } from 'rxjs/Subject';

import { CalendarEvent, CalendarMonthViewDay } from 'angular-calendar';



@Component({
  selector: 'app-createnewevent',
  templateUrl: './createnewevent.component.html',
  styleUrls: ['./createnewevent.component.css']
})
export class CreateneweventComponent implements OnInit {
  public calendar: any


  //CALENDAR
  protected viewDate: Date = new Date()
  protected selectedDay: CalendarMonthViewDay
  protected events: CalendarEvent[] = []
  protected fechaSeleccionada = true
  protected dateShowed: any
  public isSpanish

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void
  {
    body.forEach(day => {

      if ( this.selectedDay && day.date.getTime() === this.selectedDay.date.getTime() )
      {
        day.cssClass = 'cal-day-selected';
        this.selectedDay = day;
      }

    });
  }


  dayClicked(day: CalendarMonthViewDay): void
  {
    if (this.selectedDay )
    {
      delete this.selectedDay.cssClass;
    }

    this.selectedDay = day

    if( this.selectedDay.isFuture )
    {
      this.fechaSeleccionada = false
      day.cssClass = 'caca'
      let month

      if( this.selectedDay.date.toString().split(' ')[1] === 'Mar' )
      {
        month = '02'
      }
      else if ( this.selectedDay.date.toString().split(' ')[1] === 'Apr' )
      {
        month = '03'
      }
      else if ( this.selectedDay.date.toString().split(' ')[1] === 'May' )
      {
        month = '04'
      }
      else if ( this.selectedDay.date.toString().split(' ')[1] === 'Jun' )
      {
        month = '05'
      }
      else if ( this.selectedDay.date.toString().split(' ')[1] === 'Jul' )
      {
        month = '06'
      }
      else if ( this.selectedDay.date.toString().split(' ')[1] === 'Aug' )
      {
        month = '07'
      }
      else if ( this.selectedDay.date.toString().split(' ')[1] === 'Sep' )
      {
        month = '08'
      }
      else if ( this.selectedDay.date.toString().split(' ')[1] === 'Oct' )
      {
        month = '09'
      }
      else if ( this.selectedDay.date.toString().split(' ')[1] === 'Nov' )
      {
        month = '10'
      }
      else if ( this.selectedDay.date.toString().split(' ')[1] === 'Dec' )
      {
        month = '11'
      }
      else if ( this.selectedDay.date.toString().split(' ')[1] === 'Jan' )
      {
        month = '00'
      }
      else if ( this.selectedDay.date.toString().split(' ')[1] === 'Feb' )
      {
        month = '01'
      }






      this.newEvent.date = this.selectedDay.date.toString().split(' ')[3]+'/'+month+'/'+this.selectedDay.date.toString().split(' ')[2]
      console.log(day)
      console.log(this.newEvent)

    }
    else
    {
      alert("Can not select past date")
    }

  }











  public currentUser: any
  public newEvent: any
  public isFormComplete: any

  //Image Uploading
  public acceptedMimeTypes = [
    'image/jpeg',
    'image/png' ]

  @ViewChild('fileInput') fileInput: ElementRef;
  public fileDataUri : string | ArrayBuffer= '';
  public errorMsg = '';



  constructor(
    public dialogRef: MatDialogRef<CreateneweventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public eventService: EventService,
    public ev: EventHandler
    )
  {

    this.isSpanish = this.ev.isSpanish
    this.ev.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })




    console.log(data)
    this.isFormComplete = false
    this.currentUser = data.currentUser
    this.calendar = data.calendar
    let idCalendar = this.calendar._links.self.href.split('/')[ ( this.calendar._links.self.href.split('/').length - 1 ) ]


    this.newEvent = new Event()
    this.newEvent.calendar_id = idCalendar

  }



  // Image Uploading
  previewFile()
  {
    const file = this.fileInput.nativeElement.files[0];
    if (file && this.validateFile(file))
    {

      const reader = new FileReader();
      reader.readAsDataURL(this.fileInput.nativeElement.files[0]);
      reader.onload = () => {

        this.fileDataUri = reader.result;
        this.newEvent.picture = this.fileDataUri
        console.log(this.fileDataUri)
      }
    }
    else
    {
      this.errorMsg = 'File must be jpg or png and cannot be exceed 50 MB in size'
    }
  }


    validateFile(file)
  {
    return this.acceptedMimeTypes.includes(file.type) && file.size < 500000000;
  }


  verifyInformation()
  {
    if( this.newEvent.name != '' && this.newEvent.description != '' )
    {
      this.isFormComplete = true
    }
    else
    {
      this.isFormComplete = false
    }
  }


  createEvent()
  {
    console.log( this.newEvent )
    let event = this.newEvent

    this.eventService.store( event ).subscribe( data => {
      this.ev.madeChange()
      this.dialogRef.close()
    })
  }

  ngOnInit()
  {
  }

}
