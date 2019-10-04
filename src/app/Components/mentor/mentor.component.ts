import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'
import { PupilService } from '../../Services/Pupil.service'
import { UserService } from '../../Services/User.service'

import { ChatService } from '../../Services/Chat.service'
import { MessageService } from '../../Services/Message.service'
import { Router } from '@angular/router'



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
  selector: 'app-mentor',
  templateUrl: './mentor.component.html',
  styleUrls: ['./mentor.component.css']
})
export class MentorComponent implements OnInit {


  public currentUser: any
  public pupilList: any
  public users: any
  public backup: any

  //Step 2 datatables: We initialize local variables for use in the dynamic data transfer
  exampleDatabase;
  public searchByName: string
  public dataLoaded: boolean
  selection = new SelectionModel<string>(true, []);
  dataSource: ExampleDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  displayedColumns = ['Acciones', 'Picture', 'Email', 'Name', "Description" ];



  //Step 3 datatables: We initialize an datasource for display an empty table while the data is fetching
  ngOnInit()
  {
    this.setDataBase([])
  }


  //Step 4 datatables: We make the fetch and then we build a new datasource but this time with the info that we bring from the server
    public refreshPupils() : void
    {
        this.pupilService.index( ).subscribe( data => {
          let pupilsList = data._embedded.pupils.filter( pupil => parseInt( pupil.user_id1 ) === parseInt(this.currentUser.id) || parseInt( pupil.user_id ) === parseInt(this.currentUser.id) )
          console.log(pupilsList)
          this.backup = pupilsList


          for( let i = 0 ; i < pupilsList.length ; i ++ )
          {
            this.userService.show( pupilsList[i].user_id ).subscribe( data => {
              pupilsList[i].user_id = data

              this.userService.show( pupilsList[i].user_id1 ).subscribe( data =>{
                pupilsList[i].user_id1 = data
                this.setDataBase( pupilsList )
              })
            })
          }


          this.setDataBase( pupilsList )

        })

    }


  //Step 5 datatables: We create finally the new datasource which is refreshed with the table in the view
  setDataBase( data )
  {
      console.log(data)
      this.exampleDatabase = new ExampleDatabase( data );


      console.log(this.exampleDatabase)

      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, 'Pupil');
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });

  }


  accept( pupilRelation )
  {
    let pupilId = pupilRelation._links.self.href.toString().split('/')[(pupilRelation._links.self.href.toString().split('/').length -1 )]

    let originalUserId = pupilRelation.user_id._links.self.href.toString().split('/')[ ( pupilRelation.user_id._links.self.href.toString().split('/').length - 1 ) ]

    let originalUserId1 = pupilRelation.user_id1._links.self.href.toString().split('/')[ ( pupilRelation.user_id1._links.self.href.toString().split('/').length - 1 ) ]


    let pupilCopy = JSON.parse( JSON.stringify( pupilRelation ) )
    pupilCopy.user_id1 = originalUserId1.toString()
    pupilCopy.user_id = originalUserId.toString()
    pupilCopy.isActive = '1'

    console.log(pupilCopy)

    this.pupilService.update( pupilCopy, pupilId ).subscribe( data => {
      console.log(data)
      this.refreshPupils()
    })
  }

  deny( pupilRelation )
  {

    let pupilId = pupilRelation._links.self.href.toString().split('/')[(pupilRelation._links.self.href.toString().split('/').length -1 )]

    let originalUserId = pupilRelation.user_id._links.self.href.toString().split('/')[ ( pupilRelation.user_id._links.self.href.toString().split('/').length - 1 ) ]

    let originalUserId1 = pupilRelation.user_id1._links.self.href.toString().split('/')[ ( pupilRelation.user_id1._links.self.href.toString().split('/').length - 1 ) ]



        this.chatService.index().subscribe( data => {
          let chat = data._embedded.chats.filter( chat => chat.user_id === originalUserId.toString() && chat.user_id1 === originalUserId1.toString() )
          let chatId = chat[0]._links.self.href.split('/')[ (chat[0]._links.self.href.split('/').length - 1) ]
          console.log(chatId)

          this.pupilService.delete( pupilId ).subscribe( data => {

              this.chatService.delete( chatId ).subscribe( data => {
                this.refreshPupils()
              })
          })
        })

  }


  viewMeetings( pupilRelation )
  {
    localStorage.setItem( 'pupilRelation', JSON.stringify(pupilRelation) )
    this.router.navigate(['meetings'])

  }



  viewchat( pupilRelation )
  {
    localStorage.setItem('pupilRelation', JSON.stringify(pupilRelation) )
    this.router.navigate(['seechat'])
  }


  viewProfile( pupilRelation )
  {
    if( this.theyInvitedMe( pupilRelation ) )
    {
     localStorage.setItem('userToShow', JSON.stringify( pupilRelation.user_id ) )
     this.router.navigate(['profile'])
     this.events.transmit( { userToShow: pupilRelation.user_id } )
    }
    else
    {
     localStorage.setItem('userToShow', JSON.stringify( pupilRelation.user_id1 ) )
     this.router.navigate(['profile'])
     this.events.transmit( { userToShow: pupilRelation.user_id1 } )
    }
  }





  theyInvitedMe( pupilRelation )
  {


    if( pupilRelation )
    {

      let pupilId = pupilRelation._links.self.href.toString().split('/')[(pupilRelation._links.self.href.toString().split('/').length -1 )]

      let originalUserId = pupilRelation.user_id._links.self.href.toString().split('/')[ ( pupilRelation.user_id._links.self.href.toString().split('/').length - 1 ) ]

      let originalUserId1 = pupilRelation.user_id1._links.self.href.toString().split('/')[ ( pupilRelation.user_id1._links.self.href.toString().split('/').length - 1 ) ]


      if(  originalUserId1.toString()  === this.currentUser.id  )
      {
        return true
      }
      else if( originalUserId.toString()  === this.currentUser.id  )
      {
        return false
      }
    }





  }



  public isSpanish

  constructor( 
    public messageService: MessageService, 
    public chatService: ChatService, 
    public userService: UserService, 
    public auth: AuthenticationService, 
    public events : EventHandler, 
    public router: Router, 
    public pupilService: PupilService )
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
      this.currentUser.id = this.currentUser.id.toString()
      this.events.singIn()

      setInterval(() => {
         this.refreshPupils()
      }, 15000);


      this.refreshPupils()
    }
  }

}
