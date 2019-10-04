import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Chat } from '../../../Models/Chat.model'
import { Message } from '../../../Models/Message.model'
import { Pupil } from '../../../Models/Pupil.model'
import { ChatService } from '../../../Services/Chat.service'
import { MessageService } from '../../../Services/Message.service'
import { PupilService } from '../../../Services/Pupil.service'
import { Notification } from '../../../Models/Notification.model'
import { NotificationService } from '../../../Services/Notification.service'
import { UserService } from '../../../Services/User.service'
import { EventHandler } from '../../../Services/EventHandler.service'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  public currentUser: any
  public destinyUser: any
  public newChat: Chat
  public newMessage: Message
  public newPupil: Pupil
  public isAlreadySent : any



  public isSpanish

  constructor(
    public dialogRef: MatDialogRef<ContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public chatService: ChatService,
    public pupilService: PupilService,
    public messageService: MessageService,
    public notificationService: NotificationService,
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
    this.destinyUser = data.destinyUser
    this.newChat = new Chat()
    this.newMessage = new Message()
    this.newPupil = new Pupil()


    this.pupilService.index().subscribe( data => {
      console.log(data._embedded.pupils)


      let other = this.destinyUser._links.self.href.toString().split('/')[ (this.destinyUser._links.self.href.toString().split('/').length - 1) ]
      let me = this.currentUser.id


      //This check if i already invites this user
      let a = data._embedded.pupils.filter( pupil => (parseInt(pupil.user_id) === parseInt(me) && parseInt(pupil.user_id1) === parseInt(other) ) )
      //This checks if he already invites me
      let b = data._embedded.pupils.filter( pupil => (parseInt(pupil.user_id) === parseInt(other) && parseInt(pupil.user_id1) === parseInt(me) ) )



      //Now if one of those ones exist we cant send another invitation
     if( a.length >= 1 || b.length >=1 )
     {
       this.isAlreadySent = true
     }
     else
     {
       this.isAlreadySent = false

        //If you read this please dont do things like this, this is just an extremily case which this must be ready in 7 days left. Hope you understand it ;)
        let idDestinyUser = this.destinyUser._links.self.href.toString().split('/')[ (this.destinyUser._links.self.href.toString().split('/').length - 1) ]
        console.log(idDestinyUser)




        //We will create both notifications followed by the roles (mentor 4 and user 1)

        this.userService.show( me ).subscribe( user1 => {
          this.userService.show( other ).subscribe( user2 => {
            let user1Notification = new Notification()
            let user2Notification = new Notification()


            user1Notification.user_id = me
            user2Notification.user_id = other


            //Now we check the the role ( 3 is for new mentor notification and 2 for new pupil notification)
            user1Notification.notificationtype_id = user1.role === '1' ? '3' : '2'
            user2Notification.notificationtype_id = user2.role === '1' ? '3' : '2'

            user1Notification.content = user1.username+' you have invited to '+user2.username+' to get an mentoring relationship'
            user2Notification.content = user1.username+' invites you to get an mentoring relationship.'


            delete user1Notification.id
            delete user2Notification.id

            this.notificationService.store( user1Notification ).subscribe( data => {
              console.log(data)
            })

            this.notificationService.store( user2Notification ).subscribe( data => {
              console.log(data)
            })





          })
        })








        //We asigned the obvious relation between this two users
        //second ID will always be the destinatary
        this.newChat.user_id = this.currentUser.id
        this.newChat.user_id1 = idDestinyUser

        this.newPupil.user_id = this.currentUser.id
        this.newPupil.user_id1 = idDestinyUser
        this.newPupil.isActive = '0'

     }



    })

  }




  registerFromPupil( )
  {
    this.pupilService.store( this.newPupil ).subscribe( data => {
       console.log("Pupil has been saved")
       console.log(data)
       this.close()
    })
  }


  registerFromMessage( )
  {


    if( this.newMessage.content != '')
    {
      this.newMessage.chat_id = this.newChat.id.toString()
      this.newMessage.user_id = this.currentUser.id.toString()

      this.messageService.store( this.newMessage ).subscribe( data => {
        this.newMessage = data
         console.log("Message has been saved")
         console.log(data)
         this.pupilService.store( this.newPupil ).subscribe( data => {
           console.log("Pupil has been saved")
           console.log(data)
           this.close()
          })
      })
    }
    else
    {
      alert("Please write some content to your message to send the request")
    }

  }






  registerFromChat()
  {
          if( this.newChat.name != '' && this.newMessage.content != '')
          {
            this.chatService.store( this.newChat ).subscribe( data => {
              //Data must be the object registered in the DB as a Chat, so we can get the ID and put it in our Message Chat_id attribute
              console.log(data)
              this.newChat = data
              this.newMessage.chat_id = this.newChat.id.toString()
              this.newMessage.user_id = this.currentUser.id.toString()
              console.log("Chat has saved")

              this.messageService.store( this.newMessage ).subscribe( data => {
                this.newMessage = data
                console.log("Message has been saved")
                console.log(data)
                this.pupilService.store( this.newPupil ).subscribe( data => {
                  console.log("Pupil has been saved")
                  console.log(data)
                  this.close()
                })


              })


            })

          }
          else
          {
            alert("Please fill the fields to send the request")
          }

  }



  close()
  {
    this.dialogRef.close()
  }






  sendMessage()
  {
     // we have to create a chat, add the message to that chat and then create a pupil but with isactive 0
      if( this.newChat.id != 0 )
      {
        if( this.newMessage.id != 0 )
        {
          this.registerFromPupil()
        }
        else
        {
          this.registerFromMessage()
        }
      }
      else
      {
        this.registerFromChat()
      }
  }



}
