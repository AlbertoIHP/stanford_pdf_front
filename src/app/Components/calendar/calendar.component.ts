import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'

import { CalendarService } from '../../Services/Calendar.service'
import { CalendarUserService } from '../../Services/CalendarUser.service'

import { Router } from '@angular/router'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

//Childs
import { AddcalendarComponent } from './addcalendar/addcalendar.component'
import { EditcalendarComponent } from './editcalendar/editcalendar.component'
import { SeecalendarComponent } from './seecalendar/seecalendar.component'
import { CreateneweventComponent } from './createnewevent/createnewevent.component'
import { ViewcalmemComponent } from './viewcalmem/viewcalmem.component'



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
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  public currentUser: any
  public totalCalendars: any
  public calUserList: any


  //Step 2 datatables: We initialize local variables for use in the dynamic data transfer
  exampleDatabase;
  public searchByName: string
  public dataLoaded: boolean
  selection = new SelectionModel<string>(true, []);
  dataSource: ExampleDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  displayedColumns = ['Acciones', 'Name', 'Description', 'Picture', 'Members' ];

  //Step 3 datatables: We initialize an datasource for display an empty table while the data is fetching
  ngOnInit()
  {
    this.setDataBase([])
  }


  //Step 4 datatables: We make the fetch and then we build a new datasource but this time with the info that we bring from the server
    public refreshCalendars() : void
    {
      this.calUserService.index().subscribe( data => {
        let disUser = data._embedded.calendarusers

        //First check those ones that are ours by checking the id and the isowner attributes
        this.calUserList = disUser.filter( disus => ( disus.user_id === this.currentUser.id.toString() ) && (disus.isowner === '1') )

        this.totalCalendars = []

        for( let i = 0 ; i < this.calUserList.length ; i ++ )
        {

            this.calendarService.show( this.calUserList[i].calendar_id ).subscribe( data => {
              console.log(data)
              this.totalCalendars.push(data)
              this.setDataBase( this.totalCalendars )

            })
        }

        if( this.totalCalendars.length <= 0 )
        {
          this.setDataBase([])
        }

      })

    }


  //Step 5 datatables: We create finally the new datasource which is refreshed with the table in the view
  setDataBase( data )
  {
      console.log(data)
      this.exampleDatabase = new ExampleDatabase( data );


      console.log(this.exampleDatabase)

      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, 'Calendar');
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });

  }













  public isSpanish: boolean

  // CONSTRUCTOR

  constructor(
    public dialog: MatDialog,
    public calUserService: CalendarUserService,
    public calendarService: CalendarService,
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
      this.refreshCalendars()

      // setInterval(() => {
      //    this.refreshCalendars()
      // }, 15000);

        this.events.hasModified.subscribe( data => {
          console.log("HE OIDO EL EVENTO")
          this.refreshCalendars()
        })


    }
  }






// Modals functions




deleteCalendar( disList )
{
  let calId = disList._links.self.href.split('/')[ ( disList._links.self.href.split('/').length - 1 ) ]

  this.calUserService.index().subscribe( data => {
    data = data._embedded.calendarusers

    let userList = data.filter( us => us.calendar_id === calId )


    for( let i = 0 ; i < userList.length ; i ++ )
    {
      let id = userList[i]._links.self.href.split('/')[ ( userList[i]._links.self.href.split('/').length - 1 ) ]

      this.calUserService.delete( id ).subscribe( data => {
        if( userList[i].isowner === '1' )
        {
          console.log("ACTUALIZANDO")
          this.refreshCalendars()
        }
      })
    }

  })


  this.calendarService.delete( calId ).subscribe( data => {
    console.log( data )
  })

}






openEditCalendar( disList )
{
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )
    let currentDistributionCopy  = JSON.parse( JSON.stringify( disList ) )

    let dialogRef = this.dialog.open( EditcalendarComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy,
       calendar: currentDistributionCopy
      }
    });
}



openEventHistory( disList )
{
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )
    let currentDistributionCopy  = JSON.parse( JSON.stringify( disList ) )


    let dialogRef = this.dialog.open( SeecalendarComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy,
       calendar: currentDistributionCopy
      }
    });
}





viewMembers( disList )
{
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )
    let currentDistributionCopy  = JSON.parse( JSON.stringify( disList ) )

    let dialogRef = this.dialog.open( ViewcalmemComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy,
       calendar: currentDistributionCopy
      }
    });
}





openAddCalendar( )
{
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )

    let dialogRef = this.dialog.open( AddcalendarComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy
      }
    });
}






openCreateNewEvent( disList )
{
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )
    let currentDistributionCopy  = JSON.parse( JSON.stringify( disList ) )

    let dialogRef = this.dialog.open( CreateneweventComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy,
       calendar: currentDistributionCopy
      }
    });
}






}
