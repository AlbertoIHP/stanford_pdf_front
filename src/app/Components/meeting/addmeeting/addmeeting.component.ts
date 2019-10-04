import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Chat } from '../../../Models/Chat.model'
import { Message } from '../../../Models/Message.model'
import { Notification } from '../../../Models/Notification.model'
import { NotificationType } from '../../../Models/NotificationType.model'
import { Meet } from '../../../Models/Meet.model'
import { Pupil } from '../../../Models/Pupil.model'
import { ChatService } from '../../../Services/Chat.service'
import { MessageService } from '../../../Services/Message.service'
import { PupilService } from '../../../Services/Pupil.service'
import { UserService } from '../../../Services/User.service'
import { MeetService } from '../../../Services/Meet.service'
import { VideoService } from '../../../Services/Video.service'
import { NotificationService } from '../../../Services/Notification.service'
import { EventHandler } from '../../../Services/EventHandler.service'



@Component({
  selector: 'app-addmeeting',
  templateUrl: './addmeeting.component.html',
  styleUrls: ['./addmeeting.component.css']
})
export class AddmeetingComponent implements OnInit {
  public pupilRelation: any
  public newMeeting: any
  public currentUser: any
  public newMeet: Meet
  public pupilsList: any
  public minutes: any
  public hours: any
  public isThereApupilsRelationToMeet: any
  public choosedMentor: any
  public isFormComplete: any
  public choosedDate: any
  public showSpinner: any = false

  assignHours()
  {
    this.hours = []
    for( let i = 0 ; i <= 24 ; i ++ )
    {
      if( i < 10 )
      {
        this.hours.push("0"+i.toString())
      }
      else
      {
        this.hours.push(i.toString())
      }
    }
  }




  assignMinutes()
  {
    this.minutes = []

    for( let i = 0; i <= 60 ; i ++ )
    {
      if( i < 10 )
      {
        this.minutes.push("0"+i.toString())
      }
      else
      {
        this.minutes.push(i.toString())
      }
    }
  }


  changeChoosedMentor( mentor )
  {
    this.choosedMentor = mentor.inivitedUser.username
    this.newMeet.pupil_id = mentor._links.self.href.split('/')[ ( mentor._links.self.href.split('/').length - 1 ) ].toString()
    console.log(this.newMeet.pupil_id)
  }



  verifyInformation()
  {

    this.newMeet.date = this.choosedDate

    if( this.newMeet.description != '' && this.newMeet.videoconference != '' && this.newMeet.name != '' && this.newMeet.date != '' && this.newMeet.pupil_id != '' && this.newMeet.hour != '' && this.newMeet.minutes != '' )
    {
      let dateArray = this.choosedDate.toString().split(' ')
      this.newMeet.date = dateArray[2]+'/'+dateArray[1]+'/'+dateArray[3]




      if( this.newMeet.videoconference === '1' )
      {
        this.videoService.getSessionId().subscribe( data => {
          console.log(data)
          this.newMeet.session_tok_id = data.session
          console.log(this.newMeet)
        })
      }








      this.isFormComplete = true
    }
    else
    {
      console.log(this.newMeet)
      this.isFormComplete = false
    }
  }


  generateUserToMeet()
  {
    for( let i = 0; i < this.pupilsList.length; i++ )
    {

      if( this.pupilsList[i].isActive === '0' )
      {
        this.pupilsList.splice( i, 1 )
      }
      else
      {
        let invitedUser = this.pupilsList[i].user_id === this.currentUser.id.toString() ? this.pupilsList[i].user_id1 : this.pupilsList[i].user_id
        this.userService.show( invitedUser ).subscribe( data => {
          console.log(data)
          console.log(i)
          this.pupilsList[i].inivitedUser = data
        })
      }


    }
  }


  sendRequest()
  {


    this.showSpinner = true

    this.videoService.getSessionId().subscribe( data => {

      this.newMeet.session_tok_id = data.session

      this.meetService.store( this.newMeet ).subscribe( meet => {
        console.log( meet )





        this.pupilService.show( meet.pupil_id ).subscribe( pupilRelation => {

          console.log("CHATTTTTTTTTTTTTTTTTTTTTTTTTT")

          let newChat = new Chat()
          newChat.meet_id = meet.id
          newChat.name = meet.name

          newChat.user_id = pupilRelation.user_id
          newChat.user_id1 = pupilRelation.user_id1



          this.userService.show( newChat.user_id ).subscribe( user1 => {

              let userNotification = new Notification()

              // 1 is for new meeting
              userNotification.notificationtype_id = '1'
              userNotification.user_id = newChat.user_id1
              userNotification.content = "The user "+user1.username+", did invite you a new meeting for "+this.newMeet.date+" at "+this.newMeet.hour+":"+this.newMeet.minutes
              delete userNotification.id

              this.notificationService.store( userNotification ).subscribe( notification => {
                console.log( notification )
              } )


          })



          this.chatService.store( newChat ).subscribe( chat => {

            this.events.madeChange()
            this.dialogRef.close()


          })


        })



      })

    })







  }



  public isSpanish


  constructor(
    public dialogRef: MatDialogRef<AddmeetingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public chatService: ChatService,
    public pupilService: PupilService,
    public messageService: MessageService,
    public userService: UserService,
    public meetService: MeetService,
    public events: EventHandler,
    public videoService: VideoService,
    public notificationService: NotificationService
    )
  {


    this.isSpanish = this.events.isSpanish
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })

    
    this.choosedDate = ''
    this.choosedMentor = 'Choose a user to meet'
    console.log(data)
    this.currentUser = data.currentUser
    this.pupilRelation = data.pupilRelation
    this.newMeet = new Meet()
    this.newMeet.invitator = this.currentUser.id.toString()
    this.assignHours()
    this.assignMinutes()
    this.isFormComplete = false



    if( data.pupilsList )
    {
     this.pupilsList = data.pupilsList
    }
    else
    {

     this.pupilsList = []
    }

    console.log(this.pupilsList)
    this.generateUserToMeet()





    if( this.pupilRelation )
    {
      let currentPupilId = this.pupilRelation._links.self.href.split('/')[ ( this.pupilRelation._links.self.href.split('/').length - 1 ) ]
      //We have to pre select it's ID to the new Meeting
      this.newMeet.pupil_id = currentPupilId.toString()
      this.isThereApupilsRelationToMeet = true
      this.choosedMentor = this.pupilRelation.user_id.username === this.currentUser.username ? this.pupilRelation.user_id1.username : this.pupilRelation.user_id.username
      console.log(this.pupilRelation)
      console.log("Me entregaron la relacion por lo que no debo preguntar sobre esto")
      console.log(this.newMeet)
    }
    else if( this.pupilsList && this.pupilsList.length >= 1 )
    {
      //User must choose one of his whole pupils list
      this.isThereApupilsRelationToMeet = true
      this.generateUserToMeet()

      console.log("El usuario debe elegir una")
      console.log(this.pupilsList)


    }
    else
    {
      this.isThereApupilsRelationToMeet = false

    }

  }



  ngOnInit()
  {
  }

}
