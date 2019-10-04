import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EventHandler } from '../../Services/EventHandler.service'
import { AuthenticationService } from '../../Services/Authentication.service'
import { DistributionService } from '../../Services/Distribution.service'
import { DistributionUserService } from '../../Services/DistributionUser.service'
import { Router } from '@angular/router'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

//Childs
import { AdddistributionComponent } from './adddistribution/adddistribution.component'
import { EditdistributionComponent } from './editdistribution/editdistribution.component'
import { SeedistributionComponent } from './seedistribution/seedistribution.component'
import { SendnewmailComponent } from './sendnewmail/sendnewmail.component'
import { ViewmembersComponent } from './viewmembers/viewmembers.component'



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
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css']
})
export class DistributionComponent implements OnInit
{


  public currentUser: any
  public totalDistributions: any
  public disUserList: any


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
    public refreshDistributions() : void
    {
      console.log("HOLAA")

      this.disUserService.index().subscribe( data => {
        console.log(data)
        let disUser = data._embedded.distributionusers

        //First check those ones that are ours by checking the id and the isowner attributes
        this.disUserList = disUser.filter( disus => ( disus.user_id === this.currentUser.id.toString() ) && (disus.isowner === '1') )
        console.log(this.disUserList)

        this.totalDistributions = []

        for( let i = 0 ; i < this.disUserList.length ; i ++ )
        {

            this.distributionService.show( this.disUserList[i].distribution_id ).subscribe( data => {
              console.log(data)
              this.totalDistributions.push(data)
              this.setDataBase( this.totalDistributions )

            })
        }

        if( this.disUserList.length <= 0 )
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

      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, 'Distribution');
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
    public dialog: MatDialog,
    public disUserService: DistributionUserService,
    public distributionService: DistributionService,
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
      this.refreshDistributions()


      // setInterval(() => {
      //    this.refreshDistributions()
      // }, 15000);


     this.events.hasModified.subscribe( data => {
       console.log("HE OIDO EL EVENTO")
       this.refreshDistributions()
      })


    }
  }





deleteDistribution( disList )
{
  let disId = disList._links.self.href.split('/')[ ( disList._links.self.href.split('/').length - 1 ) ]
  console.log(disId)

  this.disUserService.index().subscribe( data => {
    data = data._embedded.distributionusers

    let userList = data.filter( us => us.distribution_id === disId )


    for( let i = 0 ; i < userList.length ; i ++ )
    {
      let id = userList[i]._links.self.href.split('/')[ ( userList[i]._links.self.href.split('/').length - 1 ) ]
      console.log( id )

      this.disUserService.delete( id ).subscribe( data => {
        console.log()
        if( userList[i].isowner === '1' )
        {
          console.log("ACTUALIZANDO")
          this.refreshDistributions()
        }
      })
    }

  })







  this.distributionService.delete( disId ).subscribe( data => {
    console.log( data )
  })

}

openEditDistribution( disList )
{
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )
    let currentDistributionCopy  = JSON.parse( JSON.stringify( disList ) )

    let dialogRef = this.dialog.open( EditdistributionComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy,
       distribution: currentDistributionCopy
      }
    });
}



openEmailsHistory( disList )
{
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )
    let currentDistributionCopy  = JSON.parse( JSON.stringify( disList ) )


    let dialogRef = this.dialog.open( SeedistributionComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy,
       distribution: currentDistributionCopy
      }
    });
}





viewMembers( disList )
{
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )
    let currentDistributionCopy  = JSON.parse( JSON.stringify( disList ) )

    let dialogRef = this.dialog.open( ViewmembersComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy,
       distribution: currentDistributionCopy
      }
    });
}





openAddDistribution( )
{
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )

    let dialogRef = this.dialog.open( AdddistributionComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy
      }
    });
}






openSendNewEmail( disList )
{
    let currentUserCopy = JSON.parse( JSON.stringify( this.currentUser ) )
    let currentDistributionCopy  = JSON.parse( JSON.stringify( disList ) )

    let dialogRef = this.dialog.open( SendnewmailComponent, {
      //Los parámetros se asignan y se envían los datos necesarios
      width: '700px',
      data:
      {
       currentUser: currentUserCopy,
       distribution: currentDistributionCopy
      }
    });
}






}
