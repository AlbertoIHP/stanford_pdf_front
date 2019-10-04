import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { NotificationType } from '../Models/NotificationType.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class NotificationTypeService {

  public base = base.api
  public options: RequestOptions
  public headers: Headers

  constructor ( private http: Http , public authService: AuthenticationService)
  {
    this.headers = new Headers( { 'Content-Type': 'application/json' } )
    this.options = new RequestOptions( { headers: this.headers } )
  }


  index (): Observable< NotificationType[] >
  {

    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'notificationtypes', a ).map( ( res: Response ) => res.json() );
  }


  store ( notificationtype: any )
  {
    var NotificationTypeString = JSON.stringify( notificationtype )
    return this.http.post( this.base+'notificationtype', NotificationTypeString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< NotificationType >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'notificationtypes/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( notificationtype: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var notificationtypeString = JSON.stringify( notificationtype )

    return this.http.put( this.base+'notificationtypes/'+id, notificationtypeString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'notificationtypes/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
