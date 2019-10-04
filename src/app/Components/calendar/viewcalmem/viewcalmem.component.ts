import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Calendar } from '../../../Models/Calendar.model'
import { CalendarUser } from '../../../Models/CalendarUser.model'
import { CalendarService } from '../../../Services/Calendar.service'
import { CalendarUserService } from '../../../Services/CalendarUser.service'
import { UserService } from '../../../Services/User.service'
import { EventHandler } from '../../../Services/EventHandler.service'

@Component({
  selector: 'app-viewcalmem',
  templateUrl: './viewcalmem.component.html',
  styleUrls: ['./viewcalmem.component.css']
})
export class ViewcalmemComponent implements OnInit {
  public currentUser: any
  public choosedUsers: any
  public calendar: any
  public isSpanish



  constructor(
    public dialogRef: MatDialogRef<ViewcalmemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public calendarService: CalendarService,
    public calendarUserService: CalendarUserService,
    public userService: UserService,
    public events: EventHandler
    )
  {


    this.isSpanish = this.events.isSpanish
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })

    console.log(data)
    this.currentUser = data.currentUser
    this.calendar = data.calendar
    this.choosedUsers = []
    this.getUsers()
  }


  getUsers()
  {
    console.log( this.calendar )
    let disId = this.calendar._links.self.href.split('/')[ ( this.calendar._links.self.href.split('/').length -1 ) ]

    this.calendarUserService.index().subscribe( data => {
      data = data._embedded.calendarusers

      let relations = data.filter( relation => relation.calendar_id === disId.toString() )

      for ( let rel of relations )
      {
        this.userService.show( rel.user_id ).subscribe( data => {
          data.username != this.currentUser.username ? this.choosedUsers.push( data ) : null
        })
      }


    })


  }

  ngOnInit()
  {
  }

}

