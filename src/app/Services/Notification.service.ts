import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { Notification } from '../Models/Notification.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class NotificationService {

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

    return this.http.get( this.base+'notifications', a ).map( ( res: Response ) => res.json() );
  }


  store ( notification: any )
  {
    var NotificationString = JSON.stringify( notification )
    return this.http.post( this.base+'notification', NotificationString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< Notification >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'notifications/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( notification: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var notificationString = JSON.stringify( notification )

    return this.http.put( this.base+'notifications/'+id, notificationString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'notifications/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
