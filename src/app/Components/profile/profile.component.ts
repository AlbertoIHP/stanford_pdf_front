import { Component, OnInit } from '@angular/core';
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'
import { Router } from '@angular/router'


//Profile data model
import { ProjectService } from '../../Services/Project.service'
import { ExperienceService } from '../../Services/Experience.service'
import { PupilService } from '../../Services/Pupil.service'
import { MeetService } from '../../Services/Meet.service'
import { UserService } from '../../Services/User.service'
import { CompanyUserService } from '../../Services/CompanyUser.service'
import { CalendarUserService } from '../../Services/CalendarUser.service'
import { EventService } from '../../Services/Event.service'


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public currentUser: any
  public userToShow: any





  public isSpanish

  constructor(
    public auth: AuthenticationService,
    public events : EventHandler,
    public router: Router,
    public projectService: ProjectService,
    public experienceService: ExperienceService,
    public pupilService: PupilService,
    public meetService: MeetService,
    public userService: UserService,
    public companyUserService: CompanyUserService,
    public eventService: EventService,
    public calendarUserService: CalendarUserService )
  {


    this.isSpanish = this.events.isSpanish
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })
    
    if( !localStorage.getItem('currentUser') )
    {
      this.auth.logout()
      this.events.singOut()
      this.router.navigate(['login'])
    }
    else
    {
      this.currentUser = JSON.parse( localStorage.getItem('currentUser') )
      this.events.singIn()

      localStorage.getItem('userToShow') ? this.userToShow = JSON.parse(localStorage.getItem('userToShow')) : this.userToShow = this.currentUser

      console.log( this.userToShow )


   



    }

    this.events.transmition.subscribe( data => {
      data.userToShow ? this.userToShow = data.userToShow :  console.log("I heard the event, but i'm not have anything to do with it. Im Profile component")
    })
  }

  ngOnInit()
  {
  }


  ngOnDestroy()
  {
    console.log("ME DESTRUYEN!!")
    localStorage.removeItem('userToShow')
  }


}
