import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { Chat } from '../Models/Chat.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class ChatService {

  public base = base.api
  public options: RequestOptions
  public headers: Headers

  constructor ( private http: Http , public authService: AuthenticationService)
  {
    this.headers = new Headers( { 'Content-Type': 'application/json' } )
    this.options = new RequestOptions( { headers: this.headers } )
  }


  index (): Observable< any >
  {

    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'chats', a ).map( ( res: Response ) => res.json() );
  }


  store ( chat: any )
  {
    var ChatString = JSON.stringify( chat )
    return this.http.post( this.base+'chat', ChatString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< Chat >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'chats/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( chat: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var chatString = JSON.stringify( chat )

    return this.http.put( this.base+'chats/'+id, chatString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'chats/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
