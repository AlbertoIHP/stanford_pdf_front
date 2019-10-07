import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-view-analyzed-detail',
  templateUrl: './view-analyzed-detail.component.html',
  styleUrls: ['./view-analyzed-detail.component.css']
})
export class ViewAnalyzedDetailComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ViewAnalyzedDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) 
  { 
  	console.log("data: ",data)
  }

  ngOnInit() {
  }

}
