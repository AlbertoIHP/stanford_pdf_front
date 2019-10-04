import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'
import { UserService } from '../../Services/User.service'
import { Router } from '@angular/router'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
  selector: 'app-pendingusers',
  templateUrl: './pendingusers.component.html',
  styleUrls: ['./pendingusers.component.css']
})
export class PendingusersComponent implements OnInit {
  public currentUser: any
  public userList: any

  //Step 2 datatables: We initialize local variables for use in the dynamic data transfer
  exampleDatabase;
  public searchByName: string
  public dataLoaded: boolean
  selection = new SelectionModel<string>(true, []);
  dataSource: ExampleDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  displayedColumns = ['Acciones', 'Picture', 'Email', 'Description', 'Role' ];

  //Step 3 datatables: We initialize an datasource for display an empty table while the data is fetching
  ngOnInit()
  {
    this.setDataBase([])
  }


  //Step 4 datatables: We make the fetch and then we build a new datasource but this time with the info that we bring from the server
    public refreshUsers() : void
    {

      this.userService.index().subscribe( data => {
        let users = data._embedded.users

        this.userList = users.filter( user => user.isActive === '0' )
        this.setDataBase( this.userList )

      })

    }


  //Step 5 datatables: We create finally the new datasource which is refreshed with the table in the view
  setDataBase( data )
  {
      console.log(data)
      this.exampleDatabase = new ExampleDatabase( data );


      console.log(this.exampleDatabase)

      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, 'Pending');
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });

  }

  accept( user )
  {
     let userId = user._links.self.href.split('/')[ (user._links.self.href.split('/').length - 1 ) ]
     user.isActive = '1'
     this.userService.update( user, userId ).subscribe( data => {
       console.log(data)
       this.refreshUsers()
     })
  }


  delete( user )
  {

     let userId = user._links.self.href.split('/')[ (user._links.self.href.split('/').length - 1 ) ]
     this.userService.delete( userId ).subscribe( data => {
       console.log( data   )
       this.refreshUsers()
     })

  }


  public isSpanish

  constructor(
    public dialog: MatDialog,
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
      this.refreshUsers()



      setInterval(() => {
         this.refreshUsers()
      }, 15000);

      this.events.hasModified.subscribe( data => {
        this.refreshUsers()
      })
    }
  }



}
