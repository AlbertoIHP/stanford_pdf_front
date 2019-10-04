import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { Message } from '../Models/Message.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class MessageService {

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

    return this.http.get( this.base+'messages', a ).map( ( res: Response ) => res.json() );
  }


  store ( message: any )
  {
    var MessageString = JSON.stringify( message )
    return this.http.post( this.base+'message', MessageString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< Message >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'messages/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( message: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var messageString = JSON.stringify( message )

    return this.http.put( this.base+'messages/'+id, messageString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'messages/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
