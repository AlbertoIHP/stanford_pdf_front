import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'
import { CompanyUserService } from '../../Services/CompanyUser.service'
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
  selector: 'app-workers',
  templateUrl: './workers.component.html',
  styleUrls: ['./workers.component.css']
})
export class WorkersComponent implements OnInit {


  public currentUser: any
  public companyuserslist: any

  //Step 2 datatables: We initialize local variables for use in the dynamic data transfer
  exampleDatabase;
  public searchByName: string
  public dataLoaded: boolean
  selection = new SelectionModel<string>(true, []);
  dataSource: ExampleDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  displayedColumns = ['Acciones', 'Email', 'Description', 'Picture' ];

  //Step 3 datatables: We initialize an datasource for display an empty table while the data is fetching
  ngOnInit()
  {
    this.setDataBase([])
  }


  //Step 4 datatables: We make the fetch and then we build a new datasource but this time with the info that we bring from the server
    public refreshCompanyUsers() : void
    {

      this.companyUserService.index().subscribe( data => {
        console.log(data)
        data = data._embedded.companyusers
        console.log(data)
        data = data.filter( rel => rel.user_id === this.currentUser.id.toString() )
        console.log(data)

        this.companyuserslist = data

        this.serializeUsers()



      })

    }


  //Step 5 datatables: We create finally the new datasource which is refreshed with the table in the view
  setDataBase( data )
  {
      console.log(data)
      this.exampleDatabase = new ExampleDatabase( data );


      console.log(this.exampleDatabase)

      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, 'Worker');
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });

  }


  serializeUsers()
  {
    for( let i = 0 ; i < this.companyuserslist.length ; i ++ )
    {
      this.userService.show( this.companyuserslist[i].user_id1 ).subscribe( data => {
        this.companyuserslist[i].user_id1 = data
        this.setDataBase(this.companyuserslist)
      })

    }

  }


  viewProfile( user )
  {
     localStorage.setItem('userToShow', JSON.stringify(user.user_id1) )
     this.router.navigate(['profile'])
     this.events.transmit( { userToShow: user } )
  }


  delete( relation )
  {

    let relationId = relation._links.self.href.split('/')[ ( relation._links.self.href.split('/').length - 1 ) ]

    this.companyUserService.delete( relationId ).subscribe( data => {
      console.log( data )
      this.setDataBase([])
      this.refreshCompanyUsers()
    })
  }


  public isSpanish

  constructor(
    public userService: UserService,
    public companyUserService: CompanyUserService,
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


      this.refreshCompanyUsers()
    }
  }



}
