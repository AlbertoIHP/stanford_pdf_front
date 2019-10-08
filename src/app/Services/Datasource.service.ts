//DATATABLES
import {DataSource} from '@angular/cdk/collections';
import {MatPaginator, MatSort} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { Component, ElementRef, ViewChild, Inject } from '@angular/core';




export class ExampleDatabase {

  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataChange.value; }

  constructor(ec)
  {
    // Fill up the database with 100 users.
    for (let i = 0; i < ec.length; i++) { this.addUser(ec[i]); }
  }

  /** Adds a new user to the database. */
  addUser(ec)
  {
    const copiedData = this.data.slice();
    copiedData.push(ec);
    this.dataChange.next(copiedData);
  }



}

/////////////////////////////////////////////////////////////////////////////////////




export class ExampleDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }
  public filtro;
  filteredData: any[] = [];
  renderedData: any[] = [];

  constructor(
    private _exampleDatabase: ExampleDatabase,
    private _paginator: MatPaginator,
    private _sort: MatSort,
    filtro
    )
  {
    super();

    this.filtro = filtro;


    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((item: any) => {


        if(this.filtro === "Search")
        {
           let searchStr = ( item.username ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }
        else if( this.filtro === "Pupil" )
        {
           let searchStr = ( item.user_id.username ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }
        else if( this.filtro === "Mentor" )
        {
           let searchStr = ( item.user_id.username ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }
        else if( this.filtro === "Chat" )
        {
           let searchStr = ( item.user_id.username ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }
        else if( this.filtro === "Meeting" )
        {
           let searchStr = ( item.name ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }
        else if( this.filtro === "Projects" )
        {
           let searchStr = ( item.name ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }
        else if( this.filtro === "Experiences" )
        {
           let searchStr = ( item.name ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }
        else if( this.filtro === "Distribution" )
        {
           let searchStr = ( item.name ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }
        else if( this.filtro === "Calendar" )
        {
           let searchStr = ( item.name ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }
        else if( this.filtro === "Pending" )
        {
           let searchStr = ( item.username ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }
        else if( this.filtro === "Worker" )
        {
           let searchStr = ( item.user_id1.username ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }
        else if( this.filtro === "UserAdministration" )
        {
           let searchStr = ( item.username ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }
        else if( this.filtro === "ViewAnalyzedPDF" )
        {
           let searchStr = ( item.description ).toLowerCase();
           return searchStr.indexOf(this.filter.toLowerCase()) != -1;
        }





      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });
  }

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: any[]): any[]
  {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';


        if(this.filtro === "Search")
        {
          switch (this._sort.active)
          {
            case 'Email': [propertyA, propertyB] = [a.username, b.username]; break;
            case 'Name': [propertyA, propertyB] = [a.name, b.name]; break;
            case 'Description' : [propertyA, propertyB] = [a.description, b.description]; break;
          }
        }
        else if ( this.filtro === "Pupil" )
        {
          switch (this._sort.active)
          {
            case 'Email': [propertyA, propertyB] = [a.user_id.username, b.user_id.username]; break;
            case 'Name': [propertyA, propertyB] = [a.user_id.name, b.user_id.name]; break;
            case 'Description' : [propertyA, propertyB] = [a.user_id.description, b.user_id.description]; break;
          }
        }
        else if ( this.filtro === "Mentor" )
        {
          switch (this._sort.active)
          {
            case 'Email': [propertyA, propertyB] = [a.user_id.username, b.user_id.username]; break;
            case 'Name': [propertyA, propertyB] = [a.user_id.name, b.user_id.name]; break;
            case 'Description' : [propertyA, propertyB] = [a.user_id.description, b.user_id.description]; break;
          }
        }
        else if ( this.filtro === "Chat" )
        {
          switch (this._sort.active)
          {
            case 'Name': [propertyA, propertyB] = [a.name, b.name]; break;
            case 'User': [propertyA, propertyB] = [a.user_id.username, b.user_id.username]; break;
          }
        }
        else if ( this.filtro === "Meeting" )
        {
          switch (this._sort.active)
          {
            case 'Name': [propertyA, propertyB] = [a.name, b.name]; break;
            case 'User': [propertyA, propertyB] = [a.userToMeet.username, b.userToMeet.username]; break;
            case 'Date': [propertyA, propertyB] = [a.date, b.date]; break;
          }
        }
        else if ( this.filtro === "Projects" )
        {
          switch (this._sort.active)
          {
            case 'Name': [propertyA, propertyB] = [a.name, b.name]; break;
            case 'Description': [propertyA, propertyB] = [a.description, b.description]; break;
          }
        }
        else if ( this.filtro === "Experiences" )
        {
          switch (this._sort.active)
          {
            case 'Name': [propertyA, propertyB] = [a.name, b.name]; break;
            case 'Description': [propertyA, propertyB] = [a.description, b.description]; break;
          }
        }
        else if ( this.filtro === "Distribution" )
        {
          switch (this._sort.active)
          {
            case 'Name': [propertyA, propertyB] = [a.name, b.name]; break;
            case 'Description': [propertyA, propertyB] = [a.description, b.description]; break;
          }
        }
        else if ( this.filtro === "Calendar" )
        {
          switch (this._sort.active)
          {
            case 'Name': [propertyA, propertyB] = [a.name, b.name]; break;
            case 'Description': [propertyA, propertyB] = [a.description, b.description]; break;
          }
        }
        else if ( this.filtro === "Pending" )
        {
          switch (this._sort.active)
          {
            case 'Email': [propertyA, propertyB] = [a.username, b.username]; break;
            case 'Description': [propertyA, propertyB] = [a.description, b.description]; break;
            case 'Role': [propertyA, propertyB] = [a.role, b.role]; break;
          }
        }
        else if ( this.filtro === "Worker" )
        {
          switch (this._sort.active)
          {
            case 'Email': [propertyA, propertyB] = [a.user_id1.username, b.user_id1.username]; break;
            case 'Description': [propertyA, propertyB] = [a.user_id1.description, b.user_id1.description]; break;
          }
        }
        else if ( this.filtro === "UserAdministration" )
        {
          switch (this._sort.active)
          {
            case 'Email': [propertyA, propertyB] = [a.username, b.username]; break;
            case 'Name': [propertyA, propertyB] = [a.name, b.name]; break;
          }
        }
        else if ( this.filtro === "ViewAnalyzedPDF" )
        {
          switch (this._sort.active)
          {
            case 'Shortcut': [propertyA, propertyB] = [a.shortcut, b.shortcut]; break;
            case 'Description': [propertyA, propertyB] = [a.description, b.description]; break;
            case 'Repetition': [propertyA, propertyB] = [a.description, b.description]; break;
          }
        }




      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
