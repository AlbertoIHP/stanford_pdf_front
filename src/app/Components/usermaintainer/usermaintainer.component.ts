import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router'
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'
import { UserService } from '../../Services/User.service'



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
  selector: 'app-usermaintainer',
  templateUrl: './usermaintainer.component.html',
  styleUrls: ['./usermaintainer.component.css']
})
export class UsermaintainerComponent implements OnInit {



 	public currentUser: any
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
  	displayedColumns = ['Acciones', 'Email', 'Name'];



  	//Step 3 datatables: We initialize an datasource for display an empty table while the data is fetching
  	ngOnInit()
  	{
    	this.setDataBase([])
  	}


  	//Step 4 datatables: We make the fetch and then we build a new datasource but this time with the info that we bring from the server
  public refreshUser() : void
    {
        this.userService.index( ).subscribe( data => {
        	console.log(data)
          	let userLists = data._embedded.users.filter( user => user.username !== this.currentUser.username )
          	this.setDataBase( userLists )

        })

    }


  	//Step 5 datatables: We create finally the new datasource which is refreshed with the table in the view
  	setDataBase( data )
  	{
      	console.log(data)
      	this.exampleDatabase = new ExampleDatabase( data );


      	console.log(this.exampleDatabase)

      	this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, 'UserAdministration');
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
      	this.currentUser.id = this.currentUser.id.toString()
      	this.events.singIn()

      	setInterval(() => {
         	this.refreshUser()
      	}, 15000);


      	this.refreshUser()
    	}
  	}





    viewProfile( user )
    {
      console.log( this.currentUser )
       // localStorage.setItem('userToShow', JSON.stringify(user) )
       // this.router.navigate(['profile'])
       // this.events.transmit( { userToShow: user } )
    }

}
