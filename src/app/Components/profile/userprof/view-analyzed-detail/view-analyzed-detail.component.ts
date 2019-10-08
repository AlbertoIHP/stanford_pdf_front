import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { ExampleDatabase, ExampleDataSource } from '../../../../Services/Datasource.service';


@Component({
  selector: 'app-view-analyzed-detail',
  templateUrl: './view-analyzed-detail.component.html',
  styleUrls: ['./view-analyzed-detail.component.css']
})
export class ViewAnalyzedDetailComponent implements OnInit {
  public info : Array<any> = []

  //Step 2 datatables: We initialize local variables for use in the dynamic data transfer
  exampleDatabase;
  public searchByName: string
  public dataLoaded: boolean
  selection = new SelectionModel<string>(true, []);
  dataSource: ExampleDataSource | null;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public displayedColumns: string[] = ['Shortcut', 'Description', 'Repetition'];




  //Step 3 datatables: We create finally the new datasource which is refreshed with the table in the view
  setDataBase( data )
  {
  		console.log("configurando la nueva data base: ",data)

      this.exampleDatabase = new ExampleDatabase( data );

      console.log("mi paginador: ",this.paginator)

      console.log("mi sort: ",this.sort)


      this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort, 'ViewAnalyzedPDF');
      Observable.fromEvent(this.filter.nativeElement, 'keyup')
          .debounceTime(150)
          .distinctUntilChanged()
          .subscribe(() => {
            if (!this.dataSource) { return; }
            this.dataSource.filter = this.filter.nativeElement.value;
          });

  }


  //Step 4 datatables: We initialize an datasource for display an empty table while the data is fetching
  ngOnInit()
  {
    this.setDataBase(this.info)
  }







  constructor(
    public dialogRef: MatDialogRef<ViewAnalyzedDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) 
  { 

  	for (var i = 0; i < data.values.length; i++) {
  		this.info.push( { shortcut: data.shortcut[i], description: data.description[i], repetition: data.values[i] } )
  	}
  	console.log(this.info)

  }


}






