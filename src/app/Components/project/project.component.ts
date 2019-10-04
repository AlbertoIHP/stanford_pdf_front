import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'
import { ProjectService } from '../../Services/Project.service'
import { Router } from '@angular/router'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';


//Child components
import { AddprojectComponent } from './addproject/addproject.component'
import { EditprojectComponent } from './editproject/editproject.component'


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
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {


  public currentUser: any
  public projectsList: any

  //Step 2 datatables: We initialize local variables for use in the dynamic data transfer
  exampleDatabase;
  public searchByName: string
  public dataLoaded: boolean
  selection = new SelectionModel<string>(true, []);
  dataSource: ExampleDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  displayedColumns = ['Acciones', 'Name', 'Description', 'Picture' ];

  //Step 3 datatables: We initialize an datasource for display an empty table while the data is fetching
  ngOnInit()
  {
    this.setDataBase([])
  }


  //Step 4 datatables: We make the fetch and then we build a new datasource but this time with the info that we bring from the server
    public refreshProjects() : void
    {

      this.projectService.index().subscribe( data => {
        let projects = data._embedded.projects

        this.projectsList = projects.filter( project => project.user_id === this.currentUser.id.toString() )
        this.setDataBase( this.projectsList )

      })

    }


  //Step 5 datatables: We create finally the new datasource which is refreshed with the table in the view
  setDataBase( data )
  {
      console.log(data)
      this.exampleDatabase = new ExampleDatabase( data );


      console.log(this.exampleDatabase)

      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, 'Projects');
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });

  }



  openAddProject()
  {
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )

    let dialogRef = this.dialog.open( AddprojectComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy
      }
    });
  }

  openEditProject( project )
  {
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )
    let projectCopy = JSON.parse( JSON.stringify( project ) )

    let dialogRef = this.dialog.open( EditprojectComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy,
       project: projectCopy
      }
    });
  }

  deleteProject( project )
  {
    let projectId = project._links.self.href.split('/')[ ( project._links.self.href.split('/').length - 1 ) ]
    console.log( projectId )
    this.projectService.delete( projectId ).subscribe( data => {
      this.refreshProjects()
    })
  }


  public isSpanish

  constructor(
    public dialog: MatDialog, 
    public projectService: ProjectService, 
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
      this.refreshProjects()


      // setInterval(() => {
      //    this.refreshProjects()
      // }, 15000);


      this.events.hasModified.subscribe( data => {
        this.refreshProjects()
      })
    }
  }



}
