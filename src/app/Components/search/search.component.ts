import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'
import { UserService } from '../../Services/User.service'
import { Router } from '@angular/router'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CompanyUserService } from '../../Services/CompanyUser.service'
import { CompanyUser } from '../../Models/CompanyUser.model'

//Child components
import { ContactComponent } from './contact/contact.component'



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
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public currentUser: any
  public toSearch: any

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
    public refreshSearch() : void
    {
        this.userService.index( ).subscribe( data => {

          console.log( data )
           this.setDataBase( this.defineCatalog( data ) )
        })

    }


  //Step 5 datatables: We create finally the new datasource which is refreshed with the table in the view
  setDataBase( data )
  {
      this.exampleDatabase = new ExampleDatabase( data );

      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, 'Search');
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });

  }


  defineCatalog( data )
  {
        if( parseInt( this.currentUser.role ) === 1 )
        {
          return data._embedded.users.filter( user => parseInt( user.role ) === 4 )
        }
        else if( parseInt( this.currentUser.role ) === 4 )
        {
          return data._embedded.users.filter( user => parseInt( user.role ) === 1 )
        }
        else if( parseInt( this.currentUser.role ) === 3 )
        {
          return data._embedded.users.filter( user => parseInt( user.role ) === 1 || parseInt( user.role ) === 4 )
        }
  }


  public isSpanish


  constructor(
    public companyUserService : CompanyUserService,
    public dialog: MatDialog,
    public auth: AuthenticationService,
    public events : EventHandler,
    public router: Router,
    public userService: UserService )
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
      //localStorage.getItem('toSearch') ? this.toSearch = JSON.parse(localStorage.getItem('toSearch')) : this.toSearch = null
      this.refreshSearch()
    }


    this.events.transmition.subscribe( data => {

     data.toSearch ? this.toSearch = data.toSearch : console.log("I heard the event, but i'm not have anything to do with it. Im Search component")






    })

  }


  viewProfile( user )
  {
     localStorage.setItem('userToShow', JSON.stringify(user) )
     this.router.navigate(['profile'])
     this.events.transmit( { userToShow: user } )
     this.toSearch = ''
  }



  ngOnDestroy()
  {
    console.log("ME DESTRUYEN!!")
    localStorage.removeItem('toSearch')
  }


  openContact( userToContact )
  {
    let userToContactCopy = JSON.parse( JSON.stringify( userToContact ) )
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )

    let dialogRef = this.dialog.open( ContactComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy,
       destinyUser: userToContactCopy,
      }
    });
  }



  addToCompany( user )
  {
    let userId = user._links.self.href.split('/')[ ( user._links.self.href.split('/').length - 1 ) ]


    this.companyUserService.index().subscribe( data => {
      console.log(data)
      data = data._embedded.companyusers
      data = data.filter( relation => relation.user_id === this.currentUser.id.toString() && relation.user_id1 === userId )

      if( data.length >= 1)
      {
        alert("You already add this user")
      }
      else
      {
        let newWorker = new CompanyUser()
        newWorker.isowner = '0'
        newWorker.user_id1 = userId
        newWorker.user_id = this.currentUser.id.toString()
        delete newWorker.id

        this.companyUserService.store( newWorker ).subscribe( data => {
          console.log( data )
        })
      }



    })







  }


}
