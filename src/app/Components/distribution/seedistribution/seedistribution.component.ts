import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Message } from '../../../Models/Message.model'
import { DistributionUser } from '../../../Models/DistributionUser.model'
import { MessageService } from '../../../Services/Message.service'
import { DistributionUserService } from '../../../Services/DistributionUser.service'
import { UserService } from '../../../Services/User.service'
import { EventHandler } from '../../../Services/EventHandler.service'

@Component({
  selector: 'app-seedistribution',
  templateUrl: './seedistribution.component.html',
  styleUrls: ['./seedistribution.component.css']
})
export class SeedistributionComponent implements OnInit {
  public currentUser: any
  public choosedUsers: any
  public distribution: any
  public messages: any


  public isSpanish

  constructor(
    public dialogRef: MatDialogRef<SeedistributionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public msgService: MessageService,
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
    this.getMessages()
  }

  getMessages()
  {
    let disId = this.distribution._links.self.href.split('/')[ ( this.distribution._links.self.href.split('/').length - 1 ) ]

    this.msgService.index().subscribe( data => {
      console.log(data)
      data = data._embedded.messages
      data = data.filter( msg => msg.distribution_id === disId )
      this.messages = data


    })
  }

  ngOnInit() {
  }

}
