import { Component, OnInit } from '@angular/core';
import { EventHandler } from '../../../Services/EventHandler.service'
import { AuthenticationService } from '../../../Services/Authentication.service'
import { ChatService } from '../../../Services/Chat.service'
import { MessageService } from '../../../Services/Message.service'
import { UserService } from '../../../Services/User.service'
import { Message } from '../../../Models/Message.model'
import { Router } from '@angular/router'


@Component({
  selector: 'app-seechat',
  templateUrl: './seechat.component.html',
  styleUrls: ['./seechat.component.css']
})
export class SeechatComponent implements OnInit {

  public currentUser: any
  public pupilRelation: any
  public chatRelation: any
  public messageList: any
  public newMessage: Message
  public otherUser: any
  public isSpanish

  constructor( 
    public userService: UserService, 
    public messageService: MessageService, 
    public chatService: ChatService, 
    public auth: AuthenticationService, 
    public events : EventHandler, 
    public router: Router )
  {


    this.isSpanish = this.events.isSpanish
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })


    this.otherUser = false

    if( !localStorage.getItem('currentUser') )
    {
      this.auth.logout()
      this.events.singOut()
      this.router.navigate(['login'])
    }
    else
    {
      this.refreshMessages()

      setInterval(() => {
         this.refreshMessages()
      }, 15000);


      this.events.singIn()
    }
  }


  refreshMessages()
  {
      this.currentUser = JSON.parse( localStorage.getItem('currentUser') )

      localStorage.getItem('pupilRelation') ? this.pupilRelation = JSON.parse(localStorage.getItem('pupilRelation')) : this.pupilRelation = null

      localStorage.getItem('chatRelation') ? this.chatRelation = JSON.parse( localStorage.getItem('chatRelation') ) : this.chatRelation = null




      if( this.chatRelation )
      {
        let userId = this.chatRelation.user_id._links.self.href.split('/')[(this.chatRelation.user_id._links.self.href.split('/').length - 1)]

        userId=== this.currentUser.id.toString() ? this.otherUser = this.chatRelation.user_id1 : this.otherUser =  this.chatRelation.user_id;

      }
      else if( this.pupilRelation )
      {
        let userId = this.pupilRelation.user_id._links.self.href.split('/')[(this.pupilRelation.user_id._links.self.href.split('/').length - 1)]

        userId=== this.currentUser.id.toString() ? this.otherUser = this.pupilRelation.user_id1 : this.otherUser =  this.pupilRelation.user_id;
      }



      this.messageList = []
      this.newMessage = new Message()
      this.newMessage.user_id = this.currentUser.id


      //We check if the pupil relation has come first, so if is that case we have to go and fetch the chat relation to get the messages and that stuff
      if( this.pupilRelation )
      {
        this.chatService.index().subscribe( data => {

          let chatId = this.getChatId( data, this.getOrginalUserId(), this.getOriginalUserId1() )

           this.messageService.index().subscribe( data => {
             this.filterMessages( data, chatId  )

           })

        })

      }
      else if( this.chatRelation )
      {
          let chatId = this.chatRelation._links.self.href.split('/')[ ( this.chatRelation._links.self.href.split('/').length - 1 ) ]
          console.log( this.chatRelation )

            //If the pupil relation is false, it's because the chatrelation was setted before and we just have to search the messages
           this.messageService.index().subscribe( data => {
              this.filterMessages( data, chatId )
           })
      }
  }

  getOriginalUserId1()
  {
    let originalUserId1 = this.pupilRelation.user_id1._links.self.href.toString().split('/')[ ( this.pupilRelation.user_id1._links.self.href.toString().split('/').length - 1 ) ]
    return originalUserId1
  }


  getOrginalUserId()
  {

    let originalUserId = this.pupilRelation.user_id._links.self.href.toString().split('/')[ ( this.pupilRelation.user_id._links.self.href.toString().split('/').length - 1 ) ]
    return originalUserId
  }

  getChatId( data, originalUserId, originalUserId1 )
  {
          let chat = data._embedded.chats.filter( chat => chat.user_id === originalUserId.toString() && chat.user_id1 === originalUserId1.toString() )
          this.chatRelation = chat[0]
          let chatId = this.chatRelation._links.self.href.split('/')[ ( this.chatRelation._links.self.href.split('/').length - 1 ) ]
          console.log( this.chatRelation )
          return chatId
  }


  filterMessages( data, chatId )
  {
    //MESSAGES FILTERING
    let messages = data._embedded.messages
    messages = messages.filter( msj => msj.chat_id  === chatId.toString() )
    console.log(messages)

    this.messageList = messages
    this.seriaizeUserInfo()
  }


  seriaizeUserInfo()
  {
    for( let i = 0; i < this.messageList.length ; i ++ )
    {
      let userId = this.messageList[i].user_id


      this.userService.show( userId ).subscribe( data => {
        console.log(data)
        this.messageList[i].user_id = data

/*
        if (userId != this.currentUser.id.toString() && this.otherUser === false)
        {
          this.otherUser = data
          console.log(this.otherUser)
        } */


      })
    }

  }


  sendMessage()
  {
    let chatId = this.chatRelation._links.self.href.split('/')[ ( this.chatRelation._links.self.href.split('/').length - 1 ) ]
    this.newMessage.chat_id = chatId
    console.log(this.newMessage)
    this.messageService.store( this.newMessage ).subscribe( data => {
      console.log(data)
      this.refreshMessages()
    })

  }


  ngOnInit()
  {
  }


  ngOnDestroy()
  {
    console.log("ME DESTRUYEN")
    localStorage.removeItem('pupilRelation')
    localStorage.removeItem('chatRelation')
  }

}
