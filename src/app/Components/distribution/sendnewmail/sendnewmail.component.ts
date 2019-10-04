import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Distribution } from '../../../Models/Distribution.model'
import { Message } from '../../../Models/Message.model'
import { DistributionUser } from '../../../Models/DistributionUser.model'
import { DistributionService } from '../../../Services/Distribution.service'
import { MessageService } from '../../../Services/Message.service'
import { DistributionUserService } from '../../../Services/DistributionUser.service'
import { UserService } from '../../../Services/User.service'
import { EventHandler } from '../../../Services/EventHandler.service'

@Component({
  selector: 'app-sendnewmail',
  templateUrl: './sendnewmail.component.html',
  styleUrls: ['./sendnewmail.component.css']
})
export class SendnewmailComponent implements OnInit {
  public currentUser: any
  public distribution: any
  public newMessage: any
  public sending: any = false
  public isSpanish

  constructor(
    public dialogRef: MatDialogRef<SendnewmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public distributionService: DistributionService,
    public distributionUserService: DistributionUserService,
    public userService: UserService,
    public messageService: MessageService,
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

    let disId = this.distribution._links.self.href.split('/')[ ( this.distribution._links.self.href.split('/').length - 1 ) ]

    this.newMessage = new Message()
    this.newMessage.distribution_id = disId




  }
  ngOnInit() {
  }


  sendEmail()
  {
    this.sending = true
    console.log( this.newMessage )
    this.messageService.store( this.newMessage ).subscribe( data => {
      console.log(data)
      this.dialogRef.close()
    })
  }

}
