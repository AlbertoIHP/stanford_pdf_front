import { Component, OnInit } from '@angular/core';
import { EventHandler } from '../../../Services/EventHandler.service'
import { AuthenticationService } from '../../../Services/Authentication.service'
import { VideoService } from '../../../Services/Video.service'
import { ChatService } from '../../../Services/Chat.service'
import { MessageService } from '../../../Services/Message.service'
import { Message } from '../../../Models/Message.model'
import { PupilService } from '../../../Services/Pupil.service'
import { UserService } from '../../../Services/User.service'
import { Router } from '@angular/router'

import { OpentokService } from '../../../Services/opentok.service';
import * as OT from '@opentok/client';


@Component({
  selector: 'app-seemeeting',
  templateUrl: './seemeeting.component.html',
  styleUrls: ['./seemeeting.component.css']
})



export class SeemeetingComponent  {
  title = 'Angular Basic Video Chat';
  session: OT.Session;
  streams: Array<OT.Stream> = [];
  public currentUser: any
  public meet: any
  public isTheDay = false
  public tokenId: any
  public invited: any
  public invitator: any
  public otherUser: any

  //CHAT
  public chat: any
  public messages: any
  public content: any


  public isPast: any
  public isFuture: any
  public isToday: any

  public isSpanish

  constructor(
    private opentokService: OpentokService,
    public auth: AuthenticationService,
    public events : EventHandler,
    public router: Router,
    public videoService: VideoService,
    public pupilService: PupilService,
    public userService: UserService,
    public chatService: ChatService,
    public messageService: MessageService )
  {


    this.isSpanish = this.events.isSpanish
    this.events.language.subscribe( isSpanish => {
      this.isSpanish = isSpanish
      console.log( this.isSpanish )
    })

    this.isFuture = false
    this.isPast = false
    this.isToday = false

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
      this.meet = JSON.parse( localStorage.getItem('meet') )
      console.log( this.meet )

      if( this.meet )
      {
        let today : any = new Date()
        let todayString: any = today.toString().split(' ')

        let meetString: any = this.meet.date.split('/')

        let dateString = meetString[1]+" "+meetString[0]+", "+meetString[2]+" "+this.meet.hour+":"+this.meet.minutes+":00"
        console.log("dateString: ",dateString)

        let meetDay = new Date( dateString )
        console.log("meetDay: ",meetDay)




        todayString = todayString[2]+'/'+todayString[1]+'/'+todayString[3]

        console.log("Today string: "+todayString)
        console.log("MeetString: ",meetString)


        if( today > meetDay && (todayString === this.meet.date) === false )
        {
          console.log("Es pasado")
          this.isPast = true

        }
        else if( today < meetDay )
        {
          console.log("Es futuro ")
          this.isFuture = true
        }
        else if( today > meetDay && (todayString === this.meet.date) === true )
        {
          console.log("Es hoy")
          this.isToday = true
        }



        this.getUsers()
        this.getChat()

          setInterval(() => {
             this.getChat()
          }, 5000);



      }
      else
      {
        this.router.navigate(['meetings'])
      }



    }
  }


  getTokenId()
  {

  }

  getChat()
  {
    let meetId = this.meet._links.self.href.split('/')[ ( this.meet._links.self.href.split('/').length - 1 ) ]
    this.chatService.index().subscribe( chats => {
      chats = chats._embedded.chats
      chats = chats.filter( chat => chat.meet_id === meetId )
      if( chats.length >= 1 )
      {
        this.chat = chats[0]
        let chatId = this.chat._links.self.href.split('/')[ ( this.chat._links.self.href.split('/').length - 1 ) ]
        this.getMessages( chatId )
      }


    })
  }


  getMessages( chatId )
  {
    this.messageService.index().subscribe( msgs => {
      msgs = msgs._embedded.messages
      msgs = msgs.filter( msg => msg.chat_id === chatId )

      this.messages = msgs


      for( let msg of this.messages )
      {
        this.userService.show( msg.user_id ).subscribe( user => {
          msg.user_id = user
        })
      }

    })
  }


  sendMessage( )
  {

    let chatId = this.chat._links.self.href.split('/')[ ( this.chat._links.self.href.split('/').length - 1 ) ]
    let newMsg = new Message()
    newMsg.chat_id = chatId
    newMsg.content = this.content
    newMsg.user_id = this.currentUser.id.toString()
    delete newMsg.id
    this.content = ""

    this.messageService.store( newMsg ).subscribe( info => {
      console.log( info )
      this.getMessages( chatId )

    })

  }


  getUsers()
  {
    let pupilId = this.meet.pupil_id

    this.pupilService.show( pupilId ).subscribe( data => {
      this.invitator = data.user_id
      this.invited = data.user_id1

      this.invited === this.currentUser.id.toString() ? this.otherUser = this.invitator : this.otherUser = this.invited


      this.userService.show( this.otherUser ).subscribe( data => {
        this.otherUser = data
      })

    })

  }


  ngOnInit ()
  {



    this.videoService.getTokenId( this.meet.session_tok_id ).subscribe( data => {

      this.tokenId = data.tokenId

      console.log(this.tokenId)
      console.log(this.meet.session_tok_id)


      this.opentokService.initSession( this.tokenId, this.meet.session_tok_id ).then( (session: OT.Session) => {
        this.session = session;

        //When a new connection has received we just push it into our array of connecitons (strems)
        this.session.on('streamCreated', (event) => {
          this.streams.push(event.stream);
        });


        //As soon as a connection got destroyed, we just splice it from our array of connections (streams)
        this.session.on('streamDestroyed', (event) => {
          const idx = this.streams.indexOf(event.stream);
          if (idx > -1)
          {
            this.streams.splice(idx, 1);
          }
        });
      })
      //Once we let configured the in and out connections events, we can connect to the service
      //Basically, we are going to connect with our TOKEN_ID, and with that we are goin to resolve our session_ID
      .then(() => this.opentokService.connect())
      .catch((err) => {
        console.error(err);
        //alert('Unable to connect. Make sure you have updated the config.ts file with your OpenTok details.');
      });


    })














  }

  ngOnDestroy()
  {
    localStorage.removeItem('meet')
    if( this.session )
    {
      this.session.disconnect()
    }
  }















}
