import { Injectable } from '@angular/core'
import { Http, Headers, RequestOptions, Response } from '@angular/http'
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map'
import { CalendarUser } from '../Models/CalendarUser.model'
import { AuthenticationService } from './Authentication.service'
import { base } from './base'

@Injectable()
export class CalendarUserService {

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

    return this.http.get( this.base+'calendarusers', a ).map( ( res: Response ) => res.json() );
  }


  store ( calendaruser: any )
  {
    var CalendarUserString = JSON.stringify( calendaruser )
    return this.http.post( this.base+'calendaruser', CalendarUserString, this.options).map( ( res: Response ) => res.json() )

  }


  show ( id ) : Observable< CalendarUser >
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.get( this.base+'calendarusers/'+id, a ).map( ( res: Response ) => res.json() )
  }


  update ( calendaruser: any, id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )


    var calendaruserString = JSON.stringify( calendaruser )

    return this.http.put( this.base+'calendarusers/'+id, calendaruserString, a ).map( ( res: Response ) => res.json() )
  }


  delete ( id )
  {
    var b = new Headers( { 'Content-Type': 'application/json', 'Authorization': this.authService.token } )
    var a = new RequestOptions( { headers: b } )

    return this.http.delete( this.base+'calendarusers/'+id, a ).map( ( res: Response ) => res.json() )
  }



}
