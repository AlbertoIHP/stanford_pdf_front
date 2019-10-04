import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Distribution } from '../../../Models/Distribution.model'
import { DistributionUser } from '../../../Models/DistributionUser.model'
import { DistributionService } from '../../../Services/Distribution.service'
import { DistributionUserService } from '../../../Services/DistributionUser.service'
import { UserService } from '../../../Services/User.service'
import { EventHandler } from '../../../Services/EventHandler.service'

@Component({
  selector: 'app-viewmembers',
  templateUrl: './viewmembers.component.html',
  styleUrls: ['./viewmembers.component.css']
})
export class ViewmembersComponent implements OnInit {
  public currentUser: any
  public choosedUsers: any
  public distribution: any
  public isSpanish


  constructor(
    public dialogRef: MatDialogRef<ViewmembersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public distributionService: DistributionService,
    public distributionUserService: DistributionUserService,
    public userService: UserService,
    public events: EventHandler
    )
  {

    this.isSpanish = this.events.isSpanish
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })
    
    console.log(data)
    this.currentUser = data.currentUser
    this.distribution = data.distribution
    this.choosedUsers = []
    this.getUsers()
  }


  getUsers()
  {
    console.log( this.distribution )
    let disId = this.distribution._links.self.href.split('/')[ ( this.distribution._links.self.href.split('/').length -1 ) ]

    this.distributionUserService.index().subscribe( data => {
      data = data._embedded.distributionusers

      let relations = data.filter( relation => relation.distribution_id === disId.toString() )

      for ( let rel of relations )
      {
        this.userService.show( rel.user_id ).subscribe( data => {
          data.username != this.currentUser.username ? this.choosedUsers.push( data ) : null
        })
      }


    })


  }

  ngOnInit()
  {
  }

}
