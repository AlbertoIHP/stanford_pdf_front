import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'
import { PupilService } from '../../Services/Pupil.service'
import { UserService } from '../../Services/User.service'
import { MeetService } from '../../Services/Meet.service'
import { Router } from '@angular/router'
import { Chat } from '../../Models/Chat.model'
import { ChatService } from '../../Services/Chat.service'

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

//Child components
import { AddmeetingComponent } from './addmeeting/addmeeting.component'



//Step 1 datatables: We import all dependencies peers to dispaly a fully datatable component
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import { ExampleDatabase, ExampleDataSource } from '../../Services/Datasource.service';


@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {


  public currentUser: any
  public backup: any
  public pupilRelation: any
  public pupilsList: any
  public choosedMentor: any


  //Step 2 datatables: We initialize local variables for use in the dynamic data transfer
  exampleDatabase;
  public searchByName: string
  public dataLoaded: boolean
  selection = new SelectionModel<string>(true, []);
  dataSource: ExampleDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  displayedColumns = ['Actions', 'Name', 'Description', 'Videconference', 'Date', "User", 'Concreted' ];







  //Step 3 datatables: We initialize an datasource for display an empty table while the data is fetching
  ngOnInit()
  {
    this.setDataBase([])
  }


  //Step 4 datatables: We make the fetch and then we build a new datasource but this time with the info that we bring from the server
  refreshMeetings()
  {
    let meetingsList = []

    let currentPupilId = this.pupilRelation._links.self.href.split('/')[ ( this.pupilRelation._links.self.href.split('/').length - 1 ) ]
    let userToMeet = this.pupilRelation.user_id.username === this.currentUser.username ? this.pupilRelation.user_id1 : this.pupilRelation.user_id

      console.log(this.pupilRelation)
      console.log("This is the user to meet")
      console.log(userToMeet)

      this.meetService.index().subscribe( data => {

        let currentPupilsMeets = data._embedded.meets.filter( meeting => meeting.pupil_id === currentPupilId.toString()  )

        for( let j = 0 ; j < currentPupilsMeets.length ; j ++)
        {
          currentPupilsMeets[j].userToMeet = userToMeet
        }

        meetingsList = meetingsList.concat(currentPupilsMeets)

        console.log( meetingsList )
        this.setDataBase( meetingsList )
       })


  }


  deny( meet )
  {
    let meetId = meet._links.self.href.split('/')[ ( meet._links.self.href.split('/').length -1  ) ]
    console.log(meetId)
    this.meetService.delete( meetId ).subscribe( data => {

      this.chatService.index().subscribe( chats => {
        chats = chats._embedded.chats
        chats = chats.filter( chat => chat.meet_id === meetId )

        if( chats.length >= 1 )
        {
          let meetChatId = chats[0]._links.self.href.split('/')[ ( chats[0]._links.self.href.split('/').length - 1 ) ]
          this.chatService.delete( meetChatId ).subscribe( data => {
            console.log(data)
          })
        }

      })

      this.refresh()
    })
  }


  accept( meet )
  {
    let meetId = meet._links.self.href.split('/')[ ( meet._links.self.href.split('/').length -1  ) ]
    let copy = JSON.parse( JSON.stringify( meet ) )
    copy.isactive = '1'
    delete copy.userToMeet
    this.meetService.update( copy, meetId).subscribe( data => {
      console.log(data)
      this.refresh()
    })
  }


  goMeeting( meet )
  {
    localStorage.setItem('meet', JSON.stringify( meet ) )
    this.router.navigate(['seemeeting'])

  }


  refreshMeetingsFromPupils()
  {

    let meetingsList = []

    this.pupilService.index().subscribe( data => {
      let currentUserPupilsRelation = data._embedded.pupils.filter( pupil => pupil.user_id === this.currentUser.id.toString()  || pupil.user_id1 === this.currentUser.id.toString() )
      console.log(currentUserPupilsRelation)
      this.pupilsList = currentUserPupilsRelation

      //For each one of the pupils relation wi will search meetings
      for( let i = 0 ; i < currentUserPupilsRelation.length ; i++ )
      {
        let currentPupilId = currentUserPupilsRelation[i]._links.self.href.split('/')[ ( currentUserPupilsRelation[i]._links.self.href.split('/').length - 1 ) ]

        let userToMeet = this.currentUser.id.toString() === currentUserPupilsRelation[i].user_id ? currentUserPupilsRelation[i].user_id1 : currentUserPupilsRelation[i].user_id

        console.log("The current ID of this pupil relation is: "+currentPupilId)

        this.userService.show(userToMeet).subscribe( data => {
          console.log("the user to meet is")
          userToMeet = data
          console.log(userToMeet)

          this.meetService.index().subscribe( data => {
            let currentPupilsMeets = data._embedded.meets.filter( meeting => meeting.pupil_id === currentPupilId.toString()  )

            for( let j = 0 ; j < currentPupilsMeets.length ; j ++)
            {
              currentPupilsMeets[j].userToMeet = userToMeet
            }

            meetingsList = meetingsList.concat(currentPupilsMeets)

            console.log( meetingsList )
            this.setDataBase( meetingsList )
          })
        })
      }
    })


    //Dont know why it just stop working, commenting it, works...
    //console.log( meetingsList )
    //this.setDataBase(meetingsList)
  }


  //Step 5 datatables: We create finally the new datasource which is refreshed with the table in the view
  setDataBase( data )
  {
      this.exampleDatabase = new ExampleDatabase( data );


      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, 'Meeting');
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });

  }

  public isSpanish


  constructor(
    public meetService: MeetService,
    public userService: UserService,
    public auth: AuthenticationService,
    public events : EventHandler,
    public router: Router,
    public pupilService: PupilService,
    public dialog: MatDialog,
    public chatService: ChatService )
  {


    this.isSpanish = this.events.isSpanish
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })

    this.pupilRelation = null
    this.pupilsList = null


    if( !localStorage.getItem('currentUser') )
    {
      this.auth.logout()
      this.events.singOut()
      this.router.navigate(['login'])
    }
    else
    {
      this.currentUser = JSON.parse( localStorage.getItem('currentUser') )
      //.currentUser.id = this.currentUser.id.toString()
      this.events.singIn()

      localStorage.getItem('pupilRelation') ? this.pupilRelation = JSON.parse( localStorage.getItem('pupilRelation') ) : this.pupilRelation = null
      setInterval(() => {
         this.refresh()
      }, 15000);

      this.refresh()

      this.events.hasModified.subscribe( data => {
        this.refresh()
      })


    }
  }

  refresh()
  {
      //If we come here with the relation of pupil previously seted we can just bring the whole list of meetings
      if( this.pupilRelation )
      {
        this.choosedMentor = this.pupilRelation.user_id.username === this.currentUser.username ? this.pupilRelation.user_id1.username : this.pupilRelation.user_id.username
        console.log("If we come here with the relation of pupil previously seted we can just bring the whole list of meetings")
        this.refreshMeetings()
      }
      else
      {
        this.choosedMentor = false
        //If dont, so we have to brings the whole pupils list, filter which one at least the current user appears one time, then brings the whole list of meetengs for each one of those pupils relation, and list it
        console.log("If dont, so we have to brings the whole pupils list, filter which one at least the current user appears one time, then brings the whole list of meetengs for each one of those pupils relation, and list it")
        this.refreshMeetingsFromPupils()
      }

  }


  viewProfile( user )
  {
    console.log(user)
     localStorage.setItem('userToShow', JSON.stringify(user) )
     this.router.navigate(['profile'])
     this.events.transmit( { userToShow: user } )
  }



  openAddMeeting()
  {
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )

    let pupilRelationCopy = JSON.parse( JSON.stringify( this.pupilRelation ) )
    let pupilsListCopy = JSON.parse( JSON.stringify( this.pupilsList ) )

    let dialogRef = this.dialog.open( AddmeetingComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy,
       pupilRelation: pupilRelationCopy,
       pupilsList: pupilsListCopy
      }
    });
  }



  ngOnDestroy()
  {
    console.log("ME DESTRUYO")
    localStorage.removeItem('pupilRelation')
  }

}
