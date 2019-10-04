import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'
import { PupilService } from '../../Services/Pupil.service'
import { UserService } from '../../Services/User.service'

import { Router } from '@angular/router'


import { ChatService } from '../../Services/Chat.service'
import { MessageService } from '../../Services/Message.service'



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
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {


  public currentUser: any
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
  displayedColumns = ['Acciones', 'Name', 'User' ];

  //Step 3 datatables: We initialize an datasource for display an empty table while the data is fetching
  ngOnInit()
  {
    this.setDataBase([])
  }


  //Step 4 datatables: We make the fetch and then we build a new datasource but this time with the info that we bring from the server
    public refreshChats() : void
    {
        this.chatService.index( ).subscribe( data => {
          let chatList = data._embedded.chats.filter( pupil => parseInt( pupil.user_id1 ) === parseInt(this.currentUser.id) || parseInt( pupil.user_id ) === parseInt(this.currentUser.id) )
          console.log(chatList)
          this.backup = chatList


          for( let i = 0 ; i < chatList.length ; i ++ )
          {
            this.userService.show( chatList[i].user_id ).subscribe( data => {
              chatList[i].user_id = data

              this.userService.show( chatList[i].user_id1 ).subscribe( data =>{
                chatList[i].user_id1 = data
                this.setDataBase( chatList )
              })
            })
          }


          this.setDataBase( chatList )

        })

    }


  //Step 5 datatables: We create finally the new datasource which is refreshed with the table in the view
  setDataBase( data )
  {
      console.log(data)
      this.exampleDatabase = new ExampleDatabase( data );


      console.log(this.exampleDatabase)

      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, 'Chat');
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });

  }



  viewchat( chatRelation )
  {
    console.log( chatRelation )
    localStorage.setItem('chatRelation', JSON.stringify(chatRelation) )
    this.router.navigate(['seechat'])
  }


  viewProfile( chatRelation )
  {

    let destinyUser = chatRelation.user_id.username === this.currentUser.username ? chatRelation.user_id1 : chatRelation.user_id


    console.log( destinyUser )
     localStorage.setItem('userToShow', JSON.stringify( destinyUser ) )
     this.router.navigate(['profile'])
     this.events.transmit( { userToShow: destinyUser } )
  }

  public isSpanish
  constructor( 
    public messageService: MessageService, 
    public chatService: ChatService, 
    public userService: UserService, 
    public auth: AuthenticationService, 
    public events : EventHandler, 
    public router: Router )
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
      // setInterval(() => {
      //    this.refreshChats()
      // }, 15000);

      this.refreshChats()
    }
  }



}
